import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NotionRepository } from './repositories/notion/notionRepository.js'
import type { BookingRecord, NotionDatabaseIds } from './repositories/notion/types.js'
import { GoogleWorkspaceService } from './integrations/googleWorkspace.js'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: true,
  credentials: true
})

const notionEnvSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_ROOMS_DB_ID: z.string().min(1),
  NOTION_ACTIVITIES_DB_ID: z.string().min(1),
  NOTION_POLICIES_DB_ID: z.string().min(1),
  NOTION_BOOKINGS_DB_ID: z.string().min(1)
})

const lineEnvSchema = z.object({
  LINE_CHANNEL_ID: z.string().min(1),
  LINE_CHANNEL_SECRET: z.string().min(1),
  LINE_CALLBACK_URL: z.string().url()
})

const googleEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_GMAIL_SENDER: z.string().email(),
  GOOGLE_CALENDAR_ID: z.string().min(1),
  GOOGLE_ADMIN_NOTIFY_EMAIL: z.string().email().optional()
})

const promotionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(''),
  amount: z.number().int().min(0),
  startsAt: z.string().date(),
  endsAt: z.string().date(),
  isActive: z.boolean(),
  sortOrder: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string()
})

const remittanceSchema = z.object({
  id: z.string().min(1),
  bookingId: z.string().min(1),
  transferLastFive: z.string().regex(/^\d{5}$/),
  transferAt: z.string().min(1),
  note: z.string().default(''),
  createdAt: z.string()
})

type Promotion = z.infer<typeof promotionSchema>
type Remittance = z.infer<typeof remittanceSchema>

const dir = dirname(fileURLToPath(import.meta.url))
const dataDir = join(dir, '..', 'data')
const promotionsFile = join(dataDir, 'promotions.json')
const remittancesFile = join(dataDir, 'remittances.json')
const bookingStatusCacheFile = join(dataDir, 'booking-status-cache.json')

const notionConfig = notionEnvSchema.safeParse(process.env)
const notionRepository = notionConfig.success
  ? new NotionRepository(notionConfig.data.NOTION_API_KEY, {
      roomsDbId: notionConfig.data.NOTION_ROOMS_DB_ID,
      activitiesDbId: notionConfig.data.NOTION_ACTIVITIES_DB_ID,
      policiesDbId: notionConfig.data.NOTION_POLICIES_DB_ID,
      bookingsDbId: notionConfig.data.NOTION_BOOKINGS_DB_ID
    } satisfies NotionDatabaseIds)
  : null

const lineConfig = lineEnvSchema.safeParse(process.env)
const lineLoginStateStore = new Map<string, { redirectUri: string; createdAt: number }>()

const googleConfig = googleEnvSchema.safeParse(process.env)
const googleWorkspaceService = googleConfig.success
  ? new GoogleWorkspaceService({
      clientId: googleConfig.data.GOOGLE_CLIENT_ID,
      clientSecret: googleConfig.data.GOOGLE_CLIENT_SECRET,
      redirectUri: googleConfig.data.GOOGLE_CALLBACK_URL,
      refreshToken: googleConfig.data.GOOGLE_REFRESH_TOKEN,
      sender: googleConfig.data.GOOGLE_GMAIL_SENDER,
      calendarId: googleConfig.data.GOOGLE_CALENDAR_ID,
      adminNotifyEmail: googleConfig.data.GOOGLE_ADMIN_NOTIFY_EMAIL
    })
  : null

const seedPromotions: Promotion[] = [
  {
    id: 'promo-spring-2026',
    title: '春季住房優惠',
    description: '平日入住現折 NT$1,200',
    amount: 1200,
    startsAt: '2026-04-01',
    endsAt: '2026-06-30',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const ensureDataFiles = async () => {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(promotionsFile, 'utf8')
  } catch {
    await writeFile(promotionsFile, JSON.stringify(seedPromotions, null, 2), 'utf8')
  }

  try {
    await readFile(remittancesFile, 'utf8')
  } catch {
    await writeFile(remittancesFile, JSON.stringify([], null, 2), 'utf8')
  }

  try {
    await readFile(bookingStatusCacheFile, 'utf8')
  } catch {
    await writeFile(bookingStatusCacheFile, JSON.stringify({}, null, 2), 'utf8')
  }
}

const readPromotions = async (): Promise<Promotion[]> => {
  const raw = await readFile(promotionsFile, 'utf8')
  const parsed = z.array(promotionSchema).safeParse(JSON.parse(raw))
  return parsed.success ? parsed.data : []
}

const writePromotions = async (promotions: Promotion[]) => {
  await writeFile(promotionsFile, JSON.stringify(promotions, null, 2), 'utf8')
}

const readRemittances = async (): Promise<Remittance[]> => {
  const raw = await readFile(remittancesFile, 'utf8')
  const parsed = z.array(remittanceSchema).safeParse(JSON.parse(raw))
  return parsed.success ? parsed.data : []
}

const writeRemittances = async (rows: Remittance[]) => {
  await writeFile(remittancesFile, JSON.stringify(rows, null, 2), 'utf8')
}

type BookingStatusCache = Record<string, { status: BookingRecord['status']; lastEditedAt: string }>

const readBookingStatusCache = async (): Promise<BookingStatusCache> => {
  try {
    const raw = await readFile(bookingStatusCacheFile, 'utf8')
    const parsed = z.record(z.object({ status: z.string(), lastEditedAt: z.string() })).safeParse(JSON.parse(raw))
    return parsed.success ? (parsed.data as BookingStatusCache) : {}
  } catch {
    return {}
  }
}

const writeBookingStatusCache = async (cache: BookingStatusCache) => {
  await writeFile(bookingStatusCacheFile, JSON.stringify(cache, null, 2), 'utf8')
}

const today = () => new Date().toISOString().slice(0, 10)
const inRange = (value: string, from: string, to: string) => value >= from && value <= to

const requireNotionRepository = (reply: any) => {
  if (notionRepository) return notionRepository
  reply.code(500).send({
    message:
      'Notion repository is not configured. Set NOTION_API_KEY and NOTION_*_DB_ID environment variables.'
  })
  return null
}

const requireLineConfig = (reply: any) => {
  if (lineConfig.success) return lineConfig.data
  reply.code(500).send({
    message: 'LINE login is not configured. Set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, LINE_CALLBACK_URL.'
  })
  return null
}

const requireGoogleWorkspaceService = (reply: any) => {
  if (googleWorkspaceService) return googleWorkspaceService
  reply.code(500).send({
    message:
      'Google Workspace service is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_GMAIL_SENDER and GOOGLE_CALENDAR_ID.'
  })
  return null
}

app.get('/health', async () => ({
  ok: true,
  notionConfigured: Boolean(notionRepository),
  lineConfigured: lineConfig.success,
  googleConfigured: googleConfig.success
}))

app.get('/api/auth/line/login-url', async (request, reply) => {
  const line = requireLineConfig(reply)
  if (!line) return

  const query = z
    .object({
      redirectUri: z.string().url()
    })
    .safeParse(request.query)

  if (!query.success) {
    return reply.code(400).send({ message: 'redirectUri is required' })
  }

  const state = crypto.randomUUID()
  lineLoginStateStore.set(state, {
    redirectUri: query.data.redirectUri,
    createdAt: Date.now()
  })

  const authUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', line.LINE_CHANNEL_ID)
  authUrl.searchParams.set('redirect_uri', line.LINE_CALLBACK_URL)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('scope', 'profile openid')

  return { url: authUrl.toString() }
})

app.get('/api/auth/line/callback', async (request, reply) => {
  const line = requireLineConfig(reply)
  if (!line) return

  const query = z
    .object({
      code: z.string().min(1),
      state: z.string().min(1)
    })
    .safeParse(request.query)

  if (!query.success) {
    return reply.code(400).send({ message: 'Invalid LINE callback query' })
  }

  const statePayload = lineLoginStateStore.get(query.data.state)
  if (!statePayload) {
    return reply.code(400).send({ message: 'Invalid or expired LINE state' })
  }

  lineLoginStateStore.delete(query.data.state)
  if (Date.now() - statePayload.createdAt > 10 * 60 * 1000) {
    return reply.code(400).send({ message: 'LINE state expired' })
  }

  const tokenBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: query.data.code,
    redirect_uri: line.LINE_CALLBACK_URL,
    client_id: line.LINE_CHANNEL_ID,
    client_secret: line.LINE_CHANNEL_SECRET
  })

  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody.toString()
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    request.log.error({ status: tokenRes.status, text }, 'line token exchange failed')
    return reply.code(502).send({ message: 'LINE token exchange failed' })
  }

  const tokenJson = (await tokenRes.json()) as { access_token: string }
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` }
  })

  if (!profileRes.ok) {
    const text = await profileRes.text()
    request.log.error({ status: profileRes.status, text }, 'line profile fetch failed')
    return reply.code(502).send({ message: 'LINE profile fetch failed' })
  }

  const profile = (await profileRes.json()) as { userId: string; displayName: string }
  const nextUrl = new URL(statePayload.redirectUri)
  nextUrl.searchParams.set('line_user_id', profile.userId)
  nextUrl.searchParams.set('line_display_name', profile.displayName)

  return reply.redirect(nextUrl.toString())
})

app.get('/api/site/content', async (request, reply) => {
  const repo = requireNotionRepository(reply)
  if (!repo) return

  const [rooms, activities, policies] = await Promise.all([
    repo.getRooms(),
    repo.getActivities(),
    repo.getPolicies()
  ])

  return { rooms, activities, policies }
})

app.post('/api/bookings', async (request, reply) => {
  const repo = requireNotionRepository(reply)
  if (!repo) return

  const schema = z.object({
    roomSlug: z.string().min(1),
    checkIn: z.string().date(),
    checkOut: z.string().date(),
    nights: z.coerce.number().int().min(1),
    guests: z.coerce.number().int().min(1),
    amount: z.coerce.number().int().min(0),
    guestName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    lineUserId: z.string().min(1),
    paymentMethod: z.enum(['bank_transfer', 'onsite_card_hold']),
    remittanceNote: z.string().optional().default('')
  })

  const parsed = schema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const booking = await repo.createBooking(parsed.data)

  const cache = await readBookingStatusCache()
  cache[booking.id] = { status: booking.status, lastEditedAt: booking.lastEditedAt }
  await writeBookingStatusCache(cache)

  if (googleWorkspaceService) {
    try {
      await googleWorkspaceService.notifyBookingCreated(booking)
    } catch (error) {
      request.log.error({ error, bookingId: booking.id }, 'failed to send booking created notifications')
    }
  }

  return reply.code(201).send({ status: 'submitted', data: booking })
})

app.get('/api/bookings/me', async (request, reply) => {
  const repo = requireNotionRepository(reply)
  if (!repo) return

  const query = z.object({ lineUserId: z.string().min(1) }).safeParse(request.query)
  if (!query.success) {
    return reply.code(400).send({ message: 'lineUserId is required' })
  }

  const rows = await repo.getBookingsByLineUserId(query.data.lineUserId)
  return rows
})

app.post('/api/jobs/sync-booking-status', async (request, reply) => {
  const repo = requireNotionRepository(reply)
  if (!repo) return
  const googleService = requireGoogleWorkspaceService(reply)
  if (!googleService) return

  const expectedToken = process.env.JOB_SYNC_TOKEN?.trim()
  if (expectedToken) {
    const provided = (request.headers['x-job-token'] ?? '').toString()
    if (provided !== expectedToken) {
      return reply.code(401).send({ message: 'Unauthorized job token' })
    }
  }

  const bookings = await repo.listBookingsForStatusSync(100)
  const cache = await readBookingStatusCache()
  let changed = 0

  for (const booking of bookings) {
    const previous = cache[booking.id]

    if (!previous) {
      cache[booking.id] = { status: booking.status, lastEditedAt: booking.lastEditedAt }
      continue
    }

    if (previous.status !== booking.status && ['remitted', 'confirmed', 'cancelled'].includes(booking.status)) {
      try {
        await googleService.notifyBookingStatusChanged(booking, previous.status)
        changed += 1
      } catch (error) {
        request.log.error(
          { error, bookingId: booking.id, from: previous.status, to: booking.status },
          'failed to send status changed notification'
        )
      }
    }

    cache[booking.id] = { status: booking.status, lastEditedAt: booking.lastEditedAt }
  }

  await writeBookingStatusCache(cache)
  return { synced: bookings.length, changed }
})

app.get('/api/promotions/recent', async () => {
  const promotions = await readPromotions()
  const now = today()

  return promotions
    .filter((promotion) => promotion.isActive && inRange(now, promotion.startsAt, promotion.endsAt))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.startsAt.localeCompare(b.startsAt))
})

app.get('/api/admin/promotions', async () => {
  const promotions = await readPromotions()
  return promotions.sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt))
})

app.post('/api/admin/promotions', async (request, reply) => {
  const schema = z.object({
    title: z.string().min(1),
    description: z.string().default(''),
    amount: z.coerce.number().int().min(0),
    startsAt: z.string().date(),
    endsAt: z.string().date(),
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number().int().default(0)
  })

  const parsed = schema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const now = new Date().toISOString()
  const promotions = await readPromotions()
  const newPromotion: Promotion = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: now,
    updatedAt: now
  }

  promotions.push(newPromotion)
  await writePromotions(promotions)

  return reply.code(201).send(newPromotion)
})

app.put('/api/admin/promotions/:id', async (request, reply) => {
  const params = z.object({ id: z.string().min(1) }).safeParse(request.params)
  const body = z
    .object({
      title: z.string().min(1),
      description: z.string().default(''),
      amount: z.coerce.number().int().min(0),
      startsAt: z.string().date(),
      endsAt: z.string().date(),
      isActive: z.boolean(),
      sortOrder: z.coerce.number().int().default(0)
    })
    .safeParse(request.body)

  if (!params.success || !body.success) {
    return reply.code(400).send({ message: 'Invalid payload' })
  }

  const promotions = await readPromotions()
  const target = promotions.find((promotion) => promotion.id === params.data.id)

  if (!target) {
    return reply.code(404).send({ message: 'Promotion not found' })
  }

  Object.assign(target, body.data, { updatedAt: new Date().toISOString() })
  await writePromotions(promotions)

  return target
})

app.delete('/api/admin/promotions/:id', async (request, reply) => {
  const params = z.object({ id: z.string().min(1) }).safeParse(request.params)
  if (!params.success) {
    return reply.code(400).send({ message: 'Invalid params' })
  }

  const promotions = await readPromotions()
  const nextRows = promotions.filter((promotion) => promotion.id !== params.data.id)

  if (nextRows.length === promotions.length) {
    return reply.code(404).send({ message: 'Promotion not found' })
  }

  await writePromotions(nextRows)
  return reply.code(204).send()
})

app.get('/api/admin/remittance-submissions', async () => {
  const rows = await readRemittances()
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})

app.post('/api/remittance-submissions', async (request, reply) => {
  const schema = z.object({
    bookingId: z.string().min(1),
    transferLastFive: z.string().regex(/^\d{5}$/),
    transferAt: z.string().min(1),
    note: z.string().optional().default('')
  })

  const parsed = schema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({ message: 'Invalid payload', errors: parsed.error.flatten() })
  }

  const rows = await readRemittances()
  const entry: Remittance = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString()
  }

  rows.push(entry)
  await writeRemittances(rows)

  return reply.code(201).send({ status: 'submitted', data: entry })
})

await ensureDataFiles()

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '0.0.0.0'

app.listen({ port, host })
