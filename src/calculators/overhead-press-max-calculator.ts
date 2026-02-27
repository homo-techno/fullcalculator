import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overheadPressMaxCalculator: CalculatorDefinition = {
  slug: "overhead-press-max-calculator",
  title: "Overhead Press Max Calculator",
  description: "Free overhead press max calculator. Get instant results with our easy-to-use calculator.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["overhead press max calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Overhead Press Max",
      description: "Calculate overhead press max",
      fields: [
        {
          name: "weight",
          label: "Weight Lifted",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "kg",
          min: 0,
        },
        {
          name: "reps",
          label: "Reps Performed",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 30,
        }
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const r = inputs.reps as number;
        if (!w || !r) return null;
        const orm = w * (36 / (37 - r));
        return {
          primary: { label: "Estimated 1RM", value: formatNumber(orm) + " kg" },
          details: [
            { label: "Weight lifted", value: w + " kg x " + r + " reps" },
            { label: "90% 1RM", value: formatNumber(orm * 0.9) + " kg" },
            { label: "80% 1RM", value: formatNumber(orm * 0.8) + " kg" },
            { label: "70% 1RM", value: formatNumber(orm * 0.7) + " kg" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the overhead press max calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
