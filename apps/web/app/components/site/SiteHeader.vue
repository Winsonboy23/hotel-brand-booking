<script setup lang="ts">
const route = useRoute()

const links = [
  { label: '首頁', href: '/' },
  { label: '房型介紹', href: '/rooms' },
  { label: '我要訂房', href: '/booking' },
  { label: '會員中心', href: '/member' }
]

const isActive = (href: string) => (href === '/' ? route.path === '/' : route.path.startsWith(href))
</script>

<template>
  <header class="site-header">
    <div class="site-shell site-header__inner">
      <NuxtLink to="/" class="site-logo">HOTEL AURORA</NuxtLink>
      <nav class="site-nav">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="site-nav__link"
          :class="{ 'site-nav__link--active': isActive(link.href) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
