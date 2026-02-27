import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const firePitCostCalculator: CalculatorDefinition = {
  slug: "fire-pit-cost-calculator",
  title: "Fire Pit Cost Calculator",
  description: "Calculate fire pit cost costs and expenses. Free online fire pit cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fire pit cost"],
  variants: [{
    id: "standard",
    name: "Fire Pit Cost",
    description: "",
    fields: [
      { name: "diameter", label: "Diameter (ft)", type: "number", min: 2 },
      { name: "materialCost", label: "Material ($)", type: "number", defaultValue: 500 },
      { name: "gasCost", label: "Gas Line ($)", type: "number", defaultValue: 300 },
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
    { question: "How much does fire pit cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect fire pit cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
