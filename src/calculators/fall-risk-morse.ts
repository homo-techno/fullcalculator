import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fallRiskMorseCalculator: CalculatorDefinition = {
  slug: "fall-risk-morse",
  title: "Fall Risk Morse Calculator",
  description: "Free fall risk morse calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["morse fall scale calculator"],
  variants: [{
    id: "standard",
    name: "Fall Risk Morse",
    description: "",
    fields: [
      { name: "fallHistory", label: "Fall History (0-25)", type: "number", min: 0, max: 25 },
      { name: "diagnosis", label: "Secondary Diagnosis (0-15)", type: "number", min: 0, max: 15 },
      { name: "ambulatory", label: "Ambulatory Aid (0-30)", type: "number", min: 0, max: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Risk Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fall risk morse?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
