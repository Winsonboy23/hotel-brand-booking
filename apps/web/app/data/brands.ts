import type { LocaleCode } from './messages'

type LocaleTextMap = Record<LocaleCode, string>

export type BrandKey = 'nanasen' | 'quexi'

export interface BrandConfig {
  key: BrandKey
  displayName: string
  localName: string
  logoAlt: string
  logoSrc: string
  faviconIco: string
  heroSlides: { desktop: string; mobile: string }[]
  galleryImages: { src: string; alt: string }[]
  contactPhone: string
  contactAddress: string
  mapTitle: string
  mapEmbedUrl: string
  instagramHandle: string
  instagramUrl: string
  facebookUrl: string
  reservationUrl: string
  followersCount: string
  followingCount: string
  postCount: string
  metaTitle: LocaleTextMap
  metaDescription: LocaleTextMap
}

export const brandConfigs: Record<BrandKey, BrandConfig> = {
  nanasen: {
    key: 'nanasen',
    displayName: 'NANASEN',
    localName: '七撰 割烹',
    logoAlt: 'nanasen logo',
    logoSrc: '/images/nanasen/logo.webp',
    faviconIco: '/images/brand/nanasen/favicon.ico',
    heroSlides: [
      { desktop: '/images/nanasen/hero1.webp', mobile: '/images/nanasen/heromb1.webp' },
      { desktop: '/images/nanasen/hero2.webp', mobile: '/images/nanasen/heromb2.webp' },
      { desktop: '/images/nanasen/hero3.webp', mobile: '/images/nanasen/heromb3.webp' }
    ],
    galleryImages: [
      { src: '/images/nanasen/gallery-1.webp', alt: 'Interior' },
      { src: '/images/nanasen/gallery-2.webp', alt: 'Interior detail' },
      { src: '/images/nanasen/gallery-3.webp', alt: 'Wood detail' },
      { src: '/images/nanasen/gallery-4.webp', alt: 'Counter' },
      { src: '/images/nanasen/gallery-5.webp', alt: 'Private room' },
      { src: '/images/nanasen/gallery-6.webp', alt: 'Garden' }
    ],
    contactPhone: '',
    contactAddress: '',
    mapTitle: 'Nanasen map',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.9111941269875!2d120.22693617536743!3d22.990292879196474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e77708f425f7d%3A0x1553daa6d79d696d!2z5LiD5pKwIOWJsueDuQ!5e0!3m2!1szh-TW!2stw!4v1775843233741!5m2!1szh-TW!2stw',
    instagramHandle: '@nana_sen7',
    instagramUrl: 'https://www.instagram.com/nana_sen7/',
    facebookUrl: 'https://www.facebook.com/p/%E4%B8%83%E6%92%B0-%E5%89%B2%E7%83%B9-100063477143662/',
    reservationUrl: 'https://www.instagram.com/nana_sen7/',
    followersCount: '1,879',
    followingCount: '7',
    postCount: '155',
    metaTitle: {
      ja: 'NANASEN | 七撰 割烹',
      en: 'NANASEN | Nana Sen',
      zh: 'NANASEN | 七撰 割烹'
    },
    metaDescription: {
      ja: '木の温もりある空間で旬の味を届ける、nanasen の割烹体験ページ。',
      en: 'A refined kappo dining experience page for nanasen, crafted with seasonal ingredients.',
      zh: 'nanasen 割烹體驗頁，呈現溫潤木質空間與四季旬味。'
    }
  },
  quexi: {
    key: 'quexi',
    displayName: 'QUEXI',
    localName: '鵲喜',
    logoAlt: 'quexi logo',
    logoSrc: '/images/quexi/logo.webp',
    faviconIco: '/images/brand/quexi/favicon.ico',
    heroSlides: [
      { desktop: '/images/quexi/hero1.webp', mobile: '/images/quexi/heromb1.webp' },
      { desktop: '/images/quexi/hero2.webp', mobile: '/images/quexi/heromb2.webp' },
      { desktop: '/images/quexi/hero3.webp', mobile: '/images/quexi/heromb3.webp' }
    ],
    galleryImages: [
      { src: '/images/quexi/gallery-1.webp', alt: 'Interior' },
      { src: '/images/quexi/gallery-2.webp', alt: 'Interior detail' },
      { src: '/images/quexi/gallery-3.webp', alt: 'Wood detail' },
      { src: '/images/quexi/gallery-4.webp', alt: 'Counter' },
      { src: '/images/quexi/gallery-5.webp', alt: 'Private room' },
      { src: '/images/quexi/gallery-6.webp', alt: 'Garden' }
    ],
    contactPhone: '',
    contactAddress: '@quexi_tsukemen / 鵲喜',
    mapTitle: 'Quexi map',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.362956206856!2d120.68124780000001!3d24.159000499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693deb06c14649%3A0x28bf793697c1310a!2z6bWy5Zac5rK-6bq15bCI6ZaA5bqXLeWMl-WNgOW_heWQg-aLiem6tXzmsr7purXlsIjploDlupd854ax6ZaA5rK-6bq1fOW_heWQg-e-jumjn3zkurrmsKPmi4npurV85Zyo5Zyw5o6o6Jam5ouJ6bq1!5e0!3m2!1szh-TW!2stw!4v1775935151019!5m2!1szh-TW!2stw',
    instagramHandle: '@quexi_tsukemen',
    instagramUrl: 'https://www.instagram.com/quexi_tsukemen/',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61550973456318&mibextid=LQQJ4d',
    reservationUrl: 'https://www.instagram.com/quexi_tsukemen/',
    followersCount: '2,120',
    followingCount: '18',
    postCount: '201',
    metaTitle: {
      ja: 'QUEXI | 鵲喜',
      en: 'QUEXI | 鵲喜',
      zh: 'QUEXI | 鵲喜'
    },
    metaDescription: {
      ja: '鵲喜の世界観を伝える和食ダイニングページ。コース・アクセス・予約情報を掲載。',
      en: 'Official landing page for QUEXI, featuring menu courses, access details, and reservation entry points.',
      zh: '鵲喜品牌官方頁面，完整呈現菜單、交通與預約資訊。'
    }
  }
}
