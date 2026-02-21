import type { MetadataRoute } from "next";
import { calculators } from "@/calculators";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fullcalculator.com";

  const calculatorPages = calculators.map((calc) => ({
    url: `${baseUrl}/${calc.slug}`,
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
    ...calculatorPages,
  ];
}
