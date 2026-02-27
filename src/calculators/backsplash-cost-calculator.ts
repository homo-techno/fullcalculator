import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backsplashCostCalculator: CalculatorDefinition = {
  slug: "backsplash-cost-calculator",
  title: "Backsplash Cost Calculator",
  description: "Calculate backsplash cost costs and expenses. Free online backsplash cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backsplash cost"],
  variants: [{
    id: "standard",
    name: "Backsplash Cost",
    description: "",
    fields: [
      { name: "sqft", label: "Square Feet", type: "number", min: 5 },
      { name: "tileCost", label: "Tile/SqFt ($)", type: "number", defaultValue: 15 },
      { name: "labor", label: "Labor ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does backsplash cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect backsplash cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
