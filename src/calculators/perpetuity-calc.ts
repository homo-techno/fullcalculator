import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const perpetuityCalcCalculator: CalculatorDefinition = {
  slug: "perpetuity-calc",
  title: "Perpetuity Calculator",
  description: "Free perpetuity calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["perpetuity calculator"],
  variants: [{
    id: "standard",
    name: "Perpetuity",
    description: "",
    fields: [
      { name: "payment", label: "Annual Payment ($)", type: "number", min: 1 },
      { name: "rate", label: "Discount Rate %", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PV ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate perpetuity?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "PV = PMT / r",
};
