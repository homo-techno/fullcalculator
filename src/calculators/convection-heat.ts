import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const convectionHeatCalculator: CalculatorDefinition = {
  slug: "convection-heat",
  title: "Convection Heat Transfer Calculator",
  description: "Free convection heat transfer calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["convection calculator"],
  variants: [{
    id: "standard",
    name: "Convection Heat Transfer",
    description: "",
    fields: [
      { name: "h", label: "h (W/m²·K)", type: "number", min: 0.1 },
      { name: "area", label: "Area (m²)", type: "number", min: 0.001 },
      { name: "deltaT", label: "ΔT (°C)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Heat (W)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate convection heat transfer?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Q = hAΔT",
};
