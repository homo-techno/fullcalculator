import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaPartyCalculator: CalculatorDefinition = {
  slug: "pizza-party-calculator",
  title: "Pizza Party Calculator",
  description:
    "Free pizza party calculator. Figure out how many pizzas to order based on number of guests, appetite, and pizza size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pizza party",
    "how many pizzas",
    "pizza for group",
    "pizza order calculator",
    "pizza per person",
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
          name: "pizzaSize",
          label: "Pizza Size",
          type: "select",
          options: [
            { label: "Small (10 inch, 6 slices)", value: "small" },
            { label: "Medium (12 inch, 8 slices)", value: "medium" },
            { label: "Large (14 inch, 8 slices)", value: "large" },
            { label: "Extra Large (16 inch, 10 slices)", value: "xlarge" },
          ],
        },
        {
          name: "appetite",
          label: "Group Appetite",
          type: "select",
          options: [
            { label: "Light (kids party, lots of sides)", value: "light" },
            { label: "Average (mixed group)", value: "average" },
            { label: "Hungry (teens, game day)", value: "hungry" },
          ],
        },
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const pizzaSize = inputs.pizzaSize as string;
        const appetite = inputs.appetite as string;
        if (!guests || guests <= 0) return null;

        const slicesPerPizza: Record<string, number> = {
          small: 6,
          medium: 8,
          large: 8,
          xlarge: 10,
        };

        const slicesPerPerson: Record<string, number> = {
          light: 2,
          average: 3,
          hungry: 4,
        };

        const priceEstimate: Record<string, number> = {
          small: 10,
          medium: 14,
          large: 18,
          xlarge: 22,
        };

        const slicesPP = slicesPerPerson[appetite] || 3;
        const totalSlices = guests * slicesPP;
        const slicesPP_pizza = slicesPerPizza[pizzaSize] || 8;
        const pizzasNeeded = Math.ceil(totalSlices / slicesPP_pizza);
        const pizzasCheese = Math.ceil(pizzasNeeded * 0.3);
        const pizzasPepperoni = Math.ceil(pizzasNeeded * 0.35);
        const pizzasSpecialty = pizzasNeeded - pizzasCheese - pizzasPepperoni;
        const estCost = pizzasNeeded * (priceEstimate[pizzaSize] || 16);
        const leftoverSlices = pizzasNeeded * slicesPP_pizza - totalSlices;

        return {
          primary: {
            label: "Pizzas to Order",
            value: String(pizzasNeeded),
          },
          details: [
            { label: "Total Slices Needed", value: String(totalSlices) },
            { label: "Cheese Pizzas", value: String(pizzasCheese) },
            { label: "Pepperoni Pizzas", value: String(pizzasPepperoni) },
            { label: "Specialty / Other", value: String(Math.max(0, pizzasSpecialty)) },
            { label: "Estimated Cost", value: "$" + formatNumber(estCost, 0) },
            { label: "Extra Slices (buffer)", value: String(leftoverSlices) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pizza-dough-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How many slices of pizza per person?",
      answer:
        "Plan for 2 slices per child, 3 slices per adult, and 4 slices for hungry teens or adults. If pizza is the main meal with few sides, lean toward the higher number.",
    },
    {
      question: "What pizza varieties should I order for a party?",
      answer:
        "A safe mix is about 30% cheese, 35% pepperoni, and 35% specialty or veggie. Always have at least one plain cheese pizza since it is universally liked.",
    },
  ],
  formula:
    "Pizzas = ceil(Guests × Slices per person / Slices per pizza). Slices per person: Light 2, Average 3, Hungry 4. Suggested split: 30% cheese, 35% pepperoni, 35% specialty.",
};
