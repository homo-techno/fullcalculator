import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thanksgivingCalculator: CalculatorDefinition = {
  slug: "thanksgiving-calc",
  title: "Thanksgiving Dinner Calculator",
  description: "Free online Thanksgiving dinner calculator. Calculate turkey size, side dish quantities, and servings for your holiday gathering.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["thanksgiving calculator", "turkey size", "holiday dinner", "servings calculator", "thanksgiving planning", "how much turkey"],
  variants: [
    {
      id: "thanksgiving-plan",
      name: "Thanksgiving Dinner Planner",
      fields: [
        { name: "guests", label: "Number of Guests", type: "number", placeholder: "e.g. 12" },
        {
          name: "leftovers",
          label: "Leftover Preference",
          type: "select",
          options: [
            { label: "No Leftovers", value: "none" },
            { label: "Some Leftovers", value: "some" },
            { label: "Lots of Leftovers", value: "lots" },
          ],
        },
        {
          name: "appetite",
          label: "Guest Appetite",
          type: "select",
          options: [
            { label: "Light Eaters", value: "light" },
            { label: "Average", value: "average" },
            { label: "Big Eaters", value: "big" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string) || 0;
        const leftovers = inputs.leftovers as string;
        const appetite = inputs.appetite as string;

        const leftoverMultiplier = leftovers === "none" ? 1.0 : leftovers === "some" ? 1.3 : 1.6;
        const appetiteMultiplier = appetite === "light" ? 0.85 : appetite === "big" ? 1.2 : 1.0;
        const factor = leftoverMultiplier * appetiteMultiplier;

        // Turkey: 1.25 lbs per person base
        const turkeyLbs = guests * 1.25 * factor;
        // Mashed potatoes: 0.5 lbs per person
        const mashedPotatoesLbs = guests * 0.5 * factor;
        // Stuffing: 0.33 cups per person -> lbs (rough)
        const stuffingCups = guests * 0.75 * factor;
        // Cranberry sauce: 0.25 cups per person
        const cranberryCups = guests * 0.25 * factor;
        // Green bean casserole: 0.33 lbs per person
        const greenBeanLbs = guests * 0.33 * factor;
        // Rolls: 2 per person
        const rolls = Math.ceil(guests * 2 * factor);
        // Gravy: 0.33 cups per person
        const gravyCups = guests * 0.33 * factor;
        // Pie: 1 pie per 8 guests
        const pies = Math.ceil((guests * factor) / 8);

        return {
          primary: { label: "Turkey Size", value: `${formatNumber(turkeyLbs)} lbs` },
          details: [
            { label: "Mashed Potatoes", value: `${formatNumber(mashedPotatoesLbs)} lbs` },
            { label: "Stuffing", value: `${formatNumber(stuffingCups)} cups` },
            { label: "Cranberry Sauce", value: `${formatNumber(cranberryCups)} cups` },
            { label: "Green Bean Casserole", value: `${formatNumber(greenBeanLbs)} lbs` },
            { label: "Dinner Rolls", value: formatNumber(rolls) },
            { label: "Gravy", value: `${formatNumber(gravyCups)} cups` },
            { label: "Pies", value: formatNumber(pies) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ham-cooking-time", "catering-serving-calc", "brine-calculator"],
  faq: [
    {
      question: "How many pounds of turkey per person?",
      answer: "Plan for 1.25 pounds of turkey per person. This accounts for bone weight and provides a generous serving. For more leftovers, plan 1.5-2 pounds per person.",
    },
    {
      question: "How big of a turkey do I need for 12 people?",
      answer: "For 12 people with some leftovers, you will need a 19-20 pound turkey. Without leftovers, a 15-pound turkey should suffice.",
    },
    {
      question: "How many pies should I make for Thanksgiving?",
      answer: "Plan for one pie per 8 guests. For 12 guests, make at least 2 pies. If you want variety (pumpkin and pecan, for example), make at least one of each.",
    },
  ],
  formula: "turkey_lbs = guests × 1.25 × leftover_factor × appetite_factor",
};
