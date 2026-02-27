import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cylindricalCoordinatesCalculator: CalculatorDefinition = {
  slug: "cylindrical-coordinates",
  title: "Cylindrical Coordinates Calculator",
  description: "Free cylindrical coordinates calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["cylindrical coordinates"],
  variants: [{
    id: "standard",
    name: "Cylindrical Coordinates",
    description: "",
    fields: [
      { name: "r", label: "r (radius)", type: "number", min: 0 },
      { name: "theta", label: "θ (°)", type: "number", min: 0, max: 360 },
      { name: "z", label: "z", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "(x, y, z)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cylindrical coordinates?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
