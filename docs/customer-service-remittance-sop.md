# 客服操作 SOP：在 Notion 標記已匯款

## 資料庫
- `Bookings`

## 欄位
- `Status`
- `Remittance Note`

## 合法狀態流程
- `pending_remittance -> remitted -> confirmed`
- 任一階段可改為 `cancelled`
- 不允許跳轉（例如 `pending_remittance -> confirmed`）

## 客服操作步驟
1. 到 Notion `Bookings` 找到對應訂單（`Booking No`）。
2. 確認匯款資訊（末五碼、時間）與預約資料一致。
3. 將 `Status` 從 `pending_remittance` 改為 `remitted`。
4. 在 `Remittance Note` 填入匯款備註（例：`末五碼 34819，2026-04-23 14:15`）。
5. 等待排程呼叫 `sync-booking-status` 後，系統會寄送狀態通知。

## 例外處理
- 若誤改成非法狀態，系統同步時會自動回滾並寫入 `[AUTO-REVERT]` 備註。
- 發生回滾請由客服重新依合法流程調整狀態。
