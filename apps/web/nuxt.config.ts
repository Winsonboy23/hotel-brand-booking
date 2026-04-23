export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/css/main.css'],
  site: {
    url: 'https://hotel-brand-booking.zeabur.app'
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://hotel-brand-booking.zeabur.app',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002'
    }
  },
  experimental: {
    appManifest: false,
    payloadExtraction: false
  },
  app: {
    buildAssetsDir: '/assets/'
  }
})
