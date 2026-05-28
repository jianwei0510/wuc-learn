import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { startCourseCheckout } from "@/app/checkout/actions";
import { hasCourseAccess } from "@/lib/course-access";
import { courses, getCourseBySlug } from "@/lib/courses";
import { syncCurrentUser } from "@/lib/users";
import { LockedVideo } from "./LockedVideo";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ checkout?: string }>;
}) {
  const { slug } = await params;
  const checkout = (await searchParams)?.checkout;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  const user = await syncCurrentUser();
  const displayName =
    user?.first_name ||
    user?.username ||
    user?.email ||
    "student";
  const isSignedIn = Boolean(user);
  const canAccessCourse = user ? hasCourseAccess(user.id, course.slug) : false;
  const paymentsEnabled = Boolean(
    process.env.STRIPE_SECRET_KEY && course.stripePaymentLinkUrl,
  );

  return (
    <article className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-emerald-700 transition-colors"
        >
          ← All courses
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
          {course.title}
        </h1>
        <p className="mt-2 text-neutral-600">
          Taught by <span className="font-medium text-neutral-900">{course.instructor}</span>
        </p>

        <div className="mt-8">
          <LockedVideo
            courseSlug={course.slug}
            isSignedIn={isSignedIn}
            hasAccess={canAccessCourse}
            paymentsEnabled={paymentsEnabled}
            price={course.price}
            videoUrl={course.videoUrl}
            checkoutAction={startCourseCheckout}
          />
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">About this course</h2>
          <p className="mt-3 text-neutral-700 leading-relaxed">{course.longDescription}</p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm">
          <div className="relative aspect-[16/10] bg-neutral-100">
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
              {canAccessCourse ? (
                "You already own this course."
              ) : isSignedIn ? (
                <>
                  Signed in as <span className="font-semibold">{displayName}</span>
                </>
              ) : (
                "Sign in first so this course can be attached to your account."
              )}
            </div>
            <div className="text-3xl font-semibold">
              ${course.price}
              <span className="text-neutral-400 font-normal text-base"> USD</span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">One-time purchase · Lifetime access</p>
            {canAccessCourse ? (
              <a
                href={course.videoUrl}
                className="mt-4 block w-full rounded-full bg-emerald-700 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                target="_blank"
                rel="noreferrer"
              >
                Open course
              </a>
            ) : isSignedIn && paymentsEnabled ? (
              <form action={startCourseCheckout}>
                <input type="hidden" name="courseSlug" value={course.slug} />
                <button className="mt-4 w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800">
                  Purchase course
                </button>
              </form>
            ) : isSignedIn ? (
              <button
                className="mt-4 w-full rounded-full bg-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-500"
                disabled
              >
                Stripe setup required
              </button>
            ) : (
              <div className="mt-4 grid gap-2">
                <SignInButton mode="modal">
                  <button className="w-full rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800">
                    Sign in to purchase
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-full border border-emerald-700 px-4 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                    Create account
                  </button>
                </SignUpButton>
              </div>
            )}
            <p className="mt-3 text-xs text-neutral-400 text-center">
              {canAccessCourse
                ? "Payment verified. Lifetime access is stored in the database."
                : isSignedIn && !paymentsEnabled
                ? "Add Stripe secret key and this course's Payment Link to enable checkout."
                : checkout === "verified"
                ? "Payment verified. Course access has been unlocked."
                : checkout === "unverified"
                ? "We could not verify that payment. Please contact the instructor."
                : checkout === "cancelled"
                ? "Checkout was cancelled. You can try again anytime."
                : checkout === "success"
                ? "Payment received. Verifying access now."
                : isSignedIn
                ? "Secure checkout is powered by Stripe."
                : "Sign in before purchasing this course."}
            </p>
          </div>
        </div>
      </aside>
    </article>
  );
}
