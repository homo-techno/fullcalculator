import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToTroyOz: CalculatorDefinition = {
  slug: "grams-to-troy-oz",
  title: "Grams to Troy Ounces",
  description: "Free grams to troy ounces converter. Convert precious metal weight from grams to troy ounces instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to troy ounce", "g to troy oz", "gold weight conversion", "precious metal weight"],
  variants: [
    {
      id: "grams-to-troy-oz",
      name: "Grams to Troy Ounces",
      fields: [
        { name: "grams", label: "Weight (g)", type: "number", placeholder: "e.g. 31.1", suffix: "g" },
      ],
      calculate: (inputs) => {
        const grams = inputs.grams as number;
        if (grams === undefined) return null;
        const troyOz = grams / 31.1035;
        const kilograms = grams / 1000;
        const avoirdupoisOz = grams / 28.3495;
        const pennyweights = troyOz * 20;
        const grains = troyOz * 480;
        return {
          primary: { label: "Troy Ounces", value: formatNumber(troyOz, 6), suffix: "ozt" },
          details: [
            { label: "Grams", value: `${formatNumber(grams, 4)} g` },
            { label: "Troy Ounces", value: `${formatNumber(troyOz, 6)} ozt` },
            { label: "Kilograms", value: `${formatNumber(kilograms, 6)} kg` },
            { label: "Avoirdupois Ounces", value: `${formatNumber(avoirdupoisOz, 4)} oz` },
            { label: "Pennyweights", value: `${formatNumber(pennyweights, 4)} dwt` },
            { label: "Grains", value: `${formatNumber(grains, 2)} gr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["troy-oz-to-grams", "unit-converter"],
  faq: [
    { question: "How do I convert grams to troy ounces?", answer: "Divide the weight in grams by 31.1035. For example, 31.1035 g = 1 troy ounce." },
    { question: "How much does a gold bar weigh in troy ounces?", answer: "A standard gold bar (Good Delivery bar) weighs approximately 400 troy ounces, or about 12.4 kilograms." },
  ],
  formula: "troy oz = grams ÷ 31.1035",
};
