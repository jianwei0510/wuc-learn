import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "WUC Learn — Traditional Chinese Medicine Courses",
  description:
    "Online courses in Acupuncture, Herbal Medicine, Tui Na, Qi Gong and Tai Chi.",
};

function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/70 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          WUC <span className="text-emerald-700">Learn</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/#courses" className="hover:text-emerald-700 transition-colors">
              Courses
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="mt-20 border-t border-black/5">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-neutral-500">
            © {new Date().getFullYear()} WUC Learn. For educational purposes only.
          </div>
        </footer>
      </body>
    </html>
  );
}
