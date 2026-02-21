import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculators, getCalculatorBySlug } from "@/calculators";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorPageClient } from "@/components/calculator-page-client";

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

      {/* Client component handles interactive calculators */}
      <CalculatorPageClient slug={calc.slug} />
    </>
  );
}
