import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const climbingRopeCalculator: CalculatorDefinition = {
  slug: "climbing-rope-calculator",
  title: "Climbing Rope Calculator",
  description: "Calculate climbing rope with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["climbing rope calculator"],
  variants: [{
    id: "standard",
    name: "Climbing Rope",
    description: "",
    fields: [
      { name: "routeHeight", label: "Route Height (m)", type: "number", min: 5 },
      { name: "multiplier", label: "Safety Multiplier", type: "number", defaultValue: 2.2 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Rope Length (m)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate climbing rope?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good climbing rope?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
