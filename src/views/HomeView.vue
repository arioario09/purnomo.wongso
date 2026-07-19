<template>
  <div>
    <!-- Website Hero -->
    <div class="gh-hero">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
        <div class="home-hero-content">
          <!-- <div class="home-brand-mark" aria-hidden="true"><i class="fa-solid fa-code"></i></div> -->
          <div>
            <div class="home-hero-eyebrow">Catatan, pembelajaran, dan inspirasi</div>
            <h1 class="gh-hero-name">Purnomo Wongso</h1>
            <p class="gh-hero-bio">Ruang untuk berbagi wawasan seputar akuntansi, teknologi, bisnis, dan pengembangan diri. Temukan ide yang dapat dipelajari dan diterapkan dalam pekerjaan sehari-hari.</p>

            <div class="home-hero-topics">
              <span><i class="fa-solid fa-newspaper"></i> Artikel pilihan</span>
              <span><i class="fa-solid fa-graduation-cap"></i> Materi belajar</span>
              <span><i class="fa-solid fa-lightbulb"></i> Wawasan praktis</span>
            </div>

            <div style="display:flex; gap: 8px; margin-top: 16px; flex-wrap:wrap;">
              <router-link to="/articles" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-book-open"></i> Baca Artikel
              </router-link>
              <router-link to="/modules" class="btn btn-default btn-sm font-color-primary">
                <i class="fa-solid fa-graduation-cap"></i> Jelajahi Buku
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div style="max-width: 1280px; margin: 24px auto; padding: 0 24px;">
      <div class="row g-4">
        <!-- Featured Articles -->
        <div class="col-lg-8">
          <div class="section-heading">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-thumbtack" style="color: var(--color-fg-muted);"></i>
              Artikel Unggulan
            </div>
            <router-link to="/articles" class="btn btn-invisible btn-sm">
              Lihat semua <i class="fa-solid fa-arrow-right" style="font-size:11px;"></i>
            </router-link>
          </div>

          <div class="row g-3">
            <div class="col-md-6" v-for="article in featuredArticles" :key="article.id">
              <div class="article-card" @click="viewArticle(article.id)">
                <img :src="article.image" :alt="article.title" class="article-card-img" />
                <div class="article-card-body">
                  <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom: 4px;">
                    <span :class="getCategoryLabel(article.category)" class="label">{{ article.category }}</span>
                  </div>
                  <div class="article-card-title">{{ article.title }}</div>
                  <div class="article-card-desc">{{ article.excerpt }}</div>
                  <div class="article-card-meta">
                    <span style="font-size:11px; color: var(--color-fg-subtle);">
                      <i class="fa-regular fa-clock"></i> {{ article.date }}
                    </span>
                    <span style="font-size:12px; color: var(--color-accent-fg); font-weight:500;">
                      Baca <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="col-lg-4">
          <!-- Quick Links Box -->
          <div class="gh-box mb-3">
            <div class="gh-box-header">
              <span><i class="fa-solid fa-compass me-2" style="color: var(--color-fg-muted);"></i>Navigasi Cepat</span>
            </div>
            <div class="gh-box-body" style="padding: 0;">
              <ul style="list-style:none; padding: 0; margin:0;">
                <li v-for="link in quickLinks" :key="link.to">
                  <router-link :to="link.to" class="quick-link-item">
                    <i :class="link.icon" style="width:18px; text-align:center; color: var(--color-fg-muted);"></i>
                    <span>{{ link.label }}</span>
                    <span class="ms-auto" style="font-size:11px; color: var(--color-fg-subtle);">
                      <i class="fa-solid fa-chevron-right"></i>
                    </span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <!-- Latest Books -->
          <div class="gh-box">
            <div class="gh-box-header">
              <span><i class="fa-solid fa-books me-2" style="color: var(--color-fg-muted);"></i>Buku Terbaru</span>
            </div>
            <div class="gh-box-body" style="display:flex; flex-direction:column; gap: 14px;">
              <div v-for="book in latestBooks" :key="book.id" style="display:flex; gap:9px; align-items:center;">
                <div style="width:30px; height:38px; border-radius:4px; background:#ddf4ff; color:#0969da; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fa-solid fa-book"></i></div>
                <div style="min-width:0;">
                  <div style="font-size:12px; font-weight:500; color:var(--color-fg-default); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ book.title }}</div>
                  <div style="font-size:11px; color:var(--color-fg-muted);">{{ book.author }}</div>
                </div>
              </div>
              <router-link to="/modules" class="btn btn-default btn-sm" style="justify-content:center; margin-top:4px;">
                Lihat semua buku
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store.js';

const router = useRouter();

const featuredArticles = computed(() => store.articles.slice(0, 4));
const latestBooks = computed(() => store.books.slice(0, 3));

const quickLinks = [
  { to: '/articles', label: 'Semua Artikel', icon: 'fa-solid fa-newspaper' },
  { to: '/modules', label: 'Koleksi Buku', icon: 'fa-solid fa-books' },
  { to: '/write-article', label: 'Tulis Artikel Baru', icon: 'fa-solid fa-pen-to-square' },
];

const categoryColors = {
  'Akuntansi': 'label-blue',
  'Teknologi': 'label-purple',
  'Bisnis': 'label-green',
  'Tutorial': 'label-orange',
  'Lainnya': 'label-default',
};

const getCategoryLabel = (cat) => categoryColors[cat] || 'label-default';

const viewArticle = (id) => {
  router.push({ name: 'article-detail', params: { id } });
};
</script>

<style scoped>
.home-hero-content { display: flex; gap: 20px; align-items: flex-start; }
.home-brand-mark { align-items: center; background: #0969da; border-radius: 8px; color: #fff; display: flex; flex: 0 0 auto; font-size: 24px; height: 64px; justify-content: center; width: 64px; }
.home-hero-eyebrow { color: var(--color-accent-fg); font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.home-hero-topics { align-items: center; color: var(--color-fg-muted); display: flex; flex-wrap: wrap; font-size: 13px; gap: 10px 20px; }
.home-hero-topics span { align-items: center; display: inline-flex; gap: 6px; }
.home-hero-topics i { color: var(--color-fg-subtle); font-size: 12px; }
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

@media (max-width: 767px) {
  .home-brand-mark { font-size: 18px; height: 48px; width: 48px; }
  .home-hero-content { gap: 14px; }
}
</style>
