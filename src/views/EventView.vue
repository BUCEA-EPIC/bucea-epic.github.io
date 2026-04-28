<script setup>
import { onMounted, nextTick } from 'vue'

// --- ⚠️ 图片资源引入 ---
import eventImg from '../assets/event/第四届萌新种子杯.jpg'
import track1Img from '../assets/event/视觉循迹仿真.gif'
import track2Img from '../assets/event/开关电源设计.jpg'
import track3Img from '../assets/event/三维建模设计.png'
import qqImg from '../assets/contact/qq群.jpg'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

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

  const navHeight = 82
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
      if (res.ok) window.open(url, '_blank', 'noopener,noreferrer')
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

    <!-- <div class="content-section single-column animate-on-scroll">
      <div class="text-content animate-text">
        <h2>报名渠道</h2>
        <p style="color: #ff0000; font-weight: bold; font-size: 20px; text-decoration: none;">
          已截止报名
        </p>
      </div>
    </div> -->

    <div id="schedule" class="content-section single-column animate-on-scroll">
      <div class="text-content animate-text">
        <h2>比赛时间</h2>
        <p>
          于 <span style="font-weight: bold;">11月26日（周三）至12月15日（周一）</span> 举行。
        </p>
        <p style="color: #ff0000; font-weight: bold; font-size: 20px; text-decoration: none;">
          比赛已结束
        </p>
      </div>
    </div>

    <div id="awards" class="content-section single-column animate-on-scroll awards-section">
      <div class="text-content animate-text">
        <h2>🏆 获奖公示</h2>
        
        <div class="awards-card">
          <div class="awards-info">
            <p>第五届“萌新种子杯”各项赛程已圆满结束，感谢各位同学的积极参与。</p>
            <p class="highlight-notice">
              <span class="notice-icon">📢</span> 
              荣誉证书敬请期待后续发放安排，见QQ群(455362758)通知。
            </p>
            <p>最终获奖名单现已公示，请点击下方按钮查看：</p>
          </div>

          <a href="javascript:void(0)"
             @click.prevent="checkFile(assetPath('docs/event/2025萌新种子杯获奖公示.pdf'))"
             class="awards-link-btn">
            <span class="file-icon">📄</span>
            <span class="link-text">查看《第五届萌新种子杯获奖公示》</span>
          </a>
        </div>
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
              <a href="javascript:void(0)" @click.prevent="checkFile(assetPath('docs/event/萌新种子杯-视觉循迹仿真命题文档.pdf'))">
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
              <a href="javascript:void(0)" @click.prevent="checkFile(assetPath('docs/event/萌新种子杯-开关电源设计命题文档.pdf'))">
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
              <a href="javascript:void(0)" @click.prevent="checkFile(assetPath('docs/event/萌新种子杯-三维建模设计命题文档.pdf'))">
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

/* 图片 */
.image-content { flex: 0.5; display: flex; justify-content: center; align-items: center; }
.image-content img { width: 100%; max-width: 600px; border-radius: 6px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); transition: transform 0.3s ease; }
.image-content img:hover { transform: translateY(-5px); }
.qq-group-img { width: 250px !important; }

/* --- 获奖公示板块优化样式 --- */

/* 调整整体板块间距 */
.awards-section {
  margin-top: 20px;
}

/* 获奖信息卡片容器 */
.awards-card {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border: 1px solid #e9ecef;
  border-left: 5px solid #ffc107; /* 左侧金色边框强调获奖 */
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.awards-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* 文本排版 */
.awards-info p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #495057;
}

.awards-info p:last-of-type {
  margin-bottom: 20px;
}

/* 高亮通知文本 */
.highlight-notice {
  color: #856404;
  background-color: #fff3cd;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-block;
  border: 1px solid #ffeeba;
}

.notice-icon {
  margin-right: 6px;
}

/* 下载按钮样式优化 */
.awards-link-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px; /* 限制按钮最大宽度 */
  background-color: white;
  border: 2px solid #007bff;
  color: #007bff;
  padding: 12px 20px;
  border-radius: 50px; /* 圆角按钮 */
  text-decoration: none;
  font-weight: bold;
  font-size: 1.05rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.15);
}

.awards-link-btn:hover {
  background-color: #007bff;
  color: white;
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
  text-decoration: none; /* 覆盖默认下划线 */
}

/* 按钮内部图标微调 */
.file-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.link-text {
  flex-grow: 1;
  text-align: left;
}

.arrow-icon {
  font-size: 1.2rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.awards-link-btn:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* 移动端 */
@media (max-width: 768px) {
  .header-bg-text { font-size: 6rem; }
  .content-section {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  .text-content,
  .image-content {
    width: 100%;
    flex: none;
  }
  .text-content p {
    line-height: 1.7;
  }
  .image-content img {
    max-width: 100%;
  }
  .awards-card {
    padding: 20px;
  }
  
  .awards-link-btn {
    max-width: none;
    font-size: 0.95rem;
    padding: 12px 15px;
    border-radius: 8px;
    align-items: flex-start;
  }

  .qq-group-img {
    width: min(250px, 75vw) !important;
  }
}

@media (max-width: 420px) {
  .awards-card {
    padding: 16px;
  }

  .awards-link-btn {
    font-size: 0.9rem;
  }

}
</style>
