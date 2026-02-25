import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const troyOzToGrams: CalculatorDefinition = {
  slug: "troy-oz-to-grams",
  title: "Troy Ounces to Grams",
  description: "Free troy ounces to grams converter. Convert precious metal weight from troy ounces to grams instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["troy ounce to grams", "troy oz to g", "gold weight conversion", "precious metal weight"],
  variants: [
    {
      id: "troy-oz-to-grams",
      name: "Troy Ounces to Grams",
      fields: [
        { name: "troyOz", label: "Weight (troy oz)", type: "number", placeholder: "e.g. 1", suffix: "ozt" },
      ],
      calculate: (inputs) => {
        const troyOz = inputs.troyOz as number;
        if (troyOz === undefined) return null;
        const grams = troyOz * 31.1035;
        const kilograms = grams / 1000;
        const avoirdupoisOz = troyOz * 1.09714;
        const pennyweights = troyOz * 20;
        const grains = troyOz * 480;
        return {
          primary: { label: "Grams", value: formatNumber(grams, 4), suffix: "g" },
          details: [
            { label: "Troy Ounces", value: `${formatNumber(troyOz, 4)} ozt` },
            { label: "Grams", value: `${formatNumber(grams, 4)} g` },
            { label: "Kilograms", value: `${formatNumber(kilograms, 6)} kg` },
            { label: "Avoirdupois Ounces", value: `${formatNumber(avoirdupoisOz, 4)} oz` },
            { label: "Pennyweights", value: `${formatNumber(pennyweights, 2)} dwt` },
            { label: "Grains", value: `${formatNumber(grains, 0)} gr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-troy-oz", "unit-converter"],
  faq: [
    { question: "How many grams in a troy ounce?", answer: "One troy ounce equals 31.1035 grams. This is used for weighing precious metals like gold, silver, and platinum." },
    { question: "What is the difference between a troy ounce and a regular ounce?", answer: "A troy ounce (31.1035 g) is heavier than a regular (avoirdupois) ounce (28.3495 g). Troy ounces are used exclusively for precious metals." },
  ],
  formula: "grams = troy oz × 31.1035",
};
