<script setup lang="ts">
defineProps<{
  images: { src: string; alt: string }[]
}>()
</script>

<template>
  <section id="gallery" class="anchor-section mx-auto max-w-[980px] px-6 py-20">
    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
      <div
        v-for="(image, index) in images"
        :key="image.src"
        v-reveal="index * 70"
        class="group relative overflow-hidden"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="aspect-square w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-105"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
    </div>
  </section>
</template>
