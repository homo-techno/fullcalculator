import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engineOilCapacityCalculator: CalculatorDefinition = {
  slug: "engine-oil-capacity-calculator",
  title: "Engine Oil Capacity Calculator",
  description: "Estimate engine oil capacity and total oil change cost based on engine size, oil type, and filter cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["engine oil capacity","oil change cost","motor oil calculator","engine displacement oil"],
  variants: [{
    id: "standard",
    name: "Engine Oil Capacity",
    description: "Estimate engine oil capacity and total oil change cost based on engine size, oil type, and filter cost.",
    fields: [
      { name: "engineSize", label: "Engine Displacement (liters)", type: "number", min: 0.5, max: 10, defaultValue: 2.5 },
      { name: "engineType", label: "Engine Type", type: "select", options: [{ value: "1", label: "Inline 4-Cylinder" }, { value: "2", label: "V6" }, { value: "3", label: "V8" }, { value: "4", label: "Inline 6-Cylinder" }, { value: "5", label: "Turbocharged 4-Cylinder" }], defaultValue: "1" },
      { name: "oilType", label: "Oil Type", type: "select", options: [{ value: "1", label: "Conventional ($5/qt)" }, { value: "2", label: "Synthetic Blend ($7/qt)" }, { value: "3", label: "Full Synthetic ($10/qt)" }, { value: "4", label: "High Mileage ($9/qt)" }], defaultValue: "3" },
      { name: "filterCost", label: "Oil Filter Cost ($)", type: "number", min: 3, max: 30, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const displacement = inputs.engineSize as number;
    const engineType = parseInt(inputs.engineType as string);
    const oilType = parseInt(inputs.oilType as string);
    const filterCost = inputs.filterCost as number;
    const baseCapacity = { 1: 4.5, 2: 5.5, 3: 7, 4: 6, 5: 5 };
    const sizeMultiplier = displacement / 2.5;
    const capacity = Math.round((baseCapacity[engineType] || 5) * sizeMultiplier * 10) / 10;
    const quartsNeeded = Math.ceil(capacity);
    const oilPrices = { 1: 5, 2: 7, 3: 10, 4: 9 };
    const pricePerQuart = oilPrices[oilType] || 10;
    const totalCost = quartsNeeded * pricePerQuart + filterCost;
    return {
      primary: { label: "Estimated Oil Capacity", value: formatNumber(capacity) + " quarts" },
      details: [
        { label: "Quarts to Purchase", value: formatNumber(quartsNeeded) },
        { label: "Oil Cost", value: "$" + formatNumber(quartsNeeded * pricePerQuart) },
        { label: "Filter Cost", value: "$" + formatNumber(filterCost) },
        { label: "Total DIY Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["oil-change-interval-calculator","spark-plug-replacement-calculator"],
  faq: [
    { question: "How do I find my exact oil capacity?", answer: "Check your vehicle owner manual or the oil fill cap for the exact specification. This calculator provides an estimate based on engine type and displacement." },
    { question: "Is synthetic oil worth the extra cost?", answer: "Full synthetic oil lasts longer between changes, performs better in extreme temperatures, and provides superior engine protection. Most modern vehicles require or recommend synthetic oil." },
    { question: "How much oil does a typical car need?", answer: "Most four-cylinder engines require 4 to 5 quarts, V6 engines need 5 to 6 quarts, and V8 engines typically require 6 to 8 quarts of oil." },
  ],
  formula: "Estimated Capacity = Base Capacity (by engine type) x (Displacement / 2.5)
Total DIY Cost = (Quarts Needed x Price Per Quart) + Filter Cost",
};
