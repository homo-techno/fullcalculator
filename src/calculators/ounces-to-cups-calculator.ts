import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ouncesToCupsCalculator: CalculatorDefinition = {
  slug: "ounces-to-cups-calculator",
  title: "Ounces to Cups Calculator",
  description: "Calculate ounces to cups with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ounces to cups"],
  variants: [{
    id: "standard",
    name: "Ounces to Cups",
    description: "",
    fields: [
      { name: "oz", label: "Ounces", type: "number", min: 0.1 },
      { name: "factor", label: "Cups/8oz", type: "number", defaultValue: 0.125 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cups", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate ounces to cups?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good ounces to cups?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
