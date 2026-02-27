import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbonationLevelCalculator: CalculatorDefinition = {
  slug: "carbonation-level-calculator",
  title: "Carbonation Level Calculator",
  description: "Calculate carbonation level with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["carbonation calculator", "CO2 volumes"],
  variants: [{
    id: "standard",
    name: "Carbonation Level",
    description: "",
    fields: [
      { name: "temp", label: "Beer Temp (°F)", type: "number", defaultValue: 40 },
      { name: "volumes", label: "CO2 Volumes", type: "number", defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PSI", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate carbonation level?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good carbonation level?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
