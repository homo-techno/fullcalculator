import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gameServerHostingCostCalculator: CalculatorDefinition = {
  slug: "game-server-hosting-cost-calculator",
  title: "Game Server Hosting Cost Calculator",
  description: "Estimate monthly and annual costs for hosting a dedicated game server based on player count, game type, performance tier, and location preferences.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["game server cost","dedicated server hosting","minecraft server cost","game hosting price"],
  variants: [{
    id: "standard",
    name: "Game Server Hosting Cost",
    description: "Estimate monthly and annual costs for hosting a dedicated game server based on player count, game type, performance tier, and location preferences.",
    fields: [
      { name: "gameType", label: "Game Type", type: "select", options: [{ value: "1", label: "Minecraft" }, { value: "2", label: "Rust/ARK" }, { value: "3", label: "CS2/Valorant" }, { value: "4", label: "MMO/Large Scale" }], defaultValue: "1" },
      { name: "playerSlots", label: "Player Slots", type: "number", min: 2, max: 500, defaultValue: 20 },
      { name: "performanceTier", label: "Performance Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Standard" }, { value: "3", label: "Premium" }, { value: "4", label: "Enterprise" }], defaultValue: "2" },
      { name: "addons", label: "Monthly Addon Costs ($)", type: "number", min: 0, max: 200, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const gameType = parseInt(inputs.gameType as string);
    const slots = inputs.playerSlots as number;
    const tier = parseInt(inputs.performanceTier as string);
    const addons = inputs.addons as number;
    const baseCostPerSlot = { 1: 0.50, 2: 0.85, 3: 0.60, 4: 1.20 };
    const tierMultiplier = { 1: 0.7, 2: 1.0, 3: 1.5, 4: 2.2 };
    const costPerSlot = (baseCostPerSlot[gameType] || 0.60) * (tierMultiplier[tier] || 1.0);
    const monthlyCost = slots * costPerSlot + addons;
    const annualCost = monthlyCost * 12;
    const annualDiscount = annualCost * 0.85;
    const ramEstimate = Math.ceil(slots / 10) * (gameType === 2 || gameType === 4 ? 2 : 1);
    return {
      primary: { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
      details: [
        { label: "Annual Cost (Monthly Billing)", value: "$" + formatNumber(Math.round(annualCost)) },
        { label: "Annual Cost (15% Prepay Discount)", value: "$" + formatNumber(Math.round(annualDiscount)) },
        { label: "Estimated RAM Needed", value: formatNumber(ramEstimate) + " GB" },
        { label: "Cost Per Player Slot", value: "$" + formatNumber(Math.round(costPerSlot * 100) / 100) + "/mo" }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-pc-wattage-calculator","discord-server-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Monthly Cost = Player Slots x Base Cost Per Slot x Tier Multiplier + Addons
Annual Cost = Monthly Cost x 12
Prepay Discount = Annual Cost x 0.85",
};
