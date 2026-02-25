import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sqFeetToHectares: CalculatorDefinition = {
  slug: "sq-feet-to-hectares",
  title: "Square Feet to Hectares",
  description: "Free square feet to hectares converter. Convert land area from square feet to hectares instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["square feet to hectares", "sq ft to ha", "sqft to hectares", "land area conversion"],
  variants: [
    {
      id: "sq-feet-to-hectares",
      name: "Square Feet to Hectares",
      fields: [
        { name: "sqFeet", label: "Area (ft²)", type: "number", placeholder: "e.g. 107639", suffix: "ft²" },
      ],
      calculate: (inputs) => {
        const sqFeet = inputs.sqFeet as number;
        if (sqFeet === undefined) return null;
        const hectares = sqFeet / 107639.104;
        const sqMeters = sqFeet * 0.092903;
        const acres = sqFeet / 43560;
        const sqYards = sqFeet / 9;
        return {
          primary: { label: "Hectares", value: formatNumber(hectares, 6), suffix: "ha" },
          details: [
            { label: "Square Feet", value: `${formatNumber(sqFeet, 0)} ft²` },
            { label: "Hectares", value: `${formatNumber(hectares, 6)} ha` },
            { label: "Square Meters", value: `${formatNumber(sqMeters, 2)} m²` },
            { label: "Acres", value: formatNumber(acres, 6) },
            { label: "Square Yards", value: `${formatNumber(sqYards, 0)} yd²` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hectares-to-sq-feet", "sq-meters-to-acres", "area-converter"],
  faq: [
    { question: "How do I convert square feet to hectares?", answer: "Divide the area in square feet by 107,639.104. For example, 107,639 ft² ≈ 1 hectare." },
    { question: "How many square feet in a hectare?", answer: "One hectare contains exactly 107,639.104 square feet." },
  ],
  formula: "ha = ft² ÷ 107,639.104",
};
