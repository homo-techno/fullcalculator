import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mealDeliveryCalculator: CalculatorDefinition = {
  slug: "meal-delivery-calculator",
  title: "Meal Delivery Calculator",
  description: "Calculate meal delivery costs and expenses. Free online meal delivery calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["meal delivery cost"],
  variants: [{
    id: "standard",
    name: "Meal Delivery",
    description: "",
    fields: [
      { name: "mealsPerWeek", label: "Meals/Week", type: "number", min: 1 },
      { name: "costPerMeal", label: "Cost/Meal ($)", type: "number", defaultValue: 10 },
      { name: "weeks", label: "Weeks", type: "number", defaultValue: 4 },
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
    { question: "How much does meal delivery cost?", answer: "Use our calculator to estimate costs based on your inputs." },
    { question: "What factors affect meal delivery cost?", answer: "Multiple factors including quantity, quality, and location affect the total cost." },
  ],
  formula: "Total Cost = Base Cost × Quantity + Additional Fees",
};
