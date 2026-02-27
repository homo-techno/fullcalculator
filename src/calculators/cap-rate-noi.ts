import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capRateNoiCalculator: CalculatorDefinition = {
  slug: "cap-rate-noi",
  title: "Cap Rate from NOI Calculator",
  description: "Free cap rate from noi calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cap rate noi calculator"],
  variants: [{
    id: "standard",
    name: "Cap Rate from NOI",
    description: "",
    fields: [
      { name: "noi", label: "Net Operating Income ($)", type: "number", min: 1 },
      { name: "value", label: "Property Value ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cap Rate %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cap rate from noi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
