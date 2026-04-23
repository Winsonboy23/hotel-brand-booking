import { Client } from '@notionhq/client'
import type {
  ActivityContent,
  BookingInput,
  BookingRecord,
  BookingStatus,
  NotionDatabaseIds,
  PolicyContent,
  RoomContent
} from './types.js'

const extractText = (value: any): string => {
  if (!value) return ''
  if (value.title && Array.isArray(value.title)) {
    return value.title.map((v: any) => v.plain_text ?? '').join('')
  }
  if (value.rich_text && Array.isArray(value.rich_text)) {
    return value.rich_text.map((v: any) => v.plain_text ?? '').join('')
  }
  return ''
}

const extractFiles = (value: any): string[] => {
  if (!value || !Array.isArray(value.files)) return []
  return value.files
    .map((item: any) => item?.file?.url ?? item?.external?.url ?? '')
    .filter((url: string) => Boolean(url))
}

const extractDate = (value: any): string => {
  const start = value?.date?.start
  return typeof start === 'string' ? start.slice(0, 10) : ''
}

const splitLines = (value: string): string[] =>
  value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)

const toRoom = (page: any): RoomContent => {
  const props = page.properties ?? {}
  const gallery = extractFiles(props.Gallery)
  const cover = extractFiles(props.Cover)

  return {
    id: page.id,
    slug: extractText(props.Slug),
    name: extractText(props.Name),
    subtitle: extractText(props.Subtitle),
    description: extractText(props.Description),
    size: extractText(props.Size),
    occupancy: `${props.Occupancy?.number ?? 0} 位`,
    bedType: extractText(props['Bed Type']),
    priceFrom: props['Price From']?.number ?? 0,
    image: cover[0] ?? gallery[0] ?? '',
    gallery,
    highlights: splitLines(extractText(props.Highlights)),
    amenities: splitLines(extractText(props.Amenities))
  }
}

const toActivity = (page: any): ActivityContent => {
  const props = page.properties ?? {}
  return {
    id: page.id,
    title: extractText(props.Title),
    description: extractText(props.Description),
    amount: props.Amount?.number ?? 0,
    startsAt: extractDate(props['Starts At']),
    endsAt: extractDate(props['Ends At'])
  }
}

const toPolicy = (page: any): PolicyContent => {
  const props = page.properties ?? {}
  return {
    id: page.id,
    title: extractText(props.Title),
    type: props.Type?.select?.name ?? 'notice',
    content: extractText(props.Content),
    sort: props.Sort?.number ?? 0
  }
}

const toBooking = (page: any): BookingRecord => {
  const props = page.properties ?? {}
  return {
    id: page.id,
    bookingNo: extractText(props['Booking No']),
    status: (props.Status?.select?.name ?? 'pending_remittance') as BookingRecord['status'],
    roomSlug: extractText(props['Room Slug']),
    checkIn: extractDate(props['Check In']),
    checkOut: extractDate(props['Check Out']),
    nights: props.Nights?.number ?? 0,
    guests: props.Guests?.number ?? 1,
    amount: props.Amount?.number ?? 0,
    guestName: extractText(props['Guest Name']),
    email: props.Email?.email ?? '',
    phone: props.Phone?.phone_number ?? '',
    lineUserId: extractText(props['Line User ID']),
    paymentMethod: props['Payment Method']?.select?.name ?? '',
    remittanceNote: extractText(props['Remittance Note']),
    createdAt: extractDate(props['Created At']),
    lastEditedAt: typeof page.last_edited_time === 'string' ? page.last_edited_time : ''
  }
}

export class NotionRepository {
  private notion: Client
  private db: NotionDatabaseIds

  constructor(apiKey: string, dbIds: NotionDatabaseIds) {
    this.notion = new Client({ auth: apiKey })
    this.db = dbIds
  }

  async getRooms(): Promise<RoomContent[]> {
    const response = await this.notion.databases.query({
      database_id: this.db.roomsDbId,
      filter: { property: 'Is Active', checkbox: { equals: true } },
      sorts: [{ property: 'Sort', direction: 'ascending' }]
    })

    return response.results.map(toRoom).filter((room) => room.slug)
  }

  async getActivities(): Promise<ActivityContent[]> {
    const response = await this.notion.databases.query({
      database_id: this.db.activitiesDbId,
      filter: { property: 'Is Active', checkbox: { equals: true } },
      sorts: [{ property: 'Sort', direction: 'ascending' }]
    })

    return response.results.map(toActivity)
  }

  async getPolicies(): Promise<PolicyContent[]> {
    const response = await this.notion.databases.query({
      database_id: this.db.policiesDbId,
      filter: { property: 'Is Active', checkbox: { equals: true } },
      sorts: [{ property: 'Sort', direction: 'ascending' }]
    })

    return response.results.map(toPolicy)
  }

  async createBooking(input: BookingInput): Promise<BookingRecord> {
    const now = new Date()
    const bookingNo = `BK${now.toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const response = await this.notion.pages.create({
      parent: { database_id: this.db.bookingsDbId },
      properties: {
        'Booking No': { title: [{ text: { content: bookingNo } }] },
        Status: { select: { name: 'pending_remittance' } },
        'Room Slug': { rich_text: [{ text: { content: input.roomSlug } }] },
        'Check In': { date: { start: input.checkIn } },
        'Check Out': { date: { start: input.checkOut } },
        Nights: { number: input.nights },
        Guests: { number: input.guests },
        Amount: { number: input.amount },
        'Guest Name': { rich_text: [{ text: { content: input.guestName } }] },
        Email: { email: input.email },
        Phone: { phone_number: input.phone },
        'Line User ID': { rich_text: [{ text: { content: input.lineUserId } }] },
        'Payment Method': { select: { name: input.paymentMethod } },
        'Remittance Note': { rich_text: [{ text: { content: input.remittanceNote ?? '' } }] },
        'Created At': { date: { start: now.toISOString().slice(0, 10) } }
      }
    })

    return toBooking(response)
  }

  async getBookingsByLineUserId(lineUserId: string): Promise<BookingRecord[]> {
    const response = await this.notion.databases.query({
      database_id: this.db.bookingsDbId,
      filter: {
        property: 'Line User ID',
        rich_text: { contains: lineUserId }
      },
      sorts: [{ property: 'Created At', direction: 'descending' }]
    })

    return response.results.map(toBooking)
  }

  async listBookingsForStatusSync(limit = 100): Promise<BookingRecord[]> {
    const response = await this.notion.databases.query({
      database_id: this.db.bookingsDbId,
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
      page_size: limit
    })

    return response.results.map(toBooking)
  }

  async getBookingById(pageId: string): Promise<BookingRecord> {
    const response = await this.notion.pages.retrieve({
      page_id: pageId
    })

    return toBooking(response)
  }

  async updateBookingStatus(pageId: string, status: BookingStatus, remittanceNote?: string): Promise<BookingRecord> {
    const response = await this.notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: status } },
        ...(typeof remittanceNote === 'string'
          ? {
              'Remittance Note': { rich_text: [{ text: { content: remittanceNote } }] }
            }
          : {})
      }
    })

    return toBooking(response)
  }
}
