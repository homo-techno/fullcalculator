import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kmToMetersConverter: CalculatorDefinition = {
  slug: "km-to-meters-converter",
  title: "Kilometers to Meters Converter",
  description:
    "Free kilometers to meters converter. Instantly convert km to m with formula and examples. Formula: m = km × 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "kilometers to meters",
    "km to m",
    "km to meters",
    "convert kilometers to meters",
    "length conversion",
  ],
  variants: [
    {
      id: "km-to-meters",
      name: "Kilometers to Meters",
      fields: [
        {
          name: "km",
          label: "Kilometers (km)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const km = inputs.km as number;
        if (km === undefined || km === null) return null;
        const meters = km * 1000;
        const miles = km * 0.621371;
        const feet = km * 3280.84;
        const yards = km * 1093.61;
        return {
          primary: {
            label: `${formatNumber(km, 4)} km`,
            value: `${formatNumber(meters, 2)} m`,
          },
          details: [
            { label: "Meters", value: `${formatNumber(meters, 4)} m` },
            { label: "Miles", value: `${formatNumber(miles, 4)} mi` },
            { label: "Feet", value: `${formatNumber(feet, 2)} ft` },
            { label: "Yards", value: `${formatNumber(yards, 2)} yd` },
            { label: "Formula", value: "m = km × 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "meters-to-km-converter",
    "km-to-miles-converter",
    "meters-to-feet-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How many meters are in a kilometer?",
      answer:
        "There are 1,000 meters in 1 kilometer. To convert km to meters, multiply by 1,000.",
    },
    {
      question: "How many meters is 5 km?",
      answer:
        "5 km = 5,000 meters. Multiply 5 by 1,000 to get 5,000 m.",
    },
  ],
  formula: "m = km × 1000",
};
