import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { calculators, getCalculatorBySlug } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorPageClient } from "@/components/calculator-page-client";

interface PageProps {
  params: Promise<{ categorySlug: string; slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((c) => ({
    categorySlug: c.categorySlug,
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return {};

  return {
    title: calc.title,
    description: calc.description,
    keywords: calc.keywords,
    alternates: {
      canonical: `https://fullcalculator.com/${calc.categorySlug}/${calc.slug}`,
    },
    openGraph: {
      title: `${calc.title} | FullCalculator`,
      description: calc.description,
      type: "website",
      url: `https://fullcalculator.com/${calc.categorySlug}/${calc.slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { categorySlug, slug } = await params;
  const calc = getCalculatorBySlug(slug);

  if (!calc || calc.categorySlug !== categorySlug) {
    notFound();
  }

  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryName = cat?.name ?? calc.category;
  const baseUrl = "https://fullcalculator.com";

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

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.title,
    description: calc.description,
    url: `${baseUrl}/${calc.categorySlug}/${calc.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

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
        name: `${categoryName} Calculators`,
        item: `${baseUrl}/${calc.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calc.title,
        item: `${baseUrl}/${calc.categorySlug}/${calc.slug}`,
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
          { label: `${categoryName} Calculators`, href: `/${calc.categorySlug}` },
          { label: calc.title },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {calc.title}
      </h1>

      <CalculatorPageClient slug={calc.slug} />
    </>
  );
}
