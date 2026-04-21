<script setup lang="ts">
const mockUser = {
  name: '王小明',
  email: 'member@example.com',
  lineBound: true,
  loginProvider: 'Google'
}

const orders = [
  {
    id: 'BK20260421001',
    room: 'Classic King',
    stay: '2026-05-10 ~ 2026-05-12',
    amount: 8400,
    status: '待匯款'
  },
  {
    id: 'BK20260318007',
    room: 'Aurora Suite',
    stay: '2026-03-25 ~ 2026-03-26',
    amount: 9200,
    status: '已付款'
  }
]

const { formatTwd } = useCurrency()

useHead({
  title: '會員中心｜Hotel Aurora'
})
</script>

<template>
  <div class="site-page">
    <section class="site-shell">
      <p class="text-xs tracking-[0.2em] text-black/55">MEMBER CENTER</p>
      <h1 class="mt-3 text-4xl">會員中心</h1>
    </section>

    <section class="site-shell mt-8 grid gap-6 md:grid-cols-3">
      <article class="site-card p-6 md:col-span-1">
        <h2 class="text-xl">會員資料</h2>
        <p class="mt-4 text-sm text-black/70">姓名：{{ mockUser.name }}</p>
        <p class="mt-2 text-sm text-black/70">Email：{{ mockUser.email }}</p>
        <p class="mt-2 text-sm text-black/70">登入方式：{{ mockUser.loginProvider }}</p>
        <p class="mt-2 text-sm text-black/70">LINE 綁定：{{ mockUser.lineBound ? '已綁定' : '未綁定' }}</p>
        <button class="site-btn mt-5">管理 LINE 綁定</button>
      </article>

      <article class="site-card p-6 md:col-span-2">
        <h2 class="text-xl">我的訂單</h2>
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-black/10 text-black/55">
                <th class="py-2">訂單編號</th>
                <th class="py-2">房型</th>
                <th class="py-2">入住期間</th>
                <th class="py-2">金額</th>
                <th class="py-2">狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="border-b border-black/10">
                <td class="py-3">{{ order.id }}</td>
                <td class="py-3">{{ order.room }}</td>
                <td class="py-3">{{ order.stay }}</td>
                <td class="py-3">{{ formatTwd(order.amount) }}</td>
                <td class="py-3">{{ order.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <NuxtLink to="/booking" class="site-btn mt-5 inline-block">新增訂房</NuxtLink>
      </article>
    </section>
  </div>
</template>
