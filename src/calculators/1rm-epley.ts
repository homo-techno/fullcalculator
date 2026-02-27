import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n1rmEpleyCalculator: CalculatorDefinition = {
  slug: "1rm-epley",
  title: "1RM Epley Calculator",
  description: "Free 1rm epley calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["1rm epley calculator"],
  variants: [{
    id: "standard",
    name: "1RM Epley",
    description: "",
    fields: [
      { name: "weight", label: "Weight Lifted (lbs)", type: "number", min: 1 },
      { name: "reps", label: "Reps Completed", type: "number", min: 1, max: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "1RM (lbs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate 1rm epley?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "1RM = W × (1 + R/30)",
};
