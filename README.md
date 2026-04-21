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
