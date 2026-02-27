import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vo2maxCalcCalculator: CalculatorDefinition = {
  slug: "vo2max-calc",
  title: "VO2 Max Calculator",
  description: "Free vo2 max calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["vo2max calculator"],
  variants: [{
    id: "standard",
    name: "VO2 Max",
    description: "",
    fields: [
      { name: "age", label: "Age", type: "number", min: 10 },
      { name: "restHR", label: "Resting HR", type: "number", defaultValue: 60 },
      { name: "maxHR", label: "Max HR", type: "number", defaultValue: 190 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "VO2max (mL/kg/min)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate vo2 max?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
