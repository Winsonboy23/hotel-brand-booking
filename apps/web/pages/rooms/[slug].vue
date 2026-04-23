<script setup lang="ts">
const route = useRoute()
const { formatTwd } = useCurrency()
const { rooms, policies } = useSiteContent()

const room = computed(() => rooms.value.find((item) => item.slug === String(route.params.slug)))
const activeImage = ref('')

if (!room.value) {
  throw createError({ statusCode: 404, statusMessage: 'Room not found' })
}

activeImage.value = room.value.image

watch(
  () => room.value?.slug,
  () => {
    if (room.value) {
      activeImage.value = room.value.image
    }
  }
)

const recommendations = computed(() =>
  rooms.value.filter((candidate) => candidate.slug !== room.value?.slug).slice(0, 2)
)

const stayPolicies = computed(() => {
  const fromNotion = policies.value.filter((policy) => policy.type === 'stay').map((policy) => policy.content)
  return fromNotion.length ? fromNotion : ['Check-in 15:00 後 / Check-out 11:00 前']
})

useHead(() => ({
  title: `${room.value?.name ?? '房型詳情'}｜HOTEL AURORA`,
  meta: [{ name: 'description', content: `${room.value?.name ?? ''} 房型亮點、住宿政策與預約入口。` }]
}))
</script>

<template>
  <div v-if="room">
    <section class="room-hero">
      <img :src="activeImage" :alt="room.name" class="room-hero__bg">
      <div class="room-hero__overlay" />
      <div class="site-shell room-hero__content">
        <p class="home-eyebrow">ROOM DETAIL</p>
        <h1 class="room-hero__title">{{ room.name }}</h1>
        <p class="room-hero__subtitle">{{ room.subtitle }} ・ {{ room.size }} ・ {{ room.occupancy }}</p>
      </div>
    </section>

    <section class="site-shell room-detail">
      <div class="room-detail__main">
        <article class="site-card room-panel">
          <h2>房型介紹</h2>
          <p>{{ room.description }}</p>
          <ul>
            <li v-for="highlight in room.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </article>

        <article class="site-card room-panel">
          <h2>縮圖畫廊</h2>
          <div class="room-gallery__thumbs">
            <button
              v-for="image in room.gallery"
              :key="image"
              class="room-thumb"
              :class="{ 'room-thumb--active': image === activeImage }"
              @click="activeImage = image"
            >
              <img :src="image" :alt="room.name">
            </button>
          </div>
        </article>

        <article class="site-card room-panel">
          <h2>設備清單</h2>
          <ul class="room-list-grid">
            <li v-for="amenity in room.amenities" :key="amenity">{{ amenity }}</li>
          </ul>
        </article>

        <article class="site-card room-panel">
          <h2>住宿政策</h2>
          <ul>
            <li v-for="policy in stayPolicies" :key="policy">{{ policy }}</li>
          </ul>
        </article>
      </div>

      <aside class="room-detail__aside">
        <article class="site-card room-pricing-card">
          <p class="room-pricing-card__tag">STARTING RATE</p>
          <p class="room-pricing-card__price">{{ formatTwd(room.priceFrom) }}</p>
          <p class="room-pricing-card__meta">每晚起，最終價格依入住日期為準</p>
          <NuxtLink :to="`/booking?room=${room.slug}`" class="site-btn room-pricing-card__btn">立即預約</NuxtLink>
          <NuxtLink to="/rooms" class="site-btn site-btn--ghost room-pricing-card__btn">回房型列表</NuxtLink>
        </article>
      </aside>
    </section>

    <section class="site-shell home-section">
      <div class="home-section__head">
        <div>
          <p class="home-section__eyebrow">YOU MAY ALSO LIKE</p>
          <h2 class="home-section__title">您可能也喜歡</h2>
        </div>
      </div>
      <div class="home-cards-grid home-cards-grid--two">
        <article v-for="item in recommendations" :key="item.slug" class="site-card rooms-list-card">
          <img :src="item.image" :alt="item.name" class="rooms-list-card__image">
          <div class="rooms-list-card__body">
            <h3>{{ item.name }}</h3>
            <p class="rooms-list-card__subtitle">{{ item.subtitle }}</p>
            <p class="home-price">{{ formatTwd(item.priceFrom) }} 起</p>
            <NuxtLink :to="`/rooms/${item.slug}`" class="site-btn">查看房型</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
