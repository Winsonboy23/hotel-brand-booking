# 新客戶 Onboarding（單品牌）

## 1. 客戶需提供資料
- Notion Integration Token（Internal Integration）
- Notion parent page（並已分享給 integration）
- LINE Login：Channel ID / Channel Secret / Callback URL
- Google OAuth：Client ID / Client Secret / Refresh Token / Callback URL
- Gmail 發信帳號（`GOOGLE_GMAIL_SENDER`）
- 客服通知信箱（`GOOGLE_ADMIN_NOTIFY_EMAIL`）

## 2. 初始化流程
1. 設定 `.env`（參考 `.env.example`）。
2. 執行一鍵初始化：
   - `npm run setup:single-brand --workspace @hotel/api`
3. 若輸出包含新建 DB IDs，回填至 `.env`：
   - `NOTION_ROOMS_DB_ID`
   - `NOTION_ACTIVITIES_DB_ID`
   - `NOTION_POLICIES_DB_ID`
   - `NOTION_BOOKINGS_DB_ID`
4. 若建立 Google Calendar，回填 `GOOGLE_CALENDAR_ID`。

## 3. 上線前檢查
- `/health` 顯示 notion/line/google 都為 `true`
- `GET /api/site/content` 回傳 Notion 資料
- `POST /api/site/content/revalidate` 可成功刷新
- `POST /api/jobs/sync-booking-status` 可成功執行

## 4. 建議排程
- 每 3~5 分鐘執行一次 `POST /api/jobs/sync-booking-status`
