export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://hotel-brand-booking.zeabur.app'
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://hotel-brand-booking.zeabur.app',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'
    }
  },
  experimental: {
    appManifest: false,
    payloadExtraction: false
  },
  nitro: {
    prerender: {
      routes: ['/nanasen', '/quexi']
    }
  },
  routeRules: {
    '/nanasen.html': { redirect: '/nanasen' }
  },
  app: {
    buildAssetsDir: '/assets/'
  }
})
