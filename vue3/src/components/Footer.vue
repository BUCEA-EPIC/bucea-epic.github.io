<template>
  <footer class="footer">
    <div class="container">
      <!-- 网站版权信息 -->
      <p class="copyright">
        Copyright &copy; 2025 樊彧. All Rights Reserved.
      </p>

      <!-- 备案信息（ICP备案 + 公安备案 同一行） -->
      <div class="records">
        <a
          href="http://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="record-link"
        >
          京ICP备2025148902号-1
        </a>

        <span class="separator">|</span>

        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011502038960"
          target="_blank"
          rel="noopener noreferrer"
          class="record-link"
        >
          <img src="/公安.png" alt="公安备案图标" class="record-icon" />
          京公网安备 11011502038960号
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
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

/* 版权信息 */
.footer p {
  margin: 5px 0;
  color: #adb5bd;
}

/* 备案区域 */
.records {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; /* 手机端自动换行 */
  gap: 8px;
  margin-top: 5px;
}

/* 通用备案链接样式 */
.record-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #adb5bd;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s, text-decoration 0.2s;
}

.record-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* 图标样式 */
.record-icon {
  width: 16px;
  height: 16px;
}

/* 分隔符样式 */
.separator {
  color: #6c757d;
  font-size: 14px;
  user-select: none;
}
</style>
