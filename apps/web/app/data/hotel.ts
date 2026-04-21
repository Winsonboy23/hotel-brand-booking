export type Room = {
  slug: string
  name: string
  subtitle: string
  size: string
  occupancy: string
  bedType: string
  priceFrom: number
  image: string
  gallery: string[]
  highlights: string[]
  amenities: string[]
}

export const rooms: Room[] = [
  {
    slug: 'classic-king',
    name: 'Classic King',
    subtitle: '經典大床房',
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

export const findRoomBySlug = (slug: string) => rooms.find((room) => room.slug === slug)
