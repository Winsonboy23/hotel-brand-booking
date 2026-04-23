<script setup lang="ts">
const { formatTwd } = useCurrency()
const { rooms } = useSiteContent()

useHead({
  title: '房型介紹｜HOTEL AURORA',
  meta: [{ name: 'description', content: '探索 HOTEL AURORA 全房型，查看房型亮點、設備與即時價格。' }]
})
</script>

<template>
  <div class="site-page">
    <section class="site-shell home-section">
      <p class="home-section__eyebrow">ROOM COLLECTION</p>
      <h1 class="home-section__title">房型介紹</h1>
      <p class="rooms-intro">
        點擊任一房型可進入詳細頁，查看圖片、住宿政策與即時預估費用。
      </p>
    </section>

    <section class="site-shell">
      <div class="home-cards-grid">
        <article v-for="room in rooms" :key="room.slug" class="site-card rooms-list-card">
          <img :src="room.image" :alt="room.name" class="rooms-list-card__image">
          <div class="rooms-list-card__body">
            <h2>{{ room.name }}</h2>
            <p class="rooms-list-card__subtitle">{{ room.subtitle }}</p>
            <p class="rooms-list-card__meta">{{ room.size }} ・ {{ room.occupancy }} ・ {{ room.bedType }}</p>
            <p class="rooms-list-card__desc">{{ room.description }}</p>
            <p class="home-price">{{ formatTwd(room.priceFrom) }} 起</p>
            <div class="rooms-list-card__actions">
              <NuxtLink :to="`/rooms/${room.slug}`" class="site-btn">房型詳情</NuxtLink>
              <NuxtLink :to="`/booking?room=${room.slug}`" class="site-btn site-btn--ghost">立即預約</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
