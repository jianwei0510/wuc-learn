import Link from "next/link";
import Image from "next/image";
import { courses } from "@/lib/courses";

export default function HomePage() {
  return (
    <div>
      <section className="py-10 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
          Learn Traditional Chinese Medicine,{" "}
          <span className="text-emerald-700">at your pace.</span>
        </h1>
        <p className="mt-4 text-neutral-600 max-w-xl">
          Structured online courses taught by experienced practitioners. From
          acupuncture theory to gentle movement, build your foundation step by step.
        </p>
      </section>

      <section id="courses" className="scroll-mt-20">
        <h2 className="text-xl font-semibold mb-6">Available courses</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="group rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg leading-tight">{course.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-semibold">
                    ${course.price}
                    <span className="text-neutral-400 font-normal text-sm"> USD</span>
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-700 text-white text-sm px-4 py-2 hover:bg-emerald-800 transition-colors"
                  >
                    View Course
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
