import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodAlcoholCalcCalculator: CalculatorDefinition = {
  slug: "blood-alcohol-calc",
  title: "Blood Alcohol Content Calculator",
  description: "Free blood alcohol content calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bac calculator detailed"],
  variants: [{
    id: "standard",
    name: "Blood Alcohol Content",
    description: "",
    fields: [
      { name: "drinks", label: "Standard Drinks", type: "number", min: 0.5 },
      { name: "weight", label: "Weight (lbs)", type: "number", min: 80 },
      { name: "hours", label: "Hours Drinking", type: "number", min: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "BAC %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate blood alcohol content?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
