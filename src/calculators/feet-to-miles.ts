import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const feetToMilesConverter: CalculatorDefinition = {
  slug: "feet-to-miles-converter",
  title: "Feet to Miles Converter",
  description:
    "Free feet to miles converter. Instantly convert ft to miles with formula and examples. Formula: miles = ft ÷ 5280.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "feet to miles",
    "ft to mi",
    "convert feet to miles",
    "foot to miles",
    "length conversion",
  ],
  variants: [
    {
      id: "feet-to-miles",
      name: "Feet to Miles",
      fields: [
        {
          name: "feet",
          label: "Feet (ft)",
          type: "number",
          placeholder: "e.g. 10560",
        },
      ],
      calculate: (inputs) => {
        const ft = inputs.feet as number;
        if (ft === undefined || ft === null) return null;
        const miles = ft / 5280;
        const yards = ft / 3;
        const meters = ft * 0.3048;
        const km = ft * 0.0003048;
        return {
          primary: {
            label: `${formatNumber(ft, 2)} ft`,
            value: `${formatNumber(miles, 4)} mi`,
          },
          details: [
            { label: "Miles", value: `${formatNumber(miles, 4)} mi` },
            { label: "Yards", value: `${formatNumber(yards, 2)} yd` },
            { label: "Meters", value: `${formatNumber(meters, 2)} m` },
            { label: "Kilometers", value: `${formatNumber(km, 4)} km` },
            { label: "Formula", value: "miles = ft ÷ 5280" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "miles-to-feet-converter",
    "feet-to-meters-converter",
    "km-to-miles-converter",
    "length-converter",
  ],
  faq: [
    {
      question: "How do you convert feet to miles?",
      answer:
        "Divide the number of feet by 5,280. For example, 10,560 ft = 10,560 ÷ 5,280 = 2 miles.",
    },
    {
      question: "How many miles is 5280 feet?",
      answer:
        "5,280 feet = exactly 1 mile. This is the standard definition of a mile.",
    },
  ],
  formula: "miles = ft ÷ 5280",
};
