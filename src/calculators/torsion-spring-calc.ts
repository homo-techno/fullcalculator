import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const torsionSpringCalcCalculator: CalculatorDefinition = {
  slug: "torsion-spring-calc",
  title: "Torsion Spring Calculator",
  description: "Free torsion spring calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["torsion spring calculator"],
  variants: [{
    id: "standard",
    name: "Torsion Spring",
    description: "",
    fields: [
      { name: "wireDiam", label: "Wire Diameter (mm)", type: "number", min: 0.1 },
      { name: "coilDiam", label: "Coil Diameter (mm)", type: "number", min: 1 },
      { name: "turns", label: "Active Turns", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Spring Rate (N·mm/°)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate torsion spring?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
