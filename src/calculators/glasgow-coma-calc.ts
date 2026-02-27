import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glasgowComaCalcCalculator: CalculatorDefinition = {
  slug: "glasgow-coma-calc",
  title: "Glasgow Coma Scale Calculator",
  description: "Free glasgow coma scale calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["glasgow coma scale calculator"],
  variants: [{
    id: "standard",
    name: "Glasgow Coma Scale",
    description: "",
    fields: [
      { name: "eye", label: "Eye Response (1-4)", type: "number", min: 1, max: 4 },
      { name: "verbal", label: "Verbal Response (1-5)", type: "number", min: 1, max: 5 },
      { name: "motor", label: "Motor Response (1-6)", type: "number", min: 1, max: 6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "GCS Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate glasgow coma scale?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
