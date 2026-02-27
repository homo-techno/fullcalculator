import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sleepCycleCalcCalculator: CalculatorDefinition = {
  slug: "sleep-cycle-calc",
  title: "Sleep Cycle Calculator",
  description: "Free sleep cycle calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sleep cycle calculator"],
  variants: [{
    id: "standard",
    name: "Sleep Cycle",
    description: "",
    fields: [
      { name: "bedtime", label: "Bedtime (24hr)", type: "number", defaultValue: 23 },
      { name: "cycles", label: "Desired Cycles", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Wake Time", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate sleep cycle?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
