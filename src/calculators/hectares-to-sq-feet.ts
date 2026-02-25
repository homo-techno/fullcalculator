import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hectaresToSqFeet: CalculatorDefinition = {
  slug: "hectares-to-sq-feet",
  title: "Hectares to Square Feet",
  description: "Free hectares to square feet converter. Convert land area from hectares to square feet instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hectares to square feet", "ha to sq ft", "hectare converter", "land area conversion"],
  variants: [
    {
      id: "hectares-to-sq-feet",
      name: "Hectares to Square Feet",
      fields: [
        { name: "hectares", label: "Area (hectares)", type: "number", placeholder: "e.g. 1", suffix: "ha" },
      ],
      calculate: (inputs) => {
        const hectares = inputs.hectares as number;
        if (hectares === undefined) return null;
        const sqFeet = hectares * 107639.104;
        const sqMeters = hectares * 10000;
        const acres = hectares * 2.47105;
        const sqYards = hectares * 11959.9;
        return {
          primary: { label: "Square Feet", value: formatNumber(sqFeet, 0), suffix: "ft²" },
          details: [
            { label: "Hectares", value: `${formatNumber(hectares, 4)} ha` },
            { label: "Square Feet", value: `${formatNumber(sqFeet, 0)} ft²` },
            { label: "Square Meters", value: `${formatNumber(sqMeters, 0)} m²` },
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Square Yards", value: `${formatNumber(sqYards, 0)} yd²` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sq-feet-to-hectares", "acres-to-sq-meters", "area-converter"],
  faq: [
    { question: "How many square feet in a hectare?", answer: "One hectare equals 107,639.104 square feet." },
    { question: "What is a hectare?", answer: "A hectare is a metric unit of area equal to 10,000 square meters, commonly used for measuring land." },
  ],
  formula: "ft² = hectares × 107,639.104",
};
