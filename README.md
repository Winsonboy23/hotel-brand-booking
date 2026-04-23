# Hotel Brand Booking (Monorepo)

此專案是飯店品牌預約官網 + 後台 + API 的開發起始版。

## Repo Structure
- `apps/web` - Nuxt 3 前台官網（已套用 `perfect-web-clone/homepage-nuxt` 樣式）
- `apps/admin` - Vue 3 + Vite 後台起始頁
- `apps/api` - Fastify API 起始服務（health、活動、匯款提交示例）
- `packages/shared` - 共用型別

## Quick Start
```bash
npm install
npm run dev
```

## Local Infra (optional)
若要本機啟動 Postgres + Redis：
```bash
docker compose up -d
```

## Zeabur Deployment (GitHub)
建議拆成 5 個 Services：
1. `web`（Root: `apps/web`）
   - Install: `npm install`
   - Build: `npm run build --workspace @hotel/web`
   - Start: `npm run preview --workspace @hotel/web -- --host 0.0.0.0 --port $PORT`
2. `admin`（Root: `apps/admin`）
   - Install: `npm install`
   - Build: `npm run build --workspace @hotel/admin`
   - Start: `npm run preview --workspace @hotel/admin -- --host 0.0.0.0 --port $PORT`
3. `api`（Root: `apps/api`）
   - Install: `npm install`
   - Build: `npm run build --workspace @hotel/api`
   - Start: `npm run start --workspace @hotel/api`
4. `postgres`（Zeabur managed service）
5. `redis`（Zeabur managed service）

## Environment Variables
請參考 `.env.example`。

## Notion Bootstrap (Single Brand)
1. 在 Notion 建立一個空白 parent page，並把該 page share 給 integration。
2. 設定環境變數：
   - `NOTION_API_KEY`
   - `NOTION_PARENT_PAGE_ID`
3. 執行：
```bash
npm run notion:bootstrap --workspace @hotel/api
```
4. 指令會輸出四個 DB ID（Rooms / Activities / Policies / Bookings），
   把它們填回環境變數：
   - `NOTION_ROOMS_DB_ID`
   - `NOTION_ACTIVITIES_DB_ID`
   - `NOTION_POLICIES_DB_ID`
   - `NOTION_BOOKINGS_DB_ID`

## Notion-backed API Endpoints
- `GET /api/site/content` - return rooms/activities/policies from Notion
- `POST /api/bookings` - create a booking in Notion (status defaults to `pending_remittance`)
- `GET /api/bookings/me?lineUserId=...` - query bookings by bound LINE user id
- `GET /api/auth/line/login-url?redirectUri=...` - get LINE Login URL
- `GET /api/auth/line/callback` - LINE OAuth callback (redirects back to frontend with line user info)
- `POST /api/jobs/sync-booking-status` - sync booking status changes from Notion and send email notifications

## Google Integration (Email + Calendar)
Required envs:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_GMAIL_SENDER`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_ADMIN_NOTIFY_EMAIL` (optional)

Behavior:
- On booking creation, system sends Gmail notifications and inserts a Google Calendar event.
- `sync-booking-status` job detects status transitions (e.g. `pending_remittance -> remitted`) and sends update emails.
