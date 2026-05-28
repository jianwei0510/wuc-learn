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

這個專案使用 **Payment Links + success redirect + server-side session verification**。這樣可以示範真實付款與課程解鎖，但不需要學生使用 Stripe CLI 或設定 webhook。

需要的環境變數：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
```

Payment Link URL 不放在 `.env.local`，而是存在 SQLite 的 `courses.stripe_payment_link_url` 欄位。

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

再把學生自己建立的 Payment Link URL 放進課程資料庫。這個專案目前在 [lib/db.ts](/Users/wujianwei/WUCA/wuc-learn/lib/db.ts) 的 `courseSeed` 內設定每堂課的 `stripePaymentLinkUrl`。

```ts
stripePaymentLinkUrl: "https://buy.stripe.com/test_..."
```

一開始所有課程都會先是 `null`，代表還沒有設定付款連結：

```ts
stripePaymentLinkUrl: null
```

學生做到付款階段時，請讓他們用自己的 Stripe test mode 建立 Payment Link，再把自己的連結填到對應課程。不要把老師或其他人的 Payment Link 留在專案裡。

### Payment Link 流程

1. 已登入的使用者點擊 Purchase。
2. App 將使用者送到 Stripe Payment Link。
3. Stripe 完成付款後導回 `/checkout/complete`，並帶上 `session_id`。
4. App 用 `STRIPE_SECRET_KEY` 到 Stripe 伺服器驗證 Checkout Session。
5. App 確認付款狀態、金額、幣別、課程與登入使用者。
6. 驗證成功後，寫入 `course_purchases` 與 `course_access`。
7. 使用者可以在 `/my-courses` 看到已購買課程。

限制是：使用者必須付款後回到 App，權限才會被解鎖。這對課堂 demo 足夠，也能避免額外的 webhook 設定。

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
- Store each course's Stripe Payment Link in the course database record, not in environment variables.
- Do not hard-code the instructor's Payment Link. Leave course Payment Links empty until each student creates their own Stripe Payment Link.

Please implement it, update README with the setup steps, and test that the app builds.
```
