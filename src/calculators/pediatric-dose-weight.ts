import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pediatricDoseWeightCalculator: CalculatorDefinition = {
  slug: "pediatric-dose-weight",
  title: "Pediatric Dose by Weight Calculator",
  description: "Free pediatric dose by weight calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pediatric dose calculator"],
  variants: [{
    id: "standard",
    name: "Pediatric Dose by Weight",
    description: "",
    fields: [
      { name: "weight", label: "Weight (kg)", type: "number", min: 1 },
      { name: "dosePerKg", label: "Dose/kg (mg)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Dose (mg)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pediatric dose by weight?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
