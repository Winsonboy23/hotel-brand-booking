export type Room = {
  slug: string
  name: string
  subtitle: string
  description: string
  size: string
  occupancy: string
  bedType: string
  priceFrom: number
  image: string
  gallery: string[]
  highlights: string[]
  amenities: string[]
}

export type Activity = {
  id: string
  title: string
  description: string
  amount: number
  startsAt: string
  endsAt: string
}

export type Metric = {
  value: string
  label: string
}

export type Facility = {
  title: string
  description: string
}

export const hotelProfile = {
  name: 'HOTEL AURORA',
  localName: '晨曦酒店',
  tagline: '在城市中，享受安定與儀式感',
  address: '台北市中山區晨曦路 28 號',
  phone: '02-1234-5678',
  email: 'service@hotelaurora.tw',
  heroImage: '/images/nanasen/hero1.webp',
  highlights: [
    { title: '步行 5 分鐘到捷運', description: '交通便利，商務與旅遊都方便安排行程。' },
    { title: '每日現做早餐', description: '提供台式與西式早餐，滿足不同旅客偏好。' },
    { title: '高速 Wi-Fi 與共享空間', description: '客房與公共區域皆提供穩定網路與工作座位。' },
    { title: '24 小時櫃台服務', description: '隨時協助入住需求、行李寄放與周邊推薦。' }
  ]
}

export const metrics: Metric[] = [
  { value: '18m', label: '恆溫泳池' },
  { value: '3', label: '主題餐廳' },
  { value: '24/7', label: '水療中心' },
  { value: '1:1', label: '專屬管家' }
]

export const facilities: Facility[] = [
  {
    title: 'Skyline Infinity Pool',
    description: '高樓層無邊際泳池，日夜皆可欣賞城市天際線。'
  },
  {
    title: 'Aurora Signature Dining',
    description: '全日供餐與晚間主廚套餐，提供在地與國際融合料理。'
  },
  {
    title: 'Wellness & Spa',
    description: '芳療、蒸氣室與靜謐放鬆空間，為旅程留一段修復時間。'
  },
  {
    title: 'Executive Lounge',
    description: '商務會談、遠端工作與輕食飲品，全天候開放。'
  }
]

export const stayPolicies = [
  'Check-in 15:00 後 / Check-out 11:00 前',
  '全館禁菸，違者酌收清潔費',
  '不提供寵物入住（導盲犬除外）',
  '加人加價依房型與日期浮動'
]

export const paymentMethods = ['信用卡預授權', '銀行轉帳', '現場支付（保證卡）']

export const rooms: Room[] = [
  {
    slug: 'classic-king',
    name: 'Classic King',
    subtitle: '經典大床房',
    description: '適合雙人入住的溫潤木質客房，配置大面採光窗與舒適床寢。',
    size: '26 m²',
    occupancy: '2 位',
    bedType: '1 張特大床',
    priceFrom: 4200,
    image: '/images/nanasen/gallery-1.webp',
    gallery: ['/images/nanasen/gallery-1.webp', '/images/nanasen/gallery-2.webp', '/images/nanasen/gallery-3.webp'],
    highlights: ['落地窗自然採光', '城市景觀', '獨立乾濕分離浴室'],
    amenities: ['免費 Wi‑Fi', '55 吋智慧電視', 'Nespresso 咖啡機', '浴袍與拖鞋', '迎賓點心']
  },
  {
    slug: 'deluxe-twin',
    name: 'Deluxe Twin',
    subtitle: '豪華雙床房',
    description: '彈性雙床配置，特別適合家庭旅客或朋友同行。',
    size: '32 m²',
    occupancy: '3 位',
    bedType: '2 張單人床',
    priceFrom: 5600,
    image: '/images/nanasen/gallery-4.webp',
    gallery: ['/images/nanasen/gallery-4.webp', '/images/nanasen/gallery-5.webp', '/images/nanasen/gallery-6.webp'],
    highlights: ['適合家庭與好友同行', '寬敞行李置放空間', '高樓層安靜房型'],
    amenities: ['免費 Wi‑Fi', '藍牙音響', '浴缸', '空氣清淨機', 'mini bar']
  },
  {
    slug: 'aurora-suite',
    name: 'Aurora Suite',
    subtitle: '極光套房',
    description: '擁有獨立起居空間的旗艦房型，提供更完整的度假儀式感。',
    size: '48 m²',
    occupancy: '2 位',
    bedType: '1 張特大床',
    priceFrom: 9200,
    image: '/images/nanasen/hero2.webp',
    gallery: ['/images/nanasen/hero2.webp', '/images/nanasen/hero3.webp', '/images/nanasen/heromb2.webp'],
    highlights: ['獨立客廳與休憩區', '浴缸與景觀窗', 'VIP 備品升級'],
    amenities: ['免費 Wi‑Fi', '膠囊咖啡機', '音響系統', '雙洗手台', '迎賓氣泡酒']
  }
]

export const activities: Activity[] = [
  {
    id: 'spring-escape',
    title: '春季雙人入住專案',
    description: '平日入住 Classic King，含雙人早餐與延後退房 1 小時。',
    amount: 4880,
    startsAt: '2026-04-01',
    endsAt: '2026-06-30'
  },
  {
    id: 'suite-night',
    title: '套房夜光升級',
    description: '預訂 Aurora Suite 即贈迎賓氣泡酒與夜間甜點盤。',
    amount: 9800,
    startsAt: '2026-04-15',
    endsAt: '2026-07-31'
  },
  {
    id: 'workstay',
    title: '城市 Workstay 連住方案',
    description: '連住 2 晚以上享 9 折，含共享空間與咖啡兌換。',
    amount: 7560,
    startsAt: '2026-05-01',
    endsAt: '2026-08-31'
  }
]

export const findRoomBySlug = (slug: string) => rooms.find((room) => room.slug === slug)
