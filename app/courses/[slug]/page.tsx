import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourseBySlug } from "@/lib/courses";
import { LockedVideo } from "./LockedVideo";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

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
          <LockedVideo price={course.price} />
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
            <div className="text-3xl font-semibold">
              ${course.price}
              <span className="text-neutral-400 font-normal text-base"> USD</span>
            </div>
            <p className="mt-1 text-sm text-neutral-500">One-time purchase · Lifetime access</p>
            <button className="mt-4 w-full rounded-full bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 hover:bg-emerald-800 transition-colors">
              Purchase course
            </button>
            <p className="mt-3 text-xs text-neutral-400 text-center">
              Checkout is not enabled in this preview.
            </p>
          </div>
        </div>
      </aside>
    </article>
  );
}
