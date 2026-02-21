import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineServingCalculator: CalculatorDefinition = {
  slug: "wine-serving-calculator",
  title: "Wine Serving Calculator",
  description:
    "Free wine serving calculator. Calculate how many bottles of wine you need for a party, dinner, or event based on guests and duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wine serving calculator",
    "wine for party",
    "how much wine per person",
    "wine bottles for event",
    "wine pour size",
    "wine glasses per bottle",
  ],
  variants: [
    {
      id: "party",
      name: "Wine for a Party",
      description: "Calculate wine needed for an event",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "duration",
          label: "Event Duration",
          type: "select",
          options: [
            { label: "1 hour (cocktail hour)", value: "1" },
            { label: "2 hours", value: "2" },
            { label: "3 hours (dinner party)", value: "3" },
            { label: "4 hours (reception)", value: "4" },
            { label: "5+ hours (wedding)", value: "5" },
          ],
        },
        {
          name: "drinkerPct",
          label: "Estimated % Wine Drinkers",
          type: "select",
          options: [
            { label: "100% (wine-only event)", value: "100" },
            { label: "75% (most prefer wine)", value: "75" },
            { label: "50% (mixed beverages)", value: "50" },
            { label: "33% (wine, beer, spirits)", value: "33" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const duration = parseFloat(inputs.duration as string) || 3;
        const drinkerPct = parseFloat(inputs.drinkerPct as string) || 50;
        if (!guests) return null;

        // Average: 2 glasses in first hour, 1 glass per hour after
        const glassesPerPerson = 2 + (duration - 1);
        const wineDrinkers = guests * (drinkerPct / 100);
        const totalGlasses = wineDrinkers * glassesPerPerson;
        const glassesPerBottle = 5; // standard 750ml / 150ml pour
        const totalBottles = Math.ceil(totalGlasses / glassesPerBottle);

        // Suggest 60% red / 40% white split (general)
        const redBottles = Math.ceil(totalBottles * 0.6);
        const whiteBottles = totalBottles - redBottles;

        return {
          primary: {
            label: "Bottles Needed",
            value: String(totalBottles),
          },
          details: [
            { label: "Wine Drinkers", value: formatNumber(wineDrinkers, 0) + " of " + guests + " guests" },
            { label: "Glasses per Person", value: formatNumber(glassesPerPerson, 0) },
            { label: "Total Glasses", value: formatNumber(totalGlasses, 0) },
            { label: "Glasses per Bottle", value: "5 (150mL / 5oz pour)" },
            { label: "Suggested Red Wine", value: redBottles + " bottles" },
            { label: "Suggested White/Ros\u00E9", value: whiteBottles + " bottles" },
            { label: "Cases (12 per case)", value: formatNumber(Math.ceil(totalBottles / 12), 1) },
          ],
        };
      },
    },
    {
      id: "pour",
      name: "Wine Pour Calculator",
      description: "Calculate standard wine serving sizes",
      fields: [
        {
          name: "bottles",
          label: "Number of Bottles",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "pourSize",
          label: "Pour Size",
          type: "select",
          options: [
            { label: "Standard (5 oz / 150 mL)", value: "150" },
            { label: "Tasting (2 oz / 60 mL)", value: "60" },
            { label: "Large (6 oz / 177 mL)", value: "177" },
            { label: "Generous (8 oz / 237 mL)", value: "237" },
          ],
        },
      ],
      calculate: (inputs) => {
        const bottles = inputs.bottles as number;
        const pourSize = parseFloat(inputs.pourSize as string) || 150;
        if (!bottles) return null;

        const totalMl = bottles * 750;
        const glasses = Math.floor(totalMl / pourSize);
        const pourOz = pourSize / 29.5735;

        return {
          primary: {
            label: "Glasses Available",
            value: String(glasses),
          },
          details: [
            { label: "Total Wine", value: formatNumber(totalMl, 0) + " mL" },
            { label: "Pour Size", value: formatNumber(pourSize, 0) + " mL (" + formatNumber(pourOz, 1) + " oz)" },
            { label: "Glasses per Bottle", value: formatNumber(750 / pourSize, 1) },
            { label: "Total Glasses", value: String(glasses) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["alcohol-dilution-calculator", "party-food-calculator", "beer-abv-calculator"],
  faq: [
    {
      question: "How many glasses of wine are in a bottle?",
      answer:
        "A standard 750mL bottle of wine contains about 5 standard glasses (5 oz / 150mL each). A magnum (1.5L) holds about 10 glasses. For tasting pours (2 oz), you can get about 12 tastes per bottle.",
    },
    {
      question: "How much wine do I need per person for a party?",
      answer:
        "Plan for about 1/2 bottle per person for a 2-3 hour event, or 2-3 glasses per person. For a longer event (4-5 hours), plan for about 1 bottle per person. Adjust based on the percentage of guests who drink wine.",
    },
    {
      question: "What is a standard wine serving?",
      answer:
        "A standard wine serving is 5 ounces (150 mL). This is the measurement used for nutritional labels and alcohol content calculations. It contains about 12% ABV, resulting in roughly 0.6 oz of pure alcohol per serving.",
    },
  ],
  formula:
    "Bottles = (Guests x Wine Drinker % x Glasses per Person) / 5 glasses per bottle. Glasses per person = 2 for first hour + 1 per additional hour. Standard bottle = 750mL = 5 standard (150mL) pours.",
};
