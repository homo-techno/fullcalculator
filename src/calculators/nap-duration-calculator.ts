import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const napDurationCalculator: CalculatorDefinition = {
  slug: "nap-duration-calculator",
  title: "Nap Duration Calculator",
  description: "Calculate nap duration with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["nap calculator"],
  variants: [{
    id: "standard",
    name: "Nap Duration",
    description: "",
    fields: [
      { name: "sleepLast", label: "Sleep Last Night (hrs)", type: "number", min: 0 },
      { name: "tiredness", label: "Tiredness (1-10)", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Nap Minutes", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate nap duration?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good nap duration?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
