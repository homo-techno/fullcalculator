import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lensMakerCalcCalculator: CalculatorDefinition = {
  slug: "lens-maker-calc",
  title: "Lens Maker Equation Calculator",
  description: "Free lens maker equation calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lens maker calculator"],
  variants: [{
    id: "standard",
    name: "Lens Maker Equation",
    description: "",
    fields: [
      { name: "n", label: "Refractive Index", type: "number", defaultValue: 1.5 },
      { name: "r1", label: "R1 (m)", type: "number" },
      { name: "r2", label: "R2 (m)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Focal Length (m)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate lens maker equation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
