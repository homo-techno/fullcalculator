import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const covarianceCalcCalculator: CalculatorDefinition = {
  slug: "covariance-calc",
  title: "Covariance Calculator",
  description: "Free covariance calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["covariance calculator"],
  variants: [{
    id: "standard",
    name: "Covariance",
    description: "",
    fields: [
      { name: "sumXY", label: "Σ(Xi×Yi)", type: "number" },
      { name: "meanX", label: "Mean X", type: "number" },
      { name: "meanY", label: "Mean Y", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Covariance", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate covariance?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
