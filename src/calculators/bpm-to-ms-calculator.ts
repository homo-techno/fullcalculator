import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bpmToMsCalculator: CalculatorDefinition = {
  slug: "bpm-to-ms-calculator",
  title: "BPM to Milliseconds Calculator",
  description: "Calculate bpm to milliseconds with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bpm to ms converter"],
  variants: [{
    id: "standard",
    name: "BPM to Milliseconds",
    description: "",
    fields: [
      { name: "bpm", label: "BPM", type: "number", min: 1 },
      { name: "noteValue", label: "Note Value (1=whole)", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Delay (ms)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bpm to milliseconds?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good bpm to milliseconds?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
