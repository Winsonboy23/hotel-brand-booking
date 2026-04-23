import { z } from 'zod'
import { createGoogleCalendar } from '../integrations/googleCalendarSetup.js'

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_CALENDAR_SUMMARY: z.string().min(1).default('Hotel Booking Calendar'),
  GOOGLE_CALENDAR_TIMEZONE: z.string().min(1).default('Asia/Taipei')
})

const env = envSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_CALENDAR_SUMMARY: process.env.GOOGLE_CALENDAR_SUMMARY,
  GOOGLE_CALENDAR_TIMEZONE: process.env.GOOGLE_CALENDAR_TIMEZONE
})

const run = async () => {
  const created = await createGoogleCalendar(
    {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackUrl: env.GOOGLE_CALLBACK_URL,
      refreshToken: env.GOOGLE_REFRESH_TOKEN
    },
    env.GOOGLE_CALENDAR_SUMMARY,
    env.GOOGLE_CALENDAR_TIMEZONE
  )

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        ...created
      },
      null,
      2
    )}\n`
  )
}

run().catch((error) => {
  console.error('[bootstrap-google-calendar] failed:', error)
  process.exit(1)
})
