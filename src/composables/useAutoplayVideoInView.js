import { onBeforeUnmount, onMounted, watch } from 'vue'

/**
 * 让视频仅在进入视口时自动播放、离开视口时暂停。
 * 用户偏好减少动态（prefers-reduced-motion）时不自动播放，运行期切换该偏好同样生效。
 * 用户通过 controls 手动暂停后，回到视口也不再强制续播；
 * 切后台/锁屏等浏览器主动暂停不视为用户意图，回前台后继续播放。
 *
 * 通过 watch 而非 onMounted 挂接：视频元素可能位于 v-if 分支内，
 * 路由复用同一组件实例时元素会销毁重建，需随 ref 变化重新观察。
 * @param {import('vue').Ref<HTMLVideoElement | null>} videoRef
 */
export function useAutoplayVideoInView(videoRef) {
  let observer = null
  let observed = null
  let pausedByObserver = false
  let pausedByUser = false
  let inView = false

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handlePause = () => {
    // 切后台/锁屏时浏览器会主动暂停视频，不应记为用户意图
    if (!pausedByObserver && document.visibilityState !== 'hidden') {
      pausedByUser = true
    }
    pausedByObserver = false
  }

  const handlePlay = () => {
    pausedByUser = false
  }

  const handleVisibilityChange = () => {
    // 回前台时视口交叉状态未变化，IntersectionObserver 不会重新触发，需显式续播
    if (
      document.visibilityState === 'visible' &&
      observed?.paused &&
      inView &&
      !pausedByUser
    ) {
      observed.play()?.catch(() => {})
    }
  }

  const detach = () => {
    observer?.disconnect()
    observer = null
    observed?.removeEventListener('pause', handlePause)
    observed?.removeEventListener('play', handlePlay)
    observed = null
    inView = false
  }

  const attach = (video) => {
    if (!('IntersectionObserver' in window) || reduceMotionQuery.matches) {
      return
    }

    pausedByObserver = false
    pausedByUser = false

    // 部分浏览器把 muted 特性仅当作初始默认值，显式设置属性确保允许自动播放
    video.muted = true
    video.addEventListener('pause', handlePause)
    video.addEventListener('play', handlePlay)

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting

        if (entry.isIntersecting) {
          if (!pausedByUser) {
            entry.target.play()?.catch(() => {})
          }
        } else if (!entry.target.paused) {
          pausedByObserver = true
          entry.target.pause()
        }
      })
    }, { threshold: 0.25 })

    observer.observe(video)
    observed = video
  }

  const handleReduceMotionChange = () => {
    const video = observed ?? videoRef.value

    detach()

    if (reduceMotionQuery.matches) {
      video?.pause()
    } else if (video) {
      attach(video)
    }
  }

  watch(videoRef, (video) => {
    detach()

    if (video) {
      attach(video)
    }
  }, { flush: 'post' })

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    // Safari 14 之前的 MediaQueryList 没有 addEventListener，降级为不响应运行期切换
    reduceMotionQuery.addEventListener?.('change', handleReduceMotionChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    reduceMotionQuery.removeEventListener?.('change', handleReduceMotionChange)
    detach()
  })
}
