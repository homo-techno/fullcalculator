import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cableLengthSignalCalculator: CalculatorDefinition = {
  slug: "cable-length-signal-calculator",
  title: "Cable Signal Loss Calculator",
  description: "Calculate cable signal loss with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cable signal loss"],
  variants: [{
    id: "standard",
    name: "Cable Signal Loss",
    description: "",
    fields: [
      { name: "length", label: "Cable Length (ft)", type: "number", min: 1 },
      { name: "lossPerFt", label: "Loss/Ft (dB)", type: "number", defaultValue: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Loss (dB)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cable signal loss?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good cable signal loss?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
