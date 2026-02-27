import Link from "next/link";
import { calculators } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";
import { CalculatorCard } from "@/components/calculator-card";

const HOMEPAGE_LIMIT = 12;

export default function HomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FullCalculator",
    url: "https://fullcalculator.com",
    description: "Free online calculators for math, finance, health, and everyday life.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fullcalculator.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FullCalculator",
    url: "https://fullcalculator.com",
    logo: "https://fullcalculator.com/icon.png",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Free Online Calculators
        </h1>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          {calculators.length.toLocaleString()}+ fast, accurate calculators for math, finance,
          health, science, and everyday life. No signup required.
        </p>
      </section>

      {CATEGORIES.map((cat) => {
        const catCalcs = calculators.filter(
          (c) => c.categorySlug === cat.slug
        );
        if (catCalcs.length === 0) return null;
        const shown = catCalcs.slice(0, HOMEPAGE_LIMIT);
        return (
          <section key={cat.slug} id={cat.slug} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                  {cat.icon}
                </span>
                {cat.name} Calculators
              </h2>
              <Link
                href={`/${cat.slug}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all {catCalcs.length} →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((calc) => (
                <CalculatorCard key={calc.slug} calc={calc} />
              ))}
            </div>
            {catCalcs.length > HOMEPAGE_LIMIT && (
              <div className="mt-4 text-center">
                <Link
                  href={`/${cat.slug}`}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  See all {catCalcs.length} {cat.name.toLowerCase()} calculators →
                </Link>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
