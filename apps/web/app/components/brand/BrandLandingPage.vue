<script setup lang="ts">
import { brandConfigs, type BrandKey } from '~/data/brands'
import { messages, languages, type LocaleCode } from '~/data/messages'

const props = defineProps<{
  brandKey: BrandKey
}>()

const route = useRoute()
const locale = ref<LocaleCode>('zh')

const siteUrl = 'https://homepage-nuxt-eta.vercel.app'
const brand = computed(() => brandConfigs[props.brandKey])
const canonicalUrl = computed(() => `${siteUrl}${route.path}`)
const ogImage = computed(() => `${siteUrl}${brand.value.logoSrc}`)

const setLocale = (code: string) => {
  if (code === 'ja' || code === 'en' || code === 'zh') {
    locale.value = code
  }
}

const t = (key: string): string => {
  const target = messages[locale.value]
  const value = key.split('.').reduce<any>((acc, part) => acc?.[part], target)
  return typeof value === 'string' ? value : key
}

const getMessageValue = (key: string) => {
  const target = messages[locale.value]
  return key.split('.').reduce<any>((acc, part) => acc?.[part], target)
}

const menuItems = computed(() => [
  { label: t('nav.menu'), href: '#menu' },
  { label: t('nav.access'), href: '#access' },
  { label: t('nav.reservation'), href: brand.value.reservationUrl }
])

const heroSlides = computed(() => brand.value.heroSlides)
const currentHeroSlide = ref(0)
let heroTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  heroTimer = setInterval(() => {
    currentHeroSlide.value = (currentHeroSlide.value + 1) % heroSlides.value.length
  }, 4200)
})

onBeforeUnmount(() => {
  if (heroTimer) {
    clearInterval(heroTimer)
  }
})

const greetingLines = computed(() => {
  if (brand.value.key === 'nanasen' && locale.value === 'zh') {
    return [
      '板前料理，講究食材本味與細緻手藝。',
      '日本時令海鮮食材，四季變動菜品。',
      '邀您細細品味七撰割烹的職人之作。'
    ]
  }

  if (brand.value.key === 'nanasen' && locale.value === 'en') {
    return [
      'Counter-style kappo cuisine values pure ingredients and meticulous craft.',
      'We select seasonal seafood from Japan and adapt each dish to the rhythm of the seasons.',
      "Savor the craftsmanship behind every course at Nanasen Kappo."
    ]
  }

  if (brand.value.key === 'nanasen' && locale.value === 'ja') {
    return [
      '板前料理は、素材本来の味わいと繊細な技を大切にしています。',
      '日本の旬の海鮮を厳選し、四季の移ろいに合わせて献立を整えます。',
      '七撰割烹の職人の一皿を、どうぞごゆっくりお楽しみください。'
    ]
  }

  if (brand.value.key === 'quexi' && locale.value === 'zh') {
    return [
      '以濃厚魚介豚骨湯底，搭配彈牙麵體，呈現日式沾麵的層次風味。',
      '每一份沾麵皆以現點現煮，講究溫度、濃度與口感平衡。',
      '從第一口到最後一口，享受鵲喜專注細節的沾麵體驗。'
    ]
  }

  if (brand.value.key === 'quexi' && locale.value === 'en') {
    return [
      'Rich seafood-tonkotsu dipping broth meets springy noodles for a layered tsukemen experience.',
      'Every bowl is cooked to order, with careful control of temperature, intensity, and texture.',
      "From first dip to final bite, enjoy QUEXI's detail-driven tsukemen craft."
    ]
  }

  if (brand.value.key === 'quexi' && locale.value === 'ja') {
    return [
      '濃厚な魚介豚骨のつけ汁と弾力ある麺で、つけ麺ならではの奥行きを表現します。',
      '一杯ごとに丁寧に仕上げ、温度・濃度・食感のバランスを追求しています。',
      'ひと口目から締めの一口まで、鵲喜のつけ麺づくりをご堪能ください。'
    ]
  }

  return [t('greeting.l1'), t('greeting.l2'), t('greeting.l3'), t('greeting.l4'), t('greeting.l5')]
})

const menuNote = computed(() => {
  const note = getMessageValue(`brandMenu.${brand.value.key}.note`)

  if (typeof note === 'string') {
    return note
  }

  return ''
})

const menuCourses = computed(() => {
  const localizedCourses = getMessageValue(`brandMenu.${brand.value.key}.courses`)

  if (Array.isArray(localizedCourses)) {
    return localizedCourses
  }

  return [
    { name: t('menu.c1n'), price: '¥22,000', desc: t('menu.c1d') },
    { name: t('menu.c2n'), price: '¥28,000', desc: t('menu.c2d') },
    { name: t('menu.c3n'), price: '¥8,000〜', desc: t('menu.c3d') }
  ]
})

const galleryImages = computed(() => brand.value.galleryImages)

const footerBrandName = computed(() => (brand.value.key === 'nanasen' ? '七撰割烹' : '鵲喜'))

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: brand.value.localName,
  alternateName: brand.value.displayName,
  image: [ogImage.value],
  description: brand.value.metaDescription[locale.value],
  servingCuisine: 'Japanese',
  url: canonicalUrl.value,
  sameAs: [brand.value.instagramUrl, brand.value.facebookUrl].filter(Boolean)
}))

// JSON-LD for structured data (SEO meta tags are in page files)
useHead(() => ({
  script: [{ type: 'application/ld+json', children: JSON.stringify(jsonLd.value) }]
}))
</script>

<template>
  <div class="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)]">
    <BrandFloatingNav
      :menu-items="menuItems"
      :languages="languages"
      :locale="locale"
      :set-locale="setLocale"
    />

    <main>
      <BrandHeroSection :hero-slides="heroSlides" :current-hero-slide="currentHeroSlide" :logo-alt="brand.logoAlt" :logo-src="brand.logoSrc" :logo-max-width="brand.key === 'quexi' ? 300 : 600" :logo-min-width="brand.key === 'quexi' ? 100 : 0" />
      <div class="bg-white">
        <BrandGreetingSection :greeting-lines="greetingLines" :vertical="locale !== 'en'" />
      </div>
      <div class="bg-[var(--brand-bg)]">
        <BrandMenuSection
          :title="t('section.menu')"
          :courses="menuCourses"
          :brand-key="brand.key"
          :note="menuNote"
          :prev-label="t('action.prev')"
          :next-label="t('action.next')"
        />
      </div>
      <div class="bg-white">
        <BrandGallerySection :images="galleryImages" />
      </div>
      <div class="bg-[var(--brand-bg)]">
        <BrandAccessSection :title="t('section.location')" :map-title="brand.mapTitle" :map-embed-url="brand.mapEmbedUrl" />
      </div>
      <BrandFooterSection
        :brand-name="footerBrandName"
        :logo-alt="brand.logoAlt"
        :logo-src="brand.logoSrc"
        :instagram-url="brand.instagramUrl"
        :facebook-url="brand.facebookUrl"
        :phone="brand.contactPhone"
        :address="brand.contactAddress"
        :instagram-label="t('action.instagram')"
        :facebook-label="t('action.facebook')"
      />
    </main>
  </div>
</template>
