import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fahrenheitToGasCalculator: CalculatorDefinition = {
  slug: "fahrenheit-to-gas-calculator",
  title: "Fahrenheit to Gas Mark Calculator",
  description: "Calculate fahrenheit to gas mark with our free online calculator. Get instant results.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gas mark converter"],
  variants: [{
    id: "standard",
    name: "Fahrenheit to Gas Mark",
    description: "",
    fields: [
      { name: "fahrenheit", label: "Fahrenheit", type: "number", min: 250 },
      { name: "offset", label: "Offset", type: "number", defaultValue: 250 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gas Mark", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fahrenheit to gas mark?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good fahrenheit to gas mark?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
