import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epsGrowthCalcCalculator: CalculatorDefinition = {
  slug: "eps-growth-calc",
  title: "EPS Growth Calculator",
  description: "Free eps growth calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["eps growth calculator"],
  variants: [{
    id: "standard",
    name: "EPS Growth",
    description: "",
    fields: [
      { name: "epsNow", label: "Current EPS ($)", type: "number" },
      { name: "epsPrior", label: "Prior EPS ($)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Growth %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate eps growth?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
