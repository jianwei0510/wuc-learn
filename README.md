# WUC Learn 培訓筆記：原始平台

這個分支是第 1 個進度：建立一個可以瀏覽課程的 Next.js 課程平台。這裡還沒有使用者登入，也還沒有付款功能。

## 目前完成內容

- 首頁會列出課程。
- 每一堂課都有自己的課程詳情頁。
- 課程頁有鎖定影片的預留區塊。
- 課程資料已存進本機 SQLite 的 `courses` 資料表。
- App 會從資料庫讀取課程，不再只靠程式碼裡的固定陣列。

## 明天課程中的位置

建議先讓學生看這個分支，了解原始 App 長什麼樣子，再進入後續兩個進度：

1. `01-tcm-platform-scaffold`：原始課程平台，課程資料已在資料庫。
2. `02-tcm-platform-clerk-auth`：加入 Clerk 登入與使用者資料儲存。
3. `03-tcm-platform-stripe-payment`：加入 Stripe 付款與課程解鎖。

## 這個階段不要做的事

- 不要加入 Clerk。
- 不要加入 Stripe。
- 不要加入購買紀錄或課程權限邏輯。

這個分支的重點是讓學生先看到一個乾淨的課程平台，並知道課程資料已經由資料庫提供。

## 下一步 Prompt

進入 Clerk 階段時，可以使用這段 prompt：

```text
Please add Clerk login to this course platform.

Users should be able to sign in, sign up, and see their profile button after logging in.

When a user logs in, save their basic user information in the local database.

Keep the existing course data in the database.

Do not add payment yet. This step is only for user login and saving user data.

Please test that the app builds and tell me what changed.
```
