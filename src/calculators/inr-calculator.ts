import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inrCalculator: CalculatorDefinition = {
  slug: "inr-calculator",
  title: "INR Calculator",
  description: "Free inr calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["inr calculator"],
  variants: [{
    id: "standard",
    name: "INR",
    description: "",
    fields: [
      { name: "pt", label: "Patient PT (sec)", type: "number", min: 1 },
      { name: "meanNormal", label: "Mean Normal PT (sec)", type: "number", defaultValue: 12 },
      { name: "isi", label: "ISI", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "INR", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate inr?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
