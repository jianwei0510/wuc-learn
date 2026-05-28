import "server-only";

import Stripe from "stripe";

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia",
  });
}

export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return "http://localhost:3000";
}

export function getPaymentLinkEnvName(courseSlug: string) {
  return `STRIPE_PAYMENT_LINK_${courseSlug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`;
}

export function getPaymentLinkForCourse(courseSlug: string) {
  return process.env[getPaymentLinkEnvName(courseSlug)];
}

export function buildPaymentLinkUrl(input: {
  paymentLink: string;
  courseSlug: string;
  clerkUserId: string;
  email?: string | null;
}) {
  const url = new URL(input.paymentLink);

  url.searchParams.set(
    "client_reference_id",
    `${input.clerkUserId}:${input.courseSlug}`,
  );

  if (input.email) {
    url.searchParams.set("prefilled_email", input.email);
  }

  return url.toString();
}
