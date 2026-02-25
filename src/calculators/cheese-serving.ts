import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cheeseServingCalculator: CalculatorDefinition = {
  slug: "cheese-serving-calculator",
  title: "Cheese Serving Calculator",
  description:
    "Free cheese serving calculator. Calculate how much cheese to buy per person for cheese boards, parties, and events.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cheese serving",
    "cheese board",
    "cheese per person",
    "cheese platter",
    "party cheese",
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
          placeholder: "e.g. 12",
        },
        {
          name: "occasion",
          label: "Occasion",
          type: "select",
          options: [
            { label: "Appetizer / Pre-Dinner", value: "appetizer" },
            { label: "Cheese Board Main Event", value: "main" },
            { label: "Wine & Cheese Party", value: "wine_party" },
            { label: "After-Dinner Cheese Course", value: "dessert" },
          ],
        },
        {
          name: "varieties",
          label: "Number of Cheese Varieties",
          type: "select",
          options: [
            { label: "3 Varieties", value: "3" },
            { label: "4 Varieties", value: "4" },
            { label: "5 Varieties", value: "5" },
            { label: "6 Varieties", value: "6" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const occasion = inputs.occasion as string;
        const varieties = parseFloat(inputs.varieties as string) || 4;
        if (!guests || guests <= 0) return null;

        const ozPerPerson: Record<string, number> = {
          appetizer: 2,
          main: 4,
          wine_party: 5,
          dessert: 1.5,
        };

        const perPerson = ozPerPerson[occasion] || 3;
        const totalOz = guests * perPerson;
        const totalLbs = totalOz / 16;
        const totalGrams = totalOz * 28.35;
        const perVariety = totalOz / varieties;
        const crackerBoxes = Math.ceil(guests / 8);
        const fruitLbs = Math.ceil(guests * 0.15 * 10) / 10;

        return {
          primary: {
            label: "Total Cheese Needed",
            value: formatNumber(totalLbs, 1) + " lbs",
          },
          details: [
            { label: "Total (ounces)", value: formatNumber(totalOz, 0) + " oz" },
            { label: "Total (grams)", value: formatNumber(totalGrams, 0) + " g" },
            { label: "Per Variety", value: formatNumber(perVariety, 1) + " oz each" },
            { label: "Per Person", value: perPerson + " oz" },
            { label: "Crackers/Bread (boxes)", value: String(crackerBoxes) },
            { label: "Fruit/Accompaniments", value: formatNumber(fruitLbs, 1) + " lbs" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-food-calculator", "wine-serving-calculator"],
  faq: [
    {
      question: "How much cheese do I need per person?",
      answer:
        "For appetizers, plan 2 oz per person. For a cheese board as the main event, plan 4-5 oz per person. For a wine and cheese party, plan 5 oz per person.",
    },
    {
      question: "How many types of cheese should be on a cheese board?",
      answer:
        "A good cheese board has 3-5 varieties with a mix of textures and flavors: a soft cheese (brie), a semi-soft (gouda), a hard cheese (cheddar or parmesan), and a blue cheese.",
    },
  ],
  formula:
    "Total cheese = Guests × Ounces per person. Per variety = Total / Number of varieties. Ounces per person: Appetizer 2oz, Main 4oz, Wine party 5oz, Dessert course 1.5oz.",
};
