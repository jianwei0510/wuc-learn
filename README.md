# WUC Learn 培訓筆記

這個專案是明天課程會用到的 Next.js 線上課程平台範例。培訓順序會先完成使用者登入與資料庫儲存，再加入付款。

## 目前進度

1. `01-tcm-platform-scaffold`
   - 建立原始課程平台畫面。
   - 課程資料已存進本機 SQLite 資料庫。
   - 尚未加入登入與付款。

2. `02-tcm-platform-clerk-auth`
   - 加入 Clerk 登入、註冊與使用者選單。
   - 使用者登入後，基本資料會存進本機 SQLite 資料庫。
   - 課程資料仍由資料庫讀取。
   - 尚未加入付款。

3. `03-tcm-platform-stripe-payment`
   - 在 Clerk 登入完成後加入 Stripe 付款流程。
   - 使用者付款成功後，系統會驗證 Stripe Checkout Session。
   - 成功購買會寫入 `course_purchases`，課程觀看權限會寫入 `course_access`。
   - `/my-courses` 會顯示使用者已購買的課程。

## 明天課程建議流程

### 第一步：先做 Clerk 登入

請學生先登入 Clerk，建立或選擇自己的 Clerk application，然後使用 Clerk 平台提供的 setup prompt 或安裝指示。

Clerk 提供的提示通常會協助完成：

- 安裝或更新 Clerk CLI。
- 登入 Clerk。
- 連接正確的 Clerk application。
- 安裝 `@clerk/nextjs`。
- 加入 Clerk 需要的環境變數。
- 加入 `ClerkProvider`、登入頁、註冊頁，以及 Next.js middleware/proxy 設定。
- 執行 Clerk 檢查。

學生不需要自己手寫那一大段 Clerk setup prompt，可以直接從 Clerk 平台複製。

### 第二步：把登入接進課程平台

Clerk 初始設定完成後，再使用這段比較短的 prompt：

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

## Stripe 付款設定

登入與本機使用者資料庫都完成後，才進入 Stripe。

這個專案支援兩種 Stripe 教學方式：

1. Payment Links：最適合課堂示範，學生不需要使用 Stripe CLI。
2. Stripe Checkout Sessions + webhooks：比較接近正式產品流程，可當作進階補充。

明天培訓建議使用 **Payment Links + success redirect + server-side session verification**。這樣可以示範真實付款與課程解鎖，但不需要把 webhook 當成第一天必做內容。

需要的環境變數：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_...
```

選用的 webhook 環境變數：

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Stripe Dashboard 設定

請使用 Stripe test mode。

1. 開啟 Stripe Dashboard。
2. 打開 **Test mode**。
3. 進入 **Developers** -> **API keys**。
4. 複製 **Secret key**。
5. 放進 `.env.local`：

```env
STRIPE_SECRET_KEY=sk_test_...
```

請使用 `sk_test_` 開頭的 Secret key。不要把正式金鑰放進培訓筆記，也不要把密鑰 commit 到 Git。

### Payment Link 設定

在 Stripe Dashboard 建立 Payment Link：

1. 進入 **Payment Links**。
2. 為課程建立 product。
3. 設定課程價格，例如 `$49 USD`。
4. 在付款完成後設定 redirect。
5. 完成後導回：

```text
http://localhost:3000/checkout/complete?courseSlug=acupuncture-fundamentals&session_id={CHECKOUT_SESSION_ID}
```

再把 Payment Link URL 放進 `.env.local`：

```env
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_...
```

目前第一堂課使用的測試 Payment Link：

```env
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_28E3cv9EK1qU8JPa0X5Rm00
```

### Payment Link 流程

1. 已登入的使用者點擊 Purchase。
2. App 將使用者送到 Stripe Payment Link。
3. Stripe 完成付款後導回 `/checkout/complete`，並帶上 `session_id`。
4. App 用 `STRIPE_SECRET_KEY` 到 Stripe 伺服器驗證 Checkout Session。
5. App 確認付款狀態、金額、幣別、課程與登入使用者。
6. 驗證成功後，寫入 `course_purchases` 與 `course_access`。
7. 使用者可以在 `/my-courses` 看到已購買課程。

這比 webhook 流程更適合第一天課堂。限制是：使用者必須付款後回到 App，權限才會被解鎖。正式產品建議再加上 webhook。

### 測試卡號

成功付款：

```text
4242 4242 4242 4242
```

其他欄位可以使用任意未來日期、任意 3 位 CVC、任意 5 位 ZIP。

付款失敗測試：

```text
4000 0000 0000 0002
```

3D Secure 測試：

```text
4000 0025 0000 3155
```

## Stripe 整合 Prompt

Clerk 登入與本機資料庫都完成後，再使用這段 prompt：

```text
This project already has Clerk authentication, a local SQLite user database, and course data stored in the database.

Please add the simplest Stripe payment flow for a classroom demo.

Use Stripe Payment Links instead of requiring students to use the Stripe CLI.

Requirements:
- A signed-in user should be able to click Purchase on a course.
- The app should redirect to the Stripe Payment Link for that course.
- After payment, Stripe should redirect back to the app with a Checkout Session ID.
- The app should verify the Checkout Session on the server using the Stripe secret key.
- Only grant course access after verifying the payment status, amount, currency, course, and signed-in user.
- Store successful purchases in the database.
- Add a My courses page where users can see courses they already purchased.
- Keep webhook support as an optional production upgrade, but do not make it required for the local training demo.

Please implement it, update README with the setup steps, and test that the app builds.
```

## 選用：Webhook 進階流程

如果要在本機測試 webhook，可以使用 Stripe CLI：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

把 CLI 顯示的 `whsec_...` 放進 `STRIPE_WEBHOOK_SECRET`，然後重新啟動開發伺服器。

Webhook 流程：

1. 已登入的使用者點擊 Purchase。
2. Server 建立 Stripe Checkout Session。
3. `course_purchases` 先寫入 pending 紀錄。
4. Stripe 導向 Checkout。
5. Stripe 發送 `checkout.session.completed` 到 `/api/stripe/webhook`。
6. Webhook 將購買紀錄改成 paid，並寫入 `course_access`。
