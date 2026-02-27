import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iBeamCalcCalculator: CalculatorDefinition = {
  slug: "i-beam-calc",
  title: "I-Beam Size Calculator",
  description: "Free i-beam size calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["i beam calculator"],
  variants: [{
    id: "standard",
    name: "I-Beam Size",
    description: "",
    fields: [
      { name: "span", label: "Span (ft)", type: "number", min: 1 },
      { name: "load", label: "Load (lbs/ft)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Min Section Modulus", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate i-beam size?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
