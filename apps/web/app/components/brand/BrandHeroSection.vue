<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  heroSlides: { desktop: string; mobile: string }[]
  currentHeroSlide: number
  logoAlt: string
  logoSrc: string
  logoMaxWidth?: number
  logoMinWidth?: number
}>()

const scrollY = ref(0)
const heroHeight = ref(1)
const viewportWidth = ref(1280)
const viewportHeight = ref(720)
const smoothX = ref(0)
const smoothY = ref(0)
const smoothWidth = ref(320)
const smoothOpacity = ref(1)
const lockYInFade = ref(false)
let animationFrameId: number | null = null

const onScroll = () => {
  scrollY.value = window.scrollY
}

const onResize = () => {
  heroHeight.value = window.innerHeight
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
}

const targetLogoState = computed(() => {
  const maxScroll = Math.max(heroHeight.value - 1, 1)
  const progress = Math.min(Math.max(scrollY.value / maxScroll, 0), 1)
  const startX = viewportWidth.value / 2
  const startY = viewportHeight.value / 2

  const point2X = 64
  const point2Y = 64

  const moveRatio = 0.45
  const moveProgress = Math.min(progress / moveRatio, 1)
  const easedMove = 1 - Math.pow(1 - moveProgress, 3)
  const x = startX + (point2X - startX) * easedMove
  const baseY = startY + (point2Y - startY) * easedMove
  const startWidth = viewportWidth.value < 768 ? 220 : 320
  const endWidth = 100
  const width = startWidth + (endWidth - startWidth) * easedMove

  const fadeStart = Math.max(heroHeight.value - 120, 0)
  const fadeRange = 80
  const fadeProgress = Math.min(Math.max((scrollY.value - fadeStart) / fadeRange, 0), 1)
  const opacity = 1 - fadeProgress

  const y = baseY

  return {
    visible: scrollY.value < heroHeight.value,
    x,
    y,
    width,
    opacity
  }
})

const animateLogo = () => {
  const target = targetLogoState.value
  const lerpPosition = 0.12
  const lerpSize = 0.1
  const lerpOpacity = 0.16
  const shouldLockY = scrollY.value >= Math.max(heroHeight.value - 120, 0)

  if (shouldLockY) {
    if (!lockYInFade.value) {
      smoothY.value = target.y
      lockYInFade.value = true
    }
  } else {
    lockYInFade.value = false
    smoothY.value += (target.y - smoothY.value) * lerpPosition
  }

  smoothX.value += (target.x - smoothX.value) * lerpPosition
  smoothWidth.value += (target.width - smoothWidth.value) * lerpSize
  smoothOpacity.value += (target.opacity - smoothOpacity.value) * lerpOpacity

  animationFrameId = window.requestAnimationFrame(animateLogo)
}

onMounted(() => {
  onResize()
  onScroll()

  const initial = targetLogoState.value
  smoothX.value = initial.x
  smoothY.value = initial.y
  smoothWidth.value = initial.width
  smoothOpacity.value = initial.opacity

  animationFrameId = window.requestAnimationFrame(animateLogo)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

const logoState = computed(() => {
  return {
    visible: targetLogoState.value.visible && smoothOpacity.value > 0.05,
    x: smoothX.value,
    y: smoothY.value,
    width: smoothWidth.value,
    opacity: smoothOpacity.value
  }
})

</script>

<template>
  <section id="top" class="relative h-screen min-h-screen overflow-hidden">
    <img
      v-for="(slide, index) in heroSlides"
      :key="slide.desktop"
      :src="viewportWidth < 768 ? slide.mobile : slide.desktop"
      :alt="logoAlt"
      class="absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-in-out"
      :class="index === currentHeroSlide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'"
    />

    <div class="hero-glow absolute inset-0" />

    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="logoState.visible"
        class="pointer-events-none fixed z-30"
        :style="{
          left: `${logoState.x}px`,
          top: `${logoState.y}px`,
          width: `${Math.max(Math.min(logoState.width, props.logoMaxWidth ?? 600), props.logoMinWidth ?? 0)}px`,
          opacity: `${logoState.opacity}`,
          transform: 'translate(-50%, -50%)'
        }"
      >
        <img :src="props.logoSrc" :alt="props.logoAlt" class="w-full object-contain" />
      </div>
    </Transition>
  </section>
</template>
