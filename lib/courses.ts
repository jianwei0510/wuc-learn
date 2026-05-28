import "server-only";

import { db } from "@/lib/db";

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  price: number;
  coverImage: string;
  videoUrl: string;
};

type CourseRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  instructor: string;
  price_cents: number;
  cover_image: string;
  video_url: string;
};

function mapCourseRow(row: CourseRow): Course {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    instructor: row.instructor,
    price: row.price_cents / 100,
    coverImage: row.cover_image,
    videoUrl: row.video_url,
  };
}

export function getCourses() {
  return db
    .prepare(
      `
        SELECT
          id,
          slug,
          title,
          description,
          long_description,
          instructor,
          price_cents,
          cover_image,
          video_url
        FROM courses
        ORDER BY display_order ASC, id ASC
      `,
    )
    .all()
    .map((row) => mapCourseRow(row as CourseRow));
}

export const courses = getCourses();

export function getCourseBySlug(slug: string): Course | undefined {
  const row = db
    .prepare(
      `
        SELECT
          id,
          slug,
          title,
          description,
          long_description,
          instructor,
          price_cents,
          cover_image,
          video_url
        FROM courses
        WHERE slug = ?
      `,
    )
    .get(slug) as CourseRow | undefined;

  return row ? mapCourseRow(row) : undefined;
}
