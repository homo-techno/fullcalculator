import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backpackingGearWeightCalculator: CalculatorDefinition = {
  slug: "backpacking-gear-weight-calculator",
  title: "Backpacking Gear Weight Calculator",
  description: "Calculate your total pack weight including base weight, consumables, and worn items to optimize your backpacking load.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backpacking gear weight","pack weight calculator","hiking weight","backpack load"],
  variants: [{
    id: "standard",
    name: "Backpacking Gear Weight",
    description: "Calculate your total pack weight including base weight, consumables, and worn items to optimize your backpacking load.",
    fields: [
      { name: "shelterWeight", label: "Shelter Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3.5 },
      { name: "sleepSystem", label: "Sleep System Weight (lb)", type: "number", min: 0, max: 15, defaultValue: 3 },
      { name: "packWeight", label: "Backpack Weight (lb)", type: "number", min: 0.5, max: 10, defaultValue: 3 },
      { name: "otherGear", label: "Other Base Gear (lb)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "foodPerDay", label: "Food Weight Per Day (lb)", type: "number", min: 0.5, max: 5, defaultValue: 2 },
      { name: "waterLiters", label: "Water Carried (liters)", type: "number", min: 0.5, max: 8, defaultValue: 2 },
      { name: "tripDays", label: "Trip Length (days)", type: "number", min: 1, max: 30, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const shelter = inputs.shelterWeight as number;
    const sleep = inputs.sleepSystem as number;
    const pack = inputs.packWeight as number;
    const otherGear = inputs.otherGear as number;
    const foodPerDay = inputs.foodPerDay as number;
    const waterLiters = inputs.waterLiters as number;
    const tripDays = inputs.tripDays as number;
    const baseWeight = shelter + sleep + pack + otherGear;
    const foodWeight = foodPerDay * tripDays;
    const waterWeight = waterLiters * 2.20462;
    const totalWeight = baseWeight + foodWeight + waterWeight;
    const category = baseWeight < 10 ? "Ultralight" : baseWeight < 15 ? "Lightweight" : baseWeight < 20 ? "Traditional" : "Heavy";
    const totalKg = totalWeight / 2.20462;
    return {
      primary: { label: "Total Pack Weight", value: formatNumber(Math.round(totalWeight * 10) / 10) + " lb" },
      details: [
        { label: "Base Weight", value: formatNumber(Math.round(baseWeight * 10) / 10) + " lb" },
        { label: "Category", value: category },
        { label: "Food Weight", value: formatNumber(Math.round(foodWeight * 10) / 10) + " lb" },
        { label: "Water Weight", value: formatNumber(Math.round(waterWeight * 10) / 10) + " lb" },
        { label: "Total in Kilograms", value: formatNumber(Math.round(totalKg * 10) / 10) + " kg" }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","luggage-weight-converter-calculator","travel-daily-budget-calculator"],
  faq: [
    { question: "What is a good base weight for backpacking?", answer: "Ultralight is under 10 pounds, lightweight is 10 to 15 pounds, and traditional is 15 to 20 pounds. The big three (shelter, sleep system, pack) account for most of the base weight." },
    { question: "How much food should I carry per day?", answer: "Plan for 1.5 to 2.5 pounds of food per day, providing about 2,500 to 4,500 calories depending on activity level and conditions." },
    { question: "How much water should I carry?", answer: "Carry 1 to 2 liters between reliable water sources. In arid conditions, you may need 4 or more liters at a time." },
  ],
  formula: "Base Weight = Shelter + Sleep System + Pack + Other Gear
Total Weight = Base Weight + (Food/Day x Days) + Water Weight",
};
