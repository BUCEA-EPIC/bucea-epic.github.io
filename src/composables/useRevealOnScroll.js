import { nextTick, onBeforeUnmount, onMounted } from 'vue'

export function useRevealOnScroll(selector = '.animate-on-scroll', observerOptions = {}) {
  let observer

  onMounted(() => {
    nextTick(() => {
      const elements = document.querySelectorAll(selector)

      if (
        !('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        elements.forEach((element) => element.classList.add('is-visible'))
        return
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.12,
        ...observerOptions
      })

      elements.forEach((element) => observer?.observe(element))
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
