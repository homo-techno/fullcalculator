import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const housewarmingPartyCalculator: CalculatorDefinition = {
  slug: "housewarming-party-calculator",
  title: "Housewarming Party Budget Calculator",
  description:
    "Plan your housewarming party budget. Calculate costs for food, drinks, decorations, and supplies to welcome guests to your new home.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "housewarming party",
    "housewarming budget",
    "new home party",
    "party planner",
    "housewarming cost",
  ],
  variants: [
    {
      id: "fullParty",
      name: "Full Party Budget",
      description: "Calculate all housewarming party expenses",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "partyStyle", label: "Party Style", type: "select", options: [
          { label: "Casual (snacks & drinks)", value: "casual" },
          { label: "Cookout/BBQ", value: "bbq" },
          { label: "Cocktail party", value: "cocktail" },
          { label: "Catered dinner", value: "catered" },
        ], defaultValue: "casual" },
        { name: "foodPerPerson", label: "Food per Person ($)", type: "number", placeholder: "e.g. 12" },
        { name: "drinksPerPerson", label: "Drinks per Person ($)", type: "number", placeholder: "e.g. 8" },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "servingware", label: "Plates, Cups, Napkins ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const partyStyle = inputs.partyStyle as string;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const servingware = parseFloat(inputs.servingware as string) || 0;

        if (numGuests <= 0) return null;

        const defaultFood: Record<string, number> = { casual: 10, bbq: 15, cocktail: 18, catered: 35 };
        const defaultDrinks: Record<string, number> = { casual: 6, bbq: 8, cocktail: 12, catered: 15 };

        const inputFood = parseFloat(inputs.foodPerPerson as string);
        const inputDrinks = parseFloat(inputs.drinksPerPerson as string);
        const foodPerPerson = isNaN(inputFood) ? (defaultFood[partyStyle] || 12) : inputFood;
        const drinksPerPerson = isNaN(inputDrinks) ? (defaultDrinks[partyStyle] || 8) : inputDrinks;

        const foodTotal = numGuests * foodPerPerson;
        const drinkTotal = numGuests * drinksPerPerson;
        const grandTotal = foodTotal + drinkTotal + decorations + servingware;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Party Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Food Total", value: `$${formatNumber(foodTotal, 2)}` },
            { label: "Drinks Total", value: `$${formatNumber(drinkTotal, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
            { label: "Servingware", value: `$${formatNumber(servingware, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "byBudget",
      name: "Budget Allocation",
      description: "See what you can do with a fixed budget",
      fields: [
        { name: "totalBudget", label: "Total Budget ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "partyStyle", label: "Party Style", type: "select", options: [
          { label: "Casual (snacks & drinks)", value: "casual" },
          { label: "Cookout/BBQ", value: "bbq" },
          { label: "Cocktail party", value: "cocktail" },
          { label: "Catered dinner", value: "catered" },
        ], defaultValue: "casual" },
      ],
      calculate: (inputs) => {
        const totalBudget = parseFloat(inputs.totalBudget as string) || 0;
        const numGuests = parseFloat(inputs.numGuests as string) || 0;

        if (totalBudget <= 0 || numGuests <= 0) return null;

        const fixedCosts = 65;
        const perGuestBudget = (totalBudget - fixedCosts) / numGuests;
        const foodAlloc = perGuestBudget * 0.55;
        const drinkAlloc = perGuestBudget * 0.35;
        const miscAlloc = perGuestBudget * 0.10;

        return {
          primary: { label: "Budget per Guest", value: `$${formatNumber(perGuestBudget, 2)}` },
          details: [
            { label: "Food per Guest", value: `$${formatNumber(foodAlloc, 2)}` },
            { label: "Drinks per Guest", value: `$${formatNumber(drinkAlloc, 2)}` },
            { label: "Misc per Guest", value: `$${formatNumber(miscAlloc, 2)}` },
            { label: "Fixed Costs (decor, supplies)", value: `$${formatNumber(fixedCosts, 2)}` },
            { label: "Remaining Budget", value: `$${formatNumber(totalBudget - fixedCosts - (perGuestBudget * numGuests), 2)}` },
          ],
          note: perGuestBudget < 8 ? "Budget is tight. Consider a potluck-style party!" : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["new-years-party-calculator", "superbowl-party-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much should I spend on a housewarming party?",
      answer:
        "Most housewarming parties cost $200-$500 for 20-30 guests. A casual snacks-and-drinks party is $8-$15 per person, while a catered event can run $30-$50+ per person. Keep it simple since you just spent money on a new home!",
    },
    {
      question: "When should I have a housewarming party?",
      answer:
        "Host your housewarming 1-3 months after moving in. This gives you time to unpack and set up, but is soon enough that the home still feels new. Weekends are best, and afternoon parties are generally cheaper than evening events.",
    },
  ],
  formula:
    "Total = (Guests x Food per Person) + (Guests x Drinks per Person) + Decorations + Servingware",
};
