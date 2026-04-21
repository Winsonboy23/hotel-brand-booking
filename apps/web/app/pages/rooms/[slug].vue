<script setup lang="ts">
import { findRoomBySlug } from '~/data/hotel'

const route = useRoute()
const { formatTwd } = useCurrency()

const room = computed(() => findRoomBySlug(String(route.params.slug)))

if (!room.value) {
  throw createError({ statusCode: 404, statusMessage: 'Room not found' })
}

useHead(() => ({
  title: `${room.value?.name ?? '房型'}｜Hotel Aurora`,
  meta: [{ name: 'description', content: `${room.value?.name} 房型介紹與設備資訊。` }]
}))
</script>

<template>
  <div class="site-page" v-if="room">
    <section class="site-shell">
      <NuxtLink to="/rooms" class="text-sm underline underline-offset-4">← 回到房型列表</NuxtLink>
      <div class="mt-4 grid gap-8 md:grid-cols-2">
        <img :src="room.image" :alt="room.name" class="site-card h-[340px] w-full object-cover p-1">
        <div>
          <h1 class="text-4xl">{{ room.name }}</h1>
          <p class="mt-2 text-black/65">{{ room.subtitle }}</p>
          <div class="mt-5 space-y-2 text-sm text-black/75">
            <p>面積：{{ room.size }}</p>
            <p>入住人數：{{ room.occupancy }}</p>
            <p>床型：{{ room.bedType }}</p>
          </div>
          <p class="mt-6 text-2xl text-[var(--brand-accent)]">{{ formatTwd(room.priceFrom) }} 起</p>
          <NuxtLink to="/booking" class="site-btn mt-6 inline-block">前往預約</NuxtLink>
        </div>
      </div>
    </section>

    <section class="site-shell mt-10 grid gap-6 md:grid-cols-2">
      <article class="site-card p-6">
        <h2 class="text-2xl">房型亮點</h2>
        <ul class="mt-4 space-y-2 text-sm leading-7 text-black/70">
          <li v-for="item in room.highlights" :key="item">• {{ item }}</li>
        </ul>
      </article>
      <article class="site-card p-6">
        <h2 class="text-2xl">設備與備品</h2>
        <ul class="mt-4 grid gap-2 text-sm leading-7 text-black/70 md:grid-cols-2">
          <li v-for="item in room.amenities" :key="item">• {{ item }}</li>
        </ul>
      </article>
    </section>

    <section class="site-shell mt-10">
      <h2 class="text-2xl">房型照片</h2>
      <div class="site-grid mt-4 md:grid-cols-3">
        <img v-for="image in room.gallery" :key="image" :src="image" :alt="room.name" class="site-card h-52 w-full object-cover p-1">
      </div>
    </section>
  </div>
</template>
