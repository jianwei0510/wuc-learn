"use server";

import { redirect } from "next/navigation";
import { hasCourseAccess } from "@/lib/course-access";
import { getCourseBySlug } from "@/lib/courses";
import { buildPaymentLinkUrl } from "@/lib/stripe";
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

  const paymentLink = course.stripePaymentLinkUrl;

  if (!paymentLink) {
    throw new Error("Payment Link is not configured for this course.");
  }

  redirect(
    buildPaymentLinkUrl({
      paymentLink,
      courseSlug: course.slug,
      clerkUserId: user.clerk_id,
      email: user.email,
    }),
  );
}
