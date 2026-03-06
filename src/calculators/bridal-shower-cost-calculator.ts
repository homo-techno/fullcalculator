import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bridalShowerCostCalculator: CalculatorDefinition = {
  slug: "bridal-shower-cost-calculator",
  title: "Bridal Shower Cost Calculator",
  description: "Estimate bridal shower expenses including venue, food, decorations, games, favors, and a gift for the bride.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bridal shower cost","bridal shower budget","bridal shower planning","pre-wedding shower"],
  variants: [{
    id: "standard",
    name: "Bridal Shower Cost",
    description: "Estimate bridal shower expenses including venue, food, decorations, games, favors, and a gift for the bride.",
    fields: [
      { name: "guests", label: "Number of Guests", type: "number", min: 5, max: 80, defaultValue: 25 },
      { name: "venueOrHome", label: "Venue Type", type: "select", options: [{ value: "0", label: "Home/Free Venue" }, { value: "500", label: "Restaurant ($500)" }, { value: "1000", label: "Rented Space ($1000)" }], defaultValue: "0" },
      { name: "foodPerPerson", label: "Food Per Person ($)", type: "number", min: 5, max: 100, defaultValue: 25 },
      { name: "drinkPerPerson", label: "Drinks Per Person ($)", type: "number", min: 0, max: 50, defaultValue: 10 },
      { name: "decorations", label: "Decorations ($)", type: "number", min: 0, max: 1000, defaultValue: 150 },
      { name: "favors", label: "Favors Per Guest ($)", type: "number", min: 0, max: 30, defaultValue: 8 },
      { name: "brideGift", label: "Gift for Bride ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guests as number;
    const venue = parseFloat(inputs.venueOrHome as unknown as string);
    const food = inputs.foodPerPerson as number;
    const drinks = inputs.drinkPerPerson as number;
    const decor = inputs.decorations as number;
    const favors = inputs.favors as number;
    const brideGift = inputs.brideGift as number;
    const totalFood = guests * (food + drinks);
    const totalFavors = guests * favors;
    const total = venue + totalFood + decor + totalFavors + brideGift;
    const perGuest = total / guests;
    return {
      primary: { label: "Total Bridal Shower Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Venue", value: "$" + formatNumber(venue) },
        { label: "Food and Drinks", value: "$" + formatNumber(Math.round(totalFood)) },
        { label: "Decorations", value: "$" + formatNumber(decor) },
        { label: "Favors", value: "$" + formatNumber(Math.round(totalFavors)) },
        { label: "Gift for Bride", value: "$" + formatNumber(brideGift) },
        { label: "Cost Per Guest", value: "$" + formatNumber(Math.round(perGuest)) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","bridesmaid-dress-budget-calculator","rehearsal-dinner-cost-calculator"],
  faq: [
    { question: "How much does a bridal shower cost?", answer: "Bridal showers typically cost $500 to $2,000 total, or $15 to $50 per guest. Costs vary widely based on venue choice and catering." },
    { question: "Who pays for the bridal shower?", answer: "Traditionally, the maid of honor and bridesmaids host and split the cost. Sometimes the mother of the bride or other family members contribute." },
    { question: "How many guests attend a bridal shower?", answer: "Bridal showers typically have 15 to 40 guests, including close friends, family members, and wedding party members." },
  ],
  formula: "Total = Venue + (Guests x (Food + Drinks)) + Decorations + (Guests x Favors) + BrideGift; Per Guest = Total / Guests",
};
