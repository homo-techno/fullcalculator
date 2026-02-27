import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const insulinDoseCalcCalculator: CalculatorDefinition = {
  slug: "insulin-dose-calc",
  title: "Insulin Dosage Calculator",
  description: "Free insulin dosage calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["insulin dosage calculator"],
  variants: [{
    id: "standard",
    name: "Insulin Dosage",
    description: "",
    fields: [
      { name: "weight", label: "Weight (kg)", type: "number", min: 1 },
      { name: "factor", label: "TDD Factor (U/kg)", type: "number", defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Daily Dose (U)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate insulin dosage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
