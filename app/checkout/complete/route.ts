import { redirect } from "next/navigation";
import { recordPaidCoursePurchaseAndGrantAccess } from "@/lib/course-access";
import { getCourseBySlug } from "@/lib/courses";
import { getStripe } from "@/lib/stripe";
import { syncCurrentUser } from "@/lib/users";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const courseSlug = url.searchParams.get("courseSlug");
  const sessionId = url.searchParams.get("session_id");

  if (!courseSlug || !sessionId) {
    redirect("/?checkout=invalid");
  }

  const course = getCourseBySlug(courseSlug);

  if (!course) {
    redirect("/?checkout=invalid");
  }

  const user = await syncCurrentUser();

  if (!user) {
    redirect(
      `/sign-in?redirect_url=${encodeURIComponent(`${url.pathname}${url.search}`)}`,
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const expectedAmount = Math.round(course.price * 100);
  const configuredPaymentLink = course.stripePaymentLinkUrl;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;
  const matchesDynamicCheckoutSession =
    session.client_reference_id === user.clerk_id &&
    session.metadata?.courseSlug === course.slug;
  const matchesConfiguredPaymentLink = Boolean(configuredPaymentLink);

  const failedReason =
    session.payment_status !== "paid"
      ? "payment_status"
      : session.amount_total !== expectedAmount
      ? "amount"
      : session.currency !== "usd"
      ? "currency"
      : !matchesDynamicCheckoutSession && !matchesConfiguredPaymentLink
      ? "checkout_source"
      : null;

  if (failedReason) {
    redirect(`/courses/${course.slug}?checkout=unverified&reason=${failedReason}`);
  }

  recordPaidCoursePurchaseAndGrantAccess({
    userId: user.id,
    courseSlug: course.slug,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    amountCents: expectedAmount,
    currency: session.currency ?? "usd",
  });

  redirect(`/courses/${course.slug}?checkout=verified`);
}
