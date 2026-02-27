import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strokeVolumeCalcCalculator: CalculatorDefinition = {
  slug: "stroke-volume-calc",
  title: "Stroke Volume Calculator",
  description: "Free stroke volume calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["stroke volume calculator"],
  variants: [{
    id: "standard",
    name: "Stroke Volume",
    description: "",
    fields: [
      { name: "co", label: "Cardiac Output (L/min)", type: "number", min: 1 },
      { name: "hr", label: "Heart Rate (bpm)", type: "number", min: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "SV (mL)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate stroke volume?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "SV = CO × 1000 / HR",
};
