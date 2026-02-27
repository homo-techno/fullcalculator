import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workingCapitalRatioCalculator: CalculatorDefinition = {
  slug: "working-capital-ratio-calculator",
  title: "Working Capital Calculator",
  description: "Calculate working capital with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["working capital calculator"],
  variants: [{
    id: "standard",
    name: "Working Capital",
    description: "",
    fields: [
      { name: "currentAssets", label: "Current Assets ($)", type: "number", min: 0 },
      { name: "currentLiab", label: "Current Liabilities ($)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "WC Ratio", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate working capital?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good working capital?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
