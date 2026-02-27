import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orchardPlanningCalculator: CalculatorDefinition = {
  slug: "orchard-planning-calculator",
  title: "Orchard Planning Calculator",
  description: "Calculate orchard planning costs and expenses. Free online orchard planning calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["orchard cost calculator"],
  variants: [{
    id: "standard",
    name: "Orchard Planning",
    description: "",
    fields: [
      { name: "trees", label: "Number of Trees", type: "number", min: 1 },
      { name: "treeCost", label: "Cost/Tree ($)", type: "number", defaultValue: 30 },
      { name: "spacing", label: "Spacing (ft)", type: "number", defaultValue: 20 },
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
    { question: "How much does orchard planning cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect orchard planning cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
