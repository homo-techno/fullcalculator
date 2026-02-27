import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const destinationWeddingCalculator: CalculatorDefinition = {
  slug: "destination-wedding-calculator",
  title: "Destination Wedding Calculator",
  description: "Calculate destination wedding costs and expenses. Free online destination wedding calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["destination wedding cost"],
  variants: [{
    id: "standard",
    name: "Destination Wedding",
    description: "",
    fields: [
      { name: "guests", label: "Guests", type: "number", min: 10 },
      { name: "costPerGuest", label: "Cost/Guest ($)", type: "number", defaultValue: 200 },
      { name: "venue", label: "Venue ($)", type: "number", defaultValue: 5000 },
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
    { question: "How much does destination wedding cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect destination wedding cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
