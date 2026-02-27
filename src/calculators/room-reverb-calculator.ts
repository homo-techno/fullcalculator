import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roomReverbCalculator: CalculatorDefinition = {
  slug: "room-reverb-calculator",
  title: "Room Reverb Time Calculator",
  description: "Calculate room reverb time with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["reverb calculator"],
  variants: [{
    id: "standard",
    name: "Room Reverb Time",
    description: "",
    fields: [
      { name: "volume", label: "Room Volume (cu ft)", type: "number", min: 100 },
      { name: "absorption", label: "Absorption Coeff", type: "number", defaultValue: 0.3 },
      { name: "surface", label: "Surface Area (sq ft)", type: "number", min: 50 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "RT60 (sec)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate room reverb time?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good room reverb time?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
