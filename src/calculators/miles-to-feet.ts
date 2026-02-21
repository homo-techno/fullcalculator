import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const milesToFeetConverter: CalculatorDefinition = {
  slug: "miles-to-feet-converter",
  title: "Miles to Feet Converter",
  description:
    "Free miles to feet converter. Instantly convert miles to ft with formula and examples. Formula: ft = miles × 5280.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "miles to feet",
    "mi to ft",
    "convert miles to feet",
    "mile to feet",
    "length conversion",
  ],
  variants: [
    {
      id: "miles-to-feet",
      name: "Miles to Feet",
      fields: [
        {
          name: "miles",
          label: "Miles (mi)",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const miles = inputs.miles as number;
        if (miles === undefined || miles === null) return null;
        const feet = miles * 5280;
        const yards = miles * 1760;
        const meters = miles * 1609.344;
        const km = miles * 1.609344;
        return {
          primary: {
            label: `${formatNumber(miles, 4)} mi`,
            value: `${formatNumber(feet, 2)} ft`,
          },
          details: [
            { label: "Feet", value: `${formatNumber(feet, 2)} ft` },
            { label: "Yards", value: `${formatNumber(yards, 2)} yd` },
            { label: "Meters", value: `${formatNumber(meters, 2)} m` },
            { label: "Kilometers", value: `${formatNumber(km, 4)} km` },
            { label: "Formula", value: "ft = miles × 5280" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "feet-to-miles-converter",
    "miles-to-km-converter",
    "feet-to-meters-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How many feet are in a mile?",
      answer:
        "There are 5,280 feet in 1 mile. To convert miles to feet, multiply by 5,280.",
    },
    {
      question: "How many feet is half a mile?",
      answer:
        "Half a mile = 2,640 feet. Multiply 0.5 by 5,280 to get 2,640 ft.",
    },
  ],
  formula: "ft = miles × 5280",
};
