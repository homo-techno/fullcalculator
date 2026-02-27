import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculators } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";
import { CalculatorCard } from "@/components/calculator-card";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ categorySlug: cat.slug }));
}

const categoryDescriptions: Record<string, string> = {
  math: "Free online math calculators for algebra, geometry, calculus, statistics, and more. Solve equations, convert units, and compute formulas instantly.",
  finance: "Free financial calculators for mortgage, loan, investment, retirement, tax, and budgeting. Plan your finances with accurate, easy-to-use tools.",
  health: "Free health and fitness calculators for BMI, calories, nutrition, medical scores, and wellness tracking. Monitor your health with precision.",
  everyday: "Free everyday calculators for cooking, shopping, home improvement, travel, and daily life. Simplify routine calculations in seconds.",
  science: "Free science calculators for physics, chemistry, biology, astronomy, and engineering. Compute formulas and solve scientific problems accurately.",
  conversion: "Free unit conversion calculators for length, weight, temperature, volume, speed, and more. Convert between metric, imperial, and other systems instantly.",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!cat) return {};
  const count = calculators.filter((c) => c.categorySlug === categorySlug).length;
  return {
    title: `${cat.name} Calculators — ${count}+ Free Online Tools`,
    description: categoryDescriptions[categorySlug] || `Free online ${cat.name.toLowerCase()} calculators. ${count}+ accurate, easy-to-use tools. No signup required.`,
    alternates: {
      canonical: `https://fullcalculator.com/${categorySlug}`,
    },
    openGraph: {
      title: `${cat.name} Calculators — ${count}+ Free Tools | FullCalculator`,
      description: categoryDescriptions[categorySlug],
      type: "website",
      url: `https://fullcalculator.com/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!cat) notFound();

  const catCalcs = calculators.filter((c) => c.categorySlug === categorySlug);
  const baseUrl = "https://fullcalculator.com";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${cat.name} Calculators`,
        item: `${baseUrl}/${categorySlug}`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} Calculators`,
    description: categoryDescriptions[categorySlug],
    url: `${baseUrl}/${categorySlug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catCalcs.length,
      itemListElement: catCalcs.slice(0, 100).map((calc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/${categorySlug}/${calc.slug}`,
        name: calc.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Breadcrumbs items={[{ label: `${cat.name} Calculators` }]} />

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold text-lg">
            {cat.icon}
          </span>
          {cat.name} Calculators
        </h1>
        <p className="mt-2 text-gray-600">
          {catCalcs.length} free online {cat.name.toLowerCase()} calculators. No signup required.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catCalcs.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>
    </>
  );
}
