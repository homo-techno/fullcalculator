import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cropYieldEstimateCalculator: CalculatorDefinition = {
  slug: "crop-yield-estimate-calculator",
  title: "Crop Yield Calculator",
  description: "Calculate crop yield with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crop yield calculator"],
  variants: [{
    id: "standard",
    name: "Crop Yield",
    description: "",
    fields: [
      { name: "plants", label: "Number of Plants", type: "number", min: 1 },
      { name: "yieldPerPlant", label: "Yield/Plant (lbs)", type: "number", min: 0.1 },
      { name: "harvestCycles", label: "Harvest Cycles", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Yield (lbs)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate crop yield?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good crop yield?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
