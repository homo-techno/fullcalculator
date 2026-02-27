import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const circadianRhythmCalculator: CalculatorDefinition = {
  slug: "circadian-rhythm-calculator",
  title: "Circadian Rhythm Calculator",
  description: "Calculate circadian rhythm with our free online calculator. Get instant results.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["circadian rhythm calculator"],
  variants: [{
    id: "standard",
    name: "Circadian Rhythm",
    description: "",
    fields: [
      { name: "wakeTime", label: "Wake Time (24hr)", type: "number", defaultValue: 7 },
      { name: "sleepTime", label: "Sleep Time (24hr)", type: "number", defaultValue: 23 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Sleep Duration", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate circadian rhythm?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good circadian rhythm?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
