import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smokingMeatTimeCalculator: CalculatorDefinition = {
  slug: "smoking-meat-time-calculator",
  title: "Smoking Meat Time Calculator",
  description: "Calculate smoking meat time with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["smoking meat calculator"],
  variants: [{
    id: "standard",
    name: "Smoking Meat Time",
    description: "",
    fields: [
      { name: "weight", label: "Meat Weight (lbs)", type: "number", min: 1 },
      { name: "temp", label: "Smoker Temp (°F)", type: "number", defaultValue: 225 },
      { name: "hoursPerLb", label: "Hours/Lb", type: "number", defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Hours", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate smoking meat time?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good smoking meat time?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
