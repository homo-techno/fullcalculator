import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightningDistanceCalculator: CalculatorDefinition = {
  slug: "lightning-distance-calculator",
  title: "Lightning Distance Calculator",
  description: "Free lightning distance calculator. Calculate lightning distance quickly and accurately.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lightning distance"],
  variants: [{
    id: "standard",
    name: "Lightning Distance",
    description: "",
    fields: [
      { name: "seconds", label: "Seconds After Flash", type: "number", min: 0 },
      { name: "speedOfSound", label: "Speed of Sound (mph)", type: "number", defaultValue: 767 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Distance (miles)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate lightning distance?", answer: "Enter values and get instant results." },
    { question: "Why use this lightning distance calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
