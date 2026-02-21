import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const candleBurnCalculator: CalculatorDefinition = {
  slug: "candle-burn-calculator",
  title: "Candle Burn Time Calculator",
  description:
    "Free candle burn time calculator. Estimate how long your candle will last based on weight and wax type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "candle burn time",
    "candle calculator",
    "soy candle",
    "paraffin candle",
    "burn rate",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Candle Weight (oz)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "waxType",
          label: "Wax Type",
          type: "select",
          options: [
            { label: "Soy Wax (7-9 hrs/oz)", value: "soy" },
            { label: "Paraffin Wax (5-7 hrs/oz)", value: "paraffin" },
            { label: "Beeswax (6-8 hrs/oz)", value: "beeswax" },
            { label: "Coconut Wax (7-9 hrs/oz)", value: "coconut" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const waxType = (inputs.waxType as string) || "soy";
        if (!weight || weight <= 0) return null;

        const rates: Record<string, { min: number; max: number }> = {
          soy: { min: 7, max: 9 },
          paraffin: { min: 5, max: 7 },
          beeswax: { min: 6, max: 8 },
          coconut: { min: 7, max: 9 },
        };

        const rate = rates[waxType] || rates.soy;
        const minHours = weight * rate.min;
        const maxHours = weight * rate.max;
        const avgHours = (minHours + maxHours) / 2;

        return {
          primary: {
            label: "Estimated Burn Time",
            value:
              formatNumber(minHours, 0) + " - " + formatNumber(maxHours, 0) + " hours",
          },
          details: [
            { label: "Average Estimate", value: formatNumber(avgHours, 0) + " hours" },
            { label: "Candle Weight", value: formatNumber(weight, 1) + " oz" },
            {
              label: "Burn Rate",
              value: rate.min + "-" + rate.max + " hrs/oz",
            },
            {
              label: "Days (4 hrs/day use)",
              value: formatNumber(avgHours / 4, 0) + " days",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gift-wrap-calculator"],
  faq: [
    {
      question: "How long does a candle burn per ounce?",
      answer:
        "It depends on the wax type. Soy wax burns approximately 7-9 hours per ounce, paraffin 5-7 hours per ounce, and beeswax 6-8 hours per ounce.",
    },
    {
      question: "How can I make a candle last longer?",
      answer:
        "Trim the wick to 1/4 inch before each use, burn for at least 1 hour per inch of diameter on the first burn to set a full melt pool, and keep the candle away from drafts.",
    },
  ],
  formula:
    "Burn Time (hours) = Candle Weight (oz) x Burn Rate (hrs/oz). Soy: 7-9 hrs/oz, Paraffin: 5-7 hrs/oz, Beeswax: 6-8 hrs/oz, Coconut: 7-9 hrs/oz.",
};
