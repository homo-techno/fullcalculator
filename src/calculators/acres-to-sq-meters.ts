import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const acresToSqMeters: CalculatorDefinition = {
  slug: "acres-to-sq-meters",
  title: "Acres to Square Meters",
  description: "Free acres to square meters converter. Convert land area from acres to square meters instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["acres to square meters", "acres to sq m", "acre converter", "land area conversion"],
  variants: [
    {
      id: "acres-to-sq-meters",
      name: "Acres to Square Meters",
      fields: [
        { name: "acres", label: "Area (acres)", type: "number", placeholder: "e.g. 1", suffix: "acres" },
      ],
      calculate: (inputs) => {
        const acres = inputs.acres as number;
        if (acres === undefined) return null;
        const sqMeters = acres * 4046.8564224;
        const sqFeet = acres * 43560;
        const hectares = acres * 0.404686;
        const sqKm = acres * 0.00404686;
        return {
          primary: { label: "Square Meters", value: formatNumber(sqMeters, 2), suffix: "m²" },
          details: [
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Square Meters", value: `${formatNumber(sqMeters, 2)} m²` },
            { label: "Hectares", value: formatNumber(hectares, 6) },
            { label: "Square Feet", value: `${formatNumber(sqFeet, 0)} ft²` },
            { label: "Square Kilometers", value: `${formatNumber(sqKm, 6)} km²` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sq-meters-to-acres", "hectares-to-sq-feet", "area-converter"],
  faq: [
    { question: "How many square meters in an acre?", answer: "One acre equals exactly 4,046.8564224 square meters." },
    { question: "How big is an acre?", answer: "An acre is about the size of a football field (without the end zones). It equals 43,560 square feet." },
  ],
  formula: "m² = acres × 4,046.8564224",
};
