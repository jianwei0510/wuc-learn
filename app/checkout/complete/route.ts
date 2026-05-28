import { redirect } from "next/navigation";
import { recordPaidCoursePurchaseAndGrantAccess } from "@/lib/course-access";
import { getCourseBySlug } from "@/lib/courses";
import { getPaymentLinkForCourse, getStripe } from "@/lib/stripe";
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
  const expectedPaymentLinkClientReferenceId = `${user.clerk_id}:${course.slug}`;
  const configuredPaymentLink = getPaymentLinkForCourse(course.slug);
  const configuredPaymentLinkId = configuredPaymentLink
    ? new URL(configuredPaymentLink).pathname.split("/").at(-1)
    : null;
  const customerEmail =
    session.customer_details?.email || session.customer_email || null;
  const customerEmailMatches =
    customerEmail?.toLowerCase() === user.email?.toLowerCase();
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;
  const sessionPaymentLink =
    typeof session.payment_link === "string" ? session.payment_link : null;
  const matchesDynamicCheckoutSession =
    session.client_reference_id === user.clerk_id &&
    session.metadata?.courseSlug === course.slug;
  const matchesConfiguredPaymentLink =
    sessionPaymentLink === configuredPaymentLinkId &&
    (session.client_reference_id === expectedPaymentLinkClientReferenceId ||
      customerEmailMatches);

  if (
    session.payment_status !== "paid" ||
    session.amount_total !== expectedAmount ||
    session.currency !== "usd" ||
    (!matchesDynamicCheckoutSession && !matchesConfiguredPaymentLink)
  ) {
    redirect(`/courses/${course.slug}?checkout=unverified`);
  }

  recordPaidCoursePurchaseAndGrantAccess({
    userId: user.id,
    courseSlug: course.slug,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    amountCents: expectedAmount,
    currency: session.currency,
  });

  redirect(`/courses/${course.slug}?checkout=verified`);
}
