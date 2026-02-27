import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strollerBudgetCalculator: CalculatorDefinition = {
  slug: "stroller-budget-calculator",
  title: "Stroller Budget Calculator",
  description: "Free stroller budget calculator. Calculate stroller budget quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stroller cost"],
  variants: [{
    id: "standard",
    name: "Stroller Budget",
    description: "",
    fields: [
      { name: "budget", label: "Budget ($)", type: "number", min: 50 },
      { name: "features", label: "Feature Level (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Recommendation", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate stroller budget?", answer: "Enter values and get instant results." },
    { question: "Why use this stroller budget calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
