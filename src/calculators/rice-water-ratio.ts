import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const riceWaterRatioCalculator: CalculatorDefinition = {
  slug: "rice-water-ratio-calculator",
  title: "Rice to Water Ratio Calculator",
  description:
    "Free rice to water ratio calculator. Get the perfect water-to-rice ratio for white, brown, basmati, jasmine, and sushi rice.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rice water ratio",
    "rice to water",
    "how much water for rice",
    "rice cooking ratio",
    "brown rice water ratio",
    "basmati rice ratio",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Water for Rice",
      fields: [
        {
          name: "cups",
          label: "Rice (cups)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "riceType",
          label: "Type of Rice",
          type: "select",
          options: [
            { label: "Long Grain White", value: "white_long" },
            { label: "Short Grain White", value: "white_short" },
            { label: "Basmati", value: "basmati" },
            { label: "Jasmine", value: "jasmine" },
            { label: "Brown Rice", value: "brown" },
            { label: "Sushi Rice", value: "sushi" },
            { label: "Wild Rice", value: "wild" },
            { label: "Arborio (Risotto)", value: "arborio" },
          ],
        },
        {
          name: "method",
          label: "Cooking Method",
          type: "select",
          options: [
            { label: "Stovetop", value: "stovetop" },
            { label: "Rice Cooker", value: "rice_cooker" },
            { label: "Instant Pot", value: "instant_pot" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cups = inputs.cups as number;
        const riceType = inputs.riceType as string;
        const method = inputs.method as string;
        if (!cups || !riceType || !method) return null;

        // Water ratio (cups of water per cup of rice) and cooking time
        const riceData: Record<string, Record<string, { ratio: number; time: string }>> = {
          white_long: {
            stovetop: { ratio: 1.75, time: "15-18 min" },
            rice_cooker: { ratio: 1.5, time: "Auto" },
            instant_pot: { ratio: 1.0, time: "3 min + 10 min release" },
          },
          white_short: {
            stovetop: { ratio: 1.5, time: "15-18 min" },
            rice_cooker: { ratio: 1.25, time: "Auto" },
            instant_pot: { ratio: 1.0, time: "3 min + 10 min release" },
          },
          basmati: {
            stovetop: { ratio: 1.5, time: "15-20 min" },
            rice_cooker: { ratio: 1.5, time: "Auto" },
            instant_pot: { ratio: 1.0, time: "4 min + 10 min release" },
          },
          jasmine: {
            stovetop: { ratio: 1.5, time: "12-15 min" },
            rice_cooker: { ratio: 1.25, time: "Auto" },
            instant_pot: { ratio: 1.0, time: "3 min + 10 min release" },
          },
          brown: {
            stovetop: { ratio: 2.25, time: "40-50 min" },
            rice_cooker: { ratio: 2.0, time: "Auto" },
            instant_pot: { ratio: 1.25, time: "22 min + 10 min release" },
          },
          sushi: {
            stovetop: { ratio: 1.2, time: "15-18 min" },
            rice_cooker: { ratio: 1.1, time: "Auto" },
            instant_pot: { ratio: 1.0, time: "3 min + 10 min release" },
          },
          wild: {
            stovetop: { ratio: 3.0, time: "45-60 min" },
            rice_cooker: { ratio: 2.5, time: "Auto" },
            instant_pot: { ratio: 1.75, time: "25 min + 10 min release" },
          },
          arborio: {
            stovetop: { ratio: 3.5, time: "20-25 min (add gradually)" },
            rice_cooker: { ratio: 2.5, time: "Auto" },
            instant_pot: { ratio: 2.0, time: "6 min + 10 min release" },
          },
        };

        const data = riceData[riceType]?.[method];
        if (!data) return null;

        const waterCups = cups * data.ratio;
        const servings = cups * 2; // 1 cup dry rice ~ 2 servings
        const cookedCups = cups * (riceType === "wild" ? 3 : riceType === "brown" ? 2.5 : 3);

        const riceNames: Record<string, string> = {
          white_long: "Long Grain White",
          white_short: "Short Grain White",
          basmati: "Basmati",
          jasmine: "Jasmine",
          brown: "Brown Rice",
          sushi: "Sushi Rice",
          wild: "Wild Rice",
          arborio: "Arborio",
        };

        return {
          primary: {
            label: "Water Needed",
            value: formatNumber(waterCups, 2) + " cups",
          },
          details: [
            { label: "Rice", value: cups + " cup(s) " + riceNames[riceType] },
            { label: "Water Ratio", value: "1 : " + data.ratio },
            { label: "Cooking Time", value: data.time },
            { label: "Cooked Rice (approx)", value: formatNumber(cookedCups, 1) + " cups" },
            { label: "Approx. Servings", value: formatNumber(servings, 0) },
            { label: "Water in mL", value: formatNumber(waterCups * 236.6, 0) + " mL" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pasta-serving-calculator", "meal-prep-calculator"],
  faq: [
    {
      question: "What is the basic rice to water ratio?",
      answer:
        "The standard ratio for long grain white rice on the stovetop is 1:1.75 (1 cup rice to 1.75 cups water). Brown rice needs more water at about 1:2.25, while sushi rice needs less at 1:1.2.",
    },
    {
      question: "Why does brown rice need more water?",
      answer:
        "Brown rice still has the bran layer intact, which requires more water and longer cooking time to soften. It typically needs about 2-2.25 cups of water per cup of rice and 40-50 minutes to cook.",
    },
    {
      question: "Should I rinse rice before cooking?",
      answer:
        "Yes, rinsing rice removes excess surface starch that can make it gummy. Rinse 2-3 times until the water runs mostly clear. This is especially important for jasmine and sushi rice.",
    },
  ],
  formula:
    "Water (cups) = Rice (cups) x Water Ratio. Standard ratios on stovetop: White Long Grain 1:1.75, Basmati 1:1.5, Brown 1:2.25, Sushi 1:1.2, Wild 1:3. Rice cookers and Instant Pots typically need less water.",
};
