import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postureScoreCalculator: CalculatorDefinition = {
  slug: "posture-score-calculator",
  title: "Posture Score Calculator",
  description: "Calculate posture score with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["posture assessment"],
  variants: [{
    id: "standard",
    name: "Posture Score",
    description: "",
    fields: [
      { name: "headForward", label: "Head Forward (in)", type: "number", defaultValue: 1 },
      { name: "shoulderRound", label: "Shoulder Round (deg)", type: "number", defaultValue: 10 },
      { name: "screenHours", label: "Screen Hours/Day", type: "number", defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Posture Score", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate posture score?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good posture score?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
