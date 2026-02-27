import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drywallCalcCalculator: CalculatorDefinition = {
  slug: "drywall-calc",
  title: "Drywall Sheets Calculator",
  description: "Free drywall sheets calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drywall calculator"],
  variants: [{
    id: "standard",
    name: "Drywall Sheets",
    description: "",
    fields: [
      { name: "wallArea", label: "Wall Area (sq ft)", type: "number", min: 10 },
      { name: "sheetSize", label: "Sheet Size (sq ft)", type: "number", defaultValue: 32 },
      { name: "waste", label: "Waste %", type: "number", defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Sheets Needed", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate drywall sheets?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
