<script setup lang="ts">
import { rooms } from '~/data/hotel'

const booking = reactive({
  name: '',
  email: '',
  phone: '',
  roomSlug: rooms[0]?.slug ?? '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  note: ''
})

const submitState = ref<'idle' | 'success'>('idle')

const submitBooking = async () => {
  submitState.value = 'success'
}

useHead({
  title: '我要訂房｜Hotel Aurora',
  meta: [{ name: 'description', content: '填寫入住日期與房型需求，完成 Hotel Aurora 訂房預約。' }]
})
</script>

<template>
  <div class="site-page">
    <section class="site-shell">
      <p class="text-xs tracking-[0.2em] text-black/55">BOOKING REQUEST</p>
      <h1 class="mt-3 text-4xl">我要訂房</h1>
      <p class="mt-4 max-w-2xl text-black/70">送出預約後，系統會提供匯款資訊給你，並由客服協助確認房況與最終訂單。</p>
    </section>

    <section class="site-shell mt-10">
      <form class="site-card p-6 md:p-8" @submit.prevent="submitBooking">
        <div class="site-grid md:grid-cols-2">
          <label class="form-field">
            聯絡姓名
            <input v-model="booking.name" required placeholder="請輸入姓名">
          </label>

          <label class="form-field">
            聯絡 Email
            <input v-model="booking.email" type="email" required placeholder="you@example.com">
          </label>

          <label class="form-field">
            聯絡電話
            <input v-model="booking.phone" required placeholder="09xx-xxx-xxx">
          </label>

          <label class="form-field">
            房型
            <select v-model="booking.roomSlug" required>
              <option v-for="room in rooms" :key="room.slug" :value="room.slug">{{ room.name }}（{{ room.subtitle }}）</option>
            </select>
          </label>

          <label class="form-field">
            入住日期
            <input v-model="booking.checkIn" type="date" required>
          </label>

          <label class="form-field">
            退房日期
            <input v-model="booking.checkOut" type="date" required>
          </label>

          <label class="form-field">
            入住人數
            <input v-model.number="booking.guests" type="number" min="1" max="4" required>
          </label>

          <label class="form-field md:col-span-2">
            備註
            <textarea v-model="booking.note" rows="4" placeholder="例如：希望高樓層、嬰兒床需求"></textarea>
          </label>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <button class="site-btn" type="submit">送出訂房需求</button>
          <NuxtLink to="/member" class="site-btn site-btn--ghost">已送出？前往會員中心</NuxtLink>
        </div>

        <p v-if="submitState === 'success'" class="mt-4 text-sm text-emerald-700">
          已送出！客服將透過 Email 與 LINE 與你確認，並提供匯款資訊。
        </p>
      </form>
    </section>
  </div>
</template>
