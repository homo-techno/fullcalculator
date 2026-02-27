import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellPhonePlanCostCalculator: CalculatorDefinition = {
  slug: "cell-phone-plan-cost",
  title: "Cell Phone Plan Cost Calculator",
  description: "Free cell phone plan cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cell phone plan calculator"],
  variants: [{
    id: "standard",
    name: "Cell Phone Plan Cost",
    description: "",
    fields: [
      { name: "lines", label: "Lines", type: "number", min: 1 },
      { name: "data", label: "Data (GB)", type: "number", defaultValue: 10 },
      { name: "baseCost", label: "Base Cost ($)", type: "number", defaultValue: 40 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Total ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cell phone plan cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
