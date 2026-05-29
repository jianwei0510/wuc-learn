# WUC Learn 培訓筆記：Clerk 登入階段

這個分支是第 2 個進度：在原始課程平台上加入 Clerk 登入，並把使用者與課程資料存進本機 SQLite 資料庫。

## 目前完成內容

- 課程首頁與課程詳情頁已建立。
- 課程資料已存進 SQLite 的 `courses` 資料表，頁面會從資料庫讀取課程。
- 已加入 Clerk 登入、註冊與使用者選單。
- 使用者登入後，基本資料會存進 `users` 資料表。
- 課程頁會依照登入狀態顯示不同提示。
- 付款尚未加入，會在下一個進度分支處理。

## 明天課程中的位置

建議教學順序：

1. 從 `01-tcm-platform-scaffold` 看原始平台。
2. 進入這個分支，先完成 Clerk 登入與使用者資料庫。
3. 登入完成後，再進入 `03-tcm-platform-stripe-payment` 加入 Stripe 付款。

## Clerk Setup Prompt 來源

第一段比較長的 Clerk setup prompt 由 Clerk 平台提供。學生登入 Clerk、建立或選擇 Clerk application 後，可以直接使用 Clerk 給的安裝指示或 prompt。

Clerk 提供的提示通常會協助完成：

- 安裝或更新 Clerk CLI。
- 登入 Clerk。
- 連接正確的 Clerk application。
- 安裝 `@clerk/nextjs`。
- 加入 Clerk 環境變數。
- 加入 `ClerkProvider`、登入頁、註冊頁，以及 Next.js middleware/proxy 設定。
- 執行 Clerk 檢查。

學生不需要自己手寫那一大段 Clerk setup prompt，可以直接從 Clerk 平台複製。

## 把登入接進課程平台

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

## 下一步

下一個進度分支會加入 Stripe。請先確認這個分支的登入流程與資料庫寫入都正常，再開始付款整合。
