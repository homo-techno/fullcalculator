import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breadRecipeCalculator: CalculatorDefinition = {
  slug: "bread-recipe-calculator",
  title: "Bread Recipe Calculator",
  description:
    "Free bread recipe calculator using baker's percentages. Calculate precise ingredient amounts for any loaf size and hydration level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bread recipe calculator",
    "baker's percentage",
    "bread dough calculator",
    "bread flour calculator",
    "hydration calculator bread",
    "bread ingredients",
  ],
  variants: [
    {
      id: "by-loaves",
      name: "By Number of Loaves",
      description: "Calculate ingredient amounts based on number and size of loaves",
      fields: [
        {
          name: "loaves",
          label: "Number of Loaves",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "loafSize",
          label: "Loaf Size",
          type: "select",
          options: [
            { label: "Small (1 lb / 450g)", value: "450" },
            { label: "Medium (1.5 lb / 680g)", value: "680" },
            { label: "Large (2 lb / 900g)", value: "900" },
          ],
        },
        {
          name: "hydration",
          label: "Hydration Level",
          type: "select",
          options: [
            { label: "60% (Bagels, Stiff Dough)", value: "60" },
            { label: "65% (Standard Sandwich Bread)", value: "65" },
            { label: "70% (French Bread)", value: "70" },
            { label: "75% (Ciabatta, Artisan)", value: "75" },
            { label: "80% (High Hydration / Sourdough)", value: "80" },
          ],
        },
        {
          name: "breadType",
          label: "Bread Type",
          type: "select",
          options: [
            { label: "Basic White Bread", value: "white" },
            { label: "Whole Wheat Bread", value: "whole_wheat" },
            { label: "Enriched (Butter/Egg)", value: "enriched" },
          ],
        },
      ],
      calculate: (inputs) => {
        const loaves = inputs.loaves as number;
        const loafSize = parseFloat(inputs.loafSize as string) || 680;
        const hydration = parseFloat(inputs.hydration as string) || 65;
        const breadType = inputs.breadType as string;
        if (!loaves || loaves <= 0) return null;

        const totalDoughWeight = loaves * loafSize;
        // Baker's percentages: flour = 100%, water = hydration%, salt = 2%, yeast = 1%
        // Enriched adds butter 5% and sugar 5%
        let totalPct = 100 + hydration + 2 + 1;
        if (breadType === "enriched") totalPct += 10; // butter 5% + sugar 5%

        const flour = (totalDoughWeight * 100) / totalPct;
        const water = (flour * hydration) / 100;
        const salt = (flour * 2) / 100;
        const yeast = (flour * 1) / 100;
        const butter = breadType === "enriched" ? (flour * 5) / 100 : 0;
        const sugar = breadType === "enriched" ? (flour * 5) / 100 : 0;

        const details = [
          { label: "Flour", value: formatNumber(flour, 0) + " g" },
          { label: "Water (" + hydration + "%)", value: formatNumber(water, 0) + " g" },
          { label: "Salt (2%)", value: formatNumber(salt, 1) + " g" },
          { label: "Yeast (1%)", value: formatNumber(yeast, 1) + " g" },
        ];

        if (breadType === "enriched") {
          details.push({ label: "Butter (5%)", value: formatNumber(butter, 1) + " g" });
          details.push({ label: "Sugar (5%)", value: formatNumber(sugar, 1) + " g" });
        }

        details.push({ label: "Total Dough Weight", value: formatNumber(totalDoughWeight, 0) + " g" });
        details.push({ label: "Dough per Loaf", value: formatNumber(loafSize, 0) + " g" });

        return {
          primary: {
            label: "Flour Needed",
            value: formatNumber(flour, 0) + " g",
          },
          details,
        };
      },
    },
    {
      id: "by-flour",
      name: "By Flour Weight",
      description: "Calculate all ingredients based on a specific flour weight",
      fields: [
        {
          name: "flourWeight",
          label: "Flour Weight (grams)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "hydration",
          label: "Hydration Level (%)",
          type: "number",
          placeholder: "e.g. 70",
        },
      ],
      calculate: (inputs) => {
        const flourWeight = inputs.flourWeight as number;
        const hydration = inputs.hydration as number;
        if (!flourWeight || !hydration) return null;

        const water = (flourWeight * hydration) / 100;
        const salt = (flourWeight * 2) / 100;
        const yeast = (flourWeight * 1) / 100;
        const total = flourWeight + water + salt + yeast;

        return {
          primary: {
            label: "Total Dough Weight",
            value: formatNumber(total, 0) + " g",
          },
          details: [
            { label: "Flour (100%)", value: formatNumber(flourWeight, 0) + " g" },
            { label: "Water (" + hydration + "%)", value: formatNumber(water, 0) + " g" },
            { label: "Salt (2%)", value: formatNumber(salt, 1) + " g" },
            { label: "Yeast (1%)", value: formatNumber(yeast, 1) + " g" },
            { label: "Total", value: formatNumber(total, 0) + " g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sourdough-starter-calculator", "pizza-dough-calculator", "yeast-conversion-calculator"],
  faq: [
    {
      question: "What is baker's percentage?",
      answer:
        "Baker's percentage expresses each ingredient as a percentage of the total flour weight. Flour is always 100%. So '70% hydration' means the water weighs 70% of the flour weight. This makes scaling recipes easy.",
    },
    {
      question: "What hydration level should I use?",
      answer:
        "It depends on the bread type. 60-65% for sandwich bread and bagels, 65-70% for French bread, 70-80% for artisan and sourdough. Higher hydration doughs are wetter and harder to handle but produce more open crumb structures.",
    },
    {
      question: "How much does bread weigh after baking?",
      answer:
        "Bread loses about 10-15% of its weight during baking due to moisture evaporation. So a 900g dough ball will produce roughly a 765-810g baked loaf.",
    },
  ],
  formula:
    "Baker's Percentage: Flour = 100%, Water = Hydration%, Salt = 2%, Yeast = 1%. Flour Weight = Total Dough Weight x (100 / Sum of All Percentages). Each ingredient = Flour Weight x (Its Percentage / 100).",
};
