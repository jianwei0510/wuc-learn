import "server-only";

import { db } from "@/lib/db";

export type CoursePurchaseStatus = "pending" | "paid" | "failed" | "refunded";

export type CoursePurchase = {
  id: number;
  user_id: number;
  course_slug: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  status: CoursePurchaseStatus;
  created_at: string;
  updated_at: string;
};

export function hasCourseAccess(userId: number, courseSlug: string) {
  const row = db
    .prepare(
      "SELECT 1 FROM course_access WHERE user_id = ? AND course_slug = ? LIMIT 1",
    )
    .get(userId, courseSlug);

  return Boolean(row);
}

export function getPurchasedCourseSlugsForUser(userId: number) {
  return db
    .prepare(
      `
        SELECT course_slug
        FROM course_access
        WHERE user_id = ?
        ORDER BY granted_at DESC
      `,
    )
    .all(userId)
    .map((row) => (row as { course_slug: string }).course_slug);
}

export function createPendingCoursePurchase(input: {
  userId: number;
  courseSlug: string;
  stripeCheckoutSessionId: string;
  amountCents: number;
  currency?: string;
}) {
  const now = new Date().toISOString();

  db.prepare(
    `
      INSERT INTO course_purchases (
        user_id,
        course_slug,
        stripe_checkout_session_id,
        amount_cents,
        currency,
        status,
        created_at,
        updated_at
      )
      VALUES (
        @userId,
        @courseSlug,
        @stripeCheckoutSessionId,
        @amountCents,
        @currency,
        'pending',
        @now,
        @now
      )
      ON CONFLICT(stripe_checkout_session_id) DO UPDATE SET
        user_id = excluded.user_id,
        course_slug = excluded.course_slug,
        amount_cents = excluded.amount_cents,
        currency = excluded.currency,
        updated_at = excluded.updated_at
    `,
  ).run({
    userId: input.userId,
    courseSlug: input.courseSlug,
    stripeCheckoutSessionId: input.stripeCheckoutSessionId,
    amountCents: input.amountCents,
    currency: input.currency ?? "usd",
    now,
  });

  return db
    .prepare("SELECT * FROM course_purchases WHERE stripe_checkout_session_id = ?")
    .get(input.stripeCheckoutSessionId) as CoursePurchase;
}

export function grantCourseAccessFromPaidPurchase(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
}) {
  const now = new Date().toISOString();

  const purchase = db.transaction(() => {
    db.prepare(
      `
        UPDATE course_purchases
        SET
          status = 'paid',
          stripe_payment_intent_id = COALESCE(@stripePaymentIntentId, stripe_payment_intent_id),
          updated_at = @now
        WHERE stripe_checkout_session_id = @stripeCheckoutSessionId
      `,
    ).run({
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      now,
    });

    const paidPurchase = db
      .prepare("SELECT * FROM course_purchases WHERE stripe_checkout_session_id = ?")
      .get(input.stripeCheckoutSessionId) as CoursePurchase | undefined;

    if (!paidPurchase) {
      return null;
    }

    db.prepare(
      `
        INSERT INTO course_access (
          user_id,
          course_slug,
          purchase_id,
          granted_at
        )
        VALUES (
          @userId,
          @courseSlug,
          @purchaseId,
          @now
        )
        ON CONFLICT(user_id, course_slug) DO UPDATE SET
          purchase_id = excluded.purchase_id,
          granted_at = excluded.granted_at
      `,
    ).run({
      userId: paidPurchase.user_id,
      courseSlug: paidPurchase.course_slug,
      purchaseId: paidPurchase.id,
      now,
    });

    return paidPurchase;
  })();

  return purchase;
}

export function recordPaidCoursePurchaseAndGrantAccess(input: {
  userId: number;
  courseSlug: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  amountCents: number;
  currency?: string;
}) {
  const now = new Date().toISOString();

  const purchase = db.transaction(() => {
    db.prepare(
      `
        INSERT INTO course_purchases (
          user_id,
          course_slug,
          stripe_checkout_session_id,
          stripe_payment_intent_id,
          amount_cents,
          currency,
          status,
          created_at,
          updated_at
        )
        VALUES (
          @userId,
          @courseSlug,
          @stripeCheckoutSessionId,
          @stripePaymentIntentId,
          @amountCents,
          @currency,
          'paid',
          @now,
          @now
        )
        ON CONFLICT(stripe_checkout_session_id) DO UPDATE SET
          user_id = excluded.user_id,
          course_slug = excluded.course_slug,
          stripe_payment_intent_id = COALESCE(excluded.stripe_payment_intent_id, stripe_payment_intent_id),
          amount_cents = excluded.amount_cents,
          currency = excluded.currency,
          status = 'paid',
          updated_at = excluded.updated_at
      `,
    ).run({
      userId: input.userId,
      courseSlug: input.courseSlug,
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      amountCents: input.amountCents,
      currency: input.currency ?? "usd",
      now,
    });

    const paidPurchase = db
      .prepare("SELECT * FROM course_purchases WHERE stripe_checkout_session_id = ?")
      .get(input.stripeCheckoutSessionId) as CoursePurchase;

    db.prepare(
      `
        INSERT INTO course_access (
          user_id,
          course_slug,
          purchase_id,
          granted_at
        )
        VALUES (
          @userId,
          @courseSlug,
          @purchaseId,
          @now
        )
        ON CONFLICT(user_id, course_slug) DO UPDATE SET
          purchase_id = excluded.purchase_id,
          granted_at = excluded.granted_at
      `,
    ).run({
      userId: paidPurchase.user_id,
      courseSlug: paidPurchase.course_slug,
      purchaseId: paidPurchase.id,
      now,
    });

    return paidPurchase;
  })();

  return purchase;
}
