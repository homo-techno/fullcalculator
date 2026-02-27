import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reverberationTimeCalcCalculator: CalculatorDefinition = {
  slug: "reverberation-time-calc",
  title: "Reverberation Time Calculator",
  description: "Free reverberation time calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["reverberation time calculator"],
  variants: [{
    id: "standard",
    name: "Reverberation Time",
    description: "",
    fields: [
      { name: "volume", label: "Room Volume (m³)", type: "number", min: 1 },
      { name: "absorption", label: "Total Absorption (m²)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "RT60 (s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate reverberation time?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "RT60 = 0.161V/A",
};
