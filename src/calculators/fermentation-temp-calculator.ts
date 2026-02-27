import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fermentationTempCalculator: CalculatorDefinition = {
  slug: "fermentation-temp-calculator",
  title: "Fermentation Temperature Calculator",
  description: "Calculate fermentation temperature with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fermentation temp"],
  variants: [{
    id: "standard",
    name: "Fermentation Temperature",
    description: "",
    fields: [
      { name: "ambient", label: "Ambient Temp (°F)", type: "number", defaultValue: 72 },
      { name: "yeastMin", label: "Yeast Min (°F)", type: "number", defaultValue: 60 },
      { name: "yeastMax", label: "Yeast Max (°F)", type: "number", defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Optimal Temp", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fermentation temperature?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good fermentation temperature?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
