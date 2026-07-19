# Setup Firebase

## 1. Buat proyek dan aplikasi web

1. Buka [Firebase Console](https://console.firebase.google.com/), lalu pilih **Add project**.
2. Setelah proyek selesai dibuat, klik ikon **Web** (`</>`), beri nama aplikasi, lalu daftarkan aplikasi.
3. Salin nilai konfigurasi Firebase yang ditampilkan.
4. Salin `.env.example` menjadi `.env.local`, lalu isi semua nilai `VITE_FIREBASE_*` dari konfigurasi tersebut. Jangan commit `.env.local` ke Git.

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=nama-proyek.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-proyek
VITE_FIREBASE_STORAGE_BUCKET=nama-proyek.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

Setelah membuat atau mengubah `.env.local`, hentikan lalu jalankan ulang `npm run dev`.

## 2. Aktifkan Firebase Authentication

1. Di Firebase Console, buka **Build → Authentication → Get started**.
2. Pada **Sign-in method**, aktifkan **Google**. Isi email dukungan proyek bila diminta.
3. Aktifkan **Email/Password** untuk tombol Masuk dan Daftar di halaman login.
4. Di **Settings → Authorized domains**, tambahkan domain produksi Anda. `localhost` sudah tersedia untuk pengembangan lokal.

Tombol Google pada aplikasi akan membuka popup Firebase Auth. Status pengguna dipantau otomatis saat halaman dimuat dan saat pengguna logout.

## 3. Buat Cloud Firestore

1. Buka **Build → Firestore Database → Create database**.
2. Pilih lokasi yang paling dekat dengan pengguna Anda.
3. Mulai dengan mode Production, kemudian buka tab **Rules** dan salin isi file `firestore.rules` ke editor Rules sebelum menekan **Publish**. Aturan tersebut juga tersedia di bawah ini.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    match /books/{bookId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Koleksi `articles` dan `books` bersifat global—tidak disimpan di bawah UID pengguna—sehingga semua pengunjung menerima artikel dan daftar buku yang sama secara real-time. Data contoh akan dipakai sampai koleksi memiliki data.

## 4. Jalankan dan uji

```bash
npm run dev
```

1. Masuk dengan Google atau tekan **Daftar sekarang** untuk membuat akun email/password.
2. Buat artikel lalu periksa koleksi `articles` pada Firestore Console.
3. Muat ulang aplikasi untuk memastikan sesi login dan data tetap tersedia.

## Catatan file dan gambar

Firestore cocok menyimpan metadata dan URL. Untuk PDF atau gambar besar, unggah file ke **Firebase Storage** lalu simpan URL hasilnya dalam Firestore. Batas satu dokumen Firestore adalah 1 MiB.
