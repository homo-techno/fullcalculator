import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doorReplacementCalculator: CalculatorDefinition = {
  slug: "door-replacement-calculator",
  title: "Door Replacement Calculator",
  description: "Calculate door replacement costs and expenses. Free online door replacement calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["door replacement cost"],
  variants: [{
    id: "standard",
    name: "Door Replacement",
    description: "",
    fields: [
      { name: "doors", label: "Number of Doors", type: "number", min: 1 },
      { name: "costPerDoor", label: "Cost/Door ($)", type: "number", defaultValue: 800 },
      { name: "install", label: "Install ($)", type: "number", defaultValue: 300 },
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
    { question: "How much does door replacement cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect door replacement cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
