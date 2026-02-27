import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sittingHealthRiskCalculator: CalculatorDefinition = {
  slug: "sitting-health-risk-calculator",
  title: "Sitting Health Risk Calculator",
  description: "Calculate sitting health risk with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sitting risk calculator"],
  variants: [{
    id: "standard",
    name: "Sitting Health Risk",
    description: "",
    fields: [
      { name: "sittingHours", label: "Sitting Hours/Day", type: "number", min: 1 },
      { name: "exerciseMin", label: "Exercise Min/Day", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Risk Score", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sitting health risk?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good sitting health risk?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
