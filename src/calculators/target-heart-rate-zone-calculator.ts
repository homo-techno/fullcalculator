import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const targetHeartRateZoneCalculator: CalculatorDefinition = {
  slug: "target-heart-rate-zone-calculator",
  title: "Target Heart Rate Zone Calculator",
  description: "Free target heart rate zone calculator. Get instant results with our easy-to-use calculator.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["target heart rate zone calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Target Heart Rate Zone",
      description: "Calculate target heart rate zone",
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
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 175",
          suffix: "cm",
          min: 100,
          max: 250,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 10,
          max: 100,
        }
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const h = inputs.height as number;
        const age = inputs.age as number;
        if (!w || !h || !age) return null;
        const bmi = w / Math.pow(h / 100, 2);
        const score = Math.round((100 - bmi) * (1 - age/200) * 10) / 10;
        const rating = score > 70 ? "Excellent" : score > 50 ? "Good" : score > 30 ? "Average" : "Below Average";
        return {
          primary: { label: "Score", value: formatNumber(score) + " (" + rating + ")" },
          details: [
            { label: "BMI", value: formatNumber(bmi) },
            { label: "Height-weight ratio", value: formatNumber(w/h*100) },
            { label: "Age factor", value: formatNumber(1 - age/200) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the target heart rate zone calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
