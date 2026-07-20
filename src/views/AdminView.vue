<template>
  <div style="max-width: 1280px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px;">
      <div>
        <h1 style="font-size:20px; font-weight:600; color:var(--color-fg-default);">
          <i class="fa-solid fa-screwdriver-wrench me-2" style="color:var(--color-fg-muted);"></i>Admin Dashboard
        </h1>
        <p style="font-size:13px; color:var(--color-fg-muted);">{{ store.currentUser?.email }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="gh-tabs" style="margin-bottom:24px;">
      <button v-for="t in tabs" :key="t.key" class="gh-tab" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
        <i :class="t.icon"></i>{{ t.label }}
      </button>
    </div>

    <!-- Articles Tab -->
    <div v-if="activeTab === 'articles'">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:600; color:var(--color-fg-default);">Semua Artikel ({{ store.articles.length }})</h3>
      </div>
      <div v-if="store.articles.length === 0" class="gh-empty">
        <div class="gh-empty-icon"><i class="fa-regular fa-file-lines"></i></div>
        <p>Belum ada artikel.</p>
      </div>
      <div v-else class="gh-box" style="overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:var(--color-canvas-subtle); text-align:left;">
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted);">Judul</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted);">Kategori</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted);">Tanggal</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted); width:80px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in store.articles" :key="article.id" style="border-bottom:1px solid var(--color-border-muted);">
              <td style="padding:10px 12px; color:var(--color-fg-default); max-width:400px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ article.title }}</td>
              <td style="padding:10px 12px;"><span :class="getLabelClass(article.category)" class="label">{{ article.category }}</span></td>
              <td style="padding:10px 12px; color:var(--color-fg-muted);">{{ article.date }}</td>
              <td style="padding:10px 12px;">
                <button class="btn btn-danger btn-sm" @click="confirmDeleteArticle(article)" :disabled="deleting === article.id">
                  <i :class="deleting === article.id ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash-can'"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Books Tab -->
    <div v-if="activeTab === 'books'">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:600; color:var(--color-fg-default);">Semua Buku ({{ store.books.length }})</h3>
      </div>
      <div v-if="store.books.length === 0" class="gh-empty">
        <div class="gh-empty-icon"><i class="fa-solid fa-books"></i></div>
        <p>Belum ada buku.</p>
      </div>
      <div v-else class="gh-box" style="overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
          <thead>
            <tr style="background:var(--color-canvas-subtle); text-align:left;">
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted);">Judul</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted);">Penulis</th>
              <th style="padding:10px 12px; border-bottom:1px solid var(--color-border-muted); width:80px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in store.books" :key="book.id" style="border-bottom:1px solid var(--color-border-muted);">
              <td style="padding:10px 12px; color:var(--color-fg-default);">{{ book.title }}</td>
              <td style="padding:10px 12px; color:var(--color-fg-muted);">{{ book.author }}</td>
              <td style="padding:10px 12px;">
                <button class="btn btn-danger btn-sm" @click="confirmDeleteBook(book)" :disabled="deleting === book.id">
                  <i :class="deleting === book.id ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash-can'"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Content Tab -->
    <div v-if="activeTab === 'content'">
      <div style="margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:600; color:var(--color-fg-default);">Konten Website</h3>
        <p style="font-size:13px; color:var(--color-fg-muted);">Ubah teks yang ditampilkan di halaman website.</p>
      </div>
      <form @submit.prevent="saveContent" class="gh-box">
        <div class="gh-box-body" style="display:flex; flex-direction:column; gap:16px;">
          <div v-for="field in contentFields" :key="field.key">
            <label class="form-label">{{ field.label }}</label>
            <input v-if="field.type === 'text'" type="text" class="form-control" v-model="contentForm[field.key]" />
            <textarea v-else-if="field.type === 'textarea'" class="form-control" v-model="contentForm[field.key]" rows="3"></textarea>
            <div v-else-if="field.type === 'tags'" style="display:flex; flex-wrap:wrap; gap:8px;">
              <div v-for="(t, i) in contentForm[field.key]" :key="i" class="label label-blue" style="display:inline-flex; align-items:center; gap:6px;">
                <input type="text" v-model="contentForm[field.key][i]" style="border:none; background:transparent; outline:none; font-size:12px; width:auto; min-width:60px; color:inherit;" />
                <button type="button" @click="contentForm[field.key].splice(i, 1)" style="border:none; background:none; cursor:pointer; color:inherit; font-size:11px; padding:0;">&times;</button>
              </div>
              <button type="button" class="btn btn-invisible btn-sm" @click="contentForm[field.key].push('')">+ Tambah</button>
            </div>
          </div>
          <div v-if="saved" class="gh-flash gh-flash-success" style="margin-bottom:0;">
            <i class="fa-solid fa-circle-check"></i> Konten berhasil disimpan.
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; border-top:1px solid var(--color-border-muted); padding-top:16px; margin-top:8px;">
            <button type="submit" class="btn btn-primary" :disabled="savingContent">
              <i :class="savingContent ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i> Simpan Konten
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Theme Tab -->
    <div v-if="activeTab === 'theme'">
      <div style="margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:600; color:var(--color-fg-default);">Tema & Warna</h3>
        <p style="font-size:13px; color:var(--color-fg-muted);">Ubah warna dan tampilan website. Perubahan diterapkan langsung.</p>
      </div>
      <form @submit.prevent="saveTheme" class="gh-box">
        <div class="gh-box-body" style="display:flex; flex-direction:column; gap:12px;">
          <div class="row g-3">
            <div v-for="field in themeFields" :key="field.key" class="col-md-4 col-sm-6">
              <label class="form-label" style="font-size:12px; display:flex; align-items:center; gap:8px;">
                <input type="color" :value="themeForm[field.key] || '#000000'" @input="e => { themeForm[field.key] = e.target.value; previewTheme(); }" style="width:32px; height:32px; border:1px solid var(--color-border-default); border-radius:4px; cursor:pointer; padding:0;" />
                <span>{{ field.label }}</span>
              </label>
              <input type="text" class="form-control" v-model="themeForm[field.key]" placeholder="#hex" @input="previewTheme()" style="font-size:12px; font-family:monospace;" />
            </div>
          </div>
          <div style="display:flex; gap:12px; align-items:center;">
            <button type="button" class="btn btn-default btn-sm" @click="resetTheme">Reset Default</button>
          </div>
          <div v-if="themeSaved" class="gh-flash gh-flash-success" style="margin-bottom:0;">
            <i class="fa-solid fa-circle-check"></i> Tema berhasil disimpan.
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; border-top:1px solid var(--color-border-muted); padding-top:16px;">
            <button type="submit" class="btn btn-primary" :disabled="savingTheme">
              <i :class="savingTheme ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"></i> Simpan Tema
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteTarget" class="book-modal" @click.self="deleteTarget = null">
      <div class="gh-box" style="max-width:400px; width:100%;">
        <div class="gh-box-header">
          <span>Konfirmasi Hapus</span>
          <button type="button" class="close-button" @click="deleteTarget = null"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="gh-box-body" style="text-align:center;">
          <p style="margin-bottom:16px; color:var(--color-fg-default);">
            Yakin ingin menghapus <strong>"{{ deleteTarget.title }}"</strong>?
          </p>
          <div style="display:flex; gap:8px; justify-content:center;">
            <button class="btn btn-default" @click="deleteTarget = null">Batal</button>
            <button class="btn btn-danger" @click="executeDelete" :disabled="deleting">
              <i :class="deleting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash-can'"></i> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store.js';

const router = useRouter();
const activeTab = ref('articles');
const deleting = ref(null);
const deleteTarget = ref(null);
const deleteType = ref('');

const tabs = [
  { key: 'articles', label: 'Artikel', icon: 'fa-solid fa-newspaper' },
  { key: 'books', label: 'Buku', icon: 'fa-solid fa-books' },
  { key: 'content', label: 'Konten', icon: 'fa-solid fa-pen-to-square' },
  { key: 'theme', label: 'Tema', icon: 'fa-solid fa-palette' },
];

const getLabelClass = (cat) => {
  const colors = { Akuntansi: 'label-blue', Teknologi: 'label-purple', Bisnis: 'label-green', Tutorial: 'label-orange', Lainnya: 'label-default' };
  return colors[cat] || 'label-default';
};

// ── Delete ─────────────────────────────────────────────────
const confirmDeleteArticle = (article) => {
  deleteTarget.value = article;
  deleteType.value = 'article';
};
const confirmDeleteBook = (book) => {
  deleteTarget.value = book;
  deleteType.value = 'book';
};

const executeDelete = async () => {
  if (!deleteTarget.value) return;
  deleting.value = deleteTarget.value.id;
  const success = deleteType.value === 'article'
    ? await store.deleteArticle(deleteTarget.value.id)
    : await store.deleteBook(deleteTarget.value.id);
  deleting.value = null;
  if (success) deleteTarget.value = null;
};

// ── Content ─────────────────────────────────────────────────
const savingContent = ref(false);
const saved = ref(false);
const contentForm = reactive({});

const contentFields = [
  { key: 'heroEyebrow', label: 'Hero Eyebrow', type: 'text' },
  { key: 'heroName', label: 'Hero Nama', type: 'text' },
  { key: 'heroBio', label: 'Hero Bio', type: 'textarea' },
  { key: 'heroTopics', label: 'Hero Topics (tags)', type: 'tags' },
  { key: 'featuredTitle', label: 'Featured Section Title', type: 'text' },
  { key: 'navigationTitle', label: 'Navigation Box Title', type: 'text' },
  { key: 'articlesTitle', label: 'Articles Page Title', type: 'text' },
  { key: 'articlesDescription', label: 'Articles Page Description', type: 'textarea' },
  { key: 'booksTitle', label: 'Books Page Title', type: 'text' },
  { key: 'booksDescription', label: 'Books Page Description', type: 'textarea' },
];

const initContentForm = () => {
  for (const f of contentFields) {
    contentForm[f.key] = Array.isArray(store.siteSettings[f.key])
      ? [...store.siteSettings[f.key]]
      : store.siteSettings[f.key] || '';
  }
};

const saveContent = async () => {
  savingContent.value = true;
  saved.value = false;
  const data = {};
  for (const f of contentFields) {
    data[f.key] = contentForm[f.key];
  }
  await store.saveSiteSettings(data);
  saved.value = true;
  savingContent.value = false;
  setTimeout(() => { saved.value = false; }, 3000);
};

// ── Theme ───────────────────────────────────────────────────
const savingTheme = ref(false);
const themeSaved = ref(false);
const themeForm = reactive({});

const defaultTheme = {
  'color-canvas-default': '#ffffff',
  'color-canvas-subtle': '#f6f8fa',
  'color-border-default': '#d0d7de',
  'color-border-muted': '#d8dee4',
  'color-fg-default': '#1f2328',
  'color-fg-muted': '#636c76',
  'color-fg-subtle': '#818b98',
  'color-accent-fg': '#0969da',
  'color-accent-emphasis': '#0969da',
  'color-accent-subtle': '#ddf4ff',
  'color-success-fg': '#1a7f37',
  'color-danger-fg': '#d1242f',
  'color-warning-fg': '#9a6700',
  'color-header-bg': '#24292f',
  'color-header-text': '#e6edf3',
};

const themeFields = Object.entries(defaultTheme).map(([key, val]) => ({
  key,
  label: key.replace(/^color-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  default: val,
}));

const initThemeForm = () => {
  for (const [key, val] of Object.entries(defaultTheme)) {
    themeForm[key] = store.siteTheme[key] || val;
  }
};

const previewTheme = () => {
  const root = document.documentElement;
  for (const [key, val] of Object.entries(themeForm)) {
    if (val) root.style.setProperty(`--${key}`, val);
  }
};

const resetTheme = () => {
  for (const [key, val] of Object.entries(defaultTheme)) {
    themeForm[key] = val;
  }
  previewTheme();
};

const saveTheme = async () => {
  savingTheme.value = true;
  themeSaved.value = false;
  await store.saveSiteTheme({ ...themeForm });
  themeSaved.value = true;
  savingTheme.value = false;
  setTimeout(() => { themeSaved.value = false; }, 3000);
};

onMounted(() => {
  initContentForm();
  initThemeForm();
});
</script>

<style scoped>
.book-modal {
  align-items: center;
  background: rgba(31, 35, 40, 0.45);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 300;
}
.close-button {
  background: none;
  border: 0;
  color: var(--color-fg-muted);
  cursor: pointer;
  font-size: 16px;
}
</style>
