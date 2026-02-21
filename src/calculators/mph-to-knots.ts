import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mphToKnotsConverter: CalculatorDefinition = {
  slug: "mph-to-knots-converter",
  title: "MPH to Knots Converter",
  description:
    "Free MPH to knots converter. Instantly convert miles per hour to knots with formula and examples. Formula: knots = mph ÷ 1.15078.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "mph to knots",
    "miles per hour to knots",
    "mph to kt",
    "convert mph to knots",
    "speed conversion",
  ],
  variants: [
    {
      id: "mph-to-knots",
      name: "MPH to Knots",
      fields: [
        {
          name: "mph",
          label: "Miles per Hour (mph)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const mph = inputs.mph as number;
        if (mph === undefined || mph === null) return null;
        const knots = mph / 1.15078;
        const kph = mph * 1.60934;
        const mps = mph * 0.44704;
        return {
          primary: {
            label: `${formatNumber(mph, 2)} mph`,
            value: `${formatNumber(knots, 4)} knots`,
          },
          details: [
            { label: "Knots", value: `${formatNumber(knots, 4)} kt` },
            { label: "Kilometers per Hour", value: `${formatNumber(kph, 4)} km/h` },
            { label: "Meters per Second", value: `${formatNumber(mps, 4)} m/s` },
            { label: "Formula", value: "knots = mph ÷ 1.15078" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "knots-to-mph-converter",
    "mph-to-kph-converter",
    "kph-to-mph-converter",
    "speed-converter",
  ],
  faq: [
    {
      question: "How do you convert mph to knots?",
      answer:
        "Divide the mph value by 1.15078. For example, 60 mph = 60 ÷ 1.15078 ≈ 52.14 knots.",
    },
    {
      question: "What is the difference between knots and mph?",
      answer:
        "A knot is 1 nautical mile per hour (1.852 km/h), while 1 mph is 1 statute mile per hour (1.60934 km/h). 1 knot ≈ 1.15078 mph.",
    },
  ],
  formula: "knots = mph ÷ 1.15078",
};
