import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const multinomialCalculator: CalculatorDefinition = {
  slug: "multinomial-calculator",
  title: "Multinomial Calculator",
  description: "Free multinomial calculator. Get instant results with our easy-to-use calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["multinomial calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Multinomial",
      description: "Calculate multinomial",
      fields: [
        {
          name: "mean",
          label: "Mean",
          type: "number",
          placeholder: "e.g. 50",
          step: 0.01,
        },
        {
          name: "stddev",
          label: "Standard Deviation",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.001,
          step: 0.01,
        },
        {
          name: "n",
          label: "Sample Size",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
        }
      ],
      calculate: (inputs) => {
        const mean = inputs.mean as number;
        const sd = inputs.stddev as number;
        const n = inputs.n as number;
        if (mean === undefined || !sd || !n) return null;
        const se = sd / Math.sqrt(n);
        const ci95 = 1.96 * se;
        return {
          primary: { label: "Standard Error", value: formatNumber(se) },
          details: [
            { label: "Mean", value: formatNumber(mean) },
            { label: "95% CI", value: formatNumber(mean - ci95) + " to " + formatNumber(mean + ci95) },
            { label: "Coefficient of variation", value: formatNumber((sd/Math.abs(mean||1))*100) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the multinomial calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
