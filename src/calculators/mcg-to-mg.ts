import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mcgToMgConverter: CalculatorDefinition = {
  slug: "mcg-to-mg-converter",
  title: "Micrograms to Milligrams Converter",
  description: "Free mcg to mg converter. Convert micrograms to milligrams instantly. Essential for medication dosages and supplement measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mcg to mg", "micrograms to milligrams", "mcg to mg converter", "ug to mg", "microgram conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert mcg to mg",
      fields: [
        { name: "value", label: "Micrograms (mcg)", type: "number", placeholder: "e.g. 1000" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Micrograms to Milligrams", value: "mcg_to_mg" },
          { label: "Milligrams to Micrograms", value: "mg_to_mcg" },
        ], defaultValue: "mcg_to_mg" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "mg_to_mcg") {
          const mcg = value * 1000;
          return {
            primary: { label: `${formatNumber(value)} mg`, value: `${formatNumber(mcg, 2)} mcg` },
            details: [
              { label: "Micrograms (mcg)", value: formatNumber(mcg, 2) },
              { label: "Grams (g)", value: formatNumber(value / 1000, 6) },
              { label: "Nanograms (ng)", value: formatNumber(mcg * 1000, 0) },
              { label: "International Units (IU) - Vit D", value: formatNumber(value * 40000, 0) },
            ],
          };
        }
        const mg = value / 1000;
        return {
          primary: { label: `${formatNumber(value)} mcg`, value: `${formatNumber(mg, 6)} mg` },
          details: [
            { label: "Milligrams (mg)", value: formatNumber(mg, 6) },
            { label: "Grams (g)", value: formatNumber(mg / 1000, 9) },
            { label: "Nanograms (ng)", value: formatNumber(value * 1000, 0) },
            { label: "International Units (IU) - Vit D", value: formatNumber(value * 40, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "mg-to-ml-converter", "drops-to-ml-converter"],
  faq: [
    { question: "How many mcg are in 1 mg?", answer: "There are 1,000 micrograms (mcg) in 1 milligram (mg). To convert mcg to mg, divide by 1,000. For example, 500 mcg = 0.5 mg." },
    { question: "What is the difference between mcg and mg?", answer: "A microgram (mcg or \u00b5g) is 1/1000th of a milligram (mg). A milligram is 1/1000th of a gram. Micrograms are used for very small dosages like vitamin D, B12, and certain medications." },
  ],
  formula: "1 mg = 1,000 mcg | 1 mcg = 0.001 mg | 1 g = 1,000 mg = 1,000,000 mcg",
};
