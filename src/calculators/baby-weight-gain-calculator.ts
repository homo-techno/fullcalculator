import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyWeightGainCalculator: CalculatorDefinition = {
  slug: "baby-weight-gain-calculator",
  title: "Baby Weight Gain Calculator",
  description: "Free baby weight gain calculator. Calculate baby weight gain quickly and accurately.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["baby weight gain"],
  variants: [{
    id: "standard",
    name: "Baby Weight Gain",
    description: "",
    fields: [
      { name: "birthWeight", label: "Birth Weight (lbs)", type: "number", min: 1 },
      { name: "weeks", label: "Age (weeks)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Expected Weight", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate baby weight gain?", answer: "Enter values and get instant results." },
    { question: "Why use this baby weight gain calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
