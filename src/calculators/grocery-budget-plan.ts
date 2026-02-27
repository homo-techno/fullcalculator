import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groceryBudgetPlanCalculator: CalculatorDefinition = {
  slug: "grocery-budget-plan",
  title: "Grocery Budget Calculator",
  description: "Free grocery budget calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grocery budget calculator"],
  variants: [{
    id: "standard",
    name: "Grocery Budget",
    description: "",
    fields: [
      { name: "people", label: "People", type: "number", min: 1 },
      { name: "plan", label: "Plan Level (1-3)", type: "number", defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Budget ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate grocery budget?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
