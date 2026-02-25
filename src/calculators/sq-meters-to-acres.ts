import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sqMetersToAcres: CalculatorDefinition = {
  slug: "sq-meters-to-acres",
  title: "Square Meters to Acres",
  description: "Free square meters to acres converter. Convert land area from square meters to acres instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["square meters to acres", "sq m to acres", "m2 to acres", "land area conversion"],
  variants: [
    {
      id: "sq-meters-to-acres",
      name: "Square Meters to Acres",
      fields: [
        { name: "sqMeters", label: "Area (m²)", type: "number", placeholder: "e.g. 4047", suffix: "m²" },
      ],
      calculate: (inputs) => {
        const sqMeters = inputs.sqMeters as number;
        if (sqMeters === undefined) return null;
        const acres = sqMeters / 4046.8564224;
        const sqFeet = sqMeters * 10.7639;
        const hectares = sqMeters / 10000;
        const sqKm = sqMeters / 1000000;
        return {
          primary: { label: "Acres", value: formatNumber(acres, 6), suffix: "acres" },
          details: [
            { label: "Square Meters", value: `${formatNumber(sqMeters, 2)} m²` },
            { label: "Acres", value: formatNumber(acres, 6) },
            { label: "Hectares", value: formatNumber(hectares, 6) },
            { label: "Square Feet", value: `${formatNumber(sqFeet, 0)} ft²` },
            { label: "Square Kilometers", value: `${formatNumber(sqKm, 6)} km²` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["acres-to-sq-meters", "sq-feet-to-hectares", "area-converter"],
  faq: [
    { question: "How do I convert square meters to acres?", answer: "Divide the area in square meters by 4,046.8564224. For example, 4,047 m² ≈ 1.0001 acres." },
    { question: "How many acres in a square kilometer?", answer: "One square kilometer equals approximately 247.105 acres." },
  ],
  formula: "acres = m² ÷ 4,046.8564224",
};
