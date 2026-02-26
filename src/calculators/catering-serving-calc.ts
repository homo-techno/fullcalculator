import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cateringServingCalculator: CalculatorDefinition = {
  slug: "catering-serving-calc",
  title: "Catering Servings Per Person Calculator",
  description: "Free online catering calculator. Estimate food quantities per person for buffets, sit-down dinners, and events.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["catering calculator", "servings per person", "event food calculator", "buffet planning", "food quantity estimator"],
  variants: [
    {
      id: "catering",
      name: "Catering Quantity Calculator",
      fields: [
        { name: "guests", label: "Number of Guests", type: "number", placeholder: "e.g. 50" },
        {
          name: "mealType",
          label: "Meal Type",
          type: "select",
          options: [
            { label: "Buffet Dinner", value: "buffet" },
            { label: "Sit-Down Dinner", value: "sitdown" },
            { label: "Cocktail / Appetizer Party", value: "cocktail" },
            { label: "BBQ / Cookout", value: "bbq" },
            { label: "Brunch", value: "brunch" },
            { label: "Lunch", value: "lunch" },
          ],
        },
        {
          name: "appetite",
          label: "Appetite Level",
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Average", value: "average" },
            { label: "Hearty", value: "hearty" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guests as string) || 0;
        const mealType = inputs.mealType as string;
        const appetite = inputs.appetite as string;

        const appetiteFactor: Record<string, number> = {
          light: 0.8,
          average: 1.0,
          hearty: 1.25,
        };

        // Pounds of food per person by meal type
        const meatPerPerson: Record<string, number> = {
          buffet: 0.5,
          sitdown: 0.5,
          cocktail: 0.33,
          bbq: 0.67,
          brunch: 0.33,
          lunch: 0.4,
        };

        const sidesPerPerson: Record<string, number> = {
          buffet: 0.5,
          sitdown: 0.4,
          cocktail: 0.25,
          bbq: 0.5,
          brunch: 0.33,
          lunch: 0.33,
        };

        const saladPerPerson: Record<string, number> = {
          buffet: 0.15,
          sitdown: 0.15,
          cocktail: 0.1,
          bbq: 0.15,
          brunch: 0.1,
          lunch: 0.15,
        };

        const dessertPerPerson: Record<string, number> = {
          buffet: 1.5,
          sitdown: 1.0,
          cocktail: 2.0,
          bbq: 1.0,
          brunch: 1.0,
          lunch: 1.0,
        };

        const af = appetiteFactor[appetite] || 1.0;
        const meatLbs = guests * (meatPerPerson[mealType] || 0.5) * af;
        const sideLbs = guests * (sidesPerPerson[mealType] || 0.4) * af;
        const saladLbs = guests * (saladPerPerson[mealType] || 0.15) * af;
        const dessertServings = guests * (dessertPerPerson[mealType] || 1) * af;
        const breadRolls = Math.ceil(guests * 1.5 * af);
        const beverageGallons = guests * 0.25 * af;

        return {
          primary: { label: "Meat / Protein", value: `${formatNumber(meatLbs)} lbs` },
          details: [
            { label: "Side Dishes", value: `${formatNumber(sideLbs)} lbs` },
            { label: "Salad / Greens", value: `${formatNumber(saladLbs)} lbs` },
            { label: "Dessert Pieces", value: formatNumber(Math.round(dessertServings)) },
            { label: "Bread / Rolls", value: formatNumber(breadRolls) },
            { label: "Beverages", value: `${formatNumber(beverageGallons)} gallons` },
            { label: "Guests", value: formatNumber(guests) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["thanksgiving-calc", "party-drink-calc", "wedding-alcohol-calc"],
  faq: [
    {
      question: "How much meat per person for a buffet?",
      answer: "Plan for about 0.5 pounds (8 ounces) of cooked meat per person for a buffet dinner. For a BBQ, increase to about 0.67 pounds per person since meat is the star of the meal.",
    },
    {
      question: "How do I calculate food for 50 guests?",
      answer: "For 50 guests at a buffet dinner: approximately 25 lbs of meat, 25 lbs of side dishes, 7.5 lbs of salad, 75 dinner rolls, and 12.5 gallons of beverages.",
    },
    {
      question: "Should I plan for extra food at a catered event?",
      answer: "Yes. Add 10-15% extra to account for varying appetites and unexpected guests. It is better to have a little extra than to run short at an event.",
    },
  ],
  formula: "food_quantity = guests × per_person_amount × appetite_factor",
};
