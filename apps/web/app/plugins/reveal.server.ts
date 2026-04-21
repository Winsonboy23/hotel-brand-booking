import type { Directive } from 'vue'

const revealSSRDirective: Directive<HTMLElement> = {
  getSSRProps() {
    return {}
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', revealSSRDirective)
})
