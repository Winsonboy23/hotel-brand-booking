import { Client } from '@notionhq/client'
import { z } from 'zod'
import { seedNotionDemoData } from '../notion/demoSeeder.js'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_ROOMS_DB_ID: z.string().min(1),
  NOTION_ACTIVITIES_DB_ID: z.string().min(1),
  NOTION_POLICIES_DB_ID: z.string().min(1),
  NOTION_BOOKINGS_DB_ID: z.string().min(1)
})

const env = envSchema.parse(process.env)
const notion = new Client({ auth: env.NOTION_API_KEY })
const shouldClear = process.env.NOTION_SEED_CLEAR !== '0'

const run = async () => {
  const result = await seedNotionDemoData(
    notion,
    {
      roomsDbId: env.NOTION_ROOMS_DB_ID,
      activitiesDbId: env.NOTION_ACTIVITIES_DB_ID,
      policiesDbId: env.NOTION_POLICIES_DB_ID,
      bookingsDbId: env.NOTION_BOOKINGS_DB_ID
    },
    { clear: shouldClear }
  )

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        clearMode: shouldClear,
        ...result
      },
      null,
      2
    )}\n`
  )
}

run().catch((error) => {
  console.error('[seed-notion-demo] failed:', error)
  process.exit(1)
})
