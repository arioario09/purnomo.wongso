import { reactive } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, firebaseIsConfigured } from "./firebase.js";

export const store = reactive({
  // ── Auth State ──────────────────────────────────────────
  isLoggedIn: false,

  currentUser: null, // null | { name, email, photo, provider }

  // ── User Profile (editable) ─────────────────────────────
  userProfile: {
    name: "Purnomo Wongso",
    username: "purnomo.wongso",
    bio: "Professional Accountant, Tech Enthusiast, & Web Developer. Passionate in bridging the gap between business processes and modern technology solutions.",
    avatar:
      "https://ui-avatars.com/api/?name=Purnomo+Wongso&background=0d1117&color=e6edf3&size=160&bold=true",
    location: "Jakarta, Indonesia",
    website: "https://purnomo.wongso",
    company: "PT. Wongso Digital",
    twitter: "purnomowongso",
    linkedin: "purnomowongso",
    github: "purnomowongso",
    about: `Saya adalah seorang akuntan profesional yang juga memiliki passion mendalam di bidang teknologi dan pengembangan web. Dengan pengalaman lebih dari 8 tahun di dunia akuntansi dan 5 tahun di bidang teknologi, saya percaya bahwa memahami keduanya adalah kunci untuk membangun bisnis yang sukses di era digital.\n\nSaat ini saya fokus pada pengembangan solusi teknologi untuk bisnis, terutama di bidang otomatisasi akuntansi dan pelaporan keuangan digital.`,
    joinedYear: "2020",
  },

  // ── Articles ─────────────────────────────────────────────
  articles: [],

  books: [],

  categories: [
    "Semua",
    "Akuntansi",
    "Teknologi",
    "Bisnis",
    "Tutorial",
    "Lainnya",
  ],

  // ── Methods ──────────────────────────────────────────────
  login(userData) {
    this.isLoggedIn = true;
    this.currentUser = userData;
    // Sync user profile name & avatar from Google login
    if (userData.name) this.userProfile.name = userData.name;
    if (userData.photo) this.userProfile.avatar = userData.photo;
  },

  async logout() {
    if (auth) await signOut(auth);
    this.isLoggedIn = false;
    this.currentUser = null;
  },

  async updateProfile(data) {
    Object.assign(this.userProfile, data);
    if (db && auth?.currentUser) {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }
  },

  async addArticle(article) {
    this.articles.unshift(article);
    if (db) {
      const articleRef = doc(collection(db, "articles"));
      article.id = articleRef.id;
      await setDoc(articleRef, { ...article, createdAt: serverTimestamp() });
    }
  },

  async addBook(book) {
    if (!this.isLoggedIn || !auth?.currentUser) {
      throw new Error("Login diperlukan untuk menambahkan buku.");
    }

    this.books.unshift(book);
    if (db) {
      const bookRef = doc(collection(db, "books"));
      book.id = bookRef.id;
      const persistedBook = { ...book };
      await setDoc(bookRef, { ...persistedBook, createdAt: serverTimestamp() });
    }
  },
});

export const authReady = new Promise((resolve) => {
  if (!firebaseIsConfigured || !auth) {
    resolve();
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.login({
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Pengguna",
        email: user.email,
        photo: user.photoURL || store.userProfile.avatar,
        provider: user.providerData[0]?.providerId || "email",
      });
    } else {
      store.isLoggedIn = false;
      store.currentUser = null;
    }
    resolve();
  });
});

if (db) {
  onSnapshot(collection(db, "articles"), (snapshot) => {
    store.articles = snapshot.empty
      ? []
      : snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
          );
  });

  onSnapshot(collection(db, "books"), (snapshot) => {
    store.books = snapshot.empty
      ? []
      : snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
          );
  });
}
