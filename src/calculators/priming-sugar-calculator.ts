import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const primingSugarCalculator: CalculatorDefinition = {
  slug: "priming-sugar-calculator",
  title: "Priming Sugar Calculator",
  description: "Calculate priming sugar with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["priming sugar calculator"],
  variants: [{
    id: "standard",
    name: "Priming Sugar",
    description: "",
    fields: [
      { name: "batchSize", label: "Batch Size (gal)", type: "number", defaultValue: 5 },
      { name: "volumes", label: "CO2 Volumes", type: "number", defaultValue: 2.4 },
      { name: "temp", label: "Beer Temp (°F)", type: "number", defaultValue: 65 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Sugar (oz)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate priming sugar?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good priming sugar?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
