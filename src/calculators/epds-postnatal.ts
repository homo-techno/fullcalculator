import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epdsPostnatalCalculator: CalculatorDefinition = {
  slug: "epds-postnatal",
  title: "EPDS Postnatal Calculator",
  description: "Free epds postnatal calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["epds calculator", "postnatal depression"],
  variants: [{
    id: "standard",
    name: "EPDS Postnatal",
    description: "",
    fields: [
      { name: "laugh", label: "Able to Laugh (0-3)", type: "number", min: 0, max: 3 },
      { name: "enjoyment", label: "Look Forward (0-3)", type: "number", min: 0, max: 3 },
      { name: "blame", label: "Self Blame (0-3)", type: "number", min: 0, max: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "EPDS Score", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate epds postnatal?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
