import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thinLensCalcCalculator: CalculatorDefinition = {
  slug: "thin-lens-calc",
  title: "Thin Lens Equation Calculator",
  description: "Free thin lens equation calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["thin lens calculator"],
  variants: [{
    id: "standard",
    name: "Thin Lens Equation",
    description: "",
    fields: [
      { name: "objectDist", label: "Object Distance (cm)", type: "number", min: 0.1 },
      { name: "focalLength", label: "Focal Length (cm)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Image Distance (cm)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate thin lens equation?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "1/f = 1/do + 1/di",
};
