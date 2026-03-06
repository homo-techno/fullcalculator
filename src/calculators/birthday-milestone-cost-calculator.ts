import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthdayMilestoneCostCalculator: CalculatorDefinition = {
  slug: "birthday-milestone-cost-calculator",
  title: "Birthday Milestone Cost Calculator",
  description: "Estimate costs for a milestone birthday celebration including venue, catering, decorations, entertainment, and a special cake.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["milestone birthday cost","birthday party budget","special birthday planning","birthday celebration cost"],
  variants: [{
    id: "standard",
    name: "Birthday Milestone Cost",
    description: "Estimate costs for a milestone birthday celebration including venue, catering, decorations, entertainment, and a special cake.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 5, max: 200, defaultValue: 40 },
      { name: "venueRental", label: "Venue Rental ($)", type: "number", min: 0, max: 10000, defaultValue: 1000 },
      { name: "foodPerPerson", label: "Food Cost Per Person ($)", type: "number", min: 10, max: 200, defaultValue: 45 },
      { name: "drinkPerPerson", label: "Drink Cost Per Person ($)", type: "number", min: 0, max: 80, defaultValue: 20 },
      { name: "decorations", label: "Decorations Budget ($)", type: "number", min: 0, max: 5000, defaultValue: 300 },
      { name: "entertainment", label: "Entertainment Cost ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
      { name: "cakeCost", label: "Custom Cake Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const venue = inputs.venueRental as number;
    const food = inputs.foodPerPerson as number;
    const drink = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const entertainment = inputs.entertainment as number;
    const cake = inputs.cakeCost as number;
    const cateringTotal = guests * (food + drink);
    const total = venue + cateringTotal + decor + entertainment + cake;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Party Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue Rental", value: "$" + formatNumber(venue) },
        { label: "Total Catering", value: "$" + formatNumber(Math.round(cateringTotal)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Entertainment", value: "$" + formatNumber(entertainment) },
        { label: "Cake", value: "$" + formatNumber(cake) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","event-catering-calculator","party-balloon-calculator"],
  faq: [
    { question: "How much does a milestone birthday party cost?", answer: "Milestone birthday parties (30th, 40th, 50th) typically cost $1,000 to $5,000 for 30-50 guests. Elaborate celebrations can exceed $10,000." },
    { question: "What makes a good milestone birthday party?", answer: "Great milestone parties include personalized decor, quality catering, entertainment, a custom cake, and thoughtful touches like photo displays or memory books." },
    { question: "How many guests should you invite to a birthday party?", answer: "Adult birthday parties typically have 20-50 guests. Milestone birthdays may have more, up to 100, depending on venue and budget." },
  ],
  formula: "Catering = Guests x (FoodPerPerson + DrinkPerPerson); Total = Venue + Catering + Decorations + Entertainment + Cake; Per Guest = Total / Guests",
};
