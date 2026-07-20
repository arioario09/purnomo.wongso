<template>
  <div class="books-page">
    <header class="books-header">
      <div>
        <h1><i class="fa-solid fa-books me-2"></i>{{ store.siteSettings.booksTitle }}</h1>
        <p>
          {{ store.siteSettings.booksDescription }}
        </p>
      </div>
      <div class="books-header-actions">
        <p v-if="!store.isLoggedIn" class="login-required-note">
          <i class="fa-solid fa-circle-info me-2"></i>Silakan masuk terlebih
          dahulu untuk menambahkan buku.
        </p>
        <button class="btn btn-primary" @click="openAddBookForm">
          <i class="fa-solid fa-plus"></i> Tambah Buku
        </button>
      </div>
    </header>

    <div class="books-summary">
      <i class="fa-solid fa-book-open"></i>
      <div>
        <strong>{{ store.books.length }} buku</strong
        ><span>tersedia di koleksi</span>
      </div>
    </div>

    <div v-if="store.books.length" class="row g-3">
      <div v-for="book in store.books" :key="book.id" class="col-md-6 col-lg-4">
        <article class="book-card">
          <img
            v-if="book.cover"
            :src="book.cover"
            :alt="`Sampul ${book.title}`"
            class="book-cover"
          />
          <div v-else class="book-cover book-cover-placeholder">
            <i class="fa-solid fa-book"></i>
          </div>
          <div class="book-body">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-author">
              <i class="fa-solid fa-user-pen"></i> {{ book.author }}
            </div>
            <p>{{ book.description }}</p>
            <a
              v-if="book.fileUrl"
              :href="book.fileUrl"
              target="_blank"
              rel="noreferrer"
              class="btn btn-default btn-sm"
            >
              <i class="fa-solid fa-file-pdf"></i> Buka {{ book.fileName }}
            </a>
            <span v-else class="book-file"
              ><i class="fa-regular fa-file-lines"></i> Belum ada file
              buku</span
            >
          </div>
        </article>
      </div>
    </div>

    <div v-else class="gh-empty">
      <div class="gh-empty-icon"><i class="fa-solid fa-books"></i></div>
      <p>Belum ada buku di koleksi.</p>
    </div>

    <div v-if="showForm" class="book-modal" @click.self="closeForm">
      <form class="book-form gh-box" @submit.prevent="addBook">
        <div class="gh-box-header">
          <span>Tambah Buku</span
          ><button
            type="button"
            class="close-button"
            @click="closeForm"
            aria-label="Tutup"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="gh-box-body">
          <label class="form-label" for="book-title">Judul buku</label>
          <input
            id="book-title"
            v-model.trim="book.title"
            class="form-control"
            required
            placeholder="Contoh: Panduan Akuntansi Praktis"
          />
          <label class="form-label" for="book-author">Penulis</label>
          <input
            id="book-author"
            v-model.trim="book.author"
            class="form-control"
            required
            placeholder="Nama penulis"
          />
          <label class="form-label" for="book-description"
            >Deskripsi singkat</label
          >
          <textarea
            id="book-description"
            v-model.trim="book.description"
            class="form-control book-description"
            required
            placeholder="Ceritakan isi buku secara singkat."
          ></textarea>
          <label class="form-label" for="book-cover"
            >Sampul buku (opsional)</label
          >
          <input
            id="book-cover"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="form-control"
            @change="uploadCover"
          />
          <label class="form-label" for="book-file">Link file buku PDF</label>
          <input
            id="book-file"
            v-model.trim="book.fileUrl"
            class="form-control"
            placeholder="https://drive.google.com/...."
          />
          <div class="form-text">
            Sampul gambar akan diunggah ke ImgBB. File buku gunakan link PDF
            dari Google Drive.
          </div>
        </div>
        <div class="book-form-actions">
          <button type="button" class="btn btn-default" @click="closeForm">
            Batal</button
          ><button
            class="btn btn-primary"
            type="submit"
            :disabled="!store.isLoggedIn"
          >
            <i class="fa-solid fa-upload"></i> Simpan Buku
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store.js";

const router = useRouter();
const showForm = ref(false);
const book = reactive({
  title: "",
  author: "",
  description: "",
  cover: "",
  fileUrl: "",
});
const resetBook = () =>
  Object.assign(book, {
    title: "",
    author: "",
    description: "",
    cover: "",
    fileUrl: "",
  });
const closeForm = () => {
  showForm.value = false;
  resetBook();
};
const openAddBookForm = () => {
  if (!store.isLoggedIn) {
    router.push({ name: "login", query: { redirect: "/modules" } });
    return;
  }
  showForm.value = true;
};

const uploadCover = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    if (data?.data?.url) {
      book.cover = data.data.url;
      book.fileName = book.title || "Buku";
    } else {
      throw new Error("Gagal mengunggah sampul gambar.");
    }
  } catch (error) {
    console.error(error);
    alert("Gagal mengunggah sampul gambar. Coba lagi.");
  }
};

const addBook = async () => {
  if (!store.isLoggedIn) {
    router.push({ name: "login", query: { redirect: "/modules" } });
    return;
  }

  try {
    const payload = {
      ...book,
      fileName: book.title || "Buku",
    };

    await store.addBook(payload);
    showForm.value = false;
    resetBook();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.books-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.books-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.books-header h1 {
  color: var(--color-fg-default);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
}
.books-header p {
  color: var(--color-fg-muted);
  font-size: 13px;
}
.books-header-actions {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.login-required-note {
  color: var(--color-fg-muted);
  font-size: 12px;
  margin: 0;
}
.books-summary {
  align-items: center;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 14px 16px;
}
.books-summary > i {
  align-items: center;
  background: #ddf4ff;
  border-radius: 6px;
  color: #0969da;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}
.books-summary strong,
.books-summary span {
  display: block;
}
.books-summary strong {
  color: var(--color-fg-default);
  font-size: 14px;
}
.books-summary span {
  color: var(--color-fg-muted);
  font-size: 12px;
}
.book-card {
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.book-cover {
  background: #ddf4ff;
  height: 100%;
  min-height: 182px;
  object-fit: cover;
  width: 112px;
}
.book-cover-placeholder {
  align-items: center;
  color: #0969da;
  display: flex;
  font-size: 30px;
  justify-content: center;
}
.book-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
}
.book-title {
  color: var(--color-fg-default);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.book-author {
  color: var(--color-fg-muted);
  font-size: 12px;
  margin-top: 5px;
}
.book-body p {
  color: var(--color-fg-muted);
  font-size: 12px;
  line-height: 1.5;
  margin: 10px 0 14px;
}
.book-body .btn,
.book-file {
  align-self: flex-start;
  margin-top: auto;
}
.book-file {
  color: var(--color-fg-subtle);
  font-size: 11px;
}
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
.book-form {
  max-width: 560px;
  width: 100%;
}
.close-button {
  background: none;
  border: 0;
  color: var(--color-fg-muted);
  cursor: pointer;
  font-size: 16px;
}
.book-form .form-label {
  margin-top: 14px;
}
.book-description {
  min-height: 100px;
}
.book-form-actions {
  border-top: 1px solid var(--color-border-muted);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px 16px;
}
@media (max-width: 575px) {
  .books-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .book-cover {
    width: 96px;
  }
}
</style>
