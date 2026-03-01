import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostingToiletCalculator: CalculatorDefinition = {
  slug: "composting-toilet-calculator",
  title: "Composting Toilet Calculator",
  description: "Estimate composting toilet capacity, water savings, and compost output for your household.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["composting toilet", "waterless toilet", "compost toilet sizing"],
  variants: [{
    id: "standard",
    name: "Composting Toilet",
    description: "Estimate composting toilet capacity, water savings, and compost output for your household",
    fields: [
      { name: "people", label: "Number of People", type: "number", suffix: "people", min: 1, max: 20, defaultValue: 4 },
      { name: "usesPerDay", label: "Average Uses per Person per Day", type: "number", suffix: "uses", min: 1, max: 15, defaultValue: 6 },
      { name: "waterCostPerGallon", label: "Water Cost per Gallon", type: "number", prefix: "$", min: 0, max: 1, step: 0.001, defaultValue: 0.005 },
    ],
    calculate: (inputs) => {
      const people = inputs.people as number;
      const uses = inputs.usesPerDay as number;
      const waterCost = inputs.waterCostPerGallon as number;
      if (!people || !uses) return null;
      const flushesPerDay = people * uses;
      const gallonsSavedPerDay = flushesPerDay * 1.6;
      const gallonsSavedPerYear = gallonsSavedPerDay * 365;
      const annualSavings = gallonsSavedPerYear * waterCost;
      const compostPerYear = people * 80;
      return {
        primary: { label: "Water Saved per Year", value: formatNumber(Math.round(gallonsSavedPerYear)) + " gallons" },
        details: [
          { label: "Flushes Eliminated Daily", value: formatNumber(flushesPerDay) },
          { label: "Annual Water Cost Savings", value: "$" + formatNumber(Math.round(annualSavings * 100) / 100) },
          { label: "Compost Produced per Year", value: formatNumber(compostPerYear) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["water-conservation-calculator", "greywater-system-calculator"],
  faq: [
    { question: "How much water does a composting toilet save?", answer: "A composting toilet can save approximately 6,600 gallons of water per person per year by eliminating the need for flushing." },
    { question: "Is compost from a composting toilet safe to use?", answer: "When properly maintained and composted for 12 to 24 months, the resulting humus is safe for use on non-edible plants and trees." },
  ],
  formula: "Water Saved = People x Uses per Day x 1.6 gallons x 365 days",
};
