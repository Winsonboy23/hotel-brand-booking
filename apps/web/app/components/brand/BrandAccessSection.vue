<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  title: string
  mapTitle: string
  mapEmbedUrl: string
}>()

const mapFrame = ref<HTMLElement | null>(null)
const mapGlowVisible = ref(false)
let mapObserver: IntersectionObserver | null = null

onMounted(() => {
  if (!mapFrame.value) return

  mapObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (!entry) return
      mapGlowVisible.value = entry.isIntersecting
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -8% 0px'
    }
  )

  mapObserver.observe(mapFrame.value)
})

onBeforeUnmount(() => {
  mapObserver?.disconnect()
})
</script>

<template>
  <section id="access" class="anchor-section mx-auto max-w-[980px] px-6 py-20">
    <div class="mb-6 text-center">
      <h2 v-reveal class="text-[18px] tracking-[0.2em]">
        {{ title }}
      </h2>
    </div>

    <div
      ref="mapFrame"
      v-reveal="120"
      class="overflow-hidden border border-[var(--brand-map-border)] bg-white transition-shadow duration-300"
      :class="mapGlowVisible ? 'map-border-glow' : ''"
    >
      <iframe
        :title="mapTitle"
        :src="mapEmbedUrl"
        class="h-[320px] w-full md:h-[360px]"
        loading="lazy"
      />
    </div>
  </section>
</template>

<style scoped>
.map-border-glow {
  box-shadow: 0 0 0 1px rgb(138 99 59 / 18%), 0 0 20px rgb(138 99 59 / 20%);
}
</style>
