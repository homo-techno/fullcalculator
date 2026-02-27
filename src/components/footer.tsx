import Link from "next/link";
import { calculators } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";

const FOOTER_LIMIT = 12;

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {CATEGORIES.map((cat) => {
            const catCalcs = calculators.filter((c) => c.categorySlug === cat.slug);
            if (catCalcs.length === 0) return null;
            const shown = catCalcs.slice(0, FOOTER_LIMIT);
            return (
              <div key={cat.slug}>
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  <Link href={`/${cat.slug}`} className="hover:text-blue-600 transition-colors">
                    {cat.name}
                  </Link>
                </h3>
                <ul className="space-y-1.5">
                  {shown.map((calc) => (
                    <li key={calc.slug}>
                      <Link
                        href={`/${calc.categorySlug}/${calc.slug}`}
                        className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {calc.title}
                      </Link>
                    </li>
                  ))}
                  {catCalcs.length > FOOTER_LIMIT && (
                    <li>
                      <Link
                        href={`/${cat.slug}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View all {catCalcs.length} →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} FullCalculator.com. Free online calculators for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
