import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "wuc-learn.db");

mkdirSync(dataDir, { recursive: true });

const globalForDb = globalThis as unknown as {
  db?: Database.Database;
};

export const db = globalForDb.db ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    instructor TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    cover_image TEXT NOT NULL,
    video_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    image_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

const now = new Date().toISOString();

const courseSeed = [
  {
    slug: "acupuncture-fundamentals",
    title: "Acupuncture Fundamentals",
    description:
      "Learn the foundational theory and point locations behind acupuncture practice.",
    longDescription:
      "A comprehensive introduction to acupuncture for beginners. Covers meridian theory, the twelve primary channels, point location and palpation techniques, needle handling safety, and an overview of common treatment protocols. Includes practical demonstrations and case studies drawn from clinical practice.",
    instructor: "Dr. Mei-Lin Chen",
    priceCents: 4900,
    coverImage: "https://picsum.photos/seed/acupuncture/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-acu-101",
    displayOrder: 1,
  },
  {
    slug: "herbal-medicine-basics",
    title: "Herbal Medicine Basics",
    description:
      "Discover the core herbs, formulas, and diagnostic patterns of Chinese herbology.",
    longDescription:
      "Explore the rich tradition of Chinese herbal medicine. This course introduces the four natures and five flavors of herbs, classic formula construction, common single herbs and their pairings, and how diagnosis informs prescription. Strong focus on safety, contraindications, and modern sourcing.",
    instructor: "Master Hong Wei",
    priceCents: 6900,
    coverImage: "https://picsum.photos/seed/herbal/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-herb-101",
    displayOrder: 2,
  },
  {
    slug: "tui-na-massage-techniques",
    title: "Tui Na Massage Techniques",
    description:
      "Master core hand techniques of Tui Na, the therapeutic bodywork of TCM.",
    longDescription:
      "Tui Na is a hands-on body treatment that uses Chinese taoist and martial arts principles to bring the body into balance. Learn the eight foundational techniques (pushing, grasping, pressing, rubbing, rolling, kneading, rotating, and vibrating), as well as application strategies for common musculoskeletal complaints.",
    instructor: "Dr. James Lau",
    priceCents: 5900,
    coverImage: "https://picsum.photos/seed/tuina/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-tuina-101",
    displayOrder: 3,
  },
  {
    slug: "qi-gong-tai-chi-beginners",
    title: "Qi Gong & Tai Chi for Beginners",
    description:
      "A gentle introduction to movement practices that cultivate Qi and balance.",
    longDescription:
      "Begin your journey into the moving meditation of Qi Gong and Tai Chi. This course covers standing postures, breathing exercises, the eight pieces of brocade, and a simplified Tai Chi form. Suitable for all fitness levels and ideal for stress reduction, joint mobility, and energy cultivation.",
    instructor: "Sifu Anna Park",
    priceCents: 3900,
    coverImage: "https://picsum.photos/seed/qigong/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-qigong-101",
    displayOrder: 4,
  },
];

const seedCourse = db.prepare(`
  INSERT INTO courses (
    slug,
    title,
    description,
    long_description,
    instructor,
    price_cents,
    currency,
    cover_image,
    video_url,
    display_order,
    created_at,
    updated_at
  )
  VALUES (
    @slug,
    @title,
    @description,
    @longDescription,
    @instructor,
    @priceCents,
    'usd',
    @coverImage,
    @videoUrl,
    @displayOrder,
    @now,
    @now
  )
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    long_description = excluded.long_description,
    instructor = excluded.instructor,
    price_cents = excluded.price_cents,
    currency = excluded.currency,
    cover_image = excluded.cover_image,
    video_url = excluded.video_url,
    display_order = excluded.display_order,
    updated_at = excluded.updated_at
`);

const seedCourses = db.transaction(() => {
  for (const course of courseSeed) {
    seedCourse.run({ ...course, now });
  }
});

seedCourses();
