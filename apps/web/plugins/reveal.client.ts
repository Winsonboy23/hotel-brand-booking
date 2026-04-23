import type { Directive } from 'vue'

const revealDirective: Directive<HTMLElement> = {
  mounted(el, binding) {
    const delay = typeof binding.value === 'number' ? binding.value : 0

    const hiddenY = 22
    const applyHiddenState = () => {
      el.style.opacity = '0'
      el.style.transform = `translateY(${hiddenY}px)`
    }

    const applyShownState = () => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }

    applyHiddenState()
    el.style.willChange = 'transform, opacity'
    el.style.transition = `opacity 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)`
    el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry) return

        if (entry.isIntersecting) {
          requestAnimationFrame(applyShownState)
          return
        }

        requestAnimationFrame(applyHiddenState)
      },
      {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -6% 0px'
      }
    )

    observer.observe(el)

    ;(el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver = observer
  },
  unmounted(el) {
    const target = el as HTMLElement & { _revealObserver?: IntersectionObserver }
    target._revealObserver?.disconnect()
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', revealDirective)
})
