import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fluidOzToMlCalculator: CalculatorDefinition = {
  slug: "fluid-oz-to-ml-calculator",
  title: "Fluid Oz to mL Calculator",
  description: "Calculate fluid oz to ml with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fluid ounces to ml"],
  variants: [{
    id: "standard",
    name: "Fluid Oz to mL",
    description: "",
    fields: [
      { name: "oz", label: "Fluid Ounces", type: "number", min: 0.1 },
      { name: "factor", label: "mL/fl oz", type: "number", defaultValue: 29.574 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Milliliters", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fluid oz to ml?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good fluid oz to ml?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
