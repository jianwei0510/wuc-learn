# WUC Learn Training Notes

This project is used as a teaching app for adding authentication and payment to an existing Next.js application.

## Training Progress

1. Original app
   - No user login.
   - No payment flow.
   - Courses and locked video placeholders are static UI only.

2. Add user authentication with Clerk
   - Install and authenticate with the Clerk CLI.
   - Link the project to the correct Clerk application.
   - Add Clerk to the Next.js App Router app.
   - Add visible sign-in, sign-up, and user profile controls.
   - Connect app UI to the authenticated user state.
   - Store signed-in Clerk user data in a local SQLite database.
   - Prepare database tables for future course purchase records and course access.
   - Keep payment disabled for this step.

3. Add payment
   - This is the next training step.
   - The authenticated user state and user database should already be available before checkout is added.
   - Stripe Payment Links provide the simplest classroom payment demo.
   - The app verifies the returned Stripe Checkout Session before granting course access.
   - Stripe webhooks remain available as the production-style upgrade.

## Stripe Payment Setup

This project supports two Stripe teaching flows:

1. Payment Links for the simplest classroom demo.
2. Stripe-hosted Checkout Sessions plus webhooks for the production-style upgrade.

For tomorrow's training, use **Payment Links + success redirect + server-side session verification** as the main flow. This avoids teaching Stripe CLI or webhook setup to students while still showing a real payment and course unlock workflow.

Required environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_...
```

Optional production-style webhook variable:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Stripe Dashboard Setup

Use Stripe test mode for training.

1. Open Stripe Dashboard.
2. Turn on **Test mode**.
3. Go to **Developers** -> **API keys**.
4. Under **Standard keys**, copy the **Secret key**.
5. Put it in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
```

Use the standard **Secret key** that starts with `sk_test_`. Do not use the publishable key `pk_test_...` for server verification, and do not use restricted keys for the beginner training flow.

### Payment Link Setup

Create a Payment Link in the Stripe Dashboard:

1. Go to **Payment Links**.
2. Create a product for the course.
3. Set the course price, for example `$49 USD`.
4. In the post-payment settings, redirect customers back to this app.
5. Set the completion redirect URL to:

```text
http://localhost:3000/checkout/complete?courseSlug=acupuncture-fundamentals&session_id={CHECKOUT_SESSION_ID}
```

Then paste the Payment Link URL into the matching environment variable:

```env
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_...
```

In this project, the first course currently uses:

```env
STRIPE_PAYMENT_LINK_ACUPUNCTURE_FUNDAMENTALS=https://buy.stripe.com/test_28E3cv9EK1qU8JPa0X5Rm00
```

Do not paste real live-mode keys into training notes. Keep secrets only in `.env.local`.

### Payment Link Flow

1. A signed-in user clicks Purchase.
2. The app sends the user to the Stripe Payment Link.
3. The Payment Link collects payment on Stripe's hosted checkout page.
4. Stripe redirects back to `/checkout/complete` with `session_id={CHECKOUT_SESSION_ID}`.
5. The app retrieves the Checkout Session from Stripe using `STRIPE_SECRET_KEY`.
6. The app verifies:
   - The payment status is `paid`.
   - The amount matches the course price.
   - The currency is `usd`.
   - The session came from the configured Payment Link.
   - The Stripe session metadata matches the course.
   - The payment email matches the signed-in user's email.
7. The app writes:
   - `course_purchases` with status `paid`.
   - `course_access` so the course is unlocked.
8. The purchased course appears on `/my-courses`.

This is simpler than a webhook-based production flow. The tradeoff is that access is granted only when the user returns to the app after payment. For a production app, add webhooks so Stripe can notify the app even if the user closes the browser before returning.

### Test Payment Card

Use Stripe's test card:

```text
Card number: 4242 4242 4242 4242
Expiry: any future date, for example 12/34
CVC: any 3 digits, for example 123
ZIP: any 5 digits, for example 12345
```

Declined payment test card:

```text
4000 0000 0000 0002
```

3D Secure test card:

```text
4000 0025 0000 3155
```

### Codex Prompt for Payment Link Integration

Use this prompt after Clerk login and the local user database already work:

```text
This project already has Clerk authentication and a local SQLite user database.

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

### Optional Production Webhook Flow

For local webhook testing, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` value from the CLI output into `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

Webhook payment flow:

1. A signed-in user clicks Purchase.
2. The server creates a Stripe Checkout Session.
3. A pending row is saved in `course_purchases`.
4. Stripe redirects the user to Checkout.
5. Stripe sends `checkout.session.completed` to `/api/stripe/webhook`.
6. The webhook marks the purchase as paid and writes course access to `course_access`.

## Where the Clerk Setup Prompt Comes From

The first long Clerk setup prompt used in this training was provided directly by Clerk after signing in to the Clerk platform.

For the workshop, students do not need to write that full prompt manually. They can sign in to Clerk, create or select their Clerk application, and use the setup instructions or prompt that Clerk provides from the platform.

## Two-Step Clerk Auth Teaching Flow

### Step 1: Use Clerk's Own Setup Prompt

Ask students to sign in to Clerk first, create or select their Clerk application, and use the setup prompt or instructions provided directly by Clerk.

That Clerk-provided prompt should handle the initial setup work:

- Install or update the Clerk CLI.
- Run Clerk login.
- Link the project to the correct Clerk application.
- Install `@clerk/nextjs`.
- Add Clerk environment variables.
- Add `ClerkProvider`, sign-in route, sign-up route, and Next.js middleware/proxy files when supported.
- Run Clerk setup verification.

Do not ask students to manually rewrite that long setup prompt. They can copy it from the Clerk platform after logging in.

### Step 2: Use This Prompt to Integrate Auth and User Data Into the App

After Clerk's initial setup is complete, use this shorter prompt to connect login and user data to the app's actual course UI.

```text
Clerk has already been set up in this project.

Please help me connect Clerk login to this app, and add a simple database to save user information.

I want users to clearly see Sign in, Sign up, and their profile button after logging in.

When a user logs in, please save their basic user information in the database.

Also prepare the database structure we will need later for payment:
- A table for Stripe checkout purchase records.
- A table that connects users to courses they have purchased.

On the course page:
- If the user is not logged in, ask them to sign in before purchasing or unlocking the video.
- If the user is logged in, show that they are signed in and let them see the purchase button.
- Do not add payment yet. This step is only for user login and saving user data.

Please finish the integration, test that it works, and tell me what changed.
```
