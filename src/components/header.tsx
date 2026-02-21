import Link from "next/link";
import { CATEGORIES } from "@/calculators/types";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            Full<span className="text-blue-600">Calculator</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/#${cat.slug}`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
