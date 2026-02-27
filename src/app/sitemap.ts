import type { MetadataRoute } from "next";
import { calculators } from "@/calculators";
import { CATEGORIES } from "@/calculators/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fullcalculator.com";

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const calculatorPages = calculators.map((calc) => ({
    url: `${baseUrl}/${calc.categorySlug}/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categoryPages,
    ...calculatorPages,
  ];
}
