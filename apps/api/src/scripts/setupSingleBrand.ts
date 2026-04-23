import { Client } from '@notionhq/client'
import { z } from 'zod'
import { bootstrapNotionDatabases } from '../notion/bootstrapDatabases.js'
import { seedNotionDemoData } from '../notion/demoSeeder.js'
import { createGoogleCalendar } from '../integrations/googleCalendarSetup.js'

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && value.trim() === '') return undefined
    return value
  }, schema.optional())

const setupEnvSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_PARENT_PAGE_ID: emptyToUndefined(z.string().min(1)),
  NOTION_ROOMS_DB_ID: emptyToUndefined(z.string().min(1)),
  NOTION_ACTIVITIES_DB_ID: emptyToUndefined(z.string().min(1)),
  NOTION_POLICIES_DB_ID: emptyToUndefined(z.string().min(1)),
  NOTION_BOOKINGS_DB_ID: emptyToUndefined(z.string().min(1)),
  GOOGLE_CLIENT_ID: emptyToUndefined(z.string().min(1)),
  GOOGLE_CLIENT_SECRET: emptyToUndefined(z.string().min(1)),
  GOOGLE_CALLBACK_URL: emptyToUndefined(z.string().url()),
  GOOGLE_REFRESH_TOKEN: emptyToUndefined(z.string().min(1)),
  GOOGLE_CALENDAR_SUMMARY: emptyToUndefined(z.string().min(1)),
  GOOGLE_CALENDAR_TIMEZONE: emptyToUndefined(z.string().min(1)),
  SETUP_DRY_RUN: z.string().optional(),
  SETUP_SEED_DEMO: z.string().optional(),
  SETUP_CLEAR_BEFORE_SEED: z.string().optional(),
  SETUP_BOOTSTRAP_GOOGLE_CALENDAR: z.string().optional()
})

const env = setupEnvSchema.parse(process.env)

const isEnabled = (value: string | undefined, defaultValue: boolean) => {
  if (value == null) return defaultValue
  return value === '1' || value.toLowerCase() === 'true'
}

const run = async () => {
  const dryRun = isEnabled(env.SETUP_DRY_RUN, false)
  const seedDemo = isEnabled(env.SETUP_SEED_DEMO, true)
  const clearBeforeSeed = isEnabled(env.SETUP_CLEAR_BEFORE_SEED, true)
  const bootstrapGoogleCalendar = isEnabled(env.SETUP_BOOTSTRAP_GOOGLE_CALENDAR, false)

  const notion = new Client({ auth: env.NOTION_API_KEY })

  let dbIds = {
    roomsDbId: env.NOTION_ROOMS_DB_ID,
    activitiesDbId: env.NOTION_ACTIVITIES_DB_ID,
    policiesDbId: env.NOTION_POLICIES_DB_ID,
    bookingsDbId: env.NOTION_BOOKINGS_DB_ID
  }

  const hasAllDbIds = Boolean(dbIds.roomsDbId && dbIds.activitiesDbId && dbIds.policiesDbId && dbIds.bookingsDbId)

  const setupResult: Record<string, unknown> = {
    ok: true,
    dryRun,
    usedExistingDatabases: hasAllDbIds,
    seededDemo: false,
    createdGoogleCalendar: false
  }

  if (!hasAllDbIds) {
    if (!env.NOTION_PARENT_PAGE_ID) {
      throw new Error(
        'Missing Notion DB IDs and NOTION_PARENT_PAGE_ID. Provide parent page id to bootstrap databases.'
      )
    }

    if (dryRun) {
      setupResult.bootstrappedDatabases = 'dry-run'
    } else {
      const created = await bootstrapNotionDatabases(notion, env.NOTION_PARENT_PAGE_ID)
      dbIds = created
      setupResult.bootstrappedDatabases = created
      setupResult.usedExistingDatabases = false
    }
  }

  if (!dbIds.roomsDbId || !dbIds.activitiesDbId || !dbIds.policiesDbId || !dbIds.bookingsDbId) {
    throw new Error('Notion database IDs are still incomplete after setup.')
  }

  if (seedDemo) {
    if (dryRun) {
      setupResult.seed = {
        clearBeforeSeed,
        result: 'dry-run'
      }
      setupResult.seededDemo = true
    } else {
      setupResult.seed = await seedNotionDemoData(
        notion,
        {
          roomsDbId: dbIds.roomsDbId,
          activitiesDbId: dbIds.activitiesDbId,
          policiesDbId: dbIds.policiesDbId,
          bookingsDbId: dbIds.bookingsDbId
        },
        { clear: clearBeforeSeed }
      )
      setupResult.seededDemo = true
    }
  }

  if (bootstrapGoogleCalendar) {
    const hasGoogleEnv = Boolean(
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL && env.GOOGLE_REFRESH_TOKEN
    )

    if (!hasGoogleEnv) {
      throw new Error(
        'SETUP_BOOTSTRAP_GOOGLE_CALENDAR is enabled, but GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_CALLBACK_URL / GOOGLE_REFRESH_TOKEN are missing.'
      )
    }

    if (dryRun) {
      setupResult.googleCalendar = {
        summary: env.GOOGLE_CALENDAR_SUMMARY ?? 'Hotel Booking Calendar',
        timeZone: env.GOOGLE_CALENDAR_TIMEZONE ?? 'Asia/Taipei',
        result: 'dry-run'
      }
      setupResult.createdGoogleCalendar = true
    } else {
      setupResult.googleCalendar = await createGoogleCalendar(
        {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
          callbackUrl: env.GOOGLE_CALLBACK_URL!,
          refreshToken: env.GOOGLE_REFRESH_TOKEN!
        },
        env.GOOGLE_CALENDAR_SUMMARY ?? 'Hotel Booking Calendar',
        env.GOOGLE_CALENDAR_TIMEZONE ?? 'Asia/Taipei'
      )
      setupResult.createdGoogleCalendar = true
    }
  }

  setupResult.envSuggestion = {
    NOTION_ROOMS_DB_ID: dbIds.roomsDbId,
    NOTION_ACTIVITIES_DB_ID: dbIds.activitiesDbId,
    NOTION_POLICIES_DB_ID: dbIds.policiesDbId,
    NOTION_BOOKINGS_DB_ID: dbIds.bookingsDbId,
    GOOGLE_CALENDAR_ID:
      typeof setupResult.googleCalendar === 'object' && setupResult.googleCalendar !== null
        ? (setupResult.googleCalendar as any).calendarId ?? '(keep existing)'
        : '(keep existing)'
  }

  process.stdout.write(`${JSON.stringify(setupResult, null, 2)}\n`)
}

run().catch((error) => {
  console.error('[setup-single-brand] failed:', error)
  process.exit(1)
})
