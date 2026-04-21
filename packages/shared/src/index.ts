export type BookingStatus = 'pending_payment' | 'payment_review' | 'paid' | 'cancelled'

export interface Promotion {
  id: string
  title: string
  amount: number
  startsAt: string
  endsAt: string
  isActive: boolean
}
