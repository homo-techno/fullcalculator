import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaDoughCalculator: CalculatorDefinition = {
  slug: "pizza-dough-calculator",
  title: "Pizza Dough Calculator",
  description:
    "Free pizza dough calculator. Get precise ingredient amounts for homemade pizza dough based on number and size of pizzas.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pizza dough",
    "pizza recipe",
    "dough calculator",
    "baker's percentage",
    "pizza ingredients",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "pizzas",
          label: "Number of Pizzas",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "size",
          label: "Pizza Size",
          type: "select",
          options: [
            { label: "10 inch (Small)", value: "10" },
            { label: "12 inch (Medium)", value: "12" },
            { label: "14 inch (Large)", value: "14" },
            { label: "16 inch (X-Large)", value: "16" },
          ],
        },
      ],
      calculate: (inputs) => {
        const pizzas = inputs.pizzas as number;
        const size = parseFloat(inputs.size as string) || 12;
        if (!pizzas || pizzas <= 0) return null;

        const flourPerBall: Record<number, number> = {
          10: 150,
          12: 220,
          14: 280,
          16: 350,
        };

        const flourPerPizza = flourPerBall[size] || 220;
        const totalFlour = flourPerPizza * pizzas;
        const water = totalFlour * 0.65;
        const salt = totalFlour * 0.02;
        const yeast = totalFlour * 0.005;
        const oliveOil = totalFlour * 0.03;
        const totalDough = totalFlour + water + salt + yeast + oliveOil;

        return {
          primary: {
            label: "Flour",
            value: formatNumber(totalFlour, 0) + " g",
          },
          details: [
            { label: "Water (65%)", value: formatNumber(water, 0) + " g" },
            { label: "Salt (2%)", value: formatNumber(salt, 1) + " g" },
            { label: "Yeast (0.5%)", value: formatNumber(yeast, 1) + " g" },
            { label: "Olive Oil (3%)", value: formatNumber(oliveOil, 1) + " g" },
            { label: "Total Dough Weight", value: formatNumber(totalDough, 0) + " g" },
            {
              label: "Dough Ball Weight",
              value: formatNumber(totalDough / pizzas, 0) + " g each",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-food-calculator", "coffee-ratio-calculator"],
  faq: [
    {
      question: "What is baker's percentage?",
      answer:
        "Baker's percentage expresses each ingredient as a percentage of the total flour weight. For example, 65% hydration means the water weighs 65% of the flour weight.",
    },
    {
      question: "How long should pizza dough rise?",
      answer:
        "For best flavor, cold ferment in the refrigerator for 24-72 hours. For same-day pizza, let the dough rise at room temperature for 1-2 hours until doubled in size.",
    },
  ],
  formula:
    "All percentages are baker's percentages relative to flour weight. Water = 65%, Salt = 2%, Yeast = 0.5%, Olive Oil = 3%. Flour per pizza varies by size: 10\" = 150g, 12\" = 220g, 14\" = 280g, 16\" = 350g.",
};
