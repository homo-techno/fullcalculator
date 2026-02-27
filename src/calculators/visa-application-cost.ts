import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const visaApplicationCostCalculator: CalculatorDefinition = {
  slug: "visa-application-cost",
  title: "Visa Application Cost Calculator",
  description: "Free visa application cost calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["visa cost calculator"],
  variants: [{
    id: "standard",
    name: "Visa Application Cost",
    description: "",
    fields: [
      { name: "type", label: "Visa Type (1-5)", type: "number", defaultValue: 1 },
      { name: "applicants", label: "Applicants", type: "number", min: 1 },
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
    { question: "How to calculate visa application cost?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
