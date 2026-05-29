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

## 下一步：進入 Clerk 登入

進入 Clerk 階段時分兩步，和總 README 的流程一致。

### 第一步：先做 Clerk 平台設定

請學生先登入 Clerk，建立或選擇自己的 Clerk application，然後使用 Clerk 平台提供的 setup prompt 或安裝指示（會協助安裝 `@clerk/nextjs`、加入環境變數、`ClerkProvider`、登入／註冊頁，以及 Next.js middleware/proxy 設定）。學生不需要自己手寫那一大段 setup prompt，可以直接從 Clerk 平台複製。

### 第二步：把登入接進課程平台

Clerk 初始設定完成後，使用這段 prompt：

```text
Clerk has already been set up in this project.

Please help me connect Clerk login to this app, and add a simple database to save user information.

I want users to clearly see Sign in, Sign up, and their profile button after logging in.

When a user logs in, please save their basic user information in the database.

Also make sure course data is stored in the database instead of only being hard-coded in the app.

Please prepare the database structure we will need later for payment:
- A table for Stripe checkout purchase records.
- A table that connects users to courses they have purchased.

On the course page:
- If the user is not logged in, ask them to sign in before purchasing or unlocking the video.
- If the user is logged in, show that they are signed in and let them see the purchase button.
- Do not add payment yet. This step is only for user login and saving user data.

Please finish the integration, test that it works, and tell me what changed.
```
