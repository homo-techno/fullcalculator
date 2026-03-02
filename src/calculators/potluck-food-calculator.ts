import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const potluckFoodCalculator: CalculatorDefinition = {
  slug: "potluck-food-calculator",
  title: "Potluck Food Calculator",
  description: "Calculate food amounts needed for a potluck gathering.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["potluck","food","party","servings"],
  variants: [{
    id: "standard",
    name: "Potluck Food",
    description: "Calculate food amounts needed for a potluck gathering.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 5, max: 500, defaultValue: 40 },
      { name: "dishes", label: "Number of Dishes", type: "number", min: 2, max: 30, defaultValue: 8 },
      { name: "meatLbs", label: "Meat Per Person (lbs)", type: "number", min: 0, max: 2, defaultValue: 0.5 },
      { name: "sidesPerPerson", label: "Side Servings Per Person", type: "number", min: 1, max: 5, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const dishes = inputs.dishes as number;
    const meatLbs = inputs.meatLbs as number;
    const sidesPerPerson = inputs.sidesPerPerson as number;
    const totalMeat = guests * meatLbs;
    const totalSideServings = guests * sidesPerPerson;
    const servingsPerDish = Math.ceil(totalSideServings / dishes);
    const beverageGallons = Math.ceil(guests * 0.5);
    const dessertServings = guests;
    return { primary: { label: "Total Meat Needed", value: formatNumber(totalMeat) + " lbs" }, details: [{ label: "Total Side Servings", value: formatNumber(totalSideServings) }, { label: "Servings Per Dish", value: formatNumber(servingsPerDish) }, { label: "Beverage Needed", value: formatNumber(beverageGallons) + " gallons" }, { label: "Dessert Servings", value: formatNumber(dessertServings) }] };
  },
  }],
  relatedSlugs: ["vacation-bible-school-calculator","conference-room-calculator","church-budget-calculator"],
  faq: [
    { question: "How much food per person for a potluck?", answer: "Plan for about 1 pound of total food per person including all dishes." },
    { question: "How many dishes should a potluck have?", answer: "Plan for 1 dish per 5 to 6 guests for good variety." },
    { question: "How do you coordinate potluck food?", answer: "Assign categories like main dish, side, salad, and dessert to guests." },
  ],
  formula: "TotalMeat = Guests * MeatLbs; ServingsPerDish = (Guests * SidesPerPerson) / Dishes",
};
