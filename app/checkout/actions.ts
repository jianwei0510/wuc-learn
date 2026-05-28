"use server";

import { redirect } from "next/navigation";
import { createPendingCoursePurchase, hasCourseAccess } from "@/lib/course-access";
import { getCourseBySlug } from "@/lib/courses";
import {
  buildPaymentLinkUrl,
  getAppUrl,
  getPaymentLinkForCourse,
  getStripe,
} from "@/lib/stripe";
import { syncCurrentUser } from "@/lib/users";

export async function startCourseCheckout(formData: FormData) {
  const courseSlug = formData.get("courseSlug");

  if (typeof courseSlug !== "string") {
    throw new Error("Course is required.");
  }

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    throw new Error("Course not found.");
  }

  const user = await syncCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/courses/${course.slug}`);
  }

  if (hasCourseAccess(user.id, course.slug)) {
    redirect(`/courses/${course.slug}`);
  }

  const paymentLink = getPaymentLinkForCourse(course.slug);

  if (paymentLink) {
    redirect(
      buildPaymentLinkUrl({
        paymentLink,
        courseSlug: course.slug,
        clerkUserId: user.clerk_id,
        email: user.email,
      }),
    );
  }

  const appUrl = getAppUrl();
  const amountCents = Math.round(course.price * 100);
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: user.clerk_id,
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description,
            images: [course.coverImage],
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      courseSlug: course.slug,
      localUserId: String(user.id),
      clerkUserId: user.clerk_id,
    },
    payment_intent_data: {
      metadata: {
        courseSlug: course.slug,
        localUserId: String(user.id),
        clerkUserId: user.clerk_id,
      },
    },
    success_url: `${appUrl}/courses/${course.slug}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/courses/${course.slug}?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  createPendingCoursePurchase({
    userId: user.id,
    courseSlug: course.slug,
    stripeCheckoutSessionId: session.id,
    amountCents,
    currency: "usd",
  });

  redirect(session.url);
}
