import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musicCopyrightValueCalculator: CalculatorDefinition = {
  slug: "music-copyright-value-calculator",
  title: "Music Copyright Value Calculator",
  description: "Estimate the value of a music catalog based on annual revenue and industry multipliers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["copyright","catalog","music value","publishing","IP"],
  variants: [{
    id: "standard",
    name: "Music Copyright Value",
    description: "Estimate the value of a music catalog based on annual revenue and industry multipliers.",
    fields: [
      { name: "annualRevenue", label: "Annual Revenue ($)", type: "number", min: 100, max: 100000000, defaultValue: 50000 },
      { name: "catalogAge", label: "Catalog Age (years)", type: "number", min: 1, max: 60, defaultValue: 10 },
      { name: "catalogType", label: "Catalog Type", type: "select", options: [{ value: "1", label: "Independent/Indie" }, { value: "2", label: "Established Artist" }, { value: "3", label: "Hit Catalog" }, { value: "4", label: "Evergreen Classics" }], defaultValue: "2" },
      { name: "growthRate", label: "Revenue Growth Rate (%)", type: "number", min: -10, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const annualRevenue = inputs.annualRevenue as number;
    const catalogAge = inputs.catalogAge as number;
    const catalogType = inputs.catalogType as number;
    const growthRate = inputs.growthRate as number;
    const multipliers = { 1: 8, 2: 15, 3: 22, 4: 28 };
    const multiplier = multipliers[catalogType];
    const ageFactor = catalogAge >= 20 ? 1.2 : catalogAge >= 10 ? 1.0 : 0.85;
    const growthFactor = 1 + (growthRate / 100);
    const estimatedValue = annualRevenue * multiplier * ageFactor;
    const fiveYearProjection = annualRevenue * ((Math.pow(growthFactor, 5) - 1) / (growthFactor - 1 || 5));
    const typeLabels = { 1: "Independent", 2: "Established", 3: "Hit Catalog", 4: "Evergreen Classics" };
    return {
      primary: { label: "Estimated Catalog Value", value: "$" + formatNumber(estimatedValue) },
      details: [
        { label: "Revenue Multiplier", value: formatNumber(multiplier) + "x" },
        { label: "Age Factor", value: formatNumber(ageFactor) + "x" },
        { label: "Catalog Type", value: typeLabels[catalogType] },
        { label: "5-Year Revenue Projection", value: "$" + formatNumber(fiveYearProjection) }
      ]
    };
  },
  }],
  relatedSlugs: ["music-royalty-split-calculator","music-streaming-revenue-calculator","album-production-budget-calculator"],
  faq: [
    { question: "How are music catalogs valued?", answer: "Music catalogs are typically valued at 10-30 times their annual revenue, depending on the quality and longevity of the catalog." },
    { question: "Why are music catalogs selling for so much?", answer: "Low interest rates, streaming growth, and the proven stability of music royalties have driven catalog multiples to historic highs." },
    { question: "What makes a music catalog more valuable?", answer: "Evergreen songs with consistent streaming, sync licensing potential, and multiple revenue streams command the highest multiples." },
  ],
  formula: "Catalog Value = Annual Revenue x Type Multiplier x Age Factor",
};
