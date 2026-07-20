import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { authReady, store } from '../store.js';
import { isEmailAllowed } from '../firebase.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticlesView.vue')
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: () => import('../views/ArticleDetailView.vue'),
      props: true
    },
    {
      path: '/modules',
      name: 'modules',
      component: () => import('../views/ModulesView.vue')
    },
    {
      path: '/write-article',
      name: 'write-article',
      component: () => import('../views/WriteArticleView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdmin: true }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  }
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  await authReady;
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.guestOnly && store.isLoggedIn) {
    next({ name: 'home' });
  } else if (to.meta.requiresAdmin && (!store.isLoggedIn || !isEmailAllowed(store.currentUser?.email))) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
