import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miniaturesArmyCostCalculator: CalculatorDefinition = {
  slug: "miniatures-army-cost-calculator",
  title: "Miniatures Army Cost Calculator",
  description: "Calculate the total cost of building a tabletop miniatures army including models, paints, tools, and hobby supplies for popular wargaming systems.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["miniatures army cost","Warhammer army cost","wargaming budget","miniature painting cost"],
  variants: [{
    id: "standard",
    name: "Miniatures Army Cost",
    description: "Calculate the total cost of building a tabletop miniatures army including models, paints, tools, and hobby supplies for popular wargaming systems.",
    fields: [
      { name: "gameSystem", label: "Game System", type: "select", options: [{ value: "1", label: "Warhammer 40K" }, { value: "2", label: "Age of Sigmar" }, { value: "3", label: "Star Wars Legion" }, { value: "4", label: "Bolt Action" }], defaultValue: "1" },
      { name: "armyPoints", label: "Army Point Value", type: "number", min: 250, max: 5000, defaultValue: 2000 },
      { name: "paintSupplies", label: "Already Own Paint Supplies", type: "select", options: [{ value: "0", label: "No - Starting from scratch" }, { value: "1", label: "Yes - Have supplies" }], defaultValue: "0" },
      { name: "purchaseMethod", label: "Purchase Method", type: "select", options: [{ value: "1", label: "New retail" }, { value: "2", label: "Online discount (15% off)" }, { value: "3", label: "Used/secondhand (40% off)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const system = parseInt(inputs.gameSystem as string);
    const points = inputs.armyPoints as number;
    const hasPaints = parseInt(inputs.paintSupplies as string);
    const method = parseInt(inputs.purchaseMethod as string);
    const costPerPoint = { 1: 0.30, 2: 0.28, 3: 0.22, 4: 0.18 };
    const discounts = { 1: 1.0, 2: 0.85, 3: 0.60 };
    const baseModelCost = points * (costPerPoint[system] || 0.25);
    const modelCost = baseModelCost * (discounts[method] || 1.0);
    const paintCost = hasPaints === 0 ? 120 : 25;
    const toolsCost = hasPaints === 0 ? 60 : 0;
    const totalCost = modelCost + paintCost + toolsCost;
    const modelsEstimate = Math.round(points / 25);
    return {
      primary: { label: "Total Army Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Model Cost", value: "$" + formatNumber(Math.round(modelCost)) },
        { label: "Paint Supplies", value: "$" + formatNumber(paintCost) },
        { label: "Tools and Accessories", value: "$" + formatNumber(toolsCost) },
        { label: "Estimated Model Count", value: formatNumber(modelsEstimate) + " models" }
      ]
    };
  },
  }],
  relatedSlugs: ["card-game-deck-value-calculator","tabletop-rpg-encounter-builder-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Model Cost = Army Points x Cost Per Point x Discount Multiplier
Paint Supplies = $120 (new) or $25 (resupply)
Tools = $60 (new hobbyist) or $0 (existing)
Total = Models + Paint + Tools",
};
