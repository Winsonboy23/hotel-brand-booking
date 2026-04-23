import { Client } from '@notionhq/client'
import { REQUIRED_DATABASE_SPECS } from './schema.js'

const normalize = (value: string) => value.replaceAll('-', '')

export type BootstrapNotionDatabasesResult = {
  roomsDbId: string
  activitiesDbId: string
  policiesDbId: string
  bookingsDbId: string
}

export const bootstrapNotionDatabases = async (
  notion: Client,
  parentPageId: string
): Promise<BootstrapNotionDatabasesResult> => {
  const result: Record<string, string> = {}

  for (const spec of REQUIRED_DATABASE_SPECS) {
    const created = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: normalize(parentPageId)
      },
      title: [{ type: 'text', text: { content: spec.title } }],
      // Notion SDK type is narrower; runtime accepts this structure.
      properties: spec.properties as any
    })

    result[spec.title] = created.id
  }

  const roomsDbId = result.Rooms
  const activitiesDbId = result.Activities
  const policiesDbId = result.Policies
  const bookingsDbId = result.Bookings

  if (!roomsDbId || !activitiesDbId || !policiesDbId || !bookingsDbId) {
    throw new Error('Failed to create all required Notion databases (Rooms/Activities/Policies/Bookings).')
  }

  return {
    roomsDbId,
    activitiesDbId,
    policiesDbId,
    bookingsDbId
  }
}
