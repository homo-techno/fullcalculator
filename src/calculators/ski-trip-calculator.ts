import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skiTripCalculator: CalculatorDefinition = {
  slug: "ski-trip-calculator",
  title: "Ski Trip Calculator",
  description: "Calculate ski trip costs and expenses. Free online ski trip calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ski trip cost"],
  variants: [{
    id: "standard",
    name: "Ski Trip",
    description: "",
    fields: [
      { name: "days", label: "Days", type: "number", min: 1 },
      { name: "liftTicket", label: "Lift Ticket/Day ($)", type: "number", defaultValue: 120 },
      { name: "lodging", label: "Lodging/Night ($)", type: "number", defaultValue: 200 },
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
    { question: "How much does ski trip cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect ski trip cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
