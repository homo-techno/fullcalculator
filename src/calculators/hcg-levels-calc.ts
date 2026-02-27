import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hcgLevelsCalcCalculator: CalculatorDefinition = {
  slug: "hcg-levels-calc",
  title: "hCG Levels Calculator",
  description: "Free hcg levels calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hcg calculator", "hcg levels"],
  variants: [{
    id: "standard",
    name: "hCG Levels",
    description: "",
    fields: [
      { name: "level1", label: "First hCG (mIU/mL)", type: "number", min: 1 },
      { name: "level2", label: "Second hCG (mIU/mL)", type: "number", min: 1 },
      { name: "hours", label: "Hours Between", type: "number", defaultValue: 48 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Doubling Time (hrs)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate hcg levels?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
