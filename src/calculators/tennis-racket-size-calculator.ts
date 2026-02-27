import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tennisRacketSizeCalculator: CalculatorDefinition = {
  slug: "tennis-racket-size-calculator",
  title: "Tennis Racket Calculator",
  description: "Calculate tennis racket with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tennis racket size"],
  variants: [{
    id: "standard",
    name: "Tennis Racket",
    description: "",
    fields: [
      { name: "height", label: "Height (in)", type: "number", min: 30 },
      { name: "age", label: "Age", type: "number", min: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Racket Length (in)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tennis racket?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good tennis racket?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
