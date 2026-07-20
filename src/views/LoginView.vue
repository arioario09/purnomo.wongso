<template>
  <div style="min-height: 100vh; background: var(--color-canvas-subtle); display: flex; align-items: center; justify-content: center; padding: 24px;">
    <div style="width: 100%; max-width: 380px;">

      <!-- Logo & Brand -->
      <div style="text-align: center; margin-bottom: 32px;">
        <!-- <div style="width:56px; height:56px; background: #24292f; border-radius: 50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; box-shadow: 0 4px 12px rgba(36,41,47,0.2);">
          <i class="fa-solid fa-code" style="font-size:22px; color: #e6edf3;"></i>
        </div> -->
        <h1 style="font-size: 20px; font-weight: 700; color: var(--color-fg-default); margin-bottom: 4px;">Selamat Datang</h1>
        <p style="font-size: 14px; color: var(--color-fg-muted);">{{ isRegister ? 'Buat akun di' : 'Masuk ke' }} <strong>purnomo.wongso</strong></p>
      </div>

      <!-- Login Card -->
      <div class="gh-box" style="overflow: hidden;">
        <div style="padding: 24px;">

          <!-- Google Sign In Button -->
          <button
            class="google-btn"
            @click="loginWithGoogle"
            :disabled="loading"
          >
            <span v-if="!loading" style="display:flex; align-items:center; justify-content:center; gap:10px;">
              <!-- Google Icon SVG -->
              <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Lanjutkan dengan Google
            </span>
            <span v-else style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan...
            </span>
          </button>

          <div class="or-divider">
            <span>atau</span>
          </div>

          <!-- Email Login Form -->
          <form @submit.prevent="loginWithEmail">
            <div style="margin-bottom: 12px;">
              <label class="form-label" for="email">Alamat Email</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="email"
                placeholder="nama@email.com"
                required
                autocomplete="email"
              />
            </div>
            <div style="margin-bottom: 16px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <label class="form-label" for="password" style="margin:0;">Password</label>
                <a href="#" style="font-size:12px;">Lupa password?</a>
              </div>
              <div style="position:relative;">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="form-control"
                  v-model="password"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                  style="padding-right: 40px;"
                />
                <button type="button" @click="showPassword = !showPassword" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color: var(--color-fg-muted); font-size:12px;">
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="gh-flash gh-flash-danger" style="margin-bottom: 12px;">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errorMsg }}
            </div>

            <button type="submit" class="btn btn-primary w-100" style="justify-content:center;" :disabled="loading">
              <i :class="isRegister ? 'fa-solid fa-user-plus' : 'fa-solid fa-right-to-bracket'"></i> {{ isRegister ? 'Daftar' : 'Masuk' }}
            </button>
          </form>
        </div>

        <!-- Register Link -->
        <!-- <div style="padding: 16px 24px; background: var(--color-canvas-subtle); border-top: 1px solid var(--color-border-muted); text-align:center;">
          <span style="font-size:13px; color: var(--color-fg-muted);">
            {{ isRegister ? 'Sudah punya akun?' : 'Belum punya akun?' }}
            <a href="#" style="font-weight:600;" @click.prevent="isRegister = !isRegister">{{ isRegister ? 'Masuk' : 'Daftar sekarang' }}</a>
          </span>
        </div> -->
      </div>

      <!-- Terms -->
      <p style="text-align:center; font-size:11px; color: var(--color-fg-subtle); margin-top: 20px; line-height: 1.5;">
        Dengan masuk, Anda menyetujui <a href="#" style="color: var(--color-fg-subtle);">Syarat Penggunaan</a>
        dan <a href="#" style="color: var(--color-fg-subtle);">Kebijakan Privasi</a> kami.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, firebaseIsConfigured, firebaseSetupError, googleProvider, isEmailAllowed } from '../firebase.js';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);
const isRegister = ref(false);

const getRedirect = () => route.query.redirect || '/';

const loginWithGoogle = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    if (!firebaseIsConfigured || !auth) throw new Error(firebaseSetupError);
    const result = await signInWithPopup(auth, googleProvider);
    if (!isEmailAllowed(result.user.email)) {
      await signOut(auth);
      errorMsg.value = 'Email tidak terdaftar. Hubungi administrator.';
      return;
    }
    router.push(getRedirect());
  } catch (error) {
    errorMsg.value = getAuthMessage(error);
  } finally {
    loading.value = false;
  }
};

const loginWithEmail = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    if (!firebaseIsConfigured || !auth) throw new Error(firebaseSetupError);
    let userCred;
    if (isRegister.value) {
      userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);
    } else {
      userCred = await signInWithEmailAndPassword(auth, email.value, password.value);
    }
    if (!isEmailAllowed(userCred.user.email)) {
      await signOut(auth);
      errorMsg.value = 'Email tidak terdaftar. Hubungi administrator.';
      return;
    }
    router.push(getRedirect());
  } catch (error) {
    errorMsg.value = getAuthMessage(error);
  } finally {
    loading.value = false;
  }
};

const getAuthMessage = (error) => {
  if (error.message === firebaseSetupError) return error.message;
  const messages = {
    'auth/invalid-credential': 'Email atau password tidak sesuai.',
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Password minimal harus 6 karakter.',
    'auth/popup-closed-by-user': 'Jendela masuk Google ditutup sebelum selesai.',
    'auth/operation-not-allowed': 'Metode login ini belum diaktifkan di Firebase Authentication.',
  };
  return messages[error.code] || 'Login gagal. Silakan coba lagi.';
};
</script>

<style scoped>
.google-btn {
  width: 100%;
  padding: 10px 16px;
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-fg-default);
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.google-btn:hover { background: #f8f9fa; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
.google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.or-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: var(--color-fg-subtle);
  font-size: 12px;
}
.or-divider::before, .or-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-muted);
}

.gh-flash-danger {
  background-color: #fff0ee;
  border: 1px solid #ffb8b0;
  color: #d1242f;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn.w-100 { width: 100%; }
</style>
