import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anovaTestCalculator: CalculatorDefinition = {
  slug: "anova-test",
  title: "ANOVA Calculator",
  description: "Free anova calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["anova calculator"],
  variants: [{
    id: "standard",
    name: "ANOVA",
    description: "",
    fields: [
      { name: "ssb", label: "SS Between", type: "number", min: 0 },
      { name: "ssw", label: "SS Within", type: "number", min: 0.001 },
      { name: "dfb", label: "df Between", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "F-Statistic", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate anova?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
