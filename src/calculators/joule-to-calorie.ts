import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jouleToCalorieCalculator: CalculatorDefinition = {
  slug: "joule-to-calorie",
  title: "Joule to Calorie Calculator",
  description: "Free joule to calorie calculator. Get accurate results instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["joule to calorie converter"],
  variants: [{
    id: "standard",
    name: "Joule to Calorie",
    description: "",
    fields: [
      { name: "joules", label: "Joules", type: "number", min: 0 },
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
    { question: "How to calculate joule to calorie?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
