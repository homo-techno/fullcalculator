import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventCateringCalculator: CalculatorDefinition = {
  slug: "event-catering-calculator",
  title: "Event Catering Calculator",
  description: "Estimate total catering cost per head for events.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["event catering","catering cost","catering per head"],
  variants: [{
    id: "standard",
    name: "Event Catering",
    description: "Estimate total catering cost per head for events.",
    fields: [
      { name: "guests", label: "Guest Count", type: "number", min: 10, max: 2000, defaultValue: 100 },
      { name: "mealCost", label: "Meal Cost per Head ($)", type: "number", min: 10, max: 300, defaultValue: 50 },
      { name: "drinkCost", label: "Drink Cost per Head ($)", type: "number", min: 0, max: 100, defaultValue: 15 },
      { name: "serviceFee", label: "Service Fee (%)", type: "number", min: 0, max: 30, defaultValue: 18 },
    ],
    calculate: (inputs) => {
      const guests = inputs.guests as number;
      const meal = inputs.mealCost as number;
      const drink = inputs.drinkCost as number;
      const fee = inputs.serviceFee as number;
      if (!guests || !meal) return null;
      const subtotal = guests * (meal + drink);
      const feeAmt = subtotal * fee / 100;
      const total = subtotal + feeAmt;
      return {
        primary: { label: "Total Catering Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Subtotal", value: "$" + formatNumber(Math.round(subtotal)) },
          { label: "Service Fee", value: "$" + formatNumber(Math.round(feeAmt)) },
          { label: "Cost per Guest", value: "$" + formatNumber(Math.round(total / guests)) },
        ],
      };
  },
  }],
  relatedSlugs: ["wedding-guest-calculator","event-bar-calculator"],
  faq: [
    { question: "How much does event catering cost?", answer: "Event catering averages $30 to $100 per person." },
    { question: "Should I include a service fee?", answer: "Most caterers add 15 to 20 percent for service and gratuity." },
  ],
  formula: "Total = Guests x (Meal + Drink) x (1 + Service Fee / 100)",
};
