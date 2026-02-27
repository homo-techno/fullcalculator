import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ductSizeCalcCalculator: CalculatorDefinition = {
  slug: "duct-size-calc",
  title: "Duct Size Calculator",
  description: "Free duct size calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["duct size calculator"],
  variants: [{
    id: "standard",
    name: "Duct Size",
    description: "",
    fields: [
      { name: "cfm", label: "CFM", type: "number", min: 50 },
      { name: "velocity", label: "Velocity (fpm)", type: "number", defaultValue: 700 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Duct Diameter (in)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate duct size?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
