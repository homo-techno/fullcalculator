import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const riceCookerCalculator: CalculatorDefinition = {
  slug: "rice-cooker-calculator",
  title: "Rice Cooker Water Ratio",
  description:
    "Free rice cooker water ratio calculator. Get the perfect water-to-rice ratio for any rice type and number of servings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rice cooker",
    "rice water ratio",
    "how much water for rice",
    "rice calculator",
    "rice serving",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "cups",
          label: "Cups of Dry Rice",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "riceType",
          label: "Rice Type",
          type: "select",
          options: [
            { label: "Long Grain White", value: "long_white" },
            { label: "Short Grain White (Sushi)", value: "short_white" },
            { label: "Jasmine", value: "jasmine" },
            { label: "Basmati", value: "basmati" },
            { label: "Brown Rice", value: "brown" },
            { label: "Wild Rice", value: "wild" },
            { label: "Arborio (Risotto)", value: "arborio" },
          ],
        },
        {
          name: "method",
          label: "Cooking Method",
          type: "select",
          options: [
            { label: "Rice Cooker", value: "rice_cooker" },
            { label: "Stovetop (covered)", value: "stovetop" },
            { label: "Instant Pot", value: "instant_pot" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cups = inputs.cups as number;
        const riceType = inputs.riceType as string;
        const method = inputs.method as string;
        if (!cups || cups <= 0) return null;

        const waterRatios: Record<string, number> = {
          long_white: 1.5,
          short_white: 1.1,
          jasmine: 1.25,
          basmati: 1.5,
          brown: 2.0,
          wild: 3.0,
          arborio: 3.5,
        };

        const cookMinutes: Record<string, Record<string, number>> = {
          long_white: { rice_cooker: 18, stovetop: 18, instant_pot: 4 },
          short_white: { rice_cooker: 15, stovetop: 15, instant_pot: 3 },
          jasmine: { rice_cooker: 15, stovetop: 15, instant_pot: 3 },
          basmati: { rice_cooker: 18, stovetop: 18, instant_pot: 4 },
          brown: { rice_cooker: 45, stovetop: 45, instant_pot: 22 },
          wild: { rice_cooker: 50, stovetop: 50, instant_pot: 25 },
          arborio: { rice_cooker: 25, stovetop: 20, instant_pot: 6 },
        };

        const ratio = waterRatios[riceType] || 1.5;
        const waterCups = cups * ratio;
        const waterMl = waterCups * 236.6;
        const time = (cookMinutes[riceType] && cookMinutes[riceType][method]) || 18;
        const cookedCups = cups * (riceType === "wild" ? 3 : riceType === "brown" ? 2.5 : 2);
        const servings = Math.round(cookedCups / 0.75);
        const restTime = 10;

        return {
          primary: {
            label: "Water Needed",
            value: formatNumber(waterCups, 1) + " cups",
          },
          details: [
            { label: "Water (ml)", value: formatNumber(waterMl, 0) + " ml" },
            { label: "Rice to Water Ratio", value: "1 : " + ratio },
            { label: "Cook Time", value: time + " min" },
            { label: "Rest Time (lid on)", value: restTime + " min" },
            { label: "Cooked Rice Yield", value: formatNumber(cookedCups, 1) + " cups" },
            { label: "Servings (3/4 cup each)", value: String(servings) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rice-water-ratio-calculator", "cooking-calculator"],
  faq: [
    {
      question: "What is the water-to-rice ratio for a rice cooker?",
      answer:
        "For white long grain rice, use a 1:1.5 ratio (1 cup rice to 1.5 cups water). For sushi rice, use 1:1.1. For brown rice, use 1:2. Always let the rice rest for 10 minutes after cooking.",
    },
    {
      question: "Should I rinse rice before cooking?",
      answer:
        "Yes, rinsing rice removes excess starch and prevents sticky, gummy results. Rinse 2-3 times until the water runs mostly clear. This is especially important for jasmine and basmati rice.",
    },
  ],
  formula:
    "Water = Rice cups × Water ratio. Ratios: Long White 1.5, Short/Sushi 1.1, Jasmine 1.25, Basmati 1.5, Brown 2.0, Wild 3.0, Arborio 3.5. Cooked rice yields approximately 2× dry volume.",
};
