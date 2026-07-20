import { reactive } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, firebaseIsConfigured, isEmailAllowed } from "./firebase.js";

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

  async updateArticle(id, data) {
    if (!db) return;
    const articleRef = doc(db, "articles", id);
    await setDoc(articleRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    const idx = this.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.articles[idx] = { ...this.articles[idx], ...data };
    }
  },

  async updateBook(id, data) {
    if (!db || !this.isLoggedIn) return;
    const bookRef = doc(db, "books", id);
    await setDoc(bookRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.books[idx] = { ...this.books[idx], ...data };
    }
  },

  // ── Site Settings ──────────────────────────────────────────
  siteSettings: {
    heroEyebrow: "Catatan, pembelajaran, dan inspirasi",
    heroName: "Purnomo Wongso",
    heroBio: "Ruang untuk berbagi wawasan seputar akuntansi, teknologi, bisnis, dan pengembangan diri. Temukan ide yang dapat dipelajari dan diterapkan dalam pekerjaan sehari-hari.",
    heroTopics: ["Artikel pilihan", "Materi belajar", "Wawasan praktis"],
    featuredTitle: "Artikel Unggulan",
    navigationTitle: "Navigasi Cepat",
    articlesTitle: "Artikel",
    articlesDescription: "Jelajahi tulisan-tulisan seputar akuntansi, teknologi, dan bisnis.",
    booksTitle: "Koleksi Buku",
    booksDescription: "Simpan dan bagikan buku digital yang dapat dibaca dari satu tempat.",
  },

  siteTheme: {},

  async loadSiteSettings() {
    if (!db) return;
    const snap = await getDoc(doc(db, "siteSettings", "data"));
    if (snap.exists()) {
      Object.assign(this.siteSettings, snap.data());
    }
    const themeSnap = await getDoc(doc(db, "siteTheme", "data"));
    if (themeSnap.exists()) {
      this.siteTheme = { ...themeSnap.data() };
      this.applyTheme();
    }
  },

  async saveSiteSettings(data) {
    Object.assign(this.siteSettings, data);
    if (db) {
      await setDoc(doc(db, "siteSettings", "data"), { ...data }, { merge: true });
    }
  },

  async saveSiteTheme(data) {
    this.siteTheme = { ...data };
    this.applyTheme();
    if (db) {
      await setDoc(doc(db, "siteTheme", "data"), { ...data }, { merge: true });
    }
  },

  applyTheme() {
    const root = document.documentElement;
    for (const [key, val] of Object.entries(this.siteTheme)) {
      if (val) root.style.setProperty(`--${key}`, val);
    }
  },

  async deleteArticle(articleId) {
    if (!db) return false;
    try {
      await deleteDoc(doc(db, "articles", articleId));
      return true;
    } catch {
      return false;
    }
  },

  async deleteBook(bookId) {
    if (!db) return false;
    try {
      await deleteDoc(doc(db, "books", bookId));
      return true;
    } catch {
      return false;
    }
  },
});

export const authReady = new Promise((resolve) => {
  if (!firebaseIsConfigured || !auth) {
    resolve();
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user && isEmailAllowed(user.email)) {
      store.login({
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Pengguna",
        email: user.email,
        photo: user.photoURL || store.userProfile.avatar,
        provider: user.providerData[0]?.providerId || "email",
      });
    } else {
      if (user && !isEmailAllowed(user.email)) {
        signOut(auth);
      }
      store.isLoggedIn = false;
      store.currentUser = null;
    }
    resolve();
    store.loadSiteSettings();
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
