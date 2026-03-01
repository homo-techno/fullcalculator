import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const outdoorKitchenCostCalculator: CalculatorDefinition = {
  slug: "outdoor-kitchen-cost-calculator",
  title: "Outdoor Kitchen Cost Calculator",
  description: "Estimate the cost of building an outdoor kitchen with appliances, countertops, and utilities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["outdoor kitchen cost", "outdoor kitchen build cost", "backyard kitchen cost"],
  variants: [{
    id: "standard",
    name: "Outdoor Kitchen Cost",
    description: "Estimate the cost of building an outdoor kitchen with appliances, countertops, and utilities",
    fields: [
      { name: "length", label: "Counter Length", type: "number", suffix: "linear ft", min: 4, max: 30, defaultValue: 10 },
      { name: "tier", label: "Quality Tier", type: "select", options: [{value:"basic",label:"Basic (grill + counter)"},{value:"mid",label:"Mid (+ sink, fridge)"},{value:"premium",label:"Premium (+ pizza oven, bar)"}], defaultValue: "mid" },
      { name: "counter", label: "Countertop Material", type: "select", options: [{value:"tile",label:"Tile"},{value:"granite",label:"Granite"},{value:"concrete",label:"Concrete"}], defaultValue: "granite" },
      { name: "roof", label: "Overhead Cover", type: "select", options: [{value:"none",label:"No Cover"},{value:"pergola",label:"Pergola"},{value:"solid",label:"Solid Roof"}], defaultValue: "pergola" },
    ],
    calculate: (inputs) => {
      const length = inputs.length as number;
      const tier = inputs.tier as string;
      const counter = inputs.counter as string;
      const roof = inputs.roof as string;
      if (!length || length <= 0) return null;
      const applianceCost: Record<string, number> = { basic: 2000, mid: 5000, premium: 12000 };
      const counterRate: Record<string, number> = { tile: 40, granite: 80, concrete: 60 };
      const baseCost = length * 300;
      const appliances = applianceCost[tier] || 5000;
      const counterCost = length * 2.5 * (counterRate[counter] || 80);
      const roofCost: Record<string, number> = { none: 0, pergola: 3000, solid: 7000 };
      const roofing = roofCost[roof] || 0;
      const plumbing = tier === "basic" ? 0 : 1500;
      const gas = 800;
      const electrical = 600;
      const total = baseCost + appliances + counterCost + roofing + plumbing + gas + electrical;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Base Structure", value: "$" + formatNumber(baseCost) },
          { label: "Appliances", value: "$" + formatNumber(appliances) },
          { label: "Countertops", value: "$" + formatNumber(counterCost) },
          { label: "Overhead Cover", value: "$" + formatNumber(roofing) },
          { label: "Plumbing", value: "$" + formatNumber(plumbing) },
          { label: "Gas and Electrical", value: "$" + formatNumber(gas + electrical) },
        ],
      };
    },
  }],
  relatedSlugs: ["porch-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does an outdoor kitchen cost?", answer: "A basic outdoor kitchen with a grill and counter costs $5,000 to $12,000. A mid-range setup runs $12,000 to $30,000. Premium outdoor kitchens can exceed $50,000." },
    { question: "Does an outdoor kitchen add home value?", answer: "An outdoor kitchen can increase home value by 100 to 200 percent of the investment cost, making it one of the best outdoor improvement returns." },
  ],
  formula: "Total = Base Structure + Appliances + Countertops + Cover + Plumbing + Gas + Electrical",
};
