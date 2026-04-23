import { google } from 'googleapis'

export type GoogleCalendarSetupConfig = {
  clientId: string
  clientSecret: string
  callbackUrl: string
  refreshToken: string
}

export const createGoogleCalendar = async (
  config: GoogleCalendarSetupConfig,
  summary: string,
  timeZone: string
) => {
  const oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.callbackUrl)

  oauth2Client.setCredentials({
    refresh_token: config.refreshToken
  })

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const created = await calendar.calendars.insert({
    requestBody: {
      summary,
      timeZone
    }
  })

  const calendarId = created.data.id
  if (!calendarId) {
    throw new Error('Google Calendar created but id is missing.')
  }

  return {
    calendarId,
    summary: created.data.summary,
    timeZone: created.data.timeZone
  }
}
