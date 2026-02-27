import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backToSchoolBudgetCalculator: CalculatorDefinition = {
  slug: "back-to-school-budget",
  title: "Back to School Budget Calculator",
  description: "Free back to school budget calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["back to school calculator"],
  variants: [{
    id: "standard",
    name: "Back to School Budget",
    description: "",
    fields: [
      { name: "children", label: "Children", type: "number", min: 1 },
      { name: "supplies", label: "Supplies ($)", type: "number", defaultValue: 100 },
      { name: "clothing", label: "Clothing ($)", type: "number", defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate back to school budget?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
