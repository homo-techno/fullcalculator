import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const winePairingCalculator: CalculatorDefinition = {
  slug: "wine-pairing-calculator",
  title: "Wine Pairing Quantity Calculator",
  description:
    "Free wine pairing quantity calculator. Calculate how many bottles of wine to buy for dinner parties, events, and receptions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wine calculator",
    "how many bottles of wine",
    "wine for party",
    "wine per person",
    "wine quantity",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "eventType",
          label: "Event Type",
          type: "select",
          options: [
            { label: "Dinner Party (2-3 hours)", value: "dinner" },
            { label: "Cocktail Reception (2 hours)", value: "cocktail" },
            { label: "Wedding / Long Event (4-5 hours)", value: "wedding" },
            { label: "Wine Tasting", value: "tasting" },
            { label: "Casual Get-Together", value: "casual" },
          ],
        },
        {
          name: "drinkLevel",
          label: "Drinking Level",
          type: "select",
          options: [
            { label: "Light (wine with dinner)", value: "light" },
            { label: "Moderate", value: "moderate" },
            { label: "Generous", value: "generous" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const eventType = inputs.eventType as string;
        const drinkLevel = inputs.drinkLevel as string;
        if (!guests || guests <= 0) return null;

        const glassesPerPerson: Record<string, Record<string, number>> = {
          dinner: { light: 2, moderate: 3, generous: 4 },
          cocktail: { light: 1.5, moderate: 2.5, generous: 3.5 },
          wedding: { light: 3, moderate: 4, generous: 6 },
          tasting: { light: 3, moderate: 5, generous: 6 },
          casual: { light: 1.5, moderate: 2.5, generous: 3.5 },
        };

        const glassesPerGuest = (glassesPerPerson[eventType] && glassesPerPerson[eventType][drinkLevel]) || 3;
        const totalGlasses = guests * glassesPerGuest;
        const glassesPerBottle = 5;
        const totalBottles = Math.ceil(totalGlasses / glassesPerBottle);
        const redBottles = Math.ceil(totalBottles * 0.5);
        const whiteBottles = Math.ceil(totalBottles * 0.35);
        const roseOrSparkling = totalBottles - redBottles - whiteBottles;
        const cases = Math.ceil(totalBottles / 12);
        const costLow = totalBottles * 12;
        const costHigh = totalBottles * 25;

        return {
          primary: {
            label: "Bottles Needed",
            value: String(totalBottles),
          },
          details: [
            { label: "Total Glasses", value: formatNumber(totalGlasses, 0) },
            { label: "Red Wine Bottles", value: String(redBottles) },
            { label: "White Wine Bottles", value: String(whiteBottles) },
            { label: "Rose / Sparkling", value: String(Math.max(0, roseOrSparkling)) },
            { label: "Cases (12 bottles)", value: String(cases) },
            { label: "Estimated Cost", value: "$" + formatNumber(costLow, 0) + " - $" + formatNumber(costHigh, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wine-serving-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How many bottles of wine do I need for a dinner party?",
      answer:
        "Plan for about half a bottle per person for a dinner party (2-3 glasses each). For 10 guests, buy 5-6 bottles. Always round up and consider having both red and white available.",
    },
    {
      question: "What is the standard wine pour?",
      answer:
        "A standard wine pour is 5 ounces, which gives you about 5 glasses per 750ml bottle. For a wine tasting, pours are usually 2-3 ounces each.",
    },
  ],
  formula:
    "Bottles = ceil(Guests × Glasses per person / 5 glasses per bottle). Suggested split: 50% red, 35% white, 15% rose/sparkling. Glasses per person varies by event type and drinking level.",
};
