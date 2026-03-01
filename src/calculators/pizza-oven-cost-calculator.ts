import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pizzaOvenCostCalculator: CalculatorDefinition = {
  slug: "pizza-oven-cost-calculator",
  title: "Pizza Oven Cost Calculator",
  description: "Estimate the cost of buying or building an outdoor pizza oven for your backyard.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pizza oven cost", "outdoor pizza oven cost", "brick oven cost"],
  variants: [{
    id: "standard",
    name: "Pizza Oven Cost",
    description: "Estimate the cost of buying or building an outdoor pizza oven for your backyard",
    fields: [
      { name: "type", label: "Oven Type", type: "select", options: [{value:"portable",label:"Portable (Ooni-style)"},{value:"prefab",label:"Prefab Kit"},{value:"custom",label:"Custom Brick/Stone"}], defaultValue: "prefab" },
      { name: "fuel", label: "Fuel Type", type: "select", options: [{value:"wood",label:"Wood Fired"},{value:"gas",label:"Gas"},{value:"dual",label:"Dual Fuel"}], defaultValue: "wood" },
      { name: "base", label: "Base/Stand", type: "select", options: [{value:"table",label:"Portable Table"},{value:"block",label:"Cinder Block Base"},{value:"stone",label:"Stone/Brick Counter"}], defaultValue: "block" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const fuel = inputs.fuel as string;
      const base = inputs.base as string;
      const ovenCost: Record<string, number> = { portable: 500, prefab: 2500, custom: 6000 };
      const fuelMod: Record<string, number> = { wood: 1.0, gas: 1.1, dual: 1.25 };
      const baseCost: Record<string, number> = { table: 100, block: 400, stone: 2000 };
      const oven = (ovenCost[type] || 2500) * (fuelMod[fuel] || 1.0);
      const stand = baseCost[base] || 400;
      const chimney = type === "custom" ? 800 : type === "prefab" ? 300 : 0;
      const tools = 150;
      const total = oven + stand + chimney + tools;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Oven Unit", value: "$" + formatNumber(oven) },
          { label: "Base/Stand", value: "$" + formatNumber(stand) },
          { label: "Chimney/Flue", value: "$" + formatNumber(chimney) },
          { label: "Tools and Accessories", value: "$" + formatNumber(tools) },
        ],
      };
    },
  }],
  relatedSlugs: ["porch-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does an outdoor pizza oven cost?", answer: "Portable pizza ovens cost $300 to $800. Prefab kits run $2,000 to $5,000. Custom brick ovens can cost $5,000 to $15,000 including the base and chimney." },
    { question: "Is a pizza oven worth the investment?", answer: "A pizza oven can reach 800-900 degrees Fahrenheit and cook pizza in 60-90 seconds. It is an excellent investment for outdoor entertaining and cooking enthusiasts." },
  ],
  formula: "Total = (Oven Cost x Fuel Modifier) + Base + Chimney + Tools",
};
