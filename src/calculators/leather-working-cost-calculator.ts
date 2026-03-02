import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leatherWorkingCostCalculator: CalculatorDefinition = {
  slug: "leather-working-cost-calculator",
  title: "Leather Working Cost Calculator",
  description: "Estimate material costs for leather projects based on leather type, area needed, hardware, and thread.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["leather cost","leathercraft budget","leather project cost","leather material"],
  variants: [{
    id: "standard",
    name: "Leather Working Cost",
    description: "Estimate material costs for leather projects based on leather type, area needed, hardware, and thread.",
    fields: [
      { name: "leatherArea", label: "Leather Area Needed (sq ft)", type: "number", min: 0.5, max: 50, defaultValue: 4 },
      { name: "leatherType", label: "Leather Type", type: "select", options: [{ value: "1", label: "Vegetable Tanned" }, { value: "2", label: "Chrome Tanned" }, { value: "3", label: "Exotic (Snake/Croc)" }, { value: "4", label: "Suede" }], defaultValue: "1" },
      { name: "hardwareCount", label: "Hardware Pieces (snaps, rivets)", type: "number", min: 0, max: 50, defaultValue: 6 },
      { name: "hardwareType", label: "Hardware Quality", type: "select", options: [{ value: "1", label: "Basic Brass" }, { value: "2", label: "Solid Brass" }, { value: "3", label: "Stainless Steel" }], defaultValue: "1" },
      { name: "threadLength", label: "Thread Needed (yards)", type: "number", min: 1, max: 100, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const area = inputs.leatherArea as number;
    const type = parseInt(inputs.leatherType as string);
    const hwCount = inputs.hardwareCount as number;
    const hwType = parseInt(inputs.hardwareType as string);
    const thread = inputs.threadLength as number;
    const leatherPrice = { 1: 12, 2: 8, 3: 35, 4: 6 };
    const hwPrice = { 1: 0.5, 2: 1.5, 3: 2.0 };
    const threadPricePerYard = 0.15;
    const leatherCost = area * (leatherPrice[type] || 12);
    const hardwareCost = hwCount * (hwPrice[hwType] || 0.5);
    const threadCost = thread * threadPricePerYard;
    const totalCost = leatherCost + hardwareCost + threadCost;
    return {
      primary: { label: "Total Material Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Leather Cost", value: "$" + formatNumber(Math.round(leatherCost * 100) / 100) },
        { label: "Hardware Cost", value: "$" + formatNumber(Math.round(hardwareCost * 100) / 100) },
        { label: "Thread Cost", value: "$" + formatNumber(Math.round(threadCost * 100) / 100) },
        { label: "Cost Per Sq Ft", value: "$" + formatNumber(leatherPrice[type] || 12) }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","jewelry-wire-calculator"],
  faq: [
    { question: "How much does leather cost per square foot?", answer: "Vegetable tanned leather costs around 8 to 15 dollars per square foot. Exotic leathers like snake or crocodile can cost 25 to 50 dollars or more per square foot." },
    { question: "What type of leather is best for beginners?", answer: "Vegetable tanned leather is ideal for beginners. It is firm, easy to cut, accepts dye well, and can be tooled and stamped." },
    { question: "How much leather do I need for a wallet?", answer: "A simple bifold wallet typically requires about 1 to 1.5 square feet of leather depending on the design and number of card slots." },
  ],
  formula: "Total Cost = (Leather Area x Price Per Sq Ft) + (Hardware Count x Price Per Piece) + (Thread Yards x Price Per Yard)",
};
