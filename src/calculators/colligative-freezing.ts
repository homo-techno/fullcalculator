import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const colligativeFreezingCalculator: CalculatorDefinition = {
  slug: "colligative-freezing",
  title: "Freezing Point Depression Calculator",
  description: "Free freezing point depression calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["freezing point depression"],
  variants: [{
    id: "standard",
    name: "Freezing Point Depression",
    description: "",
    fields: [
      { name: "kf", label: "Kf (°C/m)", type: "number", defaultValue: 1.86 },
      { name: "molality", label: "Molality (m)", type: "number", min: 0.001 },
      { name: "vanHoff", label: "van Hoff Factor", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ΔTf (°C)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate freezing point depression?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
