import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const importTaxCalculator: CalculatorDefinition = {
  slug: "import-tax",
  title: "Import Tax Calculator",
  description: "Free import tax calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["import tax calculator"],
  variants: [{
    id: "standard",
    name: "Import Tax",
    description: "",
    fields: [
      { name: "value", label: "CIF Value ($)", type: "number", min: 0.01 },
      { name: "dutyRate", label: "Duty Rate %", type: "number", defaultValue: 5 },
      { name: "vatRate", label: "VAT Rate %", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Tax ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate import tax?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
