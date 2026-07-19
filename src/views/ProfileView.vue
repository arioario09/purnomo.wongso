<template>
  <div style="max-width: 1280px; margin: 0 auto; padding: 24px;">
    <div class="row g-4">
      <div class="col-md-3">
        <!-- Settings Sidebar -->
        <div class="gh-box" style="position: sticky; top: 88px;">
          <div class="gh-box-body" style="padding: 0;">
            <ul style="list-style:none; padding: 0; margin:0;">
              <li>
                <a href="#" class="quick-link-item active">
                  <i class="fa-solid fa-user" style="width:18px; text-align:center; color: var(--color-fg-muted);"></i>
                  <span>Profil Publik</span>
                </a>
              </li>
              <li>
                <a href="#" class="quick-link-item">
                  <i class="fa-solid fa-gear" style="width:18px; text-align:center; color: var(--color-fg-muted);"></i>
                  <span>Pengaturan Akun</span>
                </a>
              </li>
              <li>
                <a href="#" class="quick-link-item">
                  <i class="fa-solid fa-shield-halved" style="width:18px; text-align:center; color: var(--color-fg-muted);"></i>
                  <span>Keamanan</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <h2 style="font-size: 24px; font-weight: 400; color: var(--color-fg-default); margin-bottom: 24px; border-bottom: 1px solid var(--color-border-muted); padding-bottom: 8px;">
          Profil Publik
        </h2>

        <div class="row g-4">
          <div class="col-lg-8 order-2 order-lg-1">
            <form @submit.prevent="saveProfile">
              <div style="margin-bottom: 16px;">
                <label class="form-label" for="name">Nama Lengkap</label>
                <input type="text" id="name" class="form-control" v-model="formData.name" />
              </div>
              
              <div style="margin-bottom: 16px;">
                <label class="form-label" for="bio">Bio Publik</label>
                <textarea id="bio" class="form-control" rows="3" v-model="formData.bio" placeholder="Ceritakan sedikit tentang diri Anda..."></textarea>
                <div class="form-text">Anda bisa @mention pengguna lain atau perusahaan.</div>
              </div>

              <div style="margin-bottom: 16px;">
                <label class="form-label" for="about">Tentang Saya (Lebih Lengkap)</label>
                <textarea id="about" class="form-control" rows="6" v-model="formData.about"></textarea>
              </div>

              <div style="margin-bottom: 24px;">
                <label class="form-label">Tautan Sosial</label>
                <div style="display:flex; flex-direction:column; gap:12px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <i class="fa-brands fa-twitter" style="width:20px; color:var(--color-fg-muted);"></i>
                    <input type="text" class="form-control" v-model="formData.twitter" placeholder="Username Twitter" />
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <i class="fa-brands fa-github" style="width:20px; color:var(--color-fg-muted);"></i>
                    <input type="text" class="form-control" v-model="formData.github" placeholder="Username GitHub" />
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <i class="fa-brands fa-linkedin" style="width:20px; color:var(--color-fg-muted);"></i>
                    <input type="text" class="form-control" v-model="formData.linkedin" placeholder="Username LinkedIn" />
                  </div>
                </div>
              </div>

              <div style="margin-bottom: 24px;">
                <label class="form-label">Informasi Tambahan</label>
                <div class="row g-3">
                  <div class="col-md-6">
                     <div style="display:flex; align-items:center; gap:8px;">
                      <i class="fa-solid fa-building" style="width:20px; color:var(--color-fg-muted);"></i>
                      <input type="text" class="form-control" v-model="formData.company" placeholder="Perusahaan" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <i class="fa-solid fa-location-dot" style="width:20px; color:var(--color-fg-muted);"></i>
                      <input type="text" class="form-control" v-model="formData.location" placeholder="Lokasi" />
                    </div>
                  </div>
                  <div class="col-12">
                     <div style="display:flex; align-items:center; gap:8px;">
                      <i class="fa-solid fa-link" style="width:20px; color:var(--color-fg-muted);"></i>
                      <input type="text" class="form-control" v-model="formData.website" placeholder="Website URL" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="successMsg" class="gh-flash gh-flash-success" style="margin-bottom: 16px;">
                <i class="fa-solid fa-circle-check"></i> {{ successMsg }}
              </div>

              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading"><i class="fa-solid fa-spinner fa-spin me-2"></i>Menyimpan...</span>
                <span v-else>Update Profil</span>
              </button>
            </form>
          </div>
          
          <div class="col-lg-4 order-1 order-lg-2">
            <div style="margin-bottom: 16px;">
              <label class="form-label">Foto Profil</label>
              <div class="gh-box" style="padding: 16px; text-align: center;">
                <img :src="formData.avatar" alt="Avatar" style="width:200px; height:200px; border-radius:50%; object-fit:cover; margin-bottom: 16px; border: 1px solid var(--color-border-default);" />
                
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  class="d-none"
                  @change="handleAvatarChange"
                />
                <button type="button" class="btn btn-default btn-sm" @click="avatarInput?.click()">
                  <i class="fa-solid fa-upload"></i> Ganti foto
                </button>
                <div class="form-text mt-3" style="text-align:left;">
                  Pilih file PNG, JPG, atau WEBP dari perangkat Anda. Foto akan ditampilkan sebelum disimpan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store } from '../store.js';

const formData = ref({
  name: '',
  bio: '',
  about: '',
  twitter: '',
  github: '',
  linkedin: '',
  company: '',
  location: '',
  website: '',
  avatar: ''
});

const loading = ref(false);
const successMsg = ref('');
const avatarInput = ref(null);

onMounted(() => {
  // Init form data from store
  formData.value = { ...store.userProfile };
});

const saveProfile = async () => {
  loading.value = true;
  successMsg.value = '';
  try {
    await store.updateProfile(formData.value);
    successMsg.value = 'Profil berhasil diperbarui!';
    setTimeout(() => {
      successMsg.value = '';
    }, 3000);
  } catch (error) {
    successMsg.value = 'Profil gagal disimpan. Periksa izin Firestore.';
  } finally {
    loading.value = false;
  }
};

const handleAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    successMsg.value = 'Ukuran foto maksimal 2 MB.';
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    formData.value.avatar = reader.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.quick-link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 13px;
  color: var(--color-fg-default) !important;
  text-decoration: none !important;
  border-bottom: 1px solid var(--color-border-muted);
  transition: background 0.1s ease;
}
.quick-link-item:last-child { border-bottom: none; }
.quick-link-item:hover {
  background: var(--color-canvas-subtle);
  text-decoration: none !important;
}
.quick-link-item.active {
  border-left: 2px solid var(--color-accent-emphasis);
  font-weight: 600;
  background: var(--color-canvas-subtle);
}
</style>
