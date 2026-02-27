import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dupontAnalysisCalculator: CalculatorDefinition = {
  slug: "dupont-analysis",
  title: "DuPont Analysis Calculator",
  description: "Free dupont analysis calculator. Get accurate results instantly.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dupont analysis calculator"],
  variants: [{
    id: "standard",
    name: "DuPont Analysis",
    description: "",
    fields: [
      { name: "netIncome", label: "Net Income ($)", type: "number", min: 0 },
      { name: "revenue", label: "Revenue ($)", type: "number", min: 1 },
      { name: "assets", label: "Total Assets ($)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ROE %", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dupont analysis?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "ROE = Margin × Turnover × Leverage",
};
