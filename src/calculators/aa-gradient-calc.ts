import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aaGradientCalcCalculator: CalculatorDefinition = {
  slug: "aa-gradient-calc",
  title: "A-a Gradient Calculator",
  description: "Free a-a gradient calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["aa gradient calculator"],
  variants: [{
    id: "standard",
    name: "A-a Gradient",
    description: "",
    fields: [
      { name: "fio2", label: "FiO2 %", type: "number", defaultValue: 21 },
      { name: "pao2", label: "PaO2 (mmHg)", type: "number", min: 1 },
      { name: "paco2", label: "PaCO2 (mmHg)", type: "number", defaultValue: 40 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "A-a Gradient", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate a-a gradient?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
