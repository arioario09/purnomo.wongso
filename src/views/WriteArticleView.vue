<template>
  <div style="max-width: 1280px; margin: 0 auto; padding: 24px">
    <div class="row justify-content-center">
      <div class="col-lg-7">
        <!-- Header -->
        <div style="margin-bottom: 24px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 4px;
            "
          >
            <router-link
              to="/articles"
              style="font-size: 13px; color: var(--color-fg-muted)"
              >Artikel</router-link
            >
            <i
              class="fa-solid fa-chevron-right"
              style="font-size: 10px; color: var(--color-fg-subtle)"
            ></i>
            <span style="font-size: 13px; color: var(--color-fg-muted)"
              >Artikel Baru</span
            >
          </div>
          <h1
            style="
              font-size: 20px;
              font-weight: 600;
              color: var(--color-fg-default);
            "
          >
            <i
              class="fa-solid fa-pen-to-square me-2"
              style="color: var(--color-fg-muted)"
            ></i
            >Tulis Artikel Baru
          </h1>
          <p
            style="
              font-size: 13px;
              color: var(--color-fg-muted);
              margin-top: 4px;
            "
          >
            Bagikan pengetahuan dan ide brilian Anda kepada dunia.
          </p>
        </div>

        <!-- Form Box -->
        <div class="gh-box">
          <div class="gh-box-header">
            <span
              ><i
                class="fa-solid fa-file-pen me-2"
                style="color: var(--color-fg-muted)"
              ></i
              >Detail Artikel</span
            >
          </div>
          <div class="gh-box-body" style="padding: 20px">
            <form @submit.prevent="submitArticle">
              <!-- Judul -->
              <div style="margin-bottom: 16px">
                <label class="form-label" for="title">
                  Judul Artikel
                  <span style="color: var(--color-danger-fg)">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="newArticle.title"
                  required
                  placeholder="Masukkan judul artikel..."
                  style="font-size: 15px; padding: 8px 12px"
                />
              </div>

              <!-- Kategori & Image URL -->
              <div class="row g-3 mb-4">
                <div class="col-md-5">
                  <label class="form-label" for="category">
                    Kategori
                    <span style="color: var(--color-danger-fg)">*</span>
                  </label>
                  <select
                    class="form-select"
                    id="category"
                    v-model="newArticle.category"
                    required
                  >
                    <option value="" disabled selected>
                      Pilih kategori...
                    </option>
                    <option
                      v-for="cat in store.categories.filter(
                        (c) => c !== 'Semua',
                      )"
                      :key="cat"
                      :value="cat"
                    >
                      {{ cat }}
                    </option>
                  </select>
                </div>
                <div class="col-md-7">
                  <label class="form-label" for="imageUpload"
                    >Gambar Cover Artikel</label
                  >
                  <input
                    type="file"
                    class="form-control"
                    id="imageUpload"
                    accept="image/png,image/jpeg,image/webp"
                    @change="uploadArticleImage"
                  />
                  <div v-if="newArticle.image" style="margin-top:8px;">
                    <img :src="newArticle.image" alt="Preview" style="width:100%; max-height:120px; object-fit:cover; border-radius:6px; border:1px solid var(--color-border-muted);" />
                  </div>
                  <div v-if="uploadError" style="margin-top:8px; font-size:12px; color:var(--color-danger-fg);">
                    <i class="fa-solid fa-circle-exclamation"></i> {{ uploadError }}
                  </div>
                  <div class="form-text">
                    <i class="fa-solid fa-circle-info"></i> Gambar akan diunggah
                    ke ImgBB.
                  </div>
                </div>
              </div>

              <hr class="divider" />

              <!-- Konten -->
              <div style="margin-bottom: 20px">
                <label class="form-label" for="content">
                  Konten Artikel
                  <span style="color: var(--color-danger-fg)">*</span>
                </label>
                <textarea
                  class="form-control"
                  id="content"
                  rows="14"
                  v-model="newArticle.content"
                  required
                  placeholder="Mulai menulis konten di sini... (Mendukung tag HTML dasar: <b>, <i>, <h3>, <ul>, dll.)"
                  style="
                    font-family:
                      &quot;SFMono-Regular&quot;, Consolas, monospace;
                    font-size: 13px;
                    resize: vertical;
                  "
                ></textarea>
              </div>

              <!-- Actions -->
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <button
                  type="button"
                  class="btn btn-invisible"
                  @click="resetForm"
                >
                  <i class="fa-solid fa-rotate-left"></i> Reset
                </button>
                <div style="display: flex; gap: 8px">
                  <router-link to="/articles" class="btn btn-default"
                    >Batal</router-link
                  >
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="saving"
                  >
                    <i
                      :class="
                        saving
                          ? 'fa-solid fa-spinner fa-spin'
                          : 'fa-solid fa-paper-plane'
                      "
                    ></i>
                    {{ saving ? "Menyimpan..." : "Publikasikan" }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Success Flash -->
        <div
          v-if="showSuccessMsg"
          class="gh-flash gh-flash-success"
          style="margin-top: 16px"
        >
          <i
            class="fa-solid fa-circle-check"
            style="font-size: 16px; margin-top: 1px"
          ></i>
          <div>
            <strong>Berhasil dipublikasikan!</strong>
            <div style="font-size: 12px; margin-top: 2px">
              Artikel Anda telah ditambahkan. Anda akan diarahkan ke halaman
              artikel...
            </div>
          </div>
        </div>
        <div
          v-if="errorMsg"
          class="gh-flash gh-flash-danger"
          style="margin-top: 16px"
        >
          <i class="fa-solid fa-circle-exclamation"></i>{{ errorMsg }}
        </div>

        <!-- Writing Tips -->
        <div class="gh-box" style="margin-top: 16px">
          <div class="gh-box-header">
            <span
              ><i
                class="fa-solid fa-lightbulb me-2"
                style="color: var(--color-warning-fg)"
              ></i
              >Tips Menulis</span
            >
          </div>
          <div class="gh-box-body" style="padding: 16px">
            <ul
              style="
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
              "
            >
              <li
                style="
                  font-size: 13px;
                  color: var(--color-fg-muted);
                  display: flex;
                  gap: 8px;
                "
              >
                <i
                  class="fa-solid fa-check"
                  style="color: var(--color-success-fg); margin-top: 2px"
                ></i>
                Gunakan judul yang deskriptif dan menarik perhatian. Contoh:
                <strong>"5 Cara Mengatur Arus Kas Usaha Kecil"</strong>.
              </li>
              <li
                style="
                  font-size: 13px;
                  color: var(--color-fg-muted);
                  display: flex;
                  gap: 8px;
                "
              >
                <i
                  class="fa-solid fa-check"
                  style="color: var(--color-success-fg); margin-top: 2px"
                ></i>
                Konten mendukung tag HTML dasar:
                <code
                  style="
                    font-size: 11px;
                    background: var(--color-canvas-subtle);
                    border: 1px solid var(--color-border-muted);
                    padding: 1px 5px;
                    border-radius: 3px;
                  "
                  >&lt;b&gt;</code
                >,
                <code
                  style="
                    font-size: 11px;
                    background: var(--color-canvas-subtle);
                    border: 1px solid var(--color-border-muted);
                    padding: 1px 5px;
                    border-radius: 3px;
                  "
                  >&lt;h3&gt;</code
                >,
                <code
                  style="
                    font-size: 11px;
                    background: var(--color-canvas-subtle);
                    border: 1px solid var(--color-border-muted);
                    padding: 1px 5px;
                    border-radius: 3px;
                  "
                  >&lt;ul&gt;</code
                >, dll.
              </li>
              <li
                style="
                  font-size: 13px;
                  color: var(--color-fg-muted);
                  display: flex;
                  gap: 8px;
                "
              >
                <i
                  class="fa-solid fa-check"
                  style="color: var(--color-success-fg); margin-top: 2px"
                ></i>
                Gunakan gambar cover yang relevan untuk menarik pembaca.
              </li>
            </ul>

            <div class="writing-example">
              <div class="writing-example-title">
                <i class="fa-solid fa-pen"></i> Contoh isi artikel
              </div>
              <pre>
&lt;p&gt;Arus kas yang sehat membantu usaha tetap berjalan dengan baik.&lt;/p&gt;

&lt;h3&gt;1. Catat semua pemasukan dan pengeluaran&lt;/h3&gt;
&lt;p&gt;Buat pencatatan setiap hari agar kondisi keuangan mudah dipantau.&lt;/p&gt;

&lt;h3&gt;Kesimpulan&lt;/h3&gt;
&lt;p&gt;Mulailah dari kebiasaan kecil dan lakukan secara konsisten.&lt;/p&gt;</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store } from "../store.js";

const router = useRouter();

const newArticle = ref({ title: "", category: "", image: "", content: "" });
const showSuccessMsg = ref(false);
const saving = ref(false);
const errorMsg = ref("");
const uploadError = ref("");

const resetForm = () => {
  newArticle.value = { title: "", category: "", image: "", content: "" };
  uploadError.value = "";
};

const uploadArticleImage = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadError.value = "";

  if (!import.meta.env.VITE_IMGBB_API_KEY) {
    uploadError.value = "API key ImgBB belum dikonfigurasi. Set VITE_IMGBB_API_KEY.";
    return;
  }

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
    const imgUrl = data?.data?.image?.url || data?.data?.url;
    if (imgUrl) {
      newArticle.value.image = imgUrl;
    } else {
      throw new Error("Gagal mengunggah gambar artikel.");
    }
  } catch (error) {
    console.error(error);
    uploadError.value = "Gagal mengunggah gambar. Periksa API key ImgBB.";
  }
};

const submitArticle = async () => {
  saving.value = true;
  errorMsg.value = "";
  let formattedContent = newArticle.value.content
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  if (!formattedContent.startsWith("<p>")) {
    formattedContent = "<p>" + formattedContent + "</p>";
  }

  const randomImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  ];

  try {
    await store.addArticle({
      title: newArticle.value.title,
      category: newArticle.value.category,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      image:
        newArticle.value.image ||
        randomImages[Math.floor(Math.random() * randomImages.length)],
      excerpt:
        newArticle.value.content.replace(/<[^>]+>/g, "").substring(0, 120) +
        "...",
      content: formattedContent,
      author: {
        name: store.currentUser?.name || store.userProfile.name,
        username: store.userProfile.username,
        avatar: store.currentUser?.photo || store.userProfile.avatar,
        bio: store.userProfile.bio,
      },
    });

    showSuccessMsg.value = true;
    setTimeout(() => {
      showSuccessMsg.value = false;
      resetForm();
      router.push("/articles");
    }, 1200);
  } catch (error) {
    errorMsg.value =
      "Artikel gagal disimpan. Periksa konfigurasi Firebase dan izin Firestore.";
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.writing-example {
  margin-top: 16px;
  border: 1px solid var(--color-border-muted);
  border-radius: 6px;
  overflow: hidden;
}

.writing-example-title {
  padding: 8px 10px;
  color: var(--color-fg-default);
  background: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-muted);
  font-size: 12px;
  font-weight: 600;
}

.writing-example-title i {
  color: var(--color-fg-muted);
  margin-right: 6px;
}

.writing-example pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  color: var(--color-fg-default);
  background: var(--color-canvas-default);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
