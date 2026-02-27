import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disneyVacationCalculator: CalculatorDefinition = {
  slug: "disney-vacation-calculator",
  title: "Disney Vacation Calculator",
  description: "Calculate disney vacation costs and expenses. Free online disney vacation calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["disney trip cost"],
  variants: [{
    id: "standard",
    name: "Disney Vacation",
    description: "",
    fields: [
      { name: "days", label: "Days", type: "number", min: 1 },
      { name: "tickets", label: "Tickets/Person ($)", type: "number", defaultValue: 120 },
      { name: "people", label: "People", type: "number", min: 1 },
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
    { question: "How much does disney vacation cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect disney vacation cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
