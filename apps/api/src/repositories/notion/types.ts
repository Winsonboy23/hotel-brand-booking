export type RoomContent = {
  id: string
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

export type ActivityContent = {
  id: string
  title: string
  description: string
  amount: number
  startsAt: string
  endsAt: string
}

export type PolicyContent = {
  id: string
  title: string
  type: string
  content: string
  sort: number
}

export type BookingInput = {
  roomSlug: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  amount: number
  guestName: string
  email: string
  phone: string
  lineUserId: string
  paymentMethod: 'bank_transfer' | 'onsite_card_hold'
  remittanceNote?: string
}

export type BookingStatus = 'pending_remittance' | 'remitted' | 'confirmed' | 'cancelled'

export type BookingRecord = {
  id: string
  bookingNo: string
  status: BookingStatus
  roomSlug: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  amount: number
  guestName: string
  email: string
  phone: string
  lineUserId: string
  paymentMethod: string
  remittanceNote: string
  createdAt: string
  lastEditedAt: string
}

export type NotionDatabaseIds = {
  roomsDbId: string
  activitiesDbId: string
  policiesDbId: string
  bookingsDbId: string
}
