import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newYearsPartyCalculator: CalculatorDefinition = {
  slug: "new-years-party-calculator",
  title: "New Year's Eve Party Cost Calculator",
  description:
    "Plan your New Year's Eve party budget. Calculate costs for food, drinks, decorations, and entertainment to host an unforgettable celebration.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "new years eve",
    "party budget",
    "nye party",
    "new years cost",
    "party planner",
  ],
  variants: [
    {
      id: "hostParty",
      name: "Host a Party",
      description: "Calculate total costs for hosting a NYE party at home",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "foodPerPerson", label: "Food Cost per Person ($)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "drinksPerPerson", label: "Drinks Cost per Person ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "decorations", label: "Decorations ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "partySupplies", label: "Party Supplies (hats, noisemakers) ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "entertainment", label: "Entertainment/Music ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "champagne", label: "Champagne for Toast ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string);
        const foodPerPerson = parseFloat(inputs.foodPerPerson as string);
        const drinksPerPerson = parseFloat(inputs.drinksPerPerson as string);
        const decorations = parseFloat(inputs.decorations as string);
        const partySupplies = parseFloat(inputs.partySupplies as string);
        const entertainment = parseFloat(inputs.entertainment as string);
        const champagne = parseFloat(inputs.champagne as string);

        if (isNaN(numGuests) || numGuests <= 0) return null;

        const foodTotal = numGuests * (foodPerPerson || 0);
        const drinkTotal = numGuests * (drinksPerPerson || 0);
        const fixedCosts = (decorations || 0) + (partySupplies || 0) + (entertainment || 0) + (champagne || 0);
        const grandTotal = foodTotal + drinkTotal + fixedCosts;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Party Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Food Total", value: `$${formatNumber(foodTotal, 2)}` },
            { label: "Drinks Total", value: `$${formatNumber(drinkTotal, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations || 0, 2)}` },
            { label: "Party Supplies", value: `$${formatNumber(partySupplies || 0, 2)}` },
            { label: "Entertainment", value: `$${formatNumber(entertainment || 0, 2)}` },
            { label: "Champagne for Toast", value: `$${formatNumber(champagne || 0, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "goOut",
      name: "Going Out",
      description: "Estimate costs for a New Year's Eve night out",
      fields: [
        { name: "numPeople", label: "Number of People", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "venueType", label: "Venue Type", type: "select", options: [
          { label: "Bar/Club ($30-$75 cover)", value: "bar" },
          { label: "Restaurant Dinner ($75-$150/person)", value: "restaurant" },
          { label: "Ticketed Event ($100-$300)", value: "event" },
          { label: "House party (BYOB $20-$40)", value: "house" },
        ], defaultValue: "bar" },
        { name: "drinksPerPerson", label: "Drinks Budget per Person ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "transportPerPerson", label: "Transportation per Person ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "attireCost", label: "New Outfit/Attire ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const numPeople = parseFloat(inputs.numPeople as string);
        const venueType = inputs.venueType as string;
        const drinksPerPerson = parseFloat(inputs.drinksPerPerson as string);
        const transportPerPerson = parseFloat(inputs.transportPerPerson as string);
        const attireCost = parseFloat(inputs.attireCost as string);

        if (isNaN(numPeople) || numPeople <= 0) return null;

        const venueCosts: Record<string, number> = { bar: 50, restaurant: 110, event: 200, house: 30 };
        const coverPerPerson = venueCosts[venueType] || 50;
        const venueTotal = coverPerPerson * numPeople;
        const drinksTotal = (drinksPerPerson || 0) * numPeople;
        const transportTotal = (transportPerPerson || 0) * numPeople;
        const grandTotal = venueTotal + drinksTotal + transportTotal + (attireCost || 0);
        const perPerson = grandTotal / numPeople;

        return {
          primary: { label: "Total Night Out Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Venue/Cover/Dinner", value: `$${formatNumber(venueTotal, 2)}` },
            { label: "Drinks Total", value: `$${formatNumber(drinksTotal, 2)}` },
            { label: "Transportation Total", value: `$${formatNumber(transportTotal, 2)}` },
            { label: "Attire", value: `$${formatNumber(attireCost || 0, 2)}` },
            { label: "Cost per Person", value: `$${formatNumber(perPerson, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["christmas-budget-calculator", "fourth-of-july-party-calculator", "superbowl-party-calculator"],
  faq: [
    {
      question: "How much does the average New Year's Eve party cost?",
      answer:
        "A home NYE party typically costs $200-$600 for 15-25 guests, or about $12-$25 per person. Going out to a restaurant or event can cost $100-$400+ per person depending on the venue.",
    },
    {
      question: "How much food and drink should I plan per guest?",
      answer:
        "For a NYE party, plan 8-12 appetizer pieces per person, 2-3 drinks per person for the first hour, and 1-2 drinks per hour after that. Have champagne ready for the midnight toast — one bottle serves about 6 glasses.",
    },
  ],
  formula:
    "Total = (Guests × Food per Person) + (Guests × Drinks per Person) + Decorations + Supplies + Entertainment + Champagne",
};
