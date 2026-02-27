import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taproomRevenueCalculator: CalculatorDefinition = {
  slug: "taproom-revenue-calculator",
  title: "Taproom Revenue Calculator",
  description: "Calculate taproom revenue costs and expenses. Free online taproom revenue calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["taproom calculator"],
  variants: [{
    id: "standard",
    name: "Taproom Revenue",
    description: "",
    fields: [
      { name: "seats", label: "Seats", type: "number", min: 1 },
      { name: "avgTicket", label: "Avg Ticket ($)", type: "number", defaultValue: 25 },
      { name: "turnsPerDay", label: "Turns/Day", type: "number", defaultValue: 3 },
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
    { question: "How much does taproom revenue cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect taproom revenue cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
