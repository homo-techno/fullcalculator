import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rmPercentageCalculator: CalculatorDefinition = {
  slug: "rm-percentage",
  title: "RM Percentage Calculator",
  description: "Free rm percentage calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rm percentage calculator"],
  variants: [{
    id: "standard",
    name: "RM Percentage",
    description: "",
    fields: [
      { name: "oneRM", label: "1RM (lbs)", type: "number", min: 1 },
      { name: "percentage", label: "Percentage %", type: "number", min: 50, max: 100 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Working Weight (lbs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rm percentage?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
