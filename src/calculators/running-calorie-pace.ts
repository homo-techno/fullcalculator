import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningCaloriePaceCalculator: CalculatorDefinition = {
  slug: "running-calorie-pace",
  title: "Running Calorie by Pace Calculator",
  description: "Free running calorie by pace calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["running calorie pace"],
  variants: [{
    id: "standard",
    name: "Running Calorie by Pace",
    description: "",
    fields: [
      { name: "weight", label: "Weight (lbs)", type: "number", min: 80 },
      { name: "pace", label: "Pace (min/mile)", type: "number", min: 4 },
      { name: "minutes", label: "Duration (min)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Calories", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate running calorie by pace?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
