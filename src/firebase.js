import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyAuQdAch-mGGqeyyx-ozq98D6pK03KBnR4",
  authDomain: "purnomow-af190.firebaseapp.com",
  projectId: "purnomow-af190",
  storageBucket: "purnomow-af190.firebasestorage.app",
  messagingSenderId: "114374141798",
  appId: "1:114374141798:web:4dd424d7fd6728ee754aa7",
};

// Nilai ini dibaca Vite dari file .env.local (lihat .env.example).
// Jika variabel lingkungan tidak tersedia saat deploy, aplikasi tetap memakai konfigurasi fallback.
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY || fallbackFirebaseConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    fallbackFirebaseConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    fallbackFirebaseConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    fallbackFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackFirebaseConfig.appId,
};

export const firebaseIsConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

const app = firebaseIsConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isEmailAllowed(email) {
  if (!email) return false;
  if (allowedEmails.length === 0) return true;
  return allowedEmails.includes(email.toLowerCase());
}

export const firebaseSetupError =
  "Firebase belum dikonfigurasi. Salin .env.example menjadi .env.local lalu isi konfigurasi proyek Firebase Anda.";
