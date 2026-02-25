import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pieCrustCalculator: CalculatorDefinition = {
  slug: "pie-crust-calculator",
  title: "Pie Crust Calculator",
  description:
    "Free pie crust calculator. Get ingredient amounts for homemade pie crust based on pan size and crust type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pie crust",
    "pie dough",
    "pie recipe",
    "pie pan size",
    "pie crust ingredients",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "panSize",
          label: "Pie Pan Size (inches)",
          type: "select",
          options: [
            { label: "6 inch (Mini)", value: "6" },
            { label: "8 inch", value: "8" },
            { label: "9 inch (Standard)", value: "9" },
            { label: "10 inch (Deep Dish)", value: "10" },
            { label: "12 inch (Large)", value: "12" },
          ],
        },
        {
          name: "crustType",
          label: "Crust Type",
          type: "select",
          options: [
            { label: "Single Crust (bottom only)", value: "single" },
            { label: "Double Crust (top & bottom)", value: "double" },
            { label: "Lattice Top", value: "lattice" },
            { label: "Graham Cracker Crust", value: "graham" },
          ],
        },
        {
          name: "pies",
          label: "Number of Pies",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const panSize = parseFloat(inputs.panSize as string) || 9;
        const crustType = inputs.crustType as string;
        const pies = inputs.pies as number;
        if (!pies || pies <= 0) return null;

        const scaleFactor = Math.pow(panSize / 9, 2);
        const crustMultiplier: Record<string, number> = {
          single: 1,
          double: 2,
          lattice: 1.6,
          graham: 1,
        };
        const mult = crustMultiplier[crustType] || 1;

        if (crustType === "graham") {
          const crackerSleeves = Math.ceil(1.5 * scaleFactor * pies);
          const butterGrams = Math.round(85 * scaleFactor * pies);
          const sugarGrams = Math.round(50 * scaleFactor * pies);
          const servings = Math.round(panSize * 0.9);

          return {
            primary: {
              label: "Graham Crackers",
              value: formatNumber(crackerSleeves * 9, 0) + " crackers",
            },
            details: [
              { label: "Melted Butter", value: formatNumber(butterGrams, 0) + " g" },
              { label: "Sugar", value: formatNumber(sugarGrams, 0) + " g" },
              { label: "Pan Size", value: panSize + " inches" },
              { label: "Number of Pies", value: String(pies) },
              { label: "Servings per Pie", value: String(servings) },
              { label: "Bake Time", value: "10 min at 350°F" },
            ],
          };
        }

        const flour = Math.round(156 * scaleFactor * mult * pies);
        const butter = Math.round(113 * scaleFactor * mult * pies);
        const salt = Math.round(3 * scaleFactor * mult * pies * 10) / 10;
        const waterTbsp = Math.round(4 * scaleFactor * mult * pies);
        const servings = Math.round(panSize * 0.9);

        return {
          primary: {
            label: "Flour",
            value: formatNumber(flour, 0) + " g",
          },
          details: [
            { label: "Cold Butter", value: formatNumber(butter, 0) + " g" },
            { label: "Salt", value: formatNumber(salt, 1) + " g" },
            { label: "Ice Water", value: waterTbsp + " tbsp" },
            { label: "Pan Size", value: panSize + " inches" },
            { label: "Servings per Pie", value: String(servings) },
            { label: "Chill Before Rolling", value: "1 hour minimum" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "cake-pan-size-calculator"],
  faq: [
    {
      question: "What size is a standard pie pan?",
      answer:
        "A standard pie pan is 9 inches in diameter. Deep-dish pie pans are typically 9-10 inches. Mini pie pans are 5-6 inches.",
    },
    {
      question: "What is the key to flaky pie crust?",
      answer:
        "Use very cold butter cut into small pieces and ice water. Do not overwork the dough. Visible butter pieces in the dough create flaky layers. Chill the dough for at least one hour before rolling.",
    },
  ],
  formula:
    "Scale Factor = (Pan Size / 9)². Ingredients scaled from 9-inch base: Flour 156g, Butter 113g, Salt 3g, Water 4 tbsp. Multiply by crust multiplier: Single 1×, Double 2×, Lattice 1.6×.",
};
