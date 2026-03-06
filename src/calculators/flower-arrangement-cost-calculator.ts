import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flowerArrangementCostCalculator: CalculatorDefinition = {
  slug: "flower-arrangement-cost-calculator",
  title: "Flower Arrangement Cost Calculator",
  description: "Estimate the cost of floral arrangements based on flower types, quantities, and arrangement style.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["flower arrangement cost","floral budget","bouquet price","wedding flowers cost"],
  variants: [{
    id: "standard",
    name: "Flower Arrangement Cost",
    description: "Estimate the cost of floral arrangements based on flower types, quantities, and arrangement style.",
    fields: [
      { name: "arrangementType", label: "Arrangement Type", type: "select", options: [{ value: "1", label: "Bouquet" }, { value: "2", label: "Centerpiece" }, { value: "3", label: "Corsage/Boutonniere" }, { value: "4", label: "Large Urn/Altar" }], defaultValue: "1" },
      { name: "flowerTier", label: "Flower Tier", type: "select", options: [{ value: "1", label: "Budget (Carnations, Daisies)" }, { value: "2", label: "Mid-Range (Roses, Lilies)" }, { value: "3", label: "Premium (Peonies, Orchids)" }], defaultValue: "2" },
      { name: "numArrangements", label: "Number of Arrangements", type: "number", min: 1, max: 50, defaultValue: 5 },
      { name: "greenery", label: "Greenery Level", type: "select", options: [{ value: "1", label: "Minimal" }, { value: "2", label: "Standard" }, { value: "3", label: "Lush/Full" }], defaultValue: "2" },
      { name: "season", label: "Season", type: "select", options: [{ value: "1", label: "In Season" }, { value: "2", label: "Off Season" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const arrType = parseInt(inputs.arrangementType as string);
    const tier = parseInt(inputs.flowerTier as string);
    const numArr = inputs.numArrangements as number;
    const greenery = parseInt(inputs.greenery as string);
    const season = parseInt(inputs.season as string);
    const baseCost = { 1: 45, 2: 55, 3: 15, 4: 120 };
    const tierMult = { 1: 0.6, 2: 1.0, 3: 1.8 };
    const greeneryAdd = { 1: 0, 2: 8, 3: 18 };
    const seasonMult = season === 2 ? 1.3 : 1.0;
    const costPerArr = ((baseCost[arrType] || 45) * (tierMult[tier] || 1.0) + (greeneryAdd[greenery] || 8)) * seasonMult;
    const totalCost = costPerArr * numArr;
    const deliveryFee = totalCost > 200 ? 0 : 25;
    const grandTotal = totalCost + deliveryFee;
    return {
      primary: { label: "Cost Per Arrangement", value: "$" + formatNumber(Math.round(costPerArr * 100) / 100) },
      details: [
        { label: "Total for All", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
        { label: "Number of Arrangements", value: formatNumber(numArr) },
        { label: "Delivery Fee", value: deliveryFee === 0 ? "Free (over $200)" : "$" + formatNumber(deliveryFee) },
        { label: "Grand Total", value: "$" + formatNumber(Math.round(grandTotal * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","leather-working-cost-calculator"],
  faq: [
    { question: "How much do flower arrangements cost?", answer: "A simple bouquet starts around 25 to 40 dollars. Centerpieces run 40 to 80 dollars. Large altar arrangements can cost 100 to 300 dollars or more depending on flowers used." },
    { question: "Are wedding flowers more expensive?", answer: "Wedding flowers often cost more due to design time, delivery, setup, and the expectation of premium blooms. Valentine's Day and Mother's Day also drive prices up." },
    { question: "How can I save money on flowers?", answer: "Use in-season flowers, choose more greenery, use budget-friendly blooms as filler, and keep arrangements smaller. Buying wholesale for DIY arrangements can save 40 to 60 percent." },
  ],
  formula: "Cost Per Arrangement = (Base Cost x Flower Tier Multiplier + Greenery Add-on) x Season Multiplier; Total Cost = Cost Per Arrangement x Number of Arrangements",
};
