import { Client } from '@notionhq/client'

export type NotionDemoSeedDatabaseIds = {
  roomsDbId: string
  activitiesDbId: string
  policiesDbId: string
  bookingsDbId: string
}

export type NotionDemoSeedResult = {
  deleted: {
    rooms: number
    activities: number
    policies: number
    bookings: number
  }
  created: {
    rooms: number
    activities: number
    policies: number
    bookings: number
  }
}

const normalize = (value: string) => value.replaceAll('-', '')

const richText = (content: string) => [
  {
    type: 'text',
    text: { content }
  }
]

const fileItem = (url: string, name: string) => ({
  name,
  type: 'external',
  external: { url }
})

const listAllPageIds = async (notion: Client, databaseId: string) => {
  const ids: string[] = []
  let cursor: string | undefined = undefined

  while (true) {
    const response = await notion.databases.query({
      database_id: normalize(databaseId),
      start_cursor: cursor
    })

    for (const page of response.results) {
      if ('id' in page) ids.push(page.id)
    }

    if (!response.has_more || !response.next_cursor) break
    cursor = response.next_cursor
  }

  return ids
}

const clearDatabase = async (notion: Client, databaseId: string) => {
  const pageIds = await listAllPageIds(notion, databaseId)
  for (const pageId of pageIds) {
    await notion.pages.update({ page_id: pageId, archived: true })
  }
  return pageIds.length
}

const seedRooms = async (notion: Client, databaseId: string) => {
  const rows = [
    {
      name: 'Classic King',
      slug: 'classic-king',
      subtitle: '經典大床房',
      description: '溫潤木質空間搭配大片採光，適合雙人放鬆與短期商務入住。',
      size: '26 m²',
      occupancy: 2,
      bedType: '1 張特大床',
      priceFrom: 4200,
      cover:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
      ],
      highlights: ['落地窗自然採光', '城市景觀', '乾濕分離衛浴'],
      amenities: ['免費 Wi‑Fi', '55 吋智慧電視', 'Nespresso 咖啡機', '浴袍與拖鞋'],
      sort: 1
    },
    {
      name: 'Deluxe Twin',
      slug: 'deluxe-twin',
      subtitle: '豪華雙床房',
      description: '彈性雙床配置與寬敞動線，適合家庭旅客與好友同行。',
      size: '32 m²',
      occupancy: 3,
      bedType: '2 張單人床',
      priceFrom: 5600,
      cover:
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
      ],
      highlights: ['適合家庭與好友同行', '高樓層安靜房型', '大面積收納'],
      amenities: ['免費 Wi‑Fi', '藍牙音響', '浴缸', '空氣清淨機'],
      sort: 2
    },
    {
      name: 'Aurora Suite',
      slug: 'aurora-suite',
      subtitle: '極光套房',
      description: '旗艦套房擁有獨立起居空間與景觀浴缸，打造完整度假儀式感。',
      size: '48 m²',
      occupancy: 2,
      bedType: '1 張特大床',
      priceFrom: 9200,
      cover:
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&w=1200&q=80'
      ],
      highlights: ['獨立客廳與休憩區', '景觀浴缸', 'VIP 備品升級'],
      amenities: ['免費 Wi‑Fi', '膠囊咖啡機', '音響系統', '雙洗手台', '迎賓氣泡酒'],
      sort: 3
    }
  ]

  let created = 0
  for (const row of rows) {
    await notion.pages.create({
      parent: { database_id: normalize(databaseId) },
      properties: {
        Name: { title: richText(row.name) },
        Slug: { rich_text: richText(row.slug) },
        Subtitle: { rich_text: richText(row.subtitle) },
        Description: { rich_text: richText(row.description) },
        Size: { rich_text: richText(row.size) },
        Occupancy: { number: row.occupancy },
        'Bed Type': { rich_text: richText(row.bedType) },
        'Price From': { number: row.priceFrom },
        Cover: { files: [fileItem(row.cover, `${row.slug}-cover`)] },
        Gallery: { files: row.gallery.map((url, idx) => fileItem(url, `${row.slug}-gallery-${idx + 1}`)) },
        Highlights: { rich_text: richText(row.highlights.join('\n')) },
        Amenities: { rich_text: richText(row.amenities.join('\n')) },
        'Is Active': { checkbox: true },
        Sort: { number: row.sort }
      } as any
    })
    created += 1
  }

  return created
}

const seedActivities = async (notion: Client, databaseId: string) => {
  const rows = [
    {
      title: '春季雙人入住專案',
      description: '平日入住含雙人早餐與延後退房 1 小時。',
      amount: 4880,
      startsAt: '2026-04-01',
      endsAt: '2026-06-30',
      sort: 1
    },
    {
      title: '套房夜光升級',
      description: '預訂 Aurora Suite 即贈迎賓氣泡酒與夜間甜點盤。',
      amount: 9800,
      startsAt: '2026-04-15',
      endsAt: '2026-07-31',
      sort: 2
    },
    {
      title: '城市 Workstay 連住方案',
      description: '連住 2 晚以上享 9 折，含共享空間與咖啡兌換。',
      amount: 7560,
      startsAt: '2026-05-01',
      endsAt: '2026-08-31',
      sort: 3
    }
  ]

  let created = 0
  for (const row of rows) {
    await notion.pages.create({
      parent: { database_id: normalize(databaseId) },
      properties: {
        Title: { title: richText(row.title) },
        Description: { rich_text: richText(row.description) },
        Amount: { number: row.amount },
        'Starts At': { date: { start: row.startsAt } },
        'Ends At': { date: { start: row.endsAt } },
        'Is Active': { checkbox: true },
        Sort: { number: row.sort }
      } as any
    })
    created += 1
  }

  return created
}

const seedPolicies = async (notion: Client, databaseId: string) => {
  const rows = [
    {
      title: '入住與退房',
      type: 'stay',
      content: 'Check-in 15:00 後 / Check-out 11:00 前。',
      sort: 1
    },
    {
      title: '全館禁菸政策',
      type: 'stay',
      content: '全館禁菸，違者酌收清潔費。',
      sort: 2
    },
    {
      title: '取消政策',
      type: 'cancellation',
      content: '入住日前 3 日內取消，收取首晚房費。',
      sort: 3
    },
    {
      title: '匯款提醒',
      type: 'remittance',
      content: '請於訂單建立後 24 小時內完成匯款。',
      sort: 4
    },
    {
      title: 'brand.local_name',
      type: 'notice',
      content: '晨曦酒店',
      sort: 90
    },
    {
      title: 'brand.tagline',
      type: 'notice',
      content: '在城市中，享受安定與儀式感',
      sort: 91
    },
    {
      title: 'brand.subtitle',
      type: 'notice',
      content: '一站式官方前台，快速完成房型瀏覽、費用試算與預約流程。',
      sort: 92
    },
    {
      title: 'facility:Skyline Infinity Pool',
      type: 'notice',
      content: '高樓層無邊際泳池，日夜皆可欣賞城市天際線。',
      sort: 93
    },
    {
      title: 'facility:Aurora Signature Dining',
      type: 'notice',
      content: '全日供餐與晚間主廚套餐，提供在地與國際融合料理。',
      sort: 94
    },
    {
      title: 'facility:Wellness & Spa',
      type: 'notice',
      content: '芳療、蒸氣室與靜謐放鬆空間，為旅程留一段修復時間。',
      sort: 95
    },
    {
      title: 'facility:Executive Lounge',
      type: 'notice',
      content: '商務會談、遠端工作與輕食飲品，全天候開放。',
      sort: 96
    },
    {
      title: 'metric:恆溫泳池',
      type: 'notice',
      content: '18m',
      sort: 97
    },
    {
      title: 'metric:主題餐廳',
      type: 'notice',
      content: '3',
      sort: 98
    },
    {
      title: 'metric:水療中心',
      type: 'notice',
      content: '24/7',
      sort: 99
    },
    {
      title: 'metric:專屬管家',
      type: 'notice',
      content: '1:1',
      sort: 100
    }
  ]

  let created = 0
  for (const row of rows) {
    await notion.pages.create({
      parent: { database_id: normalize(databaseId) },
      properties: {
        Title: { title: richText(row.title) },
        Type: { select: { name: row.type } },
        Content: { rich_text: richText(row.content) },
        Sort: { number: row.sort },
        'Is Active': { checkbox: true }
      } as any
    })
    created += 1
  }

  return created
}

const seedBookings = async (notion: Client, databaseId: string) => {
  const rows = [
    {
      bookingNo: 'BK202604230001',
      status: 'pending_remittance',
      roomSlug: 'classic-king',
      checkIn: '2026-05-03',
      checkOut: '2026-05-05',
      nights: 2,
      guests: 2,
      amount: 8400,
      guestName: '王小明',
      email: 'demo1@example.com',
      phone: '0912345678',
      lineUserId: 'U_demo_line_001',
      paymentMethod: 'bank_transfer',
      remittanceNote: '尚未匯款'
    },
    {
      bookingNo: 'BK202604230002',
      status: 'remitted',
      roomSlug: 'aurora-suite',
      checkIn: '2026-05-11',
      checkOut: '2026-05-13',
      nights: 2,
      guests: 2,
      amount: 18400,
      guestName: '陳小華',
      email: 'demo2@example.com',
      phone: '0922333444',
      lineUserId: 'U_demo_line_002',
      paymentMethod: 'bank_transfer',
      remittanceNote: '已匯款，末五碼 34819'
    }
  ]

  let created = 0
  for (const row of rows) {
    await notion.pages.create({
      parent: { database_id: normalize(databaseId) },
      properties: {
        'Booking No': { title: richText(row.bookingNo) },
        Status: { select: { name: row.status } },
        'Room Slug': { rich_text: richText(row.roomSlug) },
        'Check In': { date: { start: row.checkIn } },
        'Check Out': { date: { start: row.checkOut } },
        Nights: { number: row.nights },
        Guests: { number: row.guests },
        Amount: { number: row.amount },
        'Guest Name': { rich_text: richText(row.guestName) },
        Email: { email: row.email },
        Phone: { phone_number: row.phone },
        'Line User ID': { rich_text: richText(row.lineUserId) },
        'Payment Method': { select: { name: row.paymentMethod } },
        'Remittance Note': { rich_text: richText(row.remittanceNote) },
        'Created At': { date: { start: new Date().toISOString() } }
      } as any
    })
    created += 1
  }

  return created
}

export const seedNotionDemoData = async (
  notion: Client,
  dbIds: NotionDemoSeedDatabaseIds,
  options?: { clear?: boolean }
): Promise<NotionDemoSeedResult> => {
  const shouldClear = options?.clear ?? true

  const deleted = {
    rooms: 0,
    activities: 0,
    policies: 0,
    bookings: 0
  }

  if (shouldClear) {
    deleted.rooms = await clearDatabase(notion, dbIds.roomsDbId)
    deleted.activities = await clearDatabase(notion, dbIds.activitiesDbId)
    deleted.policies = await clearDatabase(notion, dbIds.policiesDbId)
    deleted.bookings = await clearDatabase(notion, dbIds.bookingsDbId)
  }

  const created = {
    rooms: await seedRooms(notion, dbIds.roomsDbId),
    activities: await seedActivities(notion, dbIds.activitiesDbId),
    policies: await seedPolicies(notion, dbIds.policiesDbId),
    bookings: await seedBookings(notion, dbIds.bookingsDbId)
  }

  return {
    deleted,
    created
  }
}
