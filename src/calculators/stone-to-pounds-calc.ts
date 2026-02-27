import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stoneToPoundsCalcCalculator: CalculatorDefinition = {
  slug: "stone-to-pounds-calc",
  title: "Stone to Pounds & Kilograms Converter",
  description:
    "Convert between stone, pounds, and kilograms. Commonly used in the UK and Ireland for body weight measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "stone",
    "pounds",
    "kilograms",
    "weight",
    "body weight",
    "UK",
    "imperial",
    "mass",
    "st",
    "lbs",
    "kg",
  ],
  variants: [
    {
      slug: "stone-to-lbs",
      title: "Stone to Pounds & Kilograms",
      fields: [
        {
          name: "stone",
          label: "Stone (st)",
          type: "number",
        },
        {
          name: "extraPounds",
          label: "Extra Pounds (optional)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const stone = parseFloat(inputs.stone as string);
        const extra = parseFloat(inputs.extraPounds as string) || 0;
        if (isNaN(stone)) return { error: "Please enter a valid stone value." };

        const totalPounds = stone * 14 + extra;
        const kg = totalPounds * 0.453592;
        const grams = kg * 1000;
        const ounces = totalPounds * 16;

        return {
          results: [
            { label: "Total Pounds (lbs)", value: formatNumber(totalPounds) },
            { label: "Kilograms (kg)", value: formatNumber(kg) },
            { label: "Grams (g)", value: formatNumber(grams) },
            { label: "Ounces (oz)", value: formatNumber(ounces) },
            { label: "Stone & Pounds", value: `${Math.floor(totalPounds / 14)} st ${formatNumber(totalPounds % 14)} lbs` },
          ],
        };
      },
    },
    {
      slug: "lbs-to-stone",
      title: "Pounds to Stone",
      fields: [
        {
          name: "pounds",
          label: "Weight (Pounds)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const pounds = parseFloat(inputs.pounds as string);
        if (isNaN(pounds)) return { error: "Please enter a valid weight in pounds." };

        const totalStone = pounds / 14;
        const wholeStone = Math.floor(totalStone);
        const remainderLbs = pounds - wholeStone * 14;
        const kg = pounds * 0.453592;

        return {
          results: [
            { label: "Stone (decimal)", value: formatNumber(totalStone) },
            { label: "Stone & Pounds", value: `${wholeStone} st ${formatNumber(remainderLbs)} lbs` },
            { label: "Kilograms (kg)", value: formatNumber(kg) },
            { label: "Pounds (input)", value: formatNumber(pounds) },
          ],
        };
      },
    },
    {
      slug: "kg-to-stone",
      title: "Kilograms to Stone & Pounds",
      fields: [
        {
          name: "kg",
          label: "Weight (Kilograms)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const kg = parseFloat(inputs.kg as string);
        if (isNaN(kg)) return { error: "Please enter a valid weight in kilograms." };

        const pounds = kg / 0.453592;
        const totalStone = pounds / 14;
        const wholeStone = Math.floor(totalStone);
        const remainderLbs = pounds - wholeStone * 14;

        return {
          results: [
            { label: "Stone (decimal)", value: formatNumber(totalStone) },
            { label: "Stone & Pounds", value: `${wholeStone} st ${formatNumber(remainderLbs)} lbs` },
            { label: "Pounds (lbs)", value: formatNumber(pounds) },
            { label: "Kilograms (input)", value: formatNumber(kg) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["micrograms-to-mg", "newtons-to-pounds", "nautical-miles-to-km"],
  faq: [
    {
      question: "How many pounds are in a stone?",
      answer:
        "One stone equals exactly 14 pounds (approximately 6.35 kg). The stone is commonly used in the UK and Ireland for measuring body weight.",
    },
    {
      question: "Why is body weight measured in stone in the UK?",
      answer:
        "The stone has been used as a unit of weight in Britain since at least the 14th century. Although the UK officially adopted the metric system, stone remains the most common way people express their body weight in everyday conversation.",
    },
  ],
  formula:
    "Pounds = Stone x 14 | Stone = Pounds / 14 | kg = Pounds x 0.453592 | Pounds = kg / 0.453592",
};
