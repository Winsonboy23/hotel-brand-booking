<script setup lang="ts">
import { rooms } from '~/data/hotel'

const { formatTwd } = useCurrency()

useHead({
  title: '房型介紹｜Hotel Aurora',
  meta: [{ name: 'description', content: '探索 Hotel Aurora 多款房型，依旅程需求挑選最合適空間。' }]
})
</script>

<template>
  <div class="site-page">
    <section class="site-shell">
      <p class="text-xs tracking-[0.2em] text-black/55">ROOM COLLECTION</p>
      <h1 class="mt-3 text-4xl">房型介紹</h1>
      <p class="mt-4 max-w-2xl leading-8 text-black/70">
        從經典房型到套房，每間客房皆配置高品質床墊與舒適備品，提供安穩、自在的入住體驗。
      </p>
    </section>

    <section class="site-shell mt-10">
      <div class="site-grid md:grid-cols-2">
        <article v-for="room in rooms" :key="room.slug" class="site-card overflow-hidden">
          <img :src="room.image" :alt="room.name" class="h-64 w-full object-cover">
          <div class="p-6">
            <h2 class="text-2xl">{{ room.name }}</h2>
            <p class="mt-2 text-sm text-black/65">{{ room.subtitle }}</p>
            <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/70">
              <span>面積：{{ room.size }}</span>
              <span>入住：{{ room.occupancy }}</span>
              <span>床型：{{ room.bedType }}</span>
            </div>
            <p class="mt-5 text-xl text-[var(--brand-accent)]">{{ formatTwd(room.priceFrom) }} 起</p>
            <NuxtLink :to="`/rooms/${room.slug}`" class="mt-4 inline-block site-btn">查看房型詳情</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
