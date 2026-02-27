import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const burnRateCalculator: CalculatorDefinition = {
  slug: "burn-rate-calculator",
  title: "Burn Rate Calculator",
  description: "Free burn rate calculator. Quickly calculate and plan your burn rate needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["burn rate calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Burn Rate",
      description: "Free burn rate calculator. Quickly calculate and plan your burn rate needs.",
      fields: [
        {
          name: "numerator",
          label: "Successes / Revenue",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "denominator",
          label: "Total / Cost",
          type: "number",
          placeholder: "e.g. 1000",
          min: 1,
        }
      ],
      calculate: (inputs) => {
        const num = inputs.numerator as number;
        const den = inputs.denominator as number;
        if (!den) return null;
        const rate = ((num || 0) / den) * 100;
        return {
          primary: { label: "Rate", value: formatNumber(rate) + "%" },
          details: [
            { label: "Successes", value: formatNumber(num || 0) },
            { label: "Total", value: formatNumber(den) },
            { label: "Ratio", value: "1:" + formatNumber(den / (num || 1)) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    {
      question: "How does the burn rate work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
