import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woundMeasurementCalculator: CalculatorDefinition = {
  slug: "wound-measurement",
  title: "Wound Measurement Calculator",
  description: "Free wound measurement calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["wound measurement calculator"],
  variants: [{
    id: "standard",
    name: "Wound Measurement",
    description: "",
    fields: [
      { name: "length", label: "Length (cm)", type: "number", min: 0.1 },
      { name: "width", label: "Width (cm)", type: "number", min: 0.1 },
      { name: "depth", label: "Depth (cm)", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Area (cm²)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate wound measurement?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
