import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kmToMilesConverter: CalculatorDefinition = {
  slug: "km-to-miles-converter",
  title: "KM to Miles Converter",
  description:
    "Free kilometers to miles converter. Quickly convert km to miles with our easy calculator. 1 km = 0.621371 miles.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "km to miles",
    "kilometers to miles",
    "km converter",
    "km to mi",
    "convert km to miles",
  ],
  variants: [
    {
      id: "km-to-miles",
      name: "Kilometers to Miles",
      fields: [
        {
          name: "km",
          label: "Kilometers",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.km as number;
        if (val === undefined || val === null) return null;
        const miles = val * 0.621371;
        return {
          primary: {
            label: `${formatNumber(val, 4)} km`,
            value: `${formatNumber(miles, 4)} miles`,
          },
          details: [
            { label: "Miles", value: formatNumber(miles, 4) },
            { label: "Meters", value: formatNumber(val * 1000, 2) },
            { label: "Feet", value: formatNumber(miles * 5280, 2) },
            { label: "Yards", value: formatNumber(miles * 1760, 2) },
          ],
        };
      },
    },
    {
      id: "miles-to-km",
      name: "Miles to Kilometers",
      fields: [
        {
          name: "miles",
          label: "Miles",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.miles as number;
        if (val === undefined || val === null) return null;
        const km = val * 1.60934;
        return {
          primary: {
            label: `${formatNumber(val, 4)} miles`,
            value: `${formatNumber(km, 4)} km`,
          },
          details: [
            { label: "Kilometers", value: formatNumber(km, 4) },
            { label: "Meters", value: formatNumber(km * 1000, 2) },
            { label: "Feet", value: formatNumber(val * 5280, 2) },
            { label: "Yards", value: formatNumber(val * 1760, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "miles-to-km-converter",
    "meters-to-feet-converter",
    "feet-to-meters-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many miles in a kilometer?",
      answer:
        "1 kilometer = 0.621371 miles. To convert km to miles, multiply the km value by 0.621371.",
    },
    {
      question: "How do I convert km to miles?",
      answer:
        "Multiply the number of kilometers by 0.621371. For example, 10 km = 10 × 0.621371 = 6.2137 miles.",
    },
  ],
  formula: "miles = km × 0.621371",
};
