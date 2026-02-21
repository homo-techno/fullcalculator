import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partyFoodCalculator: CalculatorDefinition = {
  slug: "party-food-calculator",
  title: "Party Food Calculator",
  description:
    "Free party food calculator. Calculate how much food and drinks to serve based on guest count, event duration, and meal type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "party food",
    "catering calculator",
    "food per person",
    "event planning",
    "party planning",
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
          placeholder: "e.g. 30",
        },
        {
          name: "duration",
          label: "Event Duration (hours)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "mealType",
          label: "Meal Type",
          type: "select",
          options: [
            { label: "Appetizers Only", value: "appetizers" },
            { label: "Full Meal", value: "full" },
            { label: "BBQ", value: "bbq" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const duration = inputs.duration as number;
        const mealType = (inputs.mealType as string) || "full";
        if (!guests || guests <= 0 || !duration || duration <= 0) return null;

        let meatLbs = 0;
        let sidesLbs = 0;
        let appetizerPieces = 0;
        const drinksPerHour = 2;
        const totalDrinks = guests * drinksPerHour * duration;

        if (mealType === "appetizers") {
          appetizerPieces = guests * 6 * Math.min(duration, 4);
          sidesLbs = guests * 0.25;
        } else if (mealType === "full") {
          meatLbs = guests * 0.5;
          sidesLbs = guests * 0.375;
          appetizerPieces = guests * 4;
        } else {
          meatLbs = guests * 0.67;
          sidesLbs = guests * 0.5;
          appetizerPieces = guests * 3;
        }

        const icePerPerson = 1.5;
        const totalIce = guests * icePerPerson;

        return {
          primary: {
            label: "Meat / Protein",
            value: meatLbs > 0 ? formatNumber(meatLbs, 1) + " lbs" : "N/A (appetizers)",
          },
          details: [
            { label: "Side Dishes", value: formatNumber(sidesLbs, 1) + " lbs" },
            {
              label: "Appetizer Pieces",
              value: formatNumber(appetizerPieces, 0),
            },
            {
              label: "Drinks (total)",
              value: formatNumber(totalDrinks, 0) + " servings",
            },
            { label: "Ice Needed", value: formatNumber(totalIce, 0) + " lbs" },
            { label: "Plates Needed", value: formatNumber(Math.ceil(guests * 1.5), 0) },
            { label: "Napkins", value: formatNumber(guests * 3, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-budget-calculator", "pizza-dough-calculator"],
  faq: [
    {
      question: "How much food do I need per person at a party?",
      answer:
        "For a full meal, plan about 0.5 lbs of meat and 0.375 lbs of sides per person. For a BBQ, increase to 0.67 lbs of meat per person. For appetizers only, plan 6 pieces per person per hour.",
    },
    {
      question: "How many drinks per person for a party?",
      answer:
        "Plan for about 2 drinks per person per hour. For a 4-hour event with 20 guests, that would be about 160 drinks total.",
    },
  ],
  formula:
    "Full Meal: 0.5 lb meat + 0.375 lb sides per person. BBQ: 0.67 lb meat + 0.5 lb sides per person. Appetizers: 6 pieces per person per hour. Drinks: 2 per person per hour.",
};
