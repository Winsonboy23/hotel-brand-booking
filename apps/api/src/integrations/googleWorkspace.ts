import { google } from 'googleapis'
import type { BookingRecord } from '../repositories/notion/types.js'

type GoogleWorkspaceConfig = {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken: string
  sender: string
  calendarId: string
  adminNotifyEmail?: string
}

const toBase64Url = (value: string) => Buffer.from(value).toString('base64url')

const statusLabel: Record<BookingRecord['status'], string> = {
  pending_remittance: '待匯款',
  remitted: '已匯款',
  confirmed: '已確認',
  cancelled: '已取消'
}

export class GoogleWorkspaceService {
  private gmail
  private calendar
  private config: GoogleWorkspaceConfig

  constructor(config: GoogleWorkspaceConfig) {
    this.config = config

    const auth = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)
    auth.setCredentials({ refresh_token: config.refreshToken })

    this.gmail = google.gmail({ version: 'v1', auth })
    this.calendar = google.calendar({ version: 'v3', auth })
  }

  private async sendEmail(to: string, subject: string, body: string) {
    const from = this.config.sender
    const raw = toBase64Url([
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      body
    ].join('\n'))

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw }
    })
  }

  async createBookingCalendarEvent(booking: BookingRecord) {
    const summary = `入住：${booking.bookingNo} / ${booking.guestName}`
    const description = [
      `訂單編號：${booking.bookingNo}`,
      `狀態：${statusLabel[booking.status]}`,
      `房型：${booking.roomSlug}`,
      `入住：${booking.checkIn}`,
      `退房：${booking.checkOut}`,
      `夜數：${booking.nights}`,
      `人數：${booking.guests}`,
      `金額：${booking.amount}`,
      `聯絡：${booking.phone} / ${booking.email}`,
      `LINE：${booking.lineUserId}`
    ].join('\n')

    await this.calendar.events.insert({
      calendarId: this.config.calendarId,
      requestBody: {
        summary,
        description,
        start: { date: booking.checkIn },
        end: { date: booking.checkOut }
      }
    })
  }

  async notifyBookingCreated(booking: BookingRecord) {
    const guestSubject = `【HOTEL AURORA】已收到你的預約 ${booking.bookingNo}`
    const guestBody = [
      `${booking.guestName} 您好，`,
      '',
      `我們已收到你的預約申請，訂單編號：${booking.bookingNo}`,
      `房型：${booking.roomSlug}`,
      `入住：${booking.checkIn} 至 ${booking.checkOut}（${booking.nights} 晚）`,
      `預估金額：NT$${booking.amount.toLocaleString('zh-TW')}`,
      `目前狀態：${statusLabel[booking.status]}`,
      '',
      '請依照匯款資訊完成付款，客服將再與你確認。'
    ].join('\n')

    await this.sendEmail(booking.email, guestSubject, guestBody)

    if (this.config.adminNotifyEmail) {
      const adminSubject = `【新預約】${booking.bookingNo} / ${booking.guestName}`
      const adminBody = [
        `訂單編號：${booking.bookingNo}`,
        `狀態：${statusLabel[booking.status]}`,
        `房型：${booking.roomSlug}`,
        `入住：${booking.checkIn} 至 ${booking.checkOut}`,
        `人數：${booking.guests}`,
        `金額：NT$${booking.amount.toLocaleString('zh-TW')}`,
        `聯絡：${booking.phone} / ${booking.email}`,
        `LINE：${booking.lineUserId}`,
        `備註：${booking.remittanceNote || '無'}`
      ].join('\n')
      await this.sendEmail(this.config.adminNotifyEmail, adminSubject, adminBody)
    }

    await this.createBookingCalendarEvent(booking)
  }

  async notifyBookingStatusChanged(booking: BookingRecord, previousStatus: BookingRecord['status']) {
    const subject = `【HOTEL AURORA】訂單 ${booking.bookingNo} 狀態更新`
    const body = [
      `${booking.guestName} 您好，`,
      '',
      `你的訂單狀態已更新：${statusLabel[previousStatus]} → ${statusLabel[booking.status]}`,
      `訂單編號：${booking.bookingNo}`,
      `房型：${booking.roomSlug}`,
      `入住：${booking.checkIn} 至 ${booking.checkOut}`,
      '',
      '如有疑問請直接回覆此信件或聯絡客服。'
    ].join('\n')

    await this.sendEmail(booking.email, subject, body)

    if (this.config.adminNotifyEmail) {
      await this.sendEmail(
        this.config.adminNotifyEmail,
        `【狀態更新】${booking.bookingNo}`,
        `${booking.bookingNo}: ${statusLabel[previousStatus]} -> ${statusLabel[booking.status]}`
      )
    }
  }
}

export type { GoogleWorkspaceConfig }
