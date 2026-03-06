import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingGuestMealCostCalculator: CalculatorDefinition = {
  slug: "wedding-guest-meal-cost-calculator",
  title: "Wedding Guest Meal Cost Calculator",
  description: "Calculate per-guest and total meal costs for your wedding including appetizers, entrees, dessert, beverages, and service charges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding meal cost","wedding catering per person","reception food cost","wedding dinner pricing"],
  variants: [{
    id: "standard",
    name: "Wedding Guest Meal Cost",
    description: "Calculate per-guest and total meal costs for your wedding including appetizers, entrees, dessert, beverages, and service charges.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 120 },
      { name: "serviceStyle", label: "Service Style", type: "select", options: [{ value: "1", label: "Buffet" }, { value: "1.3", label: "Plated Dinner" }, { value: "1.6", label: "Family Style" }, { value: "0.8", label: "Food Stations" }], defaultValue: "1.3" },
      { name: "appetizerCost", label: "Appetizers Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 12 },
      { name: "entreeCost", label: "Entree Per Person ($)", type: "number", min: 15, max: 200, defaultValue: 45 },
      { name: "dessertCost", label: "Dessert Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 8 },
      { name: "beverageCost", label: "Beverages Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 25 },
      { name: "serviceCharge", label: "Service Charge (%)", type: "number", min: 0, max: 25, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const styleMult = parseFloat(inputs.serviceStyle as unknown as string);
    const appetizer = inputs.appetizerCost as number;
    const entree = inputs.entreeCost as number;
    const dessert = inputs.dessertCost as number;
    const beverage = inputs.beverageCost as number;
    const serviceRate = inputs.serviceCharge as number;
    const foodPerPerson = (appetizer + entree + dessert) * styleMult;
    const totalPerPerson = foodPerPerson + beverage;
    const subtotal = totalPerPerson * guests;
    const serviceCharge = subtotal * (serviceRate / 100);
    const total = subtotal + serviceCharge;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Meal Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) },
        { label: "Food Per Person", value: "$" + formatNumber(Math.round(foodPerPerson)) },
        { label: "Beverages Per Person", value: "$" + formatNumber(beverage) },
        { label: "Subtotal", value: "$" + formatNumber(Math.round(subtotal)) },
        { label: "Service Charge", value: "$" + formatNumber(Math.round(serviceCharge)) }
      ]
    };
  },
  }],
  relatedSlugs: ["event-catering-calculator","wedding-budget-calculator","wedding-guest-calculator"],
  faq: [
    { question: "How much does a wedding meal cost per person?", answer: "Wedding meals typically cost $50 to $150 per person depending on location and menu. Plated dinners cost more than buffets due to additional service staff." },
    { question: "Which is cheaper, buffet or plated dinner?", answer: "Buffets are generally 15-30% less expensive than plated dinners because they require fewer servers. However, buffets may lead to more food waste." },
    { question: "How do you calculate food quantities for a wedding?", answer: "Plan for 6-8 appetizer pieces per guest during cocktail hour, one full entree per guest, and 1.5 dessert servings per person." },
  ],
  formula: "Food Per Person = (Appetizer + Entree + Dessert) x ServiceStyleMultiplier
Subtotal = (Food + Beverages) x Guests
Total = Subtotal + ServiceCharge",
};
