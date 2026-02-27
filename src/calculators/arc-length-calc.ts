import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const arcLengthCalcCalculator: CalculatorDefinition = {
  slug: "arc-length-calc",
  title: "Arc Length Calculator",
  description: "Free arc length calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["arc length calculator"],
  variants: [{
    id: "standard",
    name: "Arc Length",
    description: "",
    fields: [
      { name: "radius", label: "Radius", type: "number", min: 0.01 },
      { name: "angle", label: "Angle (°)", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Arc Length", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate arc length?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
