import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const painScaleAssessmentCalculator: CalculatorDefinition = {
  slug: "pain-scale-assessment",
  title: "Pain Scale Assessment Calculator",
  description: "Free pain scale assessment calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pain scale calculator"],
  variants: [{
    id: "standard",
    name: "Pain Scale Assessment",
    description: "",
    fields: [
      { name: "pain", label: "Pain Level (0-10)", type: "number", min: 0, max: 10 },
      { name: "interference", label: "Activity Interference (0-10)", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Pain Category", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pain scale assessment?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
