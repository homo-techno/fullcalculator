import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hematocritCalcCalculator: CalculatorDefinition = {
  slug: "hematocrit-calc",
  title: "Hematocrit Calculator",
  description: "Free hematocrit calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hematocrit calculator"],
  variants: [{
    id: "standard",
    name: "Hematocrit",
    description: "",
    fields: [
      { name: "hemoglobin", label: "Hemoglobin (g/dL)", type: "number", min: 1 },
      { name: "factor", label: "Conversion Factor", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Hematocrit %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hematocrit?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
