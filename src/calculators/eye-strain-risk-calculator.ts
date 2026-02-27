import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyeStrainRiskCalculator: CalculatorDefinition = {
  slug: "eye-strain-risk-calculator",
  title: "Eye Strain Risk Calculator",
  description: "Calculate eye strain risk with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["eye strain calculator"],
  variants: [{
    id: "standard",
    name: "Eye Strain Risk",
    description: "",
    fields: [
      { name: "screenHours", label: "Screen Hours/Day", type: "number", min: 1 },
      { name: "breaks", label: "Breaks/Hour", type: "number", defaultValue: 1 },
      { name: "distance", label: "Screen Distance (in)", type: "number", defaultValue: 24 },
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
    { question: "How to calculate eye strain risk?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good eye strain risk?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
