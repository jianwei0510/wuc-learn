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

export const courses: Course[] = [
  {
    id: "1",
    slug: "acupuncture-fundamentals",
    title: "Acupuncture Fundamentals",
    description:
      "Learn the foundational theory and point locations behind acupuncture practice.",
    longDescription:
      "A comprehensive introduction to acupuncture for beginners. Covers meridian theory, the twelve primary channels, point location and palpation techniques, needle handling safety, and an overview of common treatment protocols. Includes practical demonstrations and case studies drawn from clinical practice.",
    instructor: "Dr. Mei-Lin Chen",
    price: 49,
    coverImage: "https://picsum.photos/seed/acupuncture/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-acu-101",
  },
  {
    id: "2",
    slug: "herbal-medicine-basics",
    title: "Herbal Medicine Basics",
    description:
      "Discover the core herbs, formulas, and diagnostic patterns of Chinese herbology.",
    longDescription:
      "Explore the rich tradition of Chinese herbal medicine. This course introduces the four natures and five flavors of herbs, classic formula construction, common single herbs and their pairings, and how diagnosis informs prescription. Strong focus on safety, contraindications, and modern sourcing.",
    instructor: "Master Hong Wei",
    price: 69,
    coverImage: "https://picsum.photos/seed/herbal/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-herb-101",
  },
  {
    id: "3",
    slug: "tui-na-massage-techniques",
    title: "Tui Na Massage Techniques",
    description:
      "Master core hand techniques of Tui Na, the therapeutic bodywork of TCM.",
    longDescription:
      "Tui Na is a hands-on body treatment that uses Chinese taoist and martial arts principles to bring the body into balance. Learn the eight foundational techniques (pushing, grasping, pressing, rubbing, rolling, kneading, rotating, and vibrating), as well as application strategies for common musculoskeletal complaints.",
    instructor: "Dr. James Lau",
    price: 59,
    coverImage: "https://picsum.photos/seed/tuina/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-tuina-101",
  },
  {
    id: "4",
    slug: "qi-gong-tai-chi-beginners",
    title: "Qi Gong & Tai Chi for Beginners",
    description:
      "A gentle introduction to movement practices that cultivate Qi and balance.",
    longDescription:
      "Begin your journey into the moving meditation of Qi Gong and Tai Chi. This course covers standing postures, breathing exercises, the eight pieces of brocade, and a simplified Tai Chi form. Suitable for all fitness levels and ideal for stress reduction, joint mobility, and energy cultivation.",
    instructor: "Sifu Anna Park",
    price: 39,
    coverImage: "https://picsum.photos/seed/qigong/800/500",
    videoUrl: "https://www.youtube.com/watch?v=wuc-qigong-101",
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
