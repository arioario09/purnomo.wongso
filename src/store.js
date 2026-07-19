import { reactive } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseIsConfigured } from './firebase.js';

export const store = reactive({
  // ── Auth State ──────────────────────────────────────────
  isLoggedIn: false,

  currentUser: null, // null | { name, email, photo, provider }

  // ── User Profile (editable) ─────────────────────────────
  userProfile: {
    name: 'Purnomo Wongso',
    username: 'purnomo.wongso',
    bio: 'Professional Accountant, Tech Enthusiast, & Web Developer. Passionate in bridging the gap between business processes and modern technology solutions.',
    avatar: 'https://ui-avatars.com/api/?name=Purnomo+Wongso&background=0d1117&color=e6edf3&size=160&bold=true',
    location: 'Jakarta, Indonesia',
    website: 'https://purnomo.wongso',
    company: 'PT. Wongso Digital',
    twitter: 'purnomowongso',
    linkedin: 'purnomowongso',
    github: 'purnomowongso',
    about: `Saya adalah seorang akuntan profesional yang juga memiliki passion mendalam di bidang teknologi dan pengembangan web. Dengan pengalaman lebih dari 8 tahun di dunia akuntansi dan 5 tahun di bidang teknologi, saya percaya bahwa memahami keduanya adalah kunci untuk membangun bisnis yang sukses di era digital.\n\nSaat ini saya fokus pada pengembangan solusi teknologi untuk bisnis, terutama di bidang otomatisasi akuntansi dan pelaporan keuangan digital.`,
    joinedYear: '2020',
  },

  // ── Articles ─────────────────────────────────────────────
  articles: [
    {
      id: 1,
      title: 'Dasar-Dasar Akuntansi Keuangan untuk Pemula dan Pengusaha',
      category: 'Akuntansi',
      date: '15 Jul 2026',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Panduan komprehensif memahami jurnal, buku besar, dan membaca laporan keuangan dasar untuk Anda yang baru memulai bisnis.',
      content: '<p>Akuntansi sering disebut sebagai "bahasa bisnis". Memahami akuntansi berarti Anda dapat memahami kesehatan finansial sebuah entitas. Pada artikel ini, kita akan membahas siklus akuntansi dasar mulai dari pencatatan transaksi hingga penyusunan neraca saldo.</p><h3>1. Persamaan Dasar Akuntansi</h3><p>Harta = Utang + Modal. Ini adalah fondasi dari seluruh sistem pencatatan berpasangan (double-entry bookkeeping). Setiap kali ada transaksi, pastikan persamaan ini selalu seimbang.</p><br><h3>2. Laporan Laba Rugi</h3><p>Laporan yang menunjukkan performa perusahaan. Pendapatan dikurangi beban. Jika hasilnya positif berarti laba, jika negatif berarti rugi.</p><br><p>Menguasai dasar-dasar ini akan sangat membantu dalam pengambilan keputusan strategis sehari-hari.</p>'
    },
    {
      id: 2,
      title: 'Mengenal Vue.js 3: Framework Javascript Pilihan Masa Depan',
      category: 'Teknologi',
      date: '10 Jul 2026',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Mengapa Vue.js 3 dengan Composition API mengubah cara developer membangun aplikasi web modern yang reaktif dan cepat.',
      content: '<p>Vue 3 telah membawa banyak pembaruan signifikan, terutama dengan diperkenalkannya <strong>Composition API</strong>. Berbeda dengan Options API yang memisahkan logika berdasarkan opsi (data, methods, computed), Composition API memungkinkan kita mengelompokkan logika berdasarkan fitur.</p><br><h3>Kelebihan Vue 3</h3><ul><li>Lebih cepat dan ringan (ukuran bundle lebih kecil)</li><li>Dukungan TypeScript yang sangat baik</li><li>Reusability kode yang luar biasa dengan Composables</li></ul><br><p>Bagi Anda yang terbiasa dengan React Hooks, Composition API akan terasa sangat natural namun dengan kelebihan reaktivitas sistem Vue yang lebih intuitif.</p>'
    },
    {
      id: 3,
      title: 'Strategi Pemasaran Digital yang Efektif di Era Modern',
      category: 'Bisnis',
      date: '05 Jul 2026',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Bagaimana memanfaatkan SEO, media sosial, dan content marketing untuk meningkatkan konversi dan loyalitas pelanggan.',
      content: '<p>Digital marketing tidak hanya sekadar membuat iklan di Facebook atau Google. Ini adalah tentang membangun ekosistem digital yang secara konsisten menarik, meyakinkan, dan mengonversi pengunjung menjadi pelanggan setia.</p><br><h3>Pentingnya Personalisasi</h3><p>Fokus utama tahun ini adalah personalisasi konten. Konsumen modern mengabaikan iklan massal. Mereka merespons pesan yang terasa dibuat khusus untuk masalah yang mereka hadapi.</p><br><p>Pemanfaatan AI dalam analitik prediktif juga membantu marketer mengetahui kapan waktu yang tepat untuk menawarkan suatu produk kepada individu tertentu.</p>'
    },
    {
      id: 4,
      title: 'Cara Membuat Website Portfolio Keren dengan Bootstrap 5',
      category: 'Tutorial',
      date: '28 Jun 2026',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Langkah demi langkah membangun website portfolio online yang responsif, modern, dan profesional tanpa menulis banyak CSS.',
      content: '<p>Bootstrap 5 hadir tanpa jQuery dan memperkenalkan sistem utilitas (utility API) yang sangat powerful. Dalam tutorial ini, kita akan membahas cara membangun struktur dasar halaman portfolio.</p><br><h3>Langkah 1: Setup HTML5 Boilerplate</h3><p>Gunakan CDN untuk memuat Bootstrap CSS dan JS. Pastikan menambahkan meta viewport untuk responsive design.</p><br><h3>Langkah 2: Sistem Grid</h3><p>Gunakan class <code>container</code>, <code>row</code>, dan <code>col-*</code> untuk mengatur tata letak yang beradaptasi di layar mobile maupun desktop.</p><br><p>Dengan memanfaatkan utility classes seperti <code>p-4</code>, <code>mt-3</code>, dan <code>shadow-sm</code>, kita bisa meminimalisir penulisan custom CSS.</p>'
    },
    {
      id: 5,
      title: 'Tips Manajemen Waktu (Time Management) agar Lebih Produktif',
      category: 'Lainnya',
      date: '20 Jun 2026',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Menerapkan metode Pomodoro, Time Blocking, dan matrix Eisenhower untuk mengatasi penundaan (procrastination).',
      content: '<p>Waktu adalah satu-satunya aset yang tidak bisa diperbarui atau dibeli kembali. Mengelolanya dengan baik adalah kunci kesuksesan para profesional.</p><br><h3>Teknik Pomodoro</h3><p>Fokus bekerja tanpa gangguan selama 25 menit, lalu istirahat 5 menit. Setelah 4 siklus, ambil istirahat lebih panjang. Ini menjaga otak tetap segar.</p><br><h3>Matriks Eisenhower</h3><p>Bagi tugas menjadi 4 kuadran: Penting & Mendesak, Penting tapi Tidak Mendesak, Tidak Penting tapi Mendesak, dan Tidak Penting & Tidak Mendesak. Fokuslah pada kuadran kedua untuk pertumbuhan jangka panjang.</p><br><p>Selain itu, hindari multitasking karena secara ilmiah terbukti menurunkan tingkat efisiensi otak hingga 40%.</p>'
    }
  ],

  books: [
    { id: 1, title: 'Dasar-Dasar Akuntansi', author: 'Purnomo Wongso', description: 'Panduan praktis memahami persamaan dasar dan siklus akuntansi.', cover: '', fileName: '' },
    { id: 2, title: 'Pemrograman Web Frontend', author: 'Purnomo Wongso', description: 'Materi dasar HTML, CSS, Bootstrap, dan JavaScript untuk pemula.', cover: '', fileName: '' },
    { id: 3, title: 'Analisis Laporan Keuangan', author: 'Purnomo Wongso', description: 'Cara membaca neraca, laba rugi, serta arus kas dengan lebih percaya diri.', cover: '', fileName: '' }
  ],

  categories: ['Semua', 'Akuntansi', 'Teknologi', 'Bisnis', 'Tutorial', 'Lainnya'],

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
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  },

  async addArticle(article) {
    this.articles.unshift(article);
    if (db) {
      const articleRef = doc(collection(db, 'articles'));
      article.id = articleRef.id;
      await setDoc(articleRef, { ...article, createdAt: serverTimestamp() });
    }
  },

  async addBook(book) {
    this.books.unshift(book);
    if (db) {
      const bookRef = doc(collection(db, 'books'));
      book.id = bookRef.id;
      // URL file sementara dari browser tidak dapat disimpan ke Firestore.
      const { fileUrl, ...persistedBook } = book;
      await setDoc(bookRef, { ...persistedBook, createdAt: serverTimestamp() });
    }
  }
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
        name: user.displayName || user.email?.split('@')[0] || 'Pengguna',
        email: user.email,
        photo: user.photoURL || store.userProfile.avatar,
        provider: user.providerData[0]?.providerId || 'email',
      });
    } else {
      store.isLoggedIn = false;
      store.currentUser = null;
    }
    resolve();
  });
});

if (db) {
  onSnapshot(collection(db, 'articles'), (snapshot) => {
    if (!snapshot.empty) {
      store.articles = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
  });

  onSnapshot(collection(db, 'books'), (snapshot) => {
    if (!snapshot.empty) {
      store.books = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
  });
}
