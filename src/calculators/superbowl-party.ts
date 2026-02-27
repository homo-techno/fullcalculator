import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const superbowlPartyCalculator: CalculatorDefinition = {
  slug: "superbowl-party-calculator",
  title: "Super Bowl Party Budget Calculator",
  description:
    "Plan your Super Bowl party budget. Calculate costs for food, drinks, decorations, and supplies to host the ultimate game day celebration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "super bowl party",
    "superbowl budget",
    "game day party",
    "football party",
    "super bowl food",
  ],
  variants: [
    {
      id: "fullParty",
      name: "Full Party Budget",
      description: "Plan food, drinks, and supplies for your Super Bowl party",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "foodStyle", label: "Food Style", type: "select", options: [
          { label: "Homemade (wings, dips, snacks)", value: "homemade" },
          { label: "Catered/Delivered", value: "catered" },
          { label: "Potluck (you provide main)", value: "potluck" },
        ], defaultValue: "homemade" },
        { name: "foodPerPerson", label: "Food per Person ($)", type: "number", placeholder: "e.g. 12" },
        { name: "beerWine", label: "Beer & Wine ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "softDrinks", label: "Soft Drinks & Water ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "decorations", label: "Decorations & Tableware ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "squaresPool", label: "Super Bowl Squares Pool ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const foodStyle = inputs.foodStyle as string;
        const beerWine = parseFloat(inputs.beerWine as string) || 0;
        const softDrinks = parseFloat(inputs.softDrinks as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const squaresPool = parseFloat(inputs.squaresPool as string) || 0;

        if (numGuests <= 0) return null;

        const defaultFoodCost: Record<string, number> = { homemade: 10, catered: 20, potluck: 6 };
        const inputFood = parseFloat(inputs.foodPerPerson as string);
        const foodPerPerson = isNaN(inputFood) ? (defaultFoodCost[foodStyle] || 12) : inputFood;

        const foodTotal = numGuests * foodPerPerson;
        const drinkTotal = beerWine + softDrinks;
        const grandTotal = foodTotal + drinkTotal + decorations;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Party Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Food Total", value: `$${formatNumber(foodTotal, 2)}` },
            { label: "Beer & Wine", value: `$${formatNumber(beerWine, 2)}` },
            { label: "Soft Drinks & Water", value: `$${formatNumber(softDrinks, 2)}` },
            { label: "Decorations & Tableware", value: `$${formatNumber(decorations, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
            { label: "Squares Pool Entry", value: squaresPool > 0 ? `$${formatNumber(squaresPool, 2)}` : "None" },
          ],
        };
      },
    },
    {
      id: "foodPlanner",
      name: "Food Quantity Planner",
      description: "Calculate how much food and drink to buy",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "wingsPerPerson", label: "Wings per Person", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "wingCostPerDozen", label: "Wing Cost per Dozen ($)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "pizzaSlicesPerPerson", label: "Pizza Slices per Person", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "costPerPizza", label: "Cost per Pizza (8 slices) ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "beersPerPerson", label: "Beers per Person", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "beerCostPerPack", label: "Cost per 12-Pack ($)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
        { name: "snackBudget", label: "Snacks (chips, dips) ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const wingsPerPerson = parseFloat(inputs.wingsPerPerson as string) || 0;
        const wingCostPerDozen = parseFloat(inputs.wingCostPerDozen as string) || 0;
        const pizzaSlicesPerPerson = parseFloat(inputs.pizzaSlicesPerPerson as string) || 0;
        const costPerPizza = parseFloat(inputs.costPerPizza as string) || 0;
        const beersPerPerson = parseFloat(inputs.beersPerPerson as string) || 0;
        const beerCostPerPack = parseFloat(inputs.beerCostPerPack as string) || 0;
        const snackBudget = parseFloat(inputs.snackBudget as string) || 0;

        if (numGuests <= 0) return null;

        const totalWings = numGuests * wingsPerPerson;
        const dozenWings = Math.ceil(totalWings / 12);
        const wingCost = dozenWings * wingCostPerDozen;

        const totalSlices = numGuests * pizzaSlicesPerPerson;
        const pizzasNeeded = Math.ceil(totalSlices / 8);
        const pizzaCost = pizzasNeeded * costPerPizza;

        const totalBeers = numGuests * beersPerPerson;
        const packsNeeded = Math.ceil(totalBeers / 12);
        const beerCost = packsNeeded * beerCostPerPack;

        const grandTotal = wingCost + pizzaCost + beerCost + snackBudget;

        return {
          primary: { label: "Total Food & Drink Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Wings Needed", value: `${formatNumber(totalWings, 0)} (${formatNumber(dozenWings, 0)} dozen)` },
            { label: "Wing Cost", value: `$${formatNumber(wingCost, 2)}` },
            { label: "Pizzas Needed", value: formatNumber(pizzasNeeded, 0) },
            { label: "Pizza Cost", value: `$${formatNumber(pizzaCost, 2)}` },
            { label: "Beer Packs Needed", value: formatNumber(packsNeeded, 0) },
            { label: "Beer Cost", value: `$${formatNumber(beerCost, 2)}` },
            { label: "Snacks", value: `$${formatNumber(snackBudget, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fourth-of-july-party-calculator", "new-years-party-calculator", "housewarming-party-calculator"],
  faq: [
    {
      question: "How much food do I need for a Super Bowl party?",
      answer:
        "Plan for 8-12 appetizer pieces, 6-10 wings, and 2-3 pizza slices per person. For drinks, estimate 3-4 beers per person over the 4-5 hour game. Always add 15-20% buffer for hungry football fans.",
    },
    {
      question: "What are the most popular Super Bowl party foods?",
      answer:
        "The top Super Bowl foods are chicken wings, pizza, nachos, chili, sliders, seven-layer dip, guacamole, meatballs, and pulled pork. Americans eat an estimated 1.4 billion chicken wings on Super Bowl Sunday alone.",
    },
    {
      question: "How much does a typical Super Bowl party cost?",
      answer:
        "A Super Bowl party for 15-20 people typically costs $150-$350 for homemade food, or $300-$600 for catered/delivered options. The biggest expenses are food and beer, making up 80-90% of the total budget.",
    },
  ],
  formula:
    "Total = (Guests x Food per Person) + Beer/Wine + Soft Drinks + Decorations",
};
