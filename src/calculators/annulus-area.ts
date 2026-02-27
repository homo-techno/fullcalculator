import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annulusAreaCalculator: CalculatorDefinition = {
  slug: "annulus-area",
  title: "Annulus Area Calculator",
  description: "Free annulus area calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["annulus area calculator"],
  variants: [{
    id: "standard",
    name: "Annulus Area",
    description: "",
    fields: [
      { name: "R", label: "Outer Radius", type: "number", min: 0.01 },
      { name: "r", label: "Inner Radius", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Area", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate annulus area?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "A = π(R² - r²)",
};
