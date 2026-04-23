<script setup lang="ts">
import { paymentMethods } from '~/data/hotel'

const route = useRoute()
const { formatTwd } = useCurrency()
const { rooms } = useSiteContent()

const step = ref(1)
const submitted = ref(false)
const touched = ref(false)

const form = reactive({
  roomSlug: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  name: '',
  email: '',
  phone: '',
  paymentMethod: paymentMethods[0],
  note: ''
})

if (typeof route.query.room === 'string') {
  const target = rooms.value.find((item) => item.slug === route.query.room)
  if (target) {
    form.roomSlug = target.slug
  }
}

watch(
  () => rooms.value,
  (value) => {
    if (!form.roomSlug && value.length) {
      form.roomSlug = value[0]?.slug ?? ''
    }
  },
  { immediate: true }
)

const selectedRoom = computed(() => rooms.value.find((item) => item.slug === form.roomSlug) ?? rooms.value[0])
const nights = computed(() => {
  if (!form.checkIn || !form.checkOut) return 0
  const start = new Date(form.checkIn).getTime()
  const end = new Date(form.checkOut).getTime()
  const diff = Math.ceil((end - start) / 86400000)
  return diff > 0 ? diff : 0
})
const subtotal = computed(() => (selectedRoom.value ? selectedRoom.value.priceFrom * nights.value : 0))

const errors = computed(() => ({
  checkIn: !form.checkIn ? '請選擇入住日期' : '',
  checkOut: !form.checkOut ? '請選擇退房日期' : nights.value === 0 ? '退房日期需晚於入住日期' : '',
  guests: form.guests < 1 ? '入住人數至少 1 位' : '',
  name: form.name.trim().length < 2 ? '請輸入正確姓名' : '',
  email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'Email 格式不正確' : '',
  phone: form.phone.trim().length < 8 ? '請輸入正確電話' : '',
  paymentMethod: !form.paymentMethod ? '請選擇付款方式' : ''
}))

const hasStepOneError = computed(() => Boolean(errors.value.checkIn || errors.value.checkOut || errors.value.guests))
const hasStepTwoError = computed(() => Boolean(errors.value.name || errors.value.email || errors.value.phone || errors.value.paymentMethod))

const goNext = () => {
  touched.value = true
  if (step.value === 1 && hasStepOneError.value) return
  if (step.value === 2 && hasStepTwoError.value) return
  step.value = Math.min(step.value + 1, 3)
  touched.value = false
}

const goPrev = () => {
  step.value = Math.max(step.value - 1, 1)
  touched.value = false
}

const submitBooking = () => {
  touched.value = true
  if (hasStepOneError.value || hasStepTwoError.value || nights.value <= 0) return
  submitted.value = true
}

const isInvalid = (key: keyof typeof errors.value) => touched.value && Boolean(errors.value[key])

useHead({
  title: '立即預約｜HOTEL AURORA',
  meta: [{ name: 'description', content: '三步驟完成 HOTEL AURORA 預約流程，包含日期、資料與費用確認。' }]
})
</script>

<template>
  <div class="site-page">
    <section class="site-shell home-section">
      <p class="home-section__eyebrow">BOOKING FLOW</p>
      <h1 class="home-section__title">預約流程</h1>
      <div class="booking-steps">
        <div class="booking-step" :class="{ 'booking-step--active': step === 1 }">1. 選日期</div>
        <div class="booking-step" :class="{ 'booking-step--active': step === 2 }">2. 填資料</div>
        <div class="booking-step" :class="{ 'booking-step--active': step === 3 }">3. 確認</div>
      </div>
    </section>

    <section v-if="!submitted" class="site-shell booking-layout">
      <form class="site-card booking-form" @submit.prevent="submitBooking">
        <template v-if="step === 1">
          <h2>Step 1｜選擇入住日期</h2>
          <div class="booking-grid">
            <label class="form-field">
              房型
              <select v-model="form.roomSlug">
                <option v-for="room in rooms" :key="room.slug" :value="room.slug">{{ room.name }}（{{ room.subtitle }}）</option>
              </select>
            </label>

            <label class="form-field">
              入住日期
              <input v-model="form.checkIn" type="date" :class="{ 'is-error': isInvalid('checkIn') }">
              <span v-if="isInvalid('checkIn')" class="form-error">{{ errors.checkIn }}</span>
            </label>

            <label class="form-field">
              退房日期
              <input v-model="form.checkOut" type="date" :class="{ 'is-error': isInvalid('checkOut') }">
              <span v-if="isInvalid('checkOut')" class="form-error">{{ errors.checkOut }}</span>
            </label>

            <label class="form-field">
              入住人數
              <input v-model.number="form.guests" type="number" min="1" max="8" :class="{ 'is-error': isInvalid('guests') }">
              <span v-if="isInvalid('guests')" class="form-error">{{ errors.guests }}</span>
            </label>
          </div>
        </template>

        <template v-else-if="step === 2">
          <h2>Step 2｜填寫聯絡資料</h2>
          <div class="booking-grid">
            <label class="form-field">
              姓名
              <input v-model="form.name" placeholder="請輸入姓名" :class="{ 'is-error': isInvalid('name') }">
              <span v-if="isInvalid('name')" class="form-error">{{ errors.name }}</span>
            </label>

            <label class="form-field">
              Email
              <input v-model="form.email" type="email" placeholder="you@example.com" :class="{ 'is-error': isInvalid('email') }">
              <span v-if="isInvalid('email')" class="form-error">{{ errors.email }}</span>
            </label>

            <label class="form-field">
              電話
              <input v-model="form.phone" placeholder="09xx-xxx-xxx" :class="{ 'is-error': isInvalid('phone') }">
              <span v-if="isInvalid('phone')" class="form-error">{{ errors.phone }}</span>
            </label>

            <label class="form-field">
              付款方式
              <select v-model="form.paymentMethod" :class="{ 'is-error': isInvalid('paymentMethod') }">
                <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
              </select>
              <span v-if="isInvalid('paymentMethod')" class="form-error">{{ errors.paymentMethod }}</span>
            </label>

            <label class="form-field booking-full">
              備註
              <textarea v-model="form.note" rows="4" placeholder="特殊需求可填寫於此" />
            </label>
          </div>
        </template>

        <template v-else>
          <h2>Step 3｜確認內容</h2>
          <div class="booking-confirm">
            <p>房型：{{ selectedRoom?.name }}</p>
            <p>日期：{{ form.checkIn || '—' }} 至 {{ form.checkOut || '—' }}</p>
            <p>入住人數：{{ form.guests }} 位</p>
            <p>付款方式：{{ form.paymentMethod }}</p>
            <p>聯絡人：{{ form.name || '—' }} / {{ form.phone || '—' }}</p>
            <p>Email：{{ form.email || '—' }}</p>
            <p>備註：{{ form.note || '無' }}</p>
          </div>
        </template>

        <div class="booking-actions">
          <button v-if="step > 1" type="button" class="site-btn site-btn--ghost" @click="goPrev">上一步</button>
          <button v-if="step < 3" type="button" class="site-btn" @click="goNext">下一步</button>
          <button v-else type="submit" class="site-btn">確認送出</button>
        </div>
      </form>

      <aside class="site-card booking-summary">
        <h2>費用摘要</h2>
        <p>房型：{{ selectedRoom?.name }}</p>
        <p>每晚：{{ formatTwd(selectedRoom?.priceFrom ?? 0) }}</p>
        <p>夜數：{{ nights }} 晚</p>
        <p class="booking-summary__total">總計：{{ formatTwd(subtotal) }}</p>
      </aside>
    </section>

    <section v-else class="site-shell booking-success">
      <article class="site-card booking-success__card">
        <p class="home-section__eyebrow">BOOKING COMPLETED</p>
        <h2>預約成功</h2>
        <p>我們已收到你的預約需求，客服將於 30 分鐘內與你確認訂單。</p>
        <NuxtLink to="/" class="site-btn">返回首頁</NuxtLink>
      </article>
    </section>
  </div>
</template>
