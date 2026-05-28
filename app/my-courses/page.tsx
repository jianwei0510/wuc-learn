import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPurchasedCourseSlugsForUser } from "@/lib/course-access";
import { courses } from "@/lib/courses";
import { syncCurrentUser } from "@/lib/users";

export default async function MyCoursesPage() {
  const user = await syncCurrentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/my-courses");
  }

  const purchasedSlugs = new Set(getPurchasedCourseSlugsForUser(user.id));
  const purchasedCourses = courses.filter((course) => purchasedSlugs.has(course.slug));

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Your library</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">My courses</h1>
        </div>
        <Link
          href="/#courses"
          className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
        >
          Browse all courses
        </Link>
      </div>

      {purchasedCourses.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {purchasedCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
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
                <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  Unlocked
                </div>
                <h2 className="text-lg font-semibold leading-tight">{course.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
                  {course.description}
                </p>
                <p className="mt-4 text-sm font-medium text-emerald-700">Open course</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">No purchased courses yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
            Purchased courses will appear here after Stripe verifies payment and access is saved.
          </p>
          <Link
            href="/#courses"
            className="mt-5 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Browse courses
          </Link>
        </div>
      )}
    </div>
  );
}
