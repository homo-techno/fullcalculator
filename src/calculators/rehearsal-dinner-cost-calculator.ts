import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rehearsalDinnerCostCalculator: CalculatorDefinition = {
  slug: "rehearsal-dinner-cost-calculator",
  title: "Rehearsal Dinner Cost Calculator",
  description: "Estimate rehearsal dinner costs based on guest count, venue style, menu selection, drinks, and additional touches.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rehearsal dinner cost","rehearsal dinner budget","wedding rehearsal","pre-wedding dinner"],
  variants: [{
    id: "standard",
    name: "Rehearsal Dinner Cost",
    description: "Estimate rehearsal dinner costs based on guest count, venue style, menu selection, drinks, and additional touches.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 5, max: 100, defaultValue: 30 },
      { name: "venueStyle", label: "Venue Style", type: "select", options: [{ value: "30", label: "Casual Restaurant" }, { value: "55", label: "Upscale Restaurant" }, { value: "80", label: "Private Dining Room" }, { value: "120", label: "Private Event Space" }], defaultValue: "55" },
      { name: "drinksPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 100, defaultValue: 25 },
      { name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
      { name: "gratuity", label: "Gratuity (%)", type: "number", min: 0, max: 30, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const foodPerPerson = parseFloat(inputs.venueStyle as unknown as string);
    const drinks = inputs.drinksPerPerson as number;
    const decor = inputs.decorations as number;
    const gratPct = inputs.gratuity as number;
    const foodTotal = guests * foodPerPerson;
    const drinkTotal = guests * drinks;
    const subtotal = foodTotal + drinkTotal + decor;
    const gratuity = (foodTotal + drinkTotal) * (gratPct / 100);
    const total = subtotal + gratuity;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Rehearsal Dinner Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Food Cost", value: "$" + formatNumber(Math.round(foodTotal)) },
        { label: "Drinks Cost", value: "$" + formatNumber(Math.round(drinkTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Gratuity", value: "$" + formatNumber(Math.round(gratuity)) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","event-catering-calculator","reception-venue-cost-calculator"],
  faq: [
    { question: "How much does a rehearsal dinner cost?", answer: "Rehearsal dinners typically cost $1,000 to $5,000 for 20-40 guests. The average is about $75 to $100 per person including food, drinks, and gratuity." },
    { question: "Who is invited to the rehearsal dinner?", answer: "Traditionally, the wedding party, immediate family, officiant, and their partners attend. Some couples extend invitations to out-of-town guests." },
    { question: "Who pays for the rehearsal dinner?", answer: "Traditionally, the groom's family hosts and pays for the rehearsal dinner. Modern couples may split costs or have either family cover it." },
  ],
  formula: "Subtotal = (Guests x FoodPerPerson) + (Guests x DrinksPerPerson) + Decorations
Gratuity = (Food + Drinks) x GratuityRate
Total = Subtotal + Gratuity",
};
