<script setup lang="ts">
import { rooms } from '~/data/hotel'

type Promotion = {
  id: string
  title: string
  description: string
  amount: number
  startsAt: string
  endsAt: string
}

const { formatTwd } = useCurrency()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl as string

const promotions = ref<Promotion[]>([])
const loading = ref(true)

const loadPromotions = async () => {
  try {
    loading.value = true
    promotions.value = await $fetch<Promotion[]>(`${apiBaseUrl}/api/promotions/recent`)
  } catch {
    promotions.value = []
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Hotel Aurora｜官方訂房網站',
  meta: [{ name: 'description', content: 'Hotel Aurora 官方訂房網站，提供房型查詢、近期活動與匯款回填。' }]
})

onMounted(loadPromotions)
</script>

<template>
  <div class="site-page">
    <section class="site-shell site-hero">
      <img src="/images/nanasen/hero1.webp" alt="Hotel Aurora" >
      <div class="site-hero__overlay" />
      <div class="absolute inset-0 flex items-center">
        <div class="site-shell text-white">
          <p class="mb-4 text-xs tracking-[0.3em]">OFFICIAL BOOKING SITE</p>
          <h1 class="text-4xl leading-tight md:text-5xl">在城市中，享受安定與儀式感</h1>
          <p class="mt-5 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            從商務出行到週末旅行，Hotel Aurora 提供舒適客房與細緻服務。現在即可查看房型與近期限定優惠。
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink to="/rooms" class="site-btn">立即查看房型</NuxtLink>
            <NuxtLink to="/booking" class="site-btn site-btn--ghost">前往訂房流程</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="site-shell mt-16">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-xs tracking-[0.2em] text-black/55">LATEST OFFERS</p>
          <h2 class="mt-3 text-3xl">近期活動</h2>
        </div>
        <button class="site-btn site-btn--ghost" @click="loadPromotions">重新整理</button>
      </div>

      <div v-if="loading" class="site-card mt-5 p-6 text-sm text-black/60">活動讀取中...</div>

      <div v-else-if="promotions.length === 0" class="site-card mt-5 p-6 text-sm text-black/60">
        目前沒有上架活動，請稍後再查看。
      </div>

      <div v-else class="site-grid mt-5 md:grid-cols-3">
        <article v-for="promotion in promotions" :key="promotion.id" class="site-card p-6">
          <p class="text-xs tracking-[0.2em] text-black/45">PROMOTION</p>
          <h3 class="mt-3 text-xl">{{ promotion.title }}</h3>
          <p class="mt-3 text-sm leading-7 text-black/70">{{ promotion.description }}</p>
          <p class="mt-5 text-2xl text-[var(--brand-accent)]">{{ formatTwd(promotion.amount) }}</p>
          <p class="mt-2 text-xs text-black/45">{{ promotion.startsAt }} ~ {{ promotion.endsAt }}</p>
        </article>
      </div>
    </section>

    <section class="site-shell mt-16">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-xs tracking-[0.2em] text-black/55">ROOM PREVIEW</p>
          <h2 class="mt-3 text-3xl">熱門房型</h2>
        </div>
        <NuxtLink to="/rooms" class="site-btn site-btn--ghost">查看全部</NuxtLink>
      </div>

      <div class="site-grid mt-5 md:grid-cols-3">
        <article v-for="room in rooms.slice(0, 3)" :key="room.slug" class="site-card overflow-hidden">
          <img :src="room.image" :alt="room.name" class="h-52 w-full object-cover">
          <div class="p-5">
            <h3 class="text-xl">{{ room.name }}</h3>
            <p class="mt-2 text-sm text-black/65">{{ room.subtitle }}・{{ room.size }}・{{ room.occupancy }}</p>
            <p class="mt-4 text-lg text-[var(--brand-accent)]">{{ formatTwd(room.priceFrom) }} 起</p>
            <NuxtLink :to="`/rooms/${room.slug}`" class="mt-4 inline-block text-sm underline underline-offset-4">查看詳情</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
