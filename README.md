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
   - Keep payment disabled for this step.

3. Add payment
   - This is the next training step.
   - The authenticated user state and user database should already be available before checkout is added.

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

When a user logs in, please save their basic user information in the database so we can connect them to purchased courses later.

On the course page:
- If the user is not logged in, ask them to sign in before purchasing or unlocking the video.
- If the user is logged in, show that they are signed in and let them see the purchase button.
- Do not add payment yet. This step is only for user login and saving user data.

Please finish the integration, test that it works, and tell me what changed.
```
