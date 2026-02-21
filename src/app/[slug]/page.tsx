import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculators, getCalculatorBySlug, getRelatedCalculators } from "@/calculators";
import { CalculatorForm } from "@/components/calculator-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedCalculators } from "@/components/related-calculators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return {};

  return {
    title: calc.title,
    description: calc.description,
    keywords: calc.keywords,
    openGraph: {
      title: `${calc.title} | FullCalculator`,
      description: calc.description,
      type: "website",
      url: `https://fullcalculator.com/${calc.slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc) {
    notFound();
  }

  const related = getRelatedCalculators(calc);

  // JSON-LD: FAQPage structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calc.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  // JSON-LD: WebApplication structured data
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.title,
    description: calc.description,
    url: `https://fullcalculator.com/${calc.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fullcalculator.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: calc.category,
        item: `https://fullcalculator.com/#${calc.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calc.title,
        item: `https://fullcalculator.com/${calc.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: calc.category, href: `/#${calc.categorySlug}` },
          { label: calc.title },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {calc.title}
      </h1>

      {/* All calculator variants stacked — user scrolls to find the right one */}
      <div className="space-y-6">
        {calc.variants.map((variant) => (
          <CalculatorForm key={variant.id} variant={variant} calculatorSlug={calc.slug} />
        ))}
      </div>

      {/* Formula */}
      {calc.formula && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Formula</h2>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm text-gray-800">
            {calc.formula}
          </div>
        </section>
      )}

      {/* FAQ — educational content for SEO */}
      {calc.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {calc.faq.map((f, i) => (
              <details
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
                open={i === 0}
              >
                <summary className="px-5 py-3 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {f.question}
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related calculators */}
      <RelatedCalculators calculators={related} />
    </>
  );
}
