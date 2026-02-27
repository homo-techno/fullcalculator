import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bowlingAverageCalculator: CalculatorDefinition = {
  slug: "bowling-average-calculator",
  title: "Bowling Average Calculator",
  description: "Calculate bowling average with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bowling average calculator"],
  variants: [{
    id: "standard",
    name: "Bowling Average",
    description: "",
    fields: [
      { name: "totalPins", label: "Total Pins", type: "number", min: 1 },
      { name: "games", label: "Games Played", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Average", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bowling average?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good bowling average?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
