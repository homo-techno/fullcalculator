import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hearingDamageRiskCalculator: CalculatorDefinition = {
  slug: "hearing-damage-risk-calculator",
  title: "Hearing Damage Risk Calculator",
  description: "Calculate hearing damage risk with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hearing damage calculator"],
  variants: [{
    id: "standard",
    name: "Hearing Damage Risk",
    description: "",
    fields: [
      { name: "decibels", label: "Noise Level (dB)", type: "number", min: 60 },
      { name: "hours", label: "Hours Exposed", type: "number", min: 0.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Risk Level", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hearing damage risk?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good hearing damage risk?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
