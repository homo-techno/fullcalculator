import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ppcRoiCalculator: CalculatorDefinition = {
  slug: "ppc-roi-calculator",
  title: "Ppc Roi Calculator",
  description: "Free ppc roi calculator. Quickly calculate and plan your ppc roi needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ppc roi calculator", "calculator", "planning tool"],
  variants: [
    {
      id: "standard",
      name: "Ppc Roi",
      description: "Free ppc roi calculator. Quickly calculate and plan your ppc roi needs.",
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
      question: "How does the ppc roi work?",
      answer: "Enter your values and the calculator instantly shows you the results with a detailed breakdown.",
    },
    {
      question: "Can I customize the inputs?",
      answer: "Yes, adjust any input field to see how changes affect the result. All calculations update in real-time.",
    }
  ],
  formula: "Based on input values and standard formulas",
};
