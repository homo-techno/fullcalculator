import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shearStressCalcCalculator: CalculatorDefinition = {
  slug: "shear-stress-calc",
  title: "Shear Stress Calculator",
  description: "Free shear stress calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["shear stress calculator"],
  variants: [{
    id: "standard",
    name: "Shear Stress",
    description: "",
    fields: [
      { name: "force", label: "Shear Force (N)", type: "number", min: 0 },
      { name: "area", label: "Area (m²)", type: "number", min: 0.001 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Shear Stress (Pa)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate shear stress?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
