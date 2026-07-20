<template>
  <div style="max-width: 1280px; margin: 0 auto; padding: 0;">
    <!-- Page Header -->
    <div style="padding: 24px 24px 0;">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <h1 style="font-size: 20px; font-weight: 600; color: var(--color-fg-default);">
          <i class="fa-solid fa-newspaper me-2" style="color: var(--color-fg-muted);"></i>{{ store.siteSettings.articlesTitle }}
        </h1>
        <router-link to="/write-article" class="btn btn-primary btn-sm">
          <i class="fa-solid fa-plus"></i> Tulis Artikel
        </router-link>
      </div>
      <p style="font-size: 13px; color: var(--color-fg-muted); margin-bottom: 16px;">
        {{ store.siteSettings.articlesDescription }}
      </p>

      <!-- Category Filter Tabs -->
      <div class="gh-tabs">
        <button
          v-for="cat in store.categories"
          :key="cat"
          class="gh-tab"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          <i :class="getCategoryIcon(cat)" style="font-size: 12px;"></i>
          {{ cat }}
          <span v-if="cat === 'Semua'" class="tab-count">{{ store.articles.length }}</span>
          <span v-else-if="getCategoryCount(cat) > 0" class="tab-count">{{ getCategoryCount(cat) }}</span>
        </button>
      </div>
    </div>

    <!-- Article Grid -->
    <div style="padding: 20px 24px;">
      <!-- Results info -->
      <div style="font-size: 13px; color: var(--color-fg-muted); margin-bottom: 16px;" v-if="filteredArticles.length > 0">
        Menampilkan <strong>{{ filteredArticles.length }}</strong> artikel
        <span v-if="activeCategory !== 'Semua'"> dalam kategori "<strong>{{ activeCategory }}</strong>"</span>
      </div>

      <div class="row g-3" v-if="filteredArticles.length > 0">
        <div class="col-md-6 col-lg-4" v-for="article in filteredArticles" :key="article.id">
          <div class="article-card h-100" @click="viewArticle(article.id)">
            <img :src="article.image" :alt="article.title" class="article-card-img" />
            <div class="article-card-body">
              <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom: 6px;">
                <span :class="getCategoryLabel(article.category)" class="label">{{ article.category }}</span>
              </div>
              <div class="article-card-title">{{ article.title }}</div>
              <div class="article-card-desc">{{ article.excerpt }}</div>
              <div class="article-author">
                <img :src="getAuthor(article).avatar" :alt="getAuthor(article).name" />
                <span>{{ getAuthor(article).name }}</span>
              </div>
              <div class="article-card-meta">
                <span style="font-size:11px; color: var(--color-fg-subtle); display:flex; align-items:center; gap:4px;">
                  <i class="fa-regular fa-calendar"></i> {{ article.date }}
                </span>
                <span style="font-size:12px; color: var(--color-accent-fg); font-weight:500;">
                  Baca <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="gh-empty" v-else>
        <div class="gh-empty-icon"><i class="fa-regular fa-folder-open"></i></div>
        <p style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">Tidak ada artikel ditemukan</p>
        <p style="font-size: 13px;">Belum ada artikel dalam kategori "<strong>{{ activeCategory }}</strong>".</p>
        <router-link to="/write-article" class="btn btn-primary btn-sm" style="margin-top:12px;">
          <i class="fa-solid fa-plus"></i> Tulis Artikel Pertama
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store.js';

const router = useRouter();
const activeCategory = ref('Semua');

const filteredArticles = computed(() => {
  if (activeCategory.value === 'Semua') return store.articles;
  return store.articles.filter(a => a.category === activeCategory.value);
});

const getCategoryCount = (cat) => store.articles.filter(a => a.category === cat).length;

const getCategoryIcon = (cat) => ({
  'Semua': 'fa-solid fa-grip',
  'Akuntansi': 'fa-solid fa-calculator',
  'Teknologi': 'fa-solid fa-microchip',
  'Bisnis': 'fa-solid fa-briefcase',
  'Tutorial': 'fa-solid fa-book',
  'Lainnya': 'fa-solid fa-ellipsis',
})[cat] || 'fa-solid fa-tag';

const categoryColors = {
  'Akuntansi': 'label-blue',
  'Teknologi': 'label-purple',
  'Bisnis': 'label-green',
  'Tutorial': 'label-orange',
  'Lainnya': 'label-default',
};
const getCategoryLabel = (cat) => categoryColors[cat] || 'label-default';

const viewArticle = (id) => router.push({ name: 'article-detail', params: { id } });
const getAuthor = (article) => article.author || {
  name: 'Purnomo Wongso',
  avatar: 'https://ui-avatars.com/api/?name=Purnomo+Wongso&background=0d1117&color=e6edf3&size=64&bold=true'
};
</script>

<style scoped>
.article-author { align-items: center; color: var(--color-fg-muted); display: flex; font-size: 12px; gap: 6px; }
.article-author img { border: 1px solid var(--color-border-default); border-radius: 50%; height: 20px; object-fit: cover; width: 20px; }
</style>
