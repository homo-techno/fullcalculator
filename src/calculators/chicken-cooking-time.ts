import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chickenCookingTimeCalculator: CalculatorDefinition = {
  slug: "chicken-cooking-time-calculator",
  title: "Chicken Cooking Time Calculator",
  description:
    "Free chicken cooking time calculator. Get accurate roasting, grilling, and baking times based on weight and cooking method.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chicken cooking time",
    "roast chicken time",
    "chicken temperature",
    "chicken by weight",
    "how long to cook chicken",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "weight",
          label: "Chicken Weight (lbs)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "cut",
          label: "Chicken Cut",
          type: "select",
          options: [
            { label: "Whole Chicken", value: "whole" },
            { label: "Bone-In Breast", value: "breast_bone" },
            { label: "Boneless Breast", value: "breast_boneless" },
            { label: "Thighs (Bone-In)", value: "thigh_bone" },
            { label: "Drumsticks", value: "drumstick" },
            { label: "Wings", value: "wings" },
          ],
        },
        {
          name: "method",
          label: "Cooking Method",
          type: "select",
          options: [
            { label: "Roast (350°F)", value: "roast_350" },
            { label: "Roast (425°F)", value: "roast_425" },
            { label: "Grill (Medium Heat)", value: "grill" },
            { label: "Bake (375°F)", value: "bake" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const cut = inputs.cut as string;
        const method = inputs.method as string;
        if (!weight || weight <= 0) return null;

        const minPerLb: Record<string, Record<string, number>> = {
          whole: { roast_350: 22, roast_425: 15, grill: 18, bake: 20 },
          breast_bone: { roast_350: 35, roast_425: 25, grill: 20, bake: 30 },
          breast_boneless: { roast_350: 28, roast_425: 18, grill: 14, bake: 22 },
          thigh_bone: { roast_350: 40, roast_425: 28, grill: 22, bake: 35 },
          drumstick: { roast_350: 40, roast_425: 25, grill: 20, bake: 35 },
          wings: { roast_350: 35, roast_425: 22, grill: 16, bake: 30 },
        };

        const targetTemp: Record<string, number> = {
          whole: 165,
          breast_bone: 165,
          breast_boneless: 165,
          thigh_bone: 175,
          drumstick: 175,
          wings: 175,
        };

        const rate = (minPerLb[cut] && minPerLb[cut][method]) || 20;
        const totalMinutes = Math.round(rate * weight);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const target = targetTemp[cut] || 165;
        const restTime = cut === "whole" ? 15 : 5;
        const servings = cut === "whole" ? Math.round(weight * 0.75) : Math.round(weight * 2.5);

        return {
          primary: {
            label: "Cooking Time",
            value: hours > 0 ? hours + "h " + mins + "m" : mins + " min",
          },
          details: [
            { label: "Internal Temp Target", value: target + " °F" },
            { label: "Weight", value: formatNumber(weight, 1) + " lbs" },
            { label: "Minutes per Pound", value: rate + " min/lb" },
            { label: "Rest Time After Cooking", value: restTime + " min" },
            { label: "Estimated Servings", value: String(servings) },
            { label: "Remove from Heat At", value: (target - 5) + " °F (carryover cooking)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "cooking-temp-calculator"],
  faq: [
    {
      question: "What temperature should chicken be cooked to?",
      answer:
        "The USDA recommends cooking all chicken to an internal temperature of 165°F (74°C). Dark meat (thighs, drumsticks) tastes better at 175°F (79°C) for more tender results.",
    },
    {
      question: "How long does it take to roast a 5 lb chicken?",
      answer:
        "At 350°F, a 5-pound whole chicken takes approximately 1 hour 45 minutes. At 425°F, it takes about 1 hour 15 minutes. Always verify with a meat thermometer.",
    },
  ],
  formula:
    "Cooking Time = Weight × Minutes per Pound. Target temp: Breast/Whole 165°F, Dark meat 175°F. Rest 15 min for whole, 5 min for parts.",
};
