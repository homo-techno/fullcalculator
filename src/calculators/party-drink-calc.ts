import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partyDrinkCalculator: CalculatorDefinition = {
  slug: "party-drink-calc",
  title: "Party Drink & Alcohol Quantity Calculator",
  description: "Free online party drink calculator. Estimate how much beer, wine, and liquor to buy for your party or event.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["party drink calculator", "how much alcohol for party", "drink calculator", "party planning", "alcohol estimator"],
  variants: [
    {
      id: "party-drinks",
      name: "Party Drink Estimator",
      fields: [
        { name: "guests", label: "Number of Guests", type: "number", placeholder: "e.g. 30" },
        { name: "hours", label: "Party Duration (hours)", type: "number", placeholder: "e.g. 4" },
        {
          name: "drinkerLevel",
          label: "Drinking Level",
          type: "select",
          options: [
            { label: "Light (1 drink/hr)", value: "light" },
            { label: "Average (1.5 drinks/hr)", value: "average" },
            { label: "Heavy (2 drinks/hr)", value: "heavy" },
          ],
        },
        {
          name: "drinkMix",
          label: "Drink Mix Preference",
          type: "select",
          options: [
            { label: "Beer Only", value: "beer_only" },
            { label: "Wine Only", value: "wine_only" },
            { label: "Cocktails Only", value: "cocktails_only" },
            { label: "Mixed (40% Beer, 30% Wine, 30% Liquor)", value: "mixed" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string) || 0;
        const hours = parseFloat(inputs.hours as string) || 4;
        const level = inputs.drinkerLevel as string;
        const mix = inputs.drinkMix as string;

        const drinksPerHour: Record<string, number> = {
          light: 1,
          average: 1.5,
          heavy: 2,
        };

        const rate = drinksPerHour[level] || 1.5;
        const totalDrinks = guests * hours * rate;

        let beerCases = 0;
        let wineBottles = 0;
        let liquorBottles = 0;

        if (mix === "beer_only") {
          beerCases = Math.ceil(totalDrinks / 24);
        } else if (mix === "wine_only") {
          wineBottles = Math.ceil(totalDrinks / 5); // 5 glasses per bottle
        } else if (mix === "cocktails_only") {
          liquorBottles = Math.ceil(totalDrinks / 16); // 16 drinks per 750mL bottle
        } else {
          beerCases = Math.ceil((totalDrinks * 0.4) / 24);
          wineBottles = Math.ceil((totalDrinks * 0.3) / 5);
          liquorBottles = Math.ceil((totalDrinks * 0.3) / 16);
        }

        const iceLbs = Math.ceil(guests * 1.5);
        const mixerLiters = Math.ceil(totalDrinks * 0.3 / 8); // approx liters of mixers
        const cupCount = Math.ceil(totalDrinks * 1.2);

        return {
          primary: { label: "Total Drinks Needed", value: formatNumber(totalDrinks) },
          details: [
            { label: "Beer (24-packs)", value: formatNumber(beerCases) },
            { label: "Wine Bottles", value: formatNumber(wineBottles) },
            { label: "Liquor Bottles (750mL)", value: formatNumber(liquorBottles) },
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
            { label: "Mixers / Soda", value: `${formatNumber(mixerLiters)} liters` },
            { label: "Cups", value: formatNumber(cupCount) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-alcohol-calc", "catering-serving-calc", "thanksgiving-calc"],
  faq: [
    {
      question: "How many drinks per person should I plan for?",
      answer: "Plan for 1-2 drinks per person per hour. For a 4-hour party, that means 4-8 drinks per person. Average consumption is about 1.5 drinks per hour.",
    },
    {
      question: "How many glasses of wine are in a bottle?",
      answer: "A standard 750mL bottle of wine yields about 5 glasses (at 5 oz per glass). Magnum bottles (1.5L) yield about 10 glasses.",
    },
    {
      question: "How much ice do I need for a party?",
      answer: "Plan for about 1.5 pounds of ice per guest. If it is hot outside or the party is outdoors, increase to 2 pounds per guest.",
    },
  ],
  formula: "total_drinks = guests × hours × drinks_per_hour",
};
