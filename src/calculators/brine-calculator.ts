import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brineCalculator: CalculatorDefinition = {
  slug: "brine-calculator",
  title: "Brine Ratio Calculator",
  description: "Free online brine ratio calculator. Calculate the perfect brine for turkey, chicken, pork, and other meats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["brine calculator", "brine ratio", "turkey brine", "chicken brine", "wet brine", "dry brine", "salt ratio"],
  variants: [
    {
      id: "wet-brine",
      name: "Wet Brine Calculator",
      fields: [
        { name: "weight", label: "Meat Weight (lbs)", type: "number", placeholder: "e.g. 14", step: 0.5 },
        {
          name: "protein",
          label: "Protein Type",
          type: "select",
          options: [
            { label: "Whole Turkey", value: "turkey" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Chicken Breasts", value: "chicken_breast" },
            { label: "Pork Chops", value: "pork_chops" },
            { label: "Pork Loin", value: "pork_loin" },
            { label: "Pork Shoulder", value: "pork_shoulder" },
            { label: "Shrimp", value: "shrimp" },
          ],
        },
        {
          name: "strength",
          label: "Brine Strength",
          type: "select",
          options: [
            { label: "Light (3.5%)", value: "light" },
            { label: "Standard (5%)", value: "standard" },
            { label: "Strong (7%)", value: "strong" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const protein = inputs.protein as string;
        const strength = inputs.strength as string;

        // Water needed per pound of meat (cups)
        const waterPerLb: Record<string, number> = {
          turkey: 1.5,
          chicken: 2,
          chicken_breast: 2,
          pork_chops: 2,
          pork_loin: 1.5,
          pork_shoulder: 1.5,
          shrimp: 2.5,
        };

        // Brine time in hours
        const brineHours: Record<string, number> = {
          turkey: 18,
          chicken: 8,
          chicken_breast: 2,
          pork_chops: 2,
          pork_loin: 8,
          pork_shoulder: 12,
          shrimp: 0.5,
        };

        const saltPct: Record<string, number> = {
          light: 0.035,
          standard: 0.05,
          strong: 0.07,
        };

        const cupsPerLb = waterPerLb[protein] || 2;
        const totalWaterCups = cupsPerLb * weight;
        const totalWaterGallons = totalWaterCups / 16;
        const waterGrams = totalWaterCups * 236.6;
        const pct = saltPct[strength] || 0.05;
        const saltGrams = waterGrams * pct;
        const saltCups = saltGrams / 292; // kosher salt grams per cup
        const sugarCups = saltCups * 0.5;
        const time = brineHours[protein] || 8;

        return {
          primary: { label: "Water Needed", value: `${formatNumber(totalWaterCups)} cups` },
          details: [
            { label: "Water (gallons)", value: formatNumber(totalWaterGallons) },
            { label: "Kosher Salt", value: `${formatNumber(saltCups)} cups (${formatNumber(saltGrams)} g)` },
            { label: "Sugar (optional)", value: `${formatNumber(sugarCups)} cups` },
            { label: "Brine Time", value: `${formatNumber(time)} hours` },
            { label: "Meat Weight", value: `${formatNumber(weight)} lbs` },
          ],
        };
      },
    },
    {
      id: "dry-brine",
      name: "Dry Brine Calculator",
      fields: [
        { name: "weight", label: "Meat Weight (lbs)", type: "number", placeholder: "e.g. 14", step: 0.5 },
        {
          name: "protein",
          label: "Protein Type",
          type: "select",
          options: [
            { label: "Whole Turkey", value: "turkey" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Steak", value: "steak" },
            { label: "Pork Roast", value: "pork" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string) || 0;
        const protein = inputs.protein as string;

        // Teaspoons of kosher salt per pound
        const tspPerLb: Record<string, number> = {
          turkey: 1.0,
          chicken: 1.0,
          steak: 0.75,
          pork: 0.75,
        };

        const dryBrineHours: Record<string, number> = {
          turkey: 24,
          chicken: 12,
          steak: 1,
          pork: 12,
        };

        const saltTsp = (tspPerLb[protein] || 1) * weight;
        const saltTbsp = saltTsp / 3;
        const time = dryBrineHours[protein] || 12;

        return {
          primary: { label: "Kosher Salt Needed", value: `${formatNumber(saltTsp)} tsp` },
          details: [
            { label: "Salt (tablespoons)", value: formatNumber(saltTbsp) },
            { label: "Dry Brine Time", value: `${formatNumber(time)} hours` },
            { label: "Meat Weight", value: `${formatNumber(weight)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bbq-smoking-time", "ham-cooking-time", "thanksgiving-calc"],
  faq: [
    {
      question: "What is the ratio for a basic brine?",
      answer: "A standard brine uses about 5% salt by weight of the water — roughly 1 cup of kosher salt per gallon of water. Lighter brines use 3.5% and stronger brines use 7%.",
    },
    {
      question: "How long should you brine a turkey?",
      answer: "A whole turkey should be wet brined for 12-24 hours, or dry brined for 24-48 hours. Smaller cuts like chicken breasts only need 1-2 hours.",
    },
    {
      question: "What is the difference between wet and dry brine?",
      answer: "Wet brine submerges the meat in a saltwater solution. Dry brine applies salt directly to the surface. Dry brining produces crispier skin and takes up less refrigerator space.",
    },
  ],
  formula: "salt_amount = water_weight × salt_percentage",
};
