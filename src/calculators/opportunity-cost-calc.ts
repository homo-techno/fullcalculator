import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const opportunityCostCalcCalculator: CalculatorDefinition = {
  slug: "opportunity-cost-calc",
  title: "Opportunity Cost Calculator",
  description: "Free opportunity cost calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["opportunity cost calculator"],
  variants: [{
    id: "standard",
    name: "Opportunity Cost",
    description: "",
    fields: [
      { name: "optionA", label: "Option A Return ($)", type: "number", min: 0 },
      { name: "optionB", label: "Option B Return ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Opportunity Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate opportunity cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
