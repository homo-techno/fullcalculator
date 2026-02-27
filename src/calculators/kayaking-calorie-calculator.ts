import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kayakingCalorieCalculator: CalculatorDefinition = {
  slug: "kayaking-calorie-calculator",
  title: "Kayaking Calorie Calculator",
  description: "Free kayaking calorie calculator. Get instant results with our easy-to-use calculator.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["kayaking calorie calculator", "calories burned", "exercise calculator"],
  variants: [
    {
      id: "standard",
      name: "Kayaking Calorie",
      description: "Calculate kayaking calorie",
      fields: [
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 20,
          max: 300,
        },
        {
          name: "duration",
          label: "Duration",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "minutes",
          min: 1,
          max: 600,
        }
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const d = inputs.duration as number;
        if (!w || !d) return null;
        const cal = 5 * w * (d / 60);
        return {
          primary: { label: "Calories Burned", value: formatNumber(cal) + " kcal" },
          details: [
            { label: "Per minute", value: formatNumber(cal / d) + " kcal" },
            { label: "Per hour", value: formatNumber(5 * w) + " kcal" },
            { label: "MET value", value: "5" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator"],
  faq: [
    { question: "How does the kayaking calorie calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
