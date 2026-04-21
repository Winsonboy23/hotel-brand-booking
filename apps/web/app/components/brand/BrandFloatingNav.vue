<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { LocaleCode } from '~/data/messages'

const props = defineProps<{
  menuItems: { label: string; href: string }[]
  languages: readonly { code: LocaleCode; label: string }[]
  locale: LocaleCode
  setLocale: (code: string) => void
}>()

const mobileOpen = ref(false)
const showBackToTop = ref(false)
const langOpen = ref(false)

const activeLanguageLabel = computed(() => {
  return props.languages.find((lang) => lang.code === props.locale)?.label ?? props.locale.toUpperCase()
})

const getMobileLanguageLabel = (code: LocaleCode) => {
  if (code === 'zh') return 'CH'
  if (code === 'ja') return 'JP'
  return 'EN'
}

const onScroll = () => {
  const heroSection = document.getElementById('top')
  const heroHeight = heroSection?.offsetHeight ?? window.innerHeight
  showBackToTop.value = window.scrollY > heroHeight * 0.6
}

const closeMobileMenu = () => {
  mobileOpen.value = false
}

const onSelectLocale = (code: string) => {
  props.setLocale(code)
}

const onSelectDesktopLocale = (code: string) => {
  props.setLocale(code)
  langOpen.value = false
}

const isExternalLink = (href: string) => /^https?:\/\//.test(href)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div>
    <div class="fixed right-4 top-4 z-40 hidden flex-col items-end gap-2 md:flex">
      <nav class="flex items-center gap-5 bg-black/35 px-5 py-4 text-[12px] tracking-[0.24em] text-white backdrop-blur-sm transition-[background-color,backdrop-filter] duration-300 hover:bg-black/42 hover:backdrop-blur-md">
        <a
          v-for="item in menuItems.slice(0, -1)"
          :key="item.label"
          :href="item.href"
          :target="isExternalLink(item.href) ? '_blank' : undefined"
          :rel="isExternalLink(item.href) ? 'noopener noreferrer' : undefined"
          class="transition-[opacity,filter] duration-200 hover:opacity-85 hover:blur-[0.2px]"
        >
          {{ item.label }}
        </a>

        <a
          v-if="menuItems.length"
          :href="menuItems[menuItems.length - 1].href"
          :target="isExternalLink(menuItems[menuItems.length - 1].href) ? '_blank' : undefined"
          :rel="isExternalLink(menuItems[menuItems.length - 1].href) ? 'noopener noreferrer' : undefined"
          class="transition-[opacity,filter] duration-200 hover:opacity-85 hover:blur-[0.2px]"
        >
          {{ menuItems[menuItems.length - 1].label }}
        </a>

        <div class="relative ml-1">
          <button
            type="button"
            class="flex items-center gap-2 border-l border-white/25 pl-3 text-[11px] tracking-[0.12em] transition-[opacity,filter] duration-200 hover:opacity-85 hover:blur-[0.15px]"
            :aria-expanded="langOpen"
            aria-label="Toggle language menu"
            @click="langOpen = !langOpen"
          >
            <span>{{ activeLanguageLabel }}</span>
            <span class="text-[10px]" :class="langOpen ? 'rotate-180' : ''">▼</span>
          </button>

          <div
            v-if="langOpen"
            class="absolute right-0 top-[calc(100%+8px)] min-w-[88px] border border-white/20 bg-black/70 p-1 text-[11px] backdrop-blur-sm"
          >
            <button
              v-for="lang in languages"
              :key="`desktop-lang-${lang.code}`"
              class="block w-full px-3 py-1 text-left transition-colors"
              :class="locale === lang.code ? 'active-lang-chip bg-white/20 text-white' : 'text-white/85 hover:bg-white/10'"
              @click="onSelectDesktopLocale(lang.code)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
      </nav>
    </div>

    <div class="fixed right-3 top-3 z-[60] md:hidden">
      <button
        type="button"
        class="relative h-9 w-9 rounded border border-white/40 bg-black/45 backdrop-blur-sm transition-transform duration-300 active:scale-95"
        :aria-expanded="mobileOpen"
        aria-label="Toggle mobile navigation"
        @click="mobileOpen = !mobileOpen"
      >
        <span
          class="absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 bg-white transition-all duration-300 ease-out"
          :class="mobileOpen ? 'top-[18px] rotate-45' : 'top-[11px]'"
        />
        <span
          class="absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 bg-white transition-all duration-300 ease-out"
          :class="mobileOpen ? 'top-[18px] scale-x-0 opacity-0' : 'top-[18px]'"
        />
        <span
          class="absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 bg-white transition-all duration-300 ease-out"
          :class="mobileOpen ? 'top-[18px] -rotate-45' : 'top-[25px]'"
        />
      </button>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-250"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        v-if="mobileOpen"
        type="button"
        class="fixed inset-0 z-40 bg-black/45 md:hidden"
        aria-label="Close mobile menu overlay"
        @click="closeMobileMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="mobileOpen"
        class="fixed right-0 top-0 z-50 h-full w-[78vw] max-w-[320px] border-l border-white/20 bg-black/80 px-5 pb-6 pt-16 text-white backdrop-blur-md md:hidden"
      >
        <nav class="flex flex-col gap-3 text-[12px] tracking-[0.24em]">
          <a
            v-for="item in menuItems"
            :key="`mobile-${item.label}`"
            :href="item.href"
            :target="isExternalLink(item.href) ? '_blank' : undefined"
            :rel="isExternalLink(item.href) ? 'noopener noreferrer' : undefined"
            class="border-b border-white/20 pb-2"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="mt-4 flex gap-2">
          <button
            v-for="lang in languages"
            :key="`mobile-lang-${lang.code}`"
            class="lang-chip rounded px-3 py-1 text-[11px] transition-all duration-300"
            :class="locale === lang.code ? 'active-lang-chip bg-[var(--brand-accent)] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.35)]' : 'bg-white/20 text-white'"
            @click="onSelectLocale(lang.code)"
          >
            {{ getMobileLanguageLabel(lang.code) }}
          </button>
        </div>
      </aside>
    </Transition>

    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <button
        v-if="showBackToTop"
        type="button"
        aria-label="Back to top"
        class="fixed bottom-[36px] right-4 z-40 rounded-full bg-black/65 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/80"
        @click="scrollToTop"
      >
        ↑
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.active-lang-chip {
  animation: lang-chip-pop 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes lang-chip-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .active-lang-chip {
    animation: none;
    transform: scale(1.04);
  }
}
</style>
