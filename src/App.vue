<template>
  <!-- GitHub-Style Header -->
  <header class="gh-header">
    <div class="gh-header-inner">
      <button
        class="mobile-menu-toggle"
        @click="toggleMobileMenu"
        :aria-expanded="mobileMenuOpen"
        aria-label="Buka menu navigasi"
      >
        <i
          class="fa-solid"
          :class="mobileMenuOpen ? 'fa-xmark' : 'fa-bars'"
        ></i>
      </button>

      <!-- Nav Links -->
      <nav
        class="gh-header-nav"
        ref="mobileMenuRef"
        :class="{ 'mobile-open': mobileMenuOpen }"
      >
        <router-link
          to="/"
          class="gh-header-nav-item"
          exact-active-class="active"
          @click="closeMobileMenu"
        >
          <i class="fa-solid fa-house" style="font-size: 12px"></i>
          <span
            class="nav-label"
            :class="mobileMenuOpen ? 'nav-label-active' : 'nav-label-default'"
            >Beranda</span
          >
        </router-link>
        <router-link
          to="/articles"
          class="gh-header-nav-item"
          active-class="active"
          @click="closeMobileMenu"
        >
          <i class="fa-solid fa-newspaper" style="font-size: 12px"></i>
          <span
            class="nav-label"
            :class="mobileMenuOpen ? 'nav-label-active' : 'nav-label-default'"
            >Artikel</span
          >
        </router-link>
        <router-link
          to="/modules"
          class="gh-header-nav-item"
          active-class="active"
          @click="closeMobileMenu"
        >
          <i class="fa-solid fa-graduation-cap" style="font-size: 12px"></i>
          <span
            class="nav-label"
            :class="mobileMenuOpen ? 'nav-label-active' : 'nav-label-default'"
            >Buku</span
          >
        </router-link>
      </nav>

      <div class="gh-header-spacer"></div>

      <!-- Right Side: Guest or Logged-in -->
      <div class="gh-header-actions">
        <!-- Guest State -->
        <template v-if="!store.isLoggedIn">
          <router-link
            to="/login"
            class="btn btn-default btn-sm"
            style="
              background: transparent;
              border-color: rgba(255, 255, 255, 0.3);
              color: #e6edf3 !important;
            "
          >
            Sign in
          </router-link>
        </template>

        <!-- Logged-in State -->
        <template v-else>
          <router-link
            to="/write-article"
            class="btn btn-primary btn-sm write-button"
          >
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
            <span class="d-none d-sm-inline">Tulis</span>
          </router-link>

          <!-- Dropdown Trigger -->
          <div class="avatar-dropdown" ref="dropdownRef">
            <button
              class="avatar-btn"
              @click="toggleDropdown"
              :aria-expanded="dropdownOpen"
            >
              <img
                :src="store.userProfile.avatar"
                :alt="store.userProfile.name"
                style="
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  border: 2px solid rgba(255, 255, 255, 0.2);
                  object-fit: cover;
                "
              />
              <i
                class="fa-solid fa-caret-down"
                style="font-size: 10px; color: rgba(255, 255, 255, 0.6)"
              ></i>
            </button>

            <!-- Dropdown Menu -->
            <div class="avatar-dropdown-menu" v-if="dropdownOpen">
              <div class="dropdown-header">
                <div
                  style="
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--color-fg-default);
                  "
                >
                  {{ store.userProfile.name }}
                </div>
                <div style="font-size: 11px; color: var(--color-fg-muted)">
                  {{ store.currentUser?.email }}
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link
                to="/"
                class="dropdown-item"
                @click="dropdownOpen = false"
              >
                <i class="fa-solid fa-house"></i> Beranda
              </router-link>
              <router-link
                to="/write-article"
                class="dropdown-item"
                @click="dropdownOpen = false"
              >
                <i class="fa-solid fa-pen-to-square"></i> Tulis Artikel
              </router-link>
              <router-link
                to="/profile"
                class="dropdown-item"
                @click="dropdownOpen = false"
              >
                <i class="fa-solid fa-user"></i> Profil Saya
              </router-link>
              <div class="dropdown-divider"></div>
              <button
                class="dropdown-item text-danger-item"
                @click="handleLogout"
              >
                <i class="fa-solid fa-right-from-bracket"></i> Sign out
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <!-- GitHub-Style Footer -->
  <footer class="gh-footer">
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px">
      <div
        class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3"
      >
        <div class="gh-footer-links">
          <span style="font-size: 12px; color: var(--color-fg-muted)"
            >&copy; {{ new Date().getFullYear() }}
            {{ store.userProfile.name }}</span
          >
          <span style="color: var(--color-border-default)">·</span>
          <router-link to="/">Beranda</router-link>
          <router-link to="/articles">Artikel</router-link>
          <router-link to="/modules">Modul</router-link>
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <a
            :href="'https://twitter.com/' + store.userProfile.twitter"
            class="gh-social-btn"
            aria-label="Twitter"
            target="_blank"
            ><i class="fa-brands fa-x-twitter"></i
          ></a>
          <a
            :href="'https://linkedin.com/in/' + store.userProfile.linkedin"
            class="gh-social-btn"
            aria-label="LinkedIn"
            target="_blank"
            ><i class="fa-brands fa-linkedin-in"></i
          ></a>
          <a
            :href="'https://github.com/' + store.userProfile.github"
            class="gh-social-btn"
            aria-label="GitHub"
            target="_blank"
            ><i class="fa-brands fa-github"></i
          ></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { store } from "./store.js";

const router = useRouter();
const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const dropdownRef = ref(null);
const mobileMenuRef = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) dropdownOpen.value = false;
};
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleClickOutside = (e) => {
  const clickedInsideDropdown = dropdownRef.value?.contains(e.target);
  const clickedInsideMenu = mobileMenuRef.value?.contains(e.target);

  if (!clickedInsideDropdown && !clickedInsideMenu) {
    dropdownOpen.value = false;
    mobileMenuOpen.value = false;
  }
};

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);

router.afterEach(() => {
  dropdownOpen.value = false;
  mobileMenuOpen.value = false;
});

const handleLogout = async () => {
  await store.logout();
  dropdownOpen.value = false;
  mobileMenuOpen.value = false;
  router.push("/");
};
</script>

<style scoped>
.gh-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 64px;
  position: relative;
}

.mobile-menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: transparent;
  color: var(--color-header-text);
  cursor: pointer;
}

.nav-label {
  display: inline-block;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.nav-label-default {
  color: var(--color-header-text);
}

.nav-label-active {
  color: var(--color-accent-fg);
}

/* Avatar Dropdown */
.avatar-dropdown {
  position: relative;
}
.write-button {
  min-height: 32px;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.avatar-btn:hover {
  background: rgba(177, 186, 196, 0.12);
}

.avatar-dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 220px;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(140, 149, 159, 0.25);
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 16px;
  background: var(--color-canvas-subtle);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border-muted);
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--color-fg-default) !important;
  text-decoration: none !important;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: background 0.1s ease;
}
.dropdown-item:hover {
  background: var(--color-canvas-subtle);
  text-decoration: none !important;
}
.dropdown-item i {
  width: 16px;
  text-align: center;
  color: var(--color-fg-muted);
  font-size: 12px;
}

.text-danger-item {
  color: #d1242f !important;
}
.text-danger-item i {
  color: #d1242f !important;
}
.text-danger-item:hover {
  background: #fff0ee;
}

@media (max-width: 767px) {
  .mobile-menu-toggle {
    display: inline-flex;
  }

  .gh-header-nav {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    left: 16px;
    right: 16px;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: var(--color-canvas-default);
    border: 1px solid var(--color-border-default);
    border-radius: 8px;
    box-shadow: var(--shadow-large);
    z-index: 220;
  }

  .gh-header-nav.mobile-open {
    display: flex;
  }

  .gh-header-nav-item {
    color: var(--color-fg-default) !important;
    width: 100%;
    padding: 10px 12px;
    border-radius: 6px;
  }

  .nav-label-default {
    color: var(--color-fg-default);
  }

  .nav-label-active {
    color: var(--color-accent-fg);
  }

  .gh-header-nav-item .nav-label {
    display: inline-block;
    margin-left: 6px;
  }

  .gh-header-nav-item:hover,
  .gh-header-nav-item.active {
    background: var(--color-canvas-subtle);
  }
}
</style>
