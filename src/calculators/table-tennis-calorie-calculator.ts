import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tableTennisCalorieCalculator: CalculatorDefinition = {
  slug: "table-tennis-calorie-calculator",
  title: "Table Tennis Calorie Calculator",
  description: "Free table tennis calorie calculator. Get instant results with our easy-to-use calculator.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["table tennis calorie calculator", "calories burned", "exercise calculator"],
  variants: [
    {
      id: "standard",
      name: "Table Tennis Calorie",
      description: "Calculate table tennis calorie",
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
        const cal = 4 * w * (d / 60);
        return {
          primary: { label: "Calories Burned", value: formatNumber(cal) + " kcal" },
          details: [
            { label: "Per minute", value: formatNumber(cal / d) + " kcal" },
            { label: "Per hour", value: formatNumber(4 * w) + " kcal" },
            { label: "MET value", value: "4" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bmi-calculator"],
  faq: [
    { question: "How does the table tennis calorie calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
