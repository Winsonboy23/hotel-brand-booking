<script setup lang="ts">
const { formatTwd } = useCurrency()
const { rooms, activities, facilities, metrics, brandProfile } = useSiteContent()
const carouselIndex = ref(0)

const activeRoom = computed(() => rooms.value[carouselIndex.value])

const prevRoom = () => {
  carouselIndex.value = (carouselIndex.value - 1 + rooms.value.length) % rooms.value.length
}

const nextRoom = () => {
  carouselIndex.value = (carouselIndex.value + 1) % rooms.value.length
}

useHead({
  title: 'HOTEL AURORA｜官方訂房網站',
  meta: [{ name: 'description', content: 'HOTEL AURORA 官方訂房網站，探索房型、設施與線上預約流程。' }]
})
</script>

<template>
  <div>
    <section class="home-hero">
      <img :src="brandProfile.heroImage" alt="HOTEL AURORA" class="home-hero__bg">
      <div class="home-hero__overlay" />
      <div class="home-hero__halo" aria-hidden="true" />

      <div class="site-shell home-hero__content">
        <p class="home-eyebrow">{{ brandProfile.localName }}</p>
        <h1 class="home-title">{{ brandProfile.tagline }}</h1>
        <p class="home-subtitle">{{ brandProfile.subtitle }}</p>
        <div class="home-hero__actions">
          <NuxtLink to="/rooms" class="site-btn">探索房型</NuxtLink>
          <NuxtLink to="/booking" class="site-btn site-btn--ghost site-btn--light">立即預約</NuxtLink>
        </div>
      </div>
    </section>

    <section class="home-metrics-wrap">
      <div class="site-shell home-metrics">
        <article v-for="metric in metrics" :key="metric.label" class="home-metric">
          <p class="home-metric__value">{{ metric.value }}</p>
          <p class="home-metric__label">{{ metric.label }}</p>
        </article>
      </div>
    </section>

    <section class="site-shell home-section">
      <div class="home-section__head">
        <div>
          <p class="home-section__eyebrow">RECENT ACTIVITIES</p>
          <h2 class="home-section__title">近期活動</h2>
        </div>
      </div>
      <div class="home-cards-grid">
        <article v-for="activity in activities" :key="activity.id" class="site-card home-activity-card">
          <p class="home-card__tag">ACTIVITY</p>
          <h3>{{ activity.title }}</h3>
          <p>{{ activity.description }}</p>
          <p class="home-price">{{ formatTwd(activity.amount) }}</p>
          <p class="home-date">{{ activity.startsAt }} ~ {{ activity.endsAt }}</p>
        </article>
      </div>
    </section>

    <section class="site-shell home-section">
      <div class="home-section__head">
        <div>
          <p class="home-section__eyebrow">ROOM CAROUSEL</p>
          <h2 class="home-section__title">房型輪播</h2>
        </div>
        <div class="home-carousel__controls">
          <button class="home-arrow" @click="prevRoom" aria-label="上一間房型">←</button>
          <button class="home-arrow" @click="nextRoom" aria-label="下一間房型">→</button>
        </div>
      </div>

      <article v-if="activeRoom" class="site-card home-carousel-card">
        <img :src="activeRoom.image" :alt="activeRoom.name" class="home-carousel-card__img">
        <div class="home-carousel-card__body">
          <h3>{{ activeRoom.name }}</h3>
          <p class="home-carousel-card__subtitle">{{ activeRoom.subtitle }}</p>
          <p class="home-carousel-card__desc">{{ activeRoom.description }}</p>
          <p class="home-price">{{ formatTwd(activeRoom.priceFrom) }} 起</p>
          <div class="home-carousel-card__actions">
            <NuxtLink :to="`/rooms/${activeRoom.slug}`" class="site-btn">查看詳情</NuxtLink>
            <NuxtLink :to="`/booking?room=${activeRoom.slug}`" class="site-btn site-btn--ghost">立即預約</NuxtLink>
          </div>
        </div>
      </article>
    </section>

    <section class="site-shell home-section">
      <div class="home-section__head">
        <div>
          <p class="home-section__eyebrow">FACILITIES</p>
          <h2 class="home-section__title">設施介紹</h2>
        </div>
      </div>
      <div class="home-cards-grid home-cards-grid--two">
        <article v-for="item in facilities" :key="item.title" class="site-card home-facility-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="site-shell home-bottom-cta">
      <div class="site-card home-bottom-cta__inner">
        <h2>準備好規劃下一趟入住了嗎？</h2>
        <p>立即選擇房型並完成預約，系統將即時計算住宿費用與入住資訊。</p>
        <div class="home-bottom-cta__actions">
          <NuxtLink to="/rooms" class="site-btn">先看房型</NuxtLink>
          <NuxtLink to="/booking" class="site-btn site-btn--ghost">直接預約</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
