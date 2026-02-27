import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageDoorCalculator: CalculatorDefinition = {
  slug: "garage-door-calculator",
  title: "Garage Door Cost Calculator",
  description: "Calculate garage door cost costs and expenses. Free online garage door cost calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage door cost"],
  variants: [{
    id: "standard",
    name: "Garage Door Cost",
    description: "",
    fields: [
      { name: "doors", label: "Number of Doors", type: "number", min: 1 },
      { name: "costPerDoor", label: "Cost/Door ($)", type: "number", defaultValue: 1500 },
      { name: "install", label: "Install/Door ($)", type: "number", defaultValue: 500 },
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
    { question: "How much does garage door cost cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect garage door cost cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
