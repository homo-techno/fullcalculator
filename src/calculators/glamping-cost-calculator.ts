import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glampingCostCalculator: CalculatorDefinition = {
  slug: "glamping-cost-calculator",
  title: "Glamping Cost Calculator",
  description: "Calculate glamping cost costs and expenses. Free online glamping cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["glamping cost"],
  variants: [{
    id: "standard",
    name: "Glamping Cost",
    description: "",
    fields: [
      { name: "nights", label: "Nights", type: "number", min: 1 },
      { name: "perNight", label: "Per Night ($)", type: "number", defaultValue: 150 },
      { name: "guests", label: "Guests", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => !x || x <= 0)) return null;
      const result = v.reduce((a, b) => a * b, 1) / (v.length > 2 ? v[v.length-1] : 1);
      return { primary: { label: "Estimated Cost", value: "$" + formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["budget-calculator"],
  faq: [
    { question: "How much does glamping cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect glamping cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
