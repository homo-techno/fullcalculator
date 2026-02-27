import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hobbyBudgetCalculator: CalculatorDefinition = {
  slug: "hobby-budget",
  title: "Hobby Budget Calculator",
  description: "Free hobby budget calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hobby budget calculator"],
  variants: [{
    id: "standard",
    name: "Hobby Budget",
    description: "",
    fields: [
      { name: "monthlySpend", label: "Monthly Spend ($)", type: "number", min: 1 },
      { name: "months", label: "Months", type: "number", defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Annual Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hobby budget?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
