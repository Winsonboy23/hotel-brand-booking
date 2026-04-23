import { google } from 'googleapis'
import { z } from 'zod'

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

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_CALLBACK_URL
)

oauth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN
})

const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

const run = async () => {
  const created = await calendar.calendars.insert({
    requestBody: {
      summary: env.GOOGLE_CALENDAR_SUMMARY,
      timeZone: env.GOOGLE_CALENDAR_TIMEZONE
    }
  })

  const calendarId = created.data.id
  if (!calendarId) {
    throw new Error('Google Calendar created but id is missing.')
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        calendarId,
        summary: created.data.summary,
        timeZone: created.data.timeZone
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
