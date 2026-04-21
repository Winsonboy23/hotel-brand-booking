import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: true,
  credentials: true
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

const today = () => new Date().toISOString().slice(0, 10)
const inRange = (value: string, from: string, to: string) => value >= from && value <= to

app.get('/health', async () => ({ ok: true }))

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
