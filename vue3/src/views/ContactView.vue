<script setup>
import { reactive, ref, onMounted } from 'vue'
import qqImage from '../assets/contact/qq群.jpg' // Vite 推荐导入图片

// 表单数据与状态
const form = reactive({
  name: '',
  email: '',
  message: ''
})
const successMsg = ref('')
const errorMsg = ref('')

// 提交表单
const submitForm = async () => {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      successMsg.value = '消息已发送成功！'
      errorMsg.value = ''
      form.name = ''
      form.email = ''
      form.message = ''
    } else {
      const data = await res.json()
      errorMsg.value = data.detail || '发送失败'
      successMsg.value = ''
    }
  } catch (err) {
    errorMsg.value = '网络错误，请稍后再试'
    successMsg.value = ''
  }
}

// 滚动入场动画
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="header">
      <span class="header-bg-text">CONTACT</span>
      <h1>联系我们</h1>
      <p>期待与你交流，无论是技术探讨还是合作意向</p>
    </div>

    <!-- 核心内容 -->
    <div class="contact-content animate-on-scroll">
      <div class="contact-info">
        <h3>联系信息</h3>
        <p><strong><i class="icon">📧</i> 电子邮箱:</strong><br>fanyuovan@outlook.com</p>
        <p><strong><i class="icon">📍</i> 实验室地址:</strong><br>北京建筑大学大学工程实践中心314室</p>

        <!-- 居中图片和文字 -->
        <div class="qq-group">
          <p>扫码下方二维码加入我们的QQ群<br/>群号：455362758</p>
          <img :src="qqImage" alt="QQ群二维码" class="qq-image">
        </div>
      </div>

      <div class="contact-form">
        <h3>发送消息给我们</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">您的姓名</label>
            <input type="text" id="name" v-model="form.name" placeholder="请输入您的姓名" required>
          </div>
          <div class="form-group">
            <label for="email">您的邮箱</label>
            <input type="email" id="email" v-model="form.email" placeholder="方便我们与您联系" required>
          </div>
          <div class="form-group">
            <label for="message">消息内容</label>
            <textarea id="message" v-model="form.message" rows="6" placeholder="请在此输入您的留言..." required></textarea>
          </div>
          <button type="submit">发送</button>
        </form>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面头部 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.header-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.04);
  z-index: 1;
  user-select: none;
  white-space: nowrap;
}

.header h1,
.header p {
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out forwards;
}

.header h1 {
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 20px;
}

.header h1::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: #007bff;
  margin: 20px auto 0;
}

.header p {
  font-size: 1.25rem;
  color: #6c757d;
  margin-top: 0;
  animation-delay: 0.2s;
}

/* 页面容器 */
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* 滚动入场动画 */
.contact-content.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.contact-content.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 联系内容布局 */
.contact-content {
  display: flex;
  gap: 50px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.08);
}

.contact-info,
.contact-form {
  flex: 1;
}

.contact-info h3 {
  font-size: 1.5rem;
  font-weight: 400;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.contact-info p {
  line-height: 1.8;
  color: #495057;
}

.contact-info .icon {
  display: inline-block;
  width: 20px;
}

/* QQ群居中样式 */
.qq-group {
  text-align: center;
  margin-top: 20px;
}

.qq-group p {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #495057;
}

.qq-group .qq-image {
  width: 40%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.qq-group .qq-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

/* 表单样式 */
.contact-form .form-group {
  margin-bottom: 20px;
  position: relative;
}

.contact-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #495057;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

/* 按钮样式 */
.contact-form button {
  background-color: #007bff;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
}

.contact-form button:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

/* 消息提示 */
.success-msg {
  color: green;
  margin-top: 10px;
}

.error-msg {
  color: red;
  margin-top: 10px;
}

/* 响应式 */
@media (max-width: 768px) {
  .contact-content {
    flex-direction: column;
    gap: 28px;
    padding: 22px;
  }

  .header-bg-text {
    font-size: 5rem;
  }

  .qq-group .qq-image {
    width: min(220px, 75vw);
  }

  .contact-info h3 {
    font-size: 1.3rem;
  }

  .contact-form input,
  .contact-form textarea {
    font-size: 16px;
  }

  .contact-form button {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .contact-content {
    padding: 18px;
  }
}
</style>
