<template>
  <footer class="footer">
    <div class="container">
      <p class="copyright">
        Copyright &copy; {{ copyrightYears }} 樊彧. All Rights Reserved.
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
  </footer>
</template>

<script setup>
const startYear = 2025
const currentYear = new Date().getFullYear()
const copyrightYears =
  currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`

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
  background-color: #343a40;
  color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.copyright {
  margin: 5px 0;
  color: #adb5bd;
}

.beian-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 13px;
}

.beian-links a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.2s ease;
}

.beian-links a:hover {
  color: #f8f9fa;
  text-decoration: underline;
}

.beian-separator {
  color: #6c757d;
  user-select: none;
}

.beian-icon {
  width: 16px;
  height: 16px;
}
</style>
