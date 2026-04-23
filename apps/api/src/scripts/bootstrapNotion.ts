import { Client } from '@notionhq/client'
import { z } from 'zod'
import { REQUIRED_DATABASE_SPECS } from '../notion/schema.js'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_PARENT_PAGE_ID: z.string().min(1)
})

const env = envSchema.parse(process.env)

const notion = new Client({ auth: env.NOTION_API_KEY })

const normalize = (value: string) => value.replaceAll('-', '')

const run = async () => {
  const result: Record<string, string> = {}

  for (const spec of REQUIRED_DATABASE_SPECS) {
    const created = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: normalize(env.NOTION_PARENT_PAGE_ID)
      },
      title: [{ type: 'text', text: { content: spec.title } }],
      // Notion SDK type is narrower; runtime accepts this structure.
      properties: spec.properties as any
    })

    result[spec.title] = created.id
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

run().catch((error) => {
  console.error('[bootstrap-notion] failed:', error)
  process.exit(1)
})
