<template>
  <nav ref="navbarElement" class="navbar" :class="{ 'is-scrolled': isScrolled }">
    <div class="container">

      <router-link to="/" class="logo">
        <img :src="epicLogoImg" alt="" aria-hidden="true" class="logo-mark">
        <span class="logo-copy">
          工程实践创新中心<span class="mobile-break"><br/></span>317工作室
        </span>
      </router-link>

      <!-- 移动端菜单按钮 -->
      <button
        ref="menuButton"
        class="more-btn"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        :aria-label="menuOpen ? '关闭导航菜单' : '打开导航菜单'"
        title="导航菜单"
        @click="toggleMenu"
      >
        <span class="menu-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <!-- 导航链接 + 下拉动画 -->
      <transition name="dropdown">
        <div v-if="menuOpen" id="mobile-navigation" class="nav-links-mobile">
          <router-link to="/" @click="closeMenu">首页</router-link>
          <router-link to="/event" @click="closeMenu">萌新种子杯</router-link>
          <router-link to="/about" @click="closeMenu">关于我们</router-link>
          <router-link to="/team" @click="closeMenu">团队成员</router-link>
          <router-link to="/projects" @click="closeMenu">项目与机器人</router-link>
          <router-link to="/resources" @click="closeMenu">教程与资源</router-link>
          <router-link to="/news" @click="closeMenu">新闻与动态</router-link>
          <router-link to="/contact" @click="closeMenu">联系我们</router-link>
          <a
            class="github-link"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 BUCEA-EPIC 开源仓库（新标签页）"
            title="BUCEA-EPIC 开源仓库"
            @click="closeMenu"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" class="link-icon">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.23.49-2.71-1.07-2.71-1.07-.36-.91-.88-1.15-.88-1.15-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </transition>

      <!-- PC 端导航 -->
      <div class="nav-links-desktop">
        <router-link to="/">首页</router-link>
        <router-link to="/event">萌新种子杯</router-link>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/team">团队成员</router-link>
        <router-link to="/projects">项目与机器人</router-link>
        <router-link to="/resources">教程与资源</router-link>
        <router-link to="/news">新闻与动态</router-link>
        <router-link to="/contact">联系我们</router-link>
        <a
          class="github-link github-link-desktop"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="打开 BUCEA-EPIC 开源仓库（新标签页）"
          title="BUCEA-EPIC 开源仓库"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" class="link-icon">
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.23.49-2.71-1.07-2.71-1.07-.36-.91-.88-1.15-.88-1.15-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const menuOpen = ref(false);
const isScrolled = ref(false);
const navbarElement = ref(null);
const menuButton = ref(null);
const epicLogoImg = `${import.meta.env.BASE_URL}logo.jpg`;
const githubUrl = "https://github.com/BUCEA-EPIC";
const desktopBreakpoint = 1180;
let desktopMediaQuery;
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);

const updateNavbarState = () => {
  isScrolled.value = window.scrollY > 12;
};

const handleBreakpointChange = (event) => {
  if (event.matches) {
    closeMenu();
  }
};

const handleDocumentPointerDown = (event) => {
  if (menuOpen.value && !navbarElement.value?.contains(event.target)) {
    closeMenu();
  }
};

const handleKeydown = (event) => {
  if (event.key === "Escape" && menuOpen.value) {
    closeMenu();
    menuButton.value?.focus();
  }
};

watch(() => route.fullPath, closeMenu);

onMounted(() => {
  updateNavbarState();
  desktopMediaQuery = window.matchMedia(`(min-width: ${desktopBreakpoint + 1}px)`);
  window.addEventListener("scroll", updateNavbarState, { passive: true });
  document.addEventListener("pointerdown", handleDocumentPointerDown);
  document.addEventListener("keydown", handleKeydown);
  desktopMediaQuery.addEventListener("change", handleBreakpointChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateNavbarState);
  document.removeEventListener("pointerdown", handleDocumentPointerDown);
  document.removeEventListener("keydown", handleKeydown);
  desktopMediaQuery?.removeEventListener("change", handleBreakpointChange);
});
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  padding: 0;
  background: rgba(11, 12, 13, 0.94);
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(16px);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.navbar.is-scrolled {
  background: rgba(8, 9, 10, 0.97);
  border-bottom-color: var(--border-standard);
  box-shadow: none;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  min-height: 68px;
  position: relative;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  color: var(--color-text);
  font-size: 1.08rem;
  font-weight: 510;
  letter-spacing: 0;
  line-height: 1.15;
  text-decoration: none;
  flex: 0 0 auto;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.logo-mark {
  display: block;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  background: #fff;
  object-fit: cover;
}

.logo-copy {
  display: inline-block;
}

.logo:hover {
  color: var(--color-text);
}

/* PC 显示时不换行 */
.mobile-break {
  display: none;
}

/* PC 端导航 */
.nav-links-desktop {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  flex-wrap: nowrap;
  justify-content: flex-end;
  min-width: 0;
  gap: 4px;
}

.nav-links-desktop a {
  position: relative;
  margin: 0;
  padding: 23px 9px 21px;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  font-weight: 510;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.nav-links-desktop a:hover,
.nav-links-desktop a.router-link-exact-active {
  background: transparent;
  border-bottom-color: var(--color-accent);
  color: var(--color-text);
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 4px;
  padding: 8px 11px;
  border-color: var(--border-standard);
  background: transparent;
  color: var(--color-text-secondary);
}

.github-link-desktop {
  justify-content: center;
  width: 34px;
  min-width: 34px;
  padding: 8px;
  gap: 0;
}

.github-link:hover {
  background: transparent;
  border-color: var(--border-strong);
  color: var(--color-text);
  box-shadow: none;
}

.link-icon {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
}

/* 手机端导航 */
.more-btn {
  display: none;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-control);
  color: var(--color-text);
  font-size: 0.94rem;
  font-weight: 510;
  line-height: 1;
  cursor: pointer;
  appearance: none;
}

.menu-icon {
  display: flex;
  width: 16px;
  height: 16px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 4px;
}

.menu-icon span {
  display: block;
  width: 16px;
  height: 1px;
  background: currentColor;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.more-btn[aria-expanded="true"] .menu-icon span:first-child {
  transform: translateY(5px) rotate(45deg);
}

.more-btn[aria-expanded="true"] .menu-icon span:nth-child(2) {
  opacity: 0;
}

.more-btn[aria-expanded="true"] .menu-icon span:last-child {
  transform: translateY(-5px) rotate(-45deg);
}

/* 手机端下拉菜单 */
.nav-links-mobile {
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  background: var(--color-panel);
  border: 1px solid var(--border-standard);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: none;
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 220px;
  max-height: calc(100vh - 90px);
  max-height: calc(100dvh - 90px);
  overflow-y: auto;
  overscroll-behavior: contain;
  z-index: 2000;
}

.nav-links-mobile a {
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 510;
}

.nav-links-mobile a:hover,
.nav-links-mobile a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-standard);
  color: var(--color-text);
}

.nav-links-mobile .github-link {
  align-self: flex-start;
  justify-content: center;
  width: 42px;
  min-width: 42px;
  margin: 4px 0 0;
  padding: 10px;
  gap: 0;
  background: transparent;
  border-color: var(--border-standard);
}

.nav-links-mobile .github-link:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-strong);
}

/* ---------- 动画定义 ---------- */
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
.dropdown-enter-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out, max-height 0.25s ease-out;
}
.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}
.dropdown-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in, max-height 0.2s ease-in;
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

/* ------------- 手机端响应式 ------------- */
@media (max-width: 1180px) {
  .nav-links-desktop {
    display: none;
  }

  .more-btn {
    display: inline-flex;
    flex: 0 0 auto;
  }
}

@media (min-width: 1181px) {
  .nav-links-mobile {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0;
  }

  .container {
    gap: 12px;
    min-height: 64px;
  }

  /* 手机端 LOGO 换行 */
  .mobile-break {
    display: inline;
  }

  /* 更紧密的两行间距 */
  .logo {
    line-height: 1.1;
    font-size: 1rem;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .logo-mark {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
  }

  .more-btn {
    display: inline-flex;
    flex: 0 0 auto;
  }

  .nav-links-mobile {
    left: max(var(--page-gutter), env(safe-area-inset-left));
    right: max(var(--page-gutter), env(safe-area-inset-right));
    width: auto;
  }
}

@media (max-width: 360px) {
  .logo {
    font-size: 1rem;
  }

}
</style>
