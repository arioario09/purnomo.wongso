<template>
  <div style="max-width: 1280px; margin: 0 auto; padding: 24px;" v-if="article">
    <!-- Breadcrumb -->
    <div style="font-size: 13px; color: var(--color-fg-muted); margin-bottom: 16px; display:flex; align-items:center; gap: 6px;">
      <router-link to="/" style="color: var(--color-fg-muted) !important;">Beranda</router-link>
      <i class="fa-solid fa-chevron-right" style="font-size: 10px;"></i>
      <router-link to="/articles" style="color: var(--color-fg-muted) !important;">Artikel</router-link>
      <i class="fa-solid fa-chevron-right" style="font-size: 10px;"></i>
      <span>{{ article.title }}</span>
    </div>

    <div class="row g-4">
      <!-- Article Content -->
      <div class="col-lg-8">
        <div class="gh-box overflow-hidden">
          <!-- Cover Image -->
          <img :src="article.image" :alt="article.title" style="width:100%; height:300px; object-fit:cover; display:block; border-bottom: 1px solid var(--color-border-muted);" />

          <div style="padding: 24px;">
            <!-- Category + Meta -->
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px; flex-wrap:wrap;">
              <span :class="getCategoryLabel(article.category)" class="label">
                <i :class="getCategoryIcon(article.category)" style="font-size:10px;"></i>
                {{ article.category }}
              </span>
              <span style="font-size:12px; color: var(--color-fg-subtle);">
                <i class="fa-regular fa-calendar me-1"></i>{{ article.date }}
              </span>
            </div>

            <!-- Title -->
            <h1 class="article-detail-title">{{ article.title }}</h1>

            <!-- Author Info -->
            <div style="display:flex; align-items:center; gap:10px; padding: 12px 0; border-top: 1px solid var(--color-border-muted); border-bottom: 1px solid var(--color-border-muted); margin-bottom:24px;">
              <img
                :src="author.avatar"
                :alt="author.name"
                style="width:36px; height:36px; border-radius:50%; border: 1px solid var(--color-border-default);"
              />
              <div>
                <span style="font-size:13px; font-weight:600; color: var(--color-accent-fg);">{{ author.name }}</span>
                <div style="font-size:12px; color: var(--color-fg-muted);">Penulis · {{ article.date }}</div>
              </div>
            </div>

            <!-- Content -->
            <div class="article-detail-content" v-html="article.content"></div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Back button -->
        <button class="btn btn-default btn-sm w-100 mb-2" @click="$router.push('/articles')">
          <i class="fa-solid fa-arrow-left"></i> Kembali ke Artikel
        </button>

        <!-- Edit button -->
        <router-link
          v-if="canEdit"
          :to="{ name: 'article-edit', params: { id: article.id } }"
          class="btn btn-primary btn-sm w-100 mb-3"
        >
          <i class="fa-solid fa-pen-to-square"></i> Edit Artikel
        </router-link>

        <!-- About Author -->
        <div class="gh-box mb-3">
          <div class="gh-box-header">Tentang Penulis</div>
          <div class="gh-box-body" style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img
                :src="author.avatar"
                :alt="author.name"
                style="width:44px; height:44px; border-radius:50%; border: 1px solid var(--color-border-default);"
              />
              <div>
                <div style="font-size:14px; font-weight:600;">{{ author.name }}</div>
                <div style="font-size:12px; color: var(--color-fg-muted);">{{ author.username || 'Penulis' }}</div>
              </div>
            </div>
            <p style="font-size:12px; color: var(--color-fg-muted); line-height:1.5;">{{ author.bio || 'Berbagi wawasan dan pengalaman melalui tulisan.' }}</p>
            <router-link to="/articles" class="btn btn-default btn-sm" style="justify-content:center;">
              Lihat semua artikel
            </router-link>
          </div>
        </div>

        <!-- Other Articles -->
        <div class="gh-box">
          <div class="gh-box-header">Artikel Lainnya</div>
          <div style="padding: 0;">
            <div
              v-for="other in otherArticles"
              :key="other.id"
              @click="$router.push({ name: 'article-detail', params: { id: other.id } })"
              style="padding: 12px 16px; border-bottom: 1px solid var(--color-border-muted); cursor: pointer; transition: background 0.1s ease;"
              @mouseenter="e => e.currentTarget.style.background='var(--color-canvas-subtle)'"
              @mouseleave="e => e.currentTarget.style.background=''"
            >
              <div style="display:flex; gap:6px; margin-bottom:4px;">
                <span :class="getCategoryLabel(other.category)" class="label" style="font-size:10px; padding: 1px 6px;">{{ other.category }}</span>
              </div>
              <div style="font-size:13px; font-weight:500; color: var(--color-fg-default); line-height:1.4;">{{ other.title }}</div>
              <div style="font-size:11px; color: var(--color-fg-subtle); margin-top: 3px;">{{ other.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 State -->
  <div style="max-width: 1280px; margin: 0 auto; padding: 24px;" v-else>
    <div class="gh-box" style="padding:48px; text-align:center;">
      <div style="font-size:48px; margin-bottom:16px; color: var(--color-fg-muted);">
        <i class="fa-regular fa-file-lines"></i>
      </div>
      <h2 style="font-size:18px; font-weight:600; margin-bottom:8px;">Artikel tidak ditemukan</h2>
      <p style="font-size:14px; color: var(--color-fg-muted);">Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
      <router-link to="/articles" class="btn btn-primary btn-sm" style="margin-top:16px; display:inline-flex;">
        Kembali ke Daftar Artikel
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store.js';

const route = useRoute();
const article = computed(() => store.articles.find(a => String(a.id) === String(route.params.id)));
const canEdit = computed(() => {
  if (!store.isLoggedIn || !article.value) return false;
  return !article.value.authorEmail || article.value.authorEmail === store.currentUser?.email;
});
const author = computed(() => article.value?.author || {
  name: 'Purnomo Wongso',
  username: 'purnomo.wongso',
  avatar: 'https://ui-avatars.com/api/?name=Purnomo+Wongso&background=0d1117&color=e6edf3&size=80&bold=true',
  bio: 'Berbagi wawasan dan pengalaman melalui tulisan.'
});
const otherArticles = computed(() => store.articles.filter(a => String(a.id) !== String(route.params.id)).slice(0, 4));

const categoryColors = { 'Akuntansi': 'label-blue', 'Teknologi': 'label-purple', 'Bisnis': 'label-green', 'Tutorial': 'label-orange', 'Lainnya': 'label-default' };
const categoryIcons = { 'Akuntansi': 'fa-solid fa-calculator', 'Teknologi': 'fa-solid fa-microchip', 'Bisnis': 'fa-solid fa-briefcase', 'Tutorial': 'fa-solid fa-book', 'Lainnya': 'fa-solid fa-tag' };

const getCategoryLabel = (cat) => categoryColors[cat] || 'label-default';
const getCategoryIcon = (cat) => categoryIcons[cat] || 'fa-solid fa-tag';
</script>
