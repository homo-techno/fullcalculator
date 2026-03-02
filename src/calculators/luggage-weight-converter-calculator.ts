import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const luggageWeightConverterCalculator: CalculatorDefinition = {
  slug: "luggage-weight-converter-calculator",
  title: "Luggage Weight Converter Calculator",
  description: "Convert luggage weight between pounds and kilograms and check against common airline limits for carry-on and checked bags.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["luggage weight converter","baggage weight","kg to lbs luggage","airline weight limit"],
  variants: [{
    id: "standard",
    name: "Luggage Weight Converter",
    description: "Convert luggage weight between pounds and kilograms and check against common airline limits for carry-on and checked bags.",
    fields: [
      { name: "weight", label: "Luggage Weight", type: "number", min: 0.1, max: 200, defaultValue: 50 },
      { name: "unit", label: "Weight Unit", type: "select", options: [{ value: "1", label: "Pounds (lb)" }, { value: "2", label: "Kilograms (kg)" }], defaultValue: "1" },
      { name: "bagType", label: "Bag Type", type: "select", options: [{ value: "1", label: "Carry-On (limit ~15-22 lb / 7-10 kg)" }, { value: "2", label: "Checked Bag (limit ~50 lb / 23 kg)" }, { value: "3", label: "Oversize Checked (limit ~70 lb / 32 kg)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const weight = inputs.weight as number;
    const unit = inputs.unit as string;
    const bagType = parseInt(inputs.bagType as string);
    const weightLb = unit === "1" ? weight : weight * 2.20462;
    const weightKg = unit === "2" ? weight : weight / 2.20462;
    const limits = [[22, 10], [50, 23], [70, 32]];
    const limit = limits[bagType - 1] || [50, 23];
    const overLb = weightLb - limit[0];
    const overKg = weightKg - limit[1];
    const isOver = weightLb > limit[0];
    const overweightFee = isOver ? (overLb > 20 ? 200 : 100) : 0;
    return {
      primary: { label: "Weight", value: formatNumber(Math.round(weightLb * 10) / 10) + " lb / " + formatNumber(Math.round(weightKg * 10) / 10) + " kg" },
      details: [
        { label: "Airline Limit", value: formatNumber(limit[0]) + " lb / " + formatNumber(limit[1]) + " kg" },
        { label: "Status", value: isOver ? "OVERWEIGHT by " + formatNumber(Math.round(overLb * 10) / 10) + " lb" : "Within limit" },
        { label: "Estimated Overweight Fee", value: "$" + formatNumber(overweightFee) },
        { label: "Weight to Remove", value: isOver ? formatNumber(Math.round(overLb * 10) / 10) + " lb / " + formatNumber(Math.round(overKg * 10) / 10) + " kg" : "None" }
      ]
    };
  },
  }],
  relatedSlugs: ["luggage-weight-calculator","travel-budget-calculator","flight-cost-per-mile-calculator"],
  faq: [
    { question: "What is the standard checked bag weight limit?", answer: "Most airlines limit checked bags to 50 pounds (23 kg) for economy class. Business and first class often allow 70 pounds (32 kg)." },
    { question: "How much is the overweight baggage fee?", answer: "Typically $100 for bags 51 to 70 pounds and $200 for bags 71 to 100 pounds, though fees vary by airline." },
    { question: "How do I weigh my luggage at home?", answer: "Use a handheld luggage scale or stand on a bathroom scale holding your bag, then subtract your body weight." },
  ],
  formula: "Kilograms = Pounds / 2.20462
Pounds = Kilograms x 2.20462",
};
