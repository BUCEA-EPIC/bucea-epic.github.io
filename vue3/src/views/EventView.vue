<script setup>
import { onMounted, nextTick } from 'vue'

// --- ⚠️ 图片资源引入 ---
import eventImg from '../assets/event/第四届萌新种子杯.jpg'
import track1Img from '../assets/event/视觉循迹仿真.gif'
import track2Img from '../assets/event/开关电源设计.jpg'
import track3Img from '../assets/event/三维建模设计.png'
import qqImg from '../assets/contact/qq群.jpg'

// 页面动画与交互
onMounted(() => {
  nextTick(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
  })

  const navHeight = 70
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault()
      const targetId = anchor.getAttribute('href')
      if (targetId === '#') return
      const target = document.querySelector(targetId)
      if (target) {
        const top = target.offsetTop - navHeight
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  })
})

function checkFile(url) {
  fetch(url, { method: 'HEAD' })
    .then(res => {
      if (res.ok) window.open(url, '_blank')
      else alert('暂无此文件，请稍后重试或联系管理员。')
    })
    .catch(() => alert('无法访问文件服务器。'))
}
</script>

<template>
  <div class="page-container">
    <div class="header">
      <span class="header-bg-text">EVENT</span>
      <h1>萌新种子杯</h1>
      <p>实践、创新、工程、成长</p>
    </div>

    <div class="content-section animate-on-scroll">
      <div class="text-content animate-text">
        <h2>赛事简介</h2>
        <p>
          <span style="font-weight: bold;">“萌新种子杯”</span>由<span style="font-weight: bold;">工程实践创新中心</span>主办。<br/>
          本次赛事整体规划和赛题设计由<span style="font-weight: bold;">工创中心314工作室</span>负责,
          <span style="font-weight: bold;">学D317工作室</span>协助承办开关电源设计赛道，
          <span style="font-weight: bold;">机器人社</span>提供培训支持。
        </p>
        <p>
          比赛共设三个赛道：
          <a href="#track1"><span style="font-weight: bold;">视觉循迹仿真赛道</span></a>、
          <a href="#track2"><span style="font-weight: bold;">开关电源设计赛道</span></a>以及
          <a href="#track3"><span style="font-weight: bold;">三维建模设计赛道</span></a>。
        </p>
      </div>
      <div class="image-content animate-image">
        <img :src="eventImg" alt="赛事简介">
      </div>
    </div>

    <div class="content-section single-column animate-on-scroll">
      <div class="text-content animate-text">
        <h2>报名渠道</h2>
        <p style="color: #ff0000; font-weight: bold; font-size: 20px; text-decoration: none;">
          已截止报名
        </p>
      </div>
    </div>

    <div id="schedule" class="content-section single-column animate-on-scroll">
      <div class="text-content animate-text">
        <h2>比赛时间</h2>
        <p>于 <span style="font-weight: bold;">11月26日（周三）至12月15日（周一）</span> 举行。</p>
      </div>
    </div>

    <div id="submit" class="content-section single-column animate-on-scroll submission-guide">
      <div class="text-content animate-text">
        <h2>📧 作品提交</h2>
        <p style="color: #ff0000; font-weight: bold; font-size: 20px; text-decoration: none;">
          作品提交已截止
        </p>
      </div>
    </div>

    <div class="track-container">
        <div id="track1" class="content-section animate-on-scroll">
          <div class="text-content animate-text">
            <h2>赛道一：视觉循迹仿真</h2>
            <p>
              本赛道基于 <strong>Webots</strong> 仿真平台，参赛队伍需在我们提供的仿真环境中，
              对摄像头采集的图像进行处理，并控制指定小车自主完成视觉循迹任务。<br/>
              详细任务要求和评分标准请参见
              <a href="javascript:void(0)" @click.prevent="checkFile('/docs/event/萌新种子杯-视觉循迹仿真命题文档.pdf')">
                《视觉循迹仿真命题文档》
              </a>。
            </p>
          </div>
          <div class="image-content animate-image">
            <img :src="track1Img" alt="视觉循迹仿真">
          </div>
        </div>

        <div id="track2" class="content-section animate-on-scroll">
          <div class="text-content animate-text">
            <h2>赛道二：开关电源设计</h2>
            <p>
              本赛道以 <strong>电力电子技术</strong> 为核心，参赛者需使用 <strong>立创EDA</strong> 及 <strong>PLECS</strong> 仿真平台，
              完成指定 <strong>DCDC 升降压变换器</strong> 与 <strong>三相逆变器</strong> 的电路设计、参数计算与仿真调试。<br/>
              详细任务要求和评分标准请参见
              <a href="javascript:void(0)" @click.prevent="checkFile('/docs/event/萌新种子杯-开关电源设计命题文档.pdf')">
                《开关电源设计命题文档》
              </a>。
            </p>
          </div>
          <div class="image-content animate-image">
            <img :src="track2Img" alt="开关电源设计">
          </div>
        </div>

        <div id="track3" class="content-section animate-on-scroll">
          <div class="text-content animate-text">
            <h2>赛道三：三维建模设计</h2>
            <p>
              本赛道以 <strong>SolidWorks</strong> 为主要建模工具，参赛者需根据给定任务要求完成零件建模、
              装配体结构设计及自定义创新零件的设计表达。<br/>
              详细任务要求和评分标准请参见
              <a href="javascript:void(0)" @click.prevent="checkFile('/docs/event/萌新种子杯-三维建模设计命题文档.pdf')">
                《三维建模设计命题文档》
              </a>。
            </p>
          </div>
          <div class="image-content animate-image">
            <img :src="track3Img" alt="三维建模设计">
          </div>
        </div>
    </div>

    <div id="track4" class="content-section single-column animate-on-scroll">
      <div class="text-content animate-text">
        <h2>咨询我们</h2>
        <p>QQ群：455362758</p>
      </div>
      <div class="image-content animate-image"><img :src="qqImg" class="qq-group-img"></div>
    </div>

  </div>
</template>

<style scoped>
/* 样式保持不变，略 */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.header { text-align: center; padding: 60px 20px; margin-bottom: 60px; position: relative; overflow: hidden; }
.header-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; font-weight: 900; color: rgba(0,0,0,0.04); z-index: 1; user-select: none; white-space: nowrap; }
.header h1, .header p { position: relative; z-index: 2; animation: fadeInUp 0.8s ease-out forwards; }
.header h1 { font-size: 3.5rem; font-weight: 300; margin-bottom: 20px; }
.header h1::after { content: ''; display: block; width: 60px; height: 4px; background-color: #007bff; margin: 20px auto 0; }
.header p { font-size: 1.25rem; color: #6c757d; margin-top: 0; animation-delay: 0.2s; }

/* 页面容器 */
.page-container { max-width: 1000px; margin: 0 auto; padding: 0 15px 30px; }

/* 滚动动画 */
.animate-on-scroll .animate-text, .animate-on-scroll .animate-image { opacity: 0; transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
.animate-on-scroll .animate-text { transform: translateX(-30px); }
.animate-on-scroll .animate-image { transform: translateX(30px); }
.animate-on-scroll.is-visible .animate-text, .animate-on-scroll.is-visible .animate-image { opacity: 1; transform: translateX(0); }

/* 内容布局 */
.content-section { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
.text-content { flex: 0.5; }
.text-content h2 { font-size: 1.8rem; font-weight: 400; border-bottom: 2px solid #007bff; padding-bottom: 4px; margin-bottom: 10px; display: inline-block; }
.text-content p { line-height: 1.4; color: #495057; font-size: 0.95rem; }
.text-content a { text-decoration: none; color: #007bff; cursor: pointer; }
.single-column { flex-direction: column; align-items: flex-start; padding: 0; }

/* 表单 */
.submission-guide .text-content { width: 100%; }
.submission-form { width: 100%; max-width: 600px; margin-top: 20px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f8f9fa; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-weight: bold; margin-bottom: 5px; color: #343a40; }
.required { color: #dc3545; margin-left: 3px; }
.form-group select, .form-group input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box; font-size: 1rem; }
.form-group input[type="file"] { padding: 8px 0; }

/* 学生信息行 */
.input-header-row { display: flex; gap: 10px; margin-bottom: 5px; padding: 0 10px; }
.header-label { flex: 1; font-size: 0.85rem; font-weight: bold; color: #555; }
.header-placeholder, .header-placeholder-btn { width: 24px; min-width: 25px; }

.student-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; background: #fff; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
.row-label { font-size: 0.9rem; color: #666; min-width: 25px; }
.input-triple-group { display: flex; flex: 1; gap: 8px; }
.input-triple-group input { flex: 1; min-width: 0; padding: 8px !important; font-size: 0.9rem !important; }

/* 按钮 */
.remove-btn { background-color: #dc3545; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; padding: 0; }
.add-btn { background-color: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 5px; font-size: 0.9rem; }
.submit-button { width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; transition: background-color 0.3s ease; }
.submit-button:disabled { background-color: #adb5bd; cursor: not-allowed; }

/* 其他组件 */
.note { font-size: 0.85rem; margin-top: 5px; margin-bottom: 0; }
.note.info { color: #007bff; margin-bottom: 10px; }
.note.success { color: #28a745; }
.deadline-info { border-top: 1px dashed #ced4da; padding-top: 15px; margin-top: 20px; margin-bottom: 20px; }
.deadline-info p { color: #dc3545; font-size: 1rem; }
.progress-bar-container { width: 100%; height: 10px; background-color: #e9ecef; border-radius: 5px; overflow: hidden; }
.progress-bar-fill { height: 100%; background-color: #28a745; transition: width 0.2s ease; }
.progress-text { font-size: 0.85rem; color: #666; margin-top: 5px; text-align: center; }
.submission-status { margin-top: 15px; padding: 10px; border-radius: 4px; font-weight: bold; }
.submission-status.success { background-color: #d4edda; color: #155724; }
.submission-status.error { background-color: #f8d7da; color: #721c24; }

/* 图片 */
.image-content { flex: 0.5; display: flex; justify-content: center; align-items: center; }
.image-content img { width: 100%; max-width: 600px; border-radius: 6px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); transition: transform 0.3s ease; }
.image-content img:hover { transform: translateY(-5px); }
.qq-group-img { width: 250px !important; }

/* --- 新增：弹窗样式 --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  backdrop-filter: blur(5px); /* 背景模糊效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 400px;
  text-align: left;
  animation: scaleIn 0.3s ease;
}

.modal-box h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  font-size: 0.95rem;
  color: #555;
}

.modal-list li {
  margin-bottom: 6px;
}

.modal-tip {
  font-size: 0.85rem;
  color: #888;
  margin-top: 15px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn-cancel {
  padding: 8px 16px;
  background: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover { background: #e9ecef; }

.btn-confirm {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.btn-confirm:hover { background: #0056b3; }

/* 成功弹窗特有样式 */
.success-box { text-align: center; }
.success-icon { font-size: 3rem; margin-bottom: 10px; }
.success-box .modal-buttons { justify-content: center; }

/* 弹窗动画 */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* 移动端 */
@media (max-width: 768px) {
  .header-bg-text { font-size: 6rem; }
  .content-section { flex-direction: column; gap: 40px; }
  .input-header-row { display: none; }
  .student-row { flex-direction: column; align-items: stretch; }
  .input-triple-group { flex-direction: column; }
  .remove-btn { align-self: flex-end; margin-top: -10px; }
  .input-triple-group input::placeholder { color: #999; }
}
@media (min-width: 769px) { .input-triple-group input::placeholder { color: transparent; } }
</style>