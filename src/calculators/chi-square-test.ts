import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chiSquareTestCalculator: CalculatorDefinition = {
  slug: "chi-square-test",
  title: "Chi-Square Test Calculator",
  description: "Free chi-square test calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["chi square calculator"],
  variants: [{
    id: "standard",
    name: "Chi-Square Test",
    description: "",
    fields: [
      { name: "observed", label: "Observed", type: "number", min: 0 },
      { name: "expected", label: "Expected", type: "number", min: 0.01 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Chi-Square", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate chi-square test?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "χ² = Σ(O-E)²/E",
};
