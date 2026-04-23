# UAT / 上線檢查清單

## A. 前台流程
- [ ] 首頁可看到 Notion 房型與活動資料
- [ ] 房型列表可進入房型詳情
- [ ] 房型詳情可正確顯示畫廊與政策
- [ ] 預約頁三步驟流程可完成
- [ ] 未綁定 LINE 時不可送出預約

## B. 預約建立
- [ ] 送出預約後，Notion `Bookings` 新增一筆資料
- [ ] 初始狀態為 `pending_remittance`
- [ ] 客人與客服都有收到建立通知信
- [ ] Google Calendar 成功建立事件

## C. 匯款與狀態
- [ ] 客服將狀態改為 `remitted` 後，sync job 寄出狀態通知
- [ ] 客服將狀態改為 `confirmed` 後，sync job 寄出狀態通知
- [ ] 非法狀態跳轉會被自動回滾

## D. 安全與穩定性
- [ ] 連續快速送單會觸發 rate limit
- [ ] 短時間重複送單會被防重送攔截
- [ ] `site/content` 快取可由 revalidate 端點刷新
- [ ] `sync-booking-status` 有 token 保護（若有設定）
- [ ] 告警 webhook（若有設定）可收到 API 失敗訊息

## E. 交付
- [ ] `.env` 完整且不進版控
- [ ] 客服 SOP 已交付
- [ ] Onboarding 文件已交付
