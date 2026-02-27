import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orificeFlowCalculator: CalculatorDefinition = {
  slug: "orifice-flow",
  title: "Orifice Flow Calculator",
  description: "Free orifice flow calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orifice plate calculator"],
  variants: [{
    id: "standard",
    name: "Orifice Flow",
    description: "",
    fields: [
      { name: "cd", label: "Discharge Coeff", type: "number", defaultValue: 0.62 },
      { name: "area", label: "Orifice Area (m²)", type: "number", min: 0.0001 },
      { name: "dp", label: "Pressure Drop (Pa)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Flow Rate (m³/s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate orifice flow?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
