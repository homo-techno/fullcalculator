import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementSavingsGapCalculator: CalculatorDefinition = {
  slug: "retirement-savings-gap-calculator",
  title: "Retirement Gap Calculator",
  description: "Free retirement gap calculator. Calculate retirement gap quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement gap calculator"],
  variants: [{
    id: "standard",
    name: "Retirement Gap",
    description: "",
    fields: [
      { name: "current", label: "Current Savings ($)", type: "number", min: 0 },
      { name: "needed", label: "Needed at Retirement ($)", type: "number", min: 1 },
      { name: "years", label: "Years Until Retirement", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Savings Needed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate retirement gap?", answer: "Enter values and get instant results." },
    { question: "Why use this retirement gap calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
