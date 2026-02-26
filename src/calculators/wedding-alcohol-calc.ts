import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingAlcoholCalculator: CalculatorDefinition = {
  slug: "wedding-alcohol-calc",
  title: "Wedding Alcohol Calculator",
  description: "Free online wedding alcohol calculator. Estimate beer, wine, and liquor quantities for your wedding reception.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding alcohol calculator", "wedding bar calculator", "reception drinks", "wedding planning", "how much alcohol for wedding"],
  variants: [
    {
      id: "wedding-bar",
      name: "Wedding Bar Estimator",
      fields: [
        { name: "guests", label: "Number of Guests (21+)", type: "number", placeholder: "e.g. 100" },
        { name: "hours", label: "Reception Duration (hours)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        {
          name: "barType",
          label: "Bar Type",
          type: "select",
          options: [
            { label: "Beer & Wine Only", value: "beer_wine" },
            { label: "Full Bar (Beer, Wine, Liquor)", value: "full_bar" },
            { label: "Champagne Toast Only", value: "champagne" },
            { label: "Signature Cocktails + Beer & Wine", value: "signature" },
          ],
        },
        {
          name: "drinkerRatio",
          label: "Estimated Drinkers",
          type: "select",
          options: [
            { label: "Light Crowd (50% drink)", value: "light" },
            { label: "Average Crowd (70% drink)", value: "average" },
            { label: "Social Crowd (85% drink)", value: "social" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string) || 0;
        const hours = parseFloat(inputs.hours as string) || 5;
        const barType = inputs.barType as string;
        const ratio = inputs.drinkerRatio as string;

        const drinkerPct: Record<string, number> = {
          light: 0.5,
          average: 0.7,
          social: 0.85,
        };

        const pct = drinkerPct[ratio] || 0.7;
        const drinkers = guests * pct;
        // Drinks per hour decreases after first hour
        const drinksPerPerson = 1.5 * 1 + 1 * (hours - 1);
        const totalDrinks = drinkers * drinksPerPerson;

        let beerBottles = 0;
        let wineBottles = 0;
        let liquorBottles = 0;
        let champagneBottles = 0;

        if (barType === "champagne") {
          champagneBottles = Math.ceil(guests / 6); // 6 flutes per bottle
        } else if (barType === "beer_wine") {
          beerBottles = Math.ceil(totalDrinks * 0.5);
          wineBottles = Math.ceil((totalDrinks * 0.5) / 5);
        } else if (barType === "full_bar") {
          beerBottles = Math.ceil(totalDrinks * 0.35);
          wineBottles = Math.ceil((totalDrinks * 0.35) / 5);
          liquorBottles = Math.ceil((totalDrinks * 0.3) / 16);
          champagneBottles = Math.ceil(guests / 6); // for toast
        } else {
          // signature
          beerBottles = Math.ceil(totalDrinks * 0.3);
          wineBottles = Math.ceil((totalDrinks * 0.3) / 5);
          liquorBottles = Math.ceil((totalDrinks * 0.4) / 16);
          champagneBottles = Math.ceil(guests / 6);
        }

        const beerCases = Math.ceil(beerBottles / 24);
        const iceLbs = Math.ceil(guests * 1.5);
        const napkins = Math.ceil(guests * 5);

        return {
          primary: { label: "Total Drinks Needed", value: formatNumber(Math.round(totalDrinks)) },
          details: [
            { label: "Beer Bottles / Cans", value: `${formatNumber(beerBottles)} (${formatNumber(beerCases)} cases)` },
            { label: "Wine Bottles", value: formatNumber(wineBottles) },
            { label: "Liquor Bottles (750mL)", value: formatNumber(liquorBottles) },
            { label: "Champagne Bottles", value: formatNumber(champagneBottles) },
            { label: "Ice", value: `${formatNumber(iceLbs)} lbs` },
            { label: "Cocktail Napkins", value: formatNumber(napkins) },
            { label: "Drinking Guests (est.)", value: formatNumber(Math.round(drinkers)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-drink-calc", "catering-serving-calc", "thanksgiving-calc"],
  faq: [
    {
      question: "How much alcohol do I need for a 100-person wedding?",
      answer: "For a 5-hour reception with 70% of guests drinking: about 150 beer bottles (6-7 cases), 30 wine bottles, and 15 liquor bottles for a full bar. Add a case of champagne for the toast.",
    },
    {
      question: "Is it cheaper to do beer and wine only?",
      answer: "Yes. A beer-and-wine-only bar is typically 30-40% cheaper than a full bar. It also simplifies service and reduces the number of supplies needed.",
    },
    {
      question: "How many champagne bottles for a toast?",
      answer: "You get about 6 champagne flutes from one 750mL bottle. For 100 guests, plan for 17-18 bottles to ensure everyone gets a glass for the toast.",
    },
  ],
  formula: "total_drinks = drinking_guests × (1.5 + (hours - 1) × 1)",
};
