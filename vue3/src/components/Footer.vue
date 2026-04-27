<template>
  <footer class="footer">
    <div class="container">
      <p class="copyright">
        Copyright &copy; {{ copyrightYears }} 樊彧. All Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
const startYear = 2025
const currentYear = new Date().getFullYear()
const copyrightYears =
  currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`
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
</style>
