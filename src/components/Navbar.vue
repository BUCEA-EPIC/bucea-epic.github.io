<template>
  <nav ref="navbarElement" class="navbar" :class="{ 'is-scrolled': isScrolled }" aria-label="主导航" @focusout="handleFocusOut">
    <div class="container">

      <router-link to="/" class="logo">
        <img :src="epicLogoImg" alt="" aria-hidden="true" class="logo-mark">
        <span class="logo-copy">
          光启Ray-space工作室
        </span>
      </router-link>

      <!-- 移动端菜单按钮 -->
      <button
        ref="menuButton"
        class="more-btn"
        type="button"
        :aria-expanded="menuOpen"
        :aria-controls="menuOpen ? 'mobile-navigation' : undefined"
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
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="{ 'is-active': isLinkActive(link) }"
            @click="closeMenu"
          >
            {{ link.label }}
          </router-link>
          <a
            class="github-link"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 BUCEA-EPIC 开源仓库（新标签页）"
            title="BUCEA-EPIC 开源仓库"
            @click="closeMenu"
          >
            <IconGithub />
          </a>
        </div>
      </transition>

      <!-- PC 端导航 -->
      <div class="nav-links-desktop">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="{ 'is-active': isLinkActive(link) }"
        >
          {{ link.label }}
        </router-link>
        <a
          class="github-link github-link-desktop"
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="打开 BUCEA-EPIC 开源仓库（新标签页）"
          title="BUCEA-EPIC 开源仓库"
        >
          <IconGithub />
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import IconGithub from "./IconGithub.vue";
import { GITHUB_URL, SITE_LOGO } from "../data/siteInfo.js";

const navLinks = [
  { to: "/", label: "首页", exact: true },
  { to: "/event", label: "萌新种子杯" },
  { to: "/about", label: "关于我们" },
  { to: "/team", label: "团队成员" },
  { to: "/projects", label: "项目与机器人" },
  { to: "/resources", label: "教程与资源" },
  { to: "/news", label: "新闻与动态" },
  { to: "/contact", label: "联系我们" },
];

const route = useRoute();
const menuOpen = ref(false);
const isScrolled = ref(false);
const navbarElement = ref(null);
const menuButton = ref(null);
const epicLogoImg = SITE_LOGO;
const githubUrl = GITHUB_URL;
const desktopBreakpoint = 1180; // 与下方媒体查询及 style.css 的 1180px 断点保持一致
let desktopMediaQuery;
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);

// /event/5、/event/history 等子页面也高亮「萌新种子杯」入口
const isLinkActive = (link) =>
  link.exact ? route.path === link.to : route.path === link.to || route.path.startsWith(`${link.to}/`);

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

// 键盘 Tab 移出导航区域时关闭移动端菜单，避免「焦点已离开、菜单仍展开」的错位。
// 与既有「点击外部关闭」逻辑对称；focusout 会冒泡，relatedTarget 为新焦点元素。
const handleFocusOut = (event) => {
  if (menuOpen.value && !navbarElement.value?.contains(event.relatedTarget)) {
    closeMenu();
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
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0;
  padding-left: max(var(--page-gutter), env(safe-area-inset-left));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right));
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
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s ease, border-color 0.35s ease;
}

.logo-copy {
  display: inline-block;
}

.logo:hover {
  color: var(--color-text);
}

@media (hover: hover) and (pointer: fine) {
  .logo:hover .logo-mark {
    transform: translateY(-1px) scale(1.03);
    border-color: var(--border-strong);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  }
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
  padding: 25px 9px 23px;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 510;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.nav-links-desktop a:not(.github-link)::after {
  content: '';
  position: absolute;
  right: 9px;
  bottom: 16px;
  left: 9px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-hover), transparent);
  opacity: 0;
  transform: scaleX(0.25);
  transition: opacity 0.25s ease, transform 0.3s var(--ease-out);
}

.nav-links-desktop a:hover,
.nav-links-desktop a.is-active {
  background: transparent;
  border-bottom-color: transparent;
  color: var(--color-text);
}

.nav-links-desktop a:not(.github-link):hover::after,
.nav-links-desktop a:not(.github-link).is-active::after {
  opacity: 1;
  transform: scaleX(1);
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

.github-link :deep(svg) {
  transition: transform 0.25s var(--ease-spring);
}

@media (hover: hover) and (pointer: fine) {
  .github-link:hover :deep(svg) {
    transform: translateY(-1px) scale(1.05);
  }
}

/* 手机端导航 */
.more-btn {
  display: none;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
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
  transition: transform 0.25s var(--ease-spring), background-color 0.2s ease, border-color 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .more-btn:hover {
    transform: translateY(-1px);
  }
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
  right: max(var(--page-gutter), env(safe-area-inset-right));
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
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 510;
  transition: transform 0.25s var(--ease-spring), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.nav-links-mobile a:hover,
.nav-links-mobile a.is-active {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-standard);
  color: var(--color-text);
}

@media (hover: hover) and (pointer: fine) {
  .nav-links-mobile a:not(.github-link):hover {
    transform: translateX(3px);
  }
}

.nav-links-mobile .github-link {
  align-self: flex-start;
  justify-content: center;
  width: 44px;
  min-width: 44px;
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

  .logo {
    line-height: 1.1;
    font-size: 1.08rem;
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
    width: auto;
  }
}
</style>
