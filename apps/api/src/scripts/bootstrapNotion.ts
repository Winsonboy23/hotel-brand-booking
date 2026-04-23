import { Client } from '@notionhq/client'
import { z } from 'zod'
import { bootstrapNotionDatabases } from '../notion/bootstrapDatabases.js'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_PARENT_PAGE_ID: z.string().min(1)
})

const env = envSchema.parse(process.env)

const notion = new Client({ auth: env.NOTION_API_KEY })

const run = async () => {
  const result = await bootstrapNotionDatabases(notion, env.NOTION_PARENT_PAGE_ID)

  process.stdout.write(
    `${JSON.stringify(
      {
        Rooms: result.roomsDbId,
        Activities: result.activitiesDbId,
        Policies: result.policiesDbId,
        Bookings: result.bookingsDbId
      },
      null,
      2
    )}\n`
  )
}

run().catch((error) => {
  console.error('[bootstrap-notion] failed:', error)
  process.exit(1)
})
