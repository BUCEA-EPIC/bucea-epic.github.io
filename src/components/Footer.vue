<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-primary">
        <div class="footer-brand">
          <strong>光启 Ray-space 工作室</strong>
          <span>实践、协作与工程创新</span>
        </div>
        <nav class="footer-nav" aria-label="页脚导航">
          <router-link to="/projects">项目</router-link>
          <router-link to="/team">团队</router-link>
          <router-link to="/resources">资源</router-link>
          <router-link to="/contact">联系</router-link>
        </nav>
      </div>

      <div class="footer-secondary">
        <p class="copyright">
          Copyright &copy; 2025-2026 北京建筑大学 · 光启 Ray-space 工作室
        </p>
        <nav v-if="showBeianLinks" class="beian-links" aria-label="备案信息">
          <a
            v-if="icpText"
            :href="icpUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ icpText }}
          </a>
          <span v-if="icpText && policeText" class="beian-separator">|</span>
          <a
            v-if="policeText"
            :href="policeUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="policeIconUrl"
              alt=""
              aria-hidden="true"
              class="beian-icon"
            />
            <span>{{ policeText }}</span>
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
const icpText = import.meta.env.VITE_ICP_TEXT || ''
const icpUrl = import.meta.env.VITE_ICP_URL || 'https://beian.miit.gov.cn/'
const policeText = import.meta.env.VITE_POLICE_TEXT || ''
const policeUrl = import.meta.env.VITE_POLICE_URL || ''
const policeIconUrl = `${import.meta.env.BASE_URL}gongan.png`
const showBeianLinks =
  import.meta.env.VITE_SHOW_ICP === 'true' && Boolean(icpText || policeText)
</script>

<style scoped>
.footer {
  background: var(--color-bg-deep);
  border-top: 1px solid var(--border-subtle);
  color: var(--color-text-muted);
  padding: 42px 0 28px;
  text-align: left;
  font-size: 0.875rem;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}

.footer-primary,
.footer-secondary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.footer-primary {
  padding-bottom: 30px;
}

.footer-secondary {
  padding-top: 22px;
  border-top: 1px solid var(--border-subtle);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.footer-brand strong {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 590;
}

.footer-brand span {
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 22px;
}

.footer-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  font-weight: 510;
}

.copyright {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.beian-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 0;
  font-size: 13px;
}

.beian-links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.beian-links a:hover {
  color: var(--color-text);
  text-decoration: none;
}

.beian-separator {
  color: var(--color-text-subtle);
  user-select: none;
}

.beian-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .footer {
    padding: 34px 0 24px;
  }

  .footer-primary,
  .footer-secondary {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .footer-primary {
    padding-bottom: 24px;
  }

  .footer-secondary {
    padding-top: 20px;
  }

  .footer-nav {
    gap: 10px 20px;
  }

  .beian-links {
    justify-content: flex-start;
  }
}
</style>
