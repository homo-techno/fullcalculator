import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyStampDutyCalculator: CalculatorDefinition = {
  slug: "property-stamp-duty",
  title: "Stamp Duty Calculator",
  description: "Free stamp duty calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stamp duty calculator"],
  variants: [{
    id: "standard",
    name: "Stamp Duty",
    description: "",
    fields: [
      { name: "price", label: "Property Price ($)", type: "number", min: 10000 },
      { name: "rate", label: "Rate %", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Stamp Duty ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate stamp duty?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
