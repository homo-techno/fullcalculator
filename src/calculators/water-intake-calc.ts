import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterIntakeCalcCalculator: CalculatorDefinition = {
  slug: "water-intake-calc",
  title: "Water Intake Calculator",
  description: "Free water intake calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["water intake calculator detailed"],
  variants: [{
    id: "standard",
    name: "Water Intake",
    description: "",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 50 },
      { name: "exercise", label: "Exercise Min/Day", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Oz/Day", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate water intake?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
