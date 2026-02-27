import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineryStartupCalculator: CalculatorDefinition = {
  slug: "winery-startup-calculator",
  title: "Winery Startup Calculator",
  description: "Calculate winery startup costs and expenses. Free online winery startup calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["winery cost", "vineyard"],
  variants: [{
    id: "standard",
    name: "Winery Startup",
    description: "",
    fields: [
      { name: "acres", label: "Acres", type: "number", min: 1 },
      { name: "vinesPerAcre", label: "Vines/Acre", type: "number", defaultValue: 1000 },
      { name: "costPerVine", label: "Cost/Vine ($)", type: "number", defaultValue: 5 },
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
    { question: "How much does winery startup cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect winery startup cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
