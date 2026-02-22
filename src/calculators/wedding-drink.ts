import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingDrinkCalculator: CalculatorDefinition = {
  slug: "wedding-drink",
  title: "Wedding Drink Calculator",
  description: "Free wedding drink calculator. Estimate bar quantities including wine, beer, spirits, and mixers needed for your wedding reception.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding bar", "drink calculator", "wedding drinks", "bar quantities", "alcohol calculator"],
  variants: [
    {
      id: "fullBar",
      name: "Full Bar",
      fields: [
        { name: "guestCount", label: "Number of Guests (21+)", type: "number", placeholder: "e.g. 120" },
        { name: "eventHours", label: "Event Duration (hours)", type: "number", placeholder: "e.g. 5" },
        { name: "drinkLevel", label: "Drinking Level", type: "select", options: [
          { label: "Light", value: "light" },
          { label: "Average", value: "average" },
          { label: "Heavy", value: "heavy" },
        ] },
        { name: "winePercent", label: "Wine Drinkers (%)", type: "number", placeholder: "e.g. 40" },
        { name: "beerPercent", label: "Beer Drinkers (%)", type: "number", placeholder: "e.g. 30" },
        { name: "spiritPercent", label: "Spirit Drinkers (%)", type: "number", placeholder: "e.g. 20" },
        { name: "nonAlcPercent", label: "Non-Alcoholic (%)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const eventHours = (inputs.eventHours as number) || 5;
        const drinkLevel = (inputs.drinkLevel as string) || "average";
        const winePercent = (inputs.winePercent as number) || 40;
        const beerPercent = (inputs.beerPercent as number) || 30;
        const spiritPercent = (inputs.spiritPercent as number) || 20;
        const nonAlcPercent = (inputs.nonAlcPercent as number) || 10;
        if (guestCount <= 0) return null;
        const drinksPerHour = drinkLevel === "light" ? 0.75 : drinkLevel === "heavy" ? 1.5 : 1;
        const totalDrinks = Math.ceil(guestCount * drinksPerHour * eventHours);
        const wineDrinks = Math.ceil(totalDrinks * (winePercent / 100));
        const beerDrinks = Math.ceil(totalDrinks * (beerPercent / 100));
        const spiritDrinks = Math.ceil(totalDrinks * (spiritPercent / 100));
        const wineBottles = Math.ceil(wineDrinks / 5);
        const beerCases = Math.ceil(beerDrinks / 24);
        const spiritBottles = Math.ceil(spiritDrinks / 16);
        return {
          primary: { label: "Total Drinks Needed", value: formatNumber(totalDrinks) },
          details: [
            { label: "Wine Bottles", value: formatNumber(wineBottles) },
            { label: "Beer Cases (24-pack)", value: formatNumber(beerCases) },
            { label: "Spirit Bottles (750ml)", value: formatNumber(spiritBottles) },
            { label: "Non-Alc Servings", value: formatNumber(Math.ceil(totalDrinks * (nonAlcPercent / 100))) },
            { label: "Ice (lbs)", value: formatNumber(Math.ceil(guestCount * 1.5)) },
            { label: "Drinks Per Person", value: formatNumber(Math.ceil(totalDrinks / guestCount)) },
          ],
        };
      },
    },
    {
      id: "beerWineOnly",
      name: "Beer & Wine Only",
      fields: [
        { name: "guestCount", label: "Number of Guests (21+)", type: "number", placeholder: "e.g. 100" },
        { name: "eventHours", label: "Event Duration (hours)", type: "number", placeholder: "e.g. 4" },
        { name: "winePercent", label: "Wine Drinkers (%)", type: "number", placeholder: "e.g. 60" },
        { name: "beerPercent", label: "Beer Drinkers (%)", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const eventHours = (inputs.eventHours as number) || 4;
        const winePercent = (inputs.winePercent as number) || 60;
        const beerPercent = (inputs.beerPercent as number) || 40;
        if (guestCount <= 0) return null;
        const totalDrinks = Math.ceil(guestCount * 1 * eventHours);
        const wineBottles = Math.ceil((totalDrinks * winePercent / 100) / 5);
        const beerCases = Math.ceil((totalDrinks * beerPercent / 100) / 24);
        return {
          primary: { label: "Total Drinks Needed", value: formatNumber(totalDrinks) },
          details: [
            { label: "Wine Bottles", value: formatNumber(wineBottles) },
            { label: "Beer Cases (24-pack)", value: formatNumber(beerCases) },
            { label: "Ice (lbs)", value: formatNumber(Math.ceil(guestCount * 1.5)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "catering-quantity", "wedding-cake-size"],
  faq: [
    { question: "How many drinks per person at a wedding?", answer: "Plan for about 1 drink per person per hour for average consumption. For a 5-hour reception, that is roughly 5 drinks per guest." },
    { question: "How much ice do I need?", answer: "Plan for about 1-1.5 pounds of ice per guest. For 100 guests, you would need 100-150 pounds of ice." },
  ],
  formula: "Total Drinks = Guest Count x Drinks Per Hour x Event Hours",
};
