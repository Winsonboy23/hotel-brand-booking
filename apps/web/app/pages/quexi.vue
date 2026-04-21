<script setup lang="ts">
import { brandConfigs } from '~/data/brands'

const brand = brandConfigs.quexi
const siteUrl = 'https://homepage-nuxt-eta.vercel.app'

useHead({
  title: brand.metaTitle.zh,
  htmlAttrs: { lang: 'zh', 'data-brand': 'quexi' },
  meta: [
    { name: 'description', content: brand.metaDescription.zh },
    { property: 'og:title', content: brand.metaTitle.zh },
    { property: 'og:description', content: brand.metaDescription.zh },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${siteUrl}${brand.logoSrc}` },
    { property: 'og:url', content: `${siteUrl}/quexi` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: brand.metaTitle.zh },
    { name: 'twitter:description', content: brand.metaDescription.zh },
    { name: 'twitter:image', content: `${siteUrl}${brand.logoSrc}` },
    { name: 'robots', content: 'index, follow' }
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}/quexi` },
    { rel: 'icon', type: 'image/x-icon', href: brand.faviconIco }
  ]
})
</script>

<template>
  <BrandLandingPage brand-key="quexi" />
</template>
