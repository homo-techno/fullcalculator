import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const darcyWeisbachCalculator: CalculatorDefinition = {
  slug: "darcy-weisbach",
  title: "Darcy-Weisbach Calculator",
  description: "Free darcy-weisbach calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["darcy weisbach calculator"],
  variants: [{
    id: "standard",
    name: "Darcy-Weisbach",
    description: "",
    fields: [
      { name: "friction", label: "Friction Factor", type: "number", defaultValue: 0.02 },
      { name: "length", label: "Pipe Length (m)", type: "number", min: 0.1 },
      { name: "diameter", label: "Diameter (m)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Head Loss (m)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate darcy-weisbach?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
