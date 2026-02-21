import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knotsToMphConverter: CalculatorDefinition = {
  slug: "knots-to-mph-converter",
  title: "Knots to MPH Converter",
  description:
    "Free knots to MPH converter. Instantly convert knots to miles per hour with formula and examples. Formula: mph = knots × 1.15078.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "knots to mph",
    "knots to miles per hour",
    "kt to mph",
    "convert knots to mph",
    "speed conversion",
  ],
  variants: [
    {
      id: "knots-to-mph",
      name: "Knots to MPH",
      fields: [
        {
          name: "knots",
          label: "Knots (kt)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const knots = inputs.knots as number;
        if (knots === undefined || knots === null) return null;
        const mph = knots * 1.15078;
        const kph = knots * 1.852;
        const mps = knots * 0.514444;
        return {
          primary: {
            label: `${formatNumber(knots, 2)} knots`,
            value: `${formatNumber(mph, 4)} mph`,
          },
          details: [
            { label: "Miles per Hour", value: `${formatNumber(mph, 4)} mph` },
            { label: "Kilometers per Hour", value: `${formatNumber(kph, 4)} km/h` },
            { label: "Meters per Second", value: `${formatNumber(mps, 4)} m/s` },
            { label: "Formula", value: "mph = knots × 1.15078" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "mph-to-knots-converter",
    "mph-to-kph-converter",
    "kph-to-mph-converter",
    "speed-converter",
  ],
  faq: [
    {
      question: "How do you convert knots to mph?",
      answer:
        "Multiply the knot value by 1.15078. For example, 50 knots = 50 × 1.15078 = 57.539 mph.",
    },
    {
      question: "What is 1 knot in mph?",
      answer:
        "1 knot = 1.15078 miles per hour. A knot is one nautical mile per hour.",
    },
  ],
  formula: "mph = knots × 1.15078",
};
