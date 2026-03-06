import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cocktailRecipeCostCalculator: CalculatorDefinition = {
  slug: "cocktail-recipe-cost-calculator",
  title: "Cocktail Recipe Cost Calculator",
  description: "Calculate the exact cost of any cocktail recipe by adding up each spirit, mixer, and garnish component to determine pour cost and optimal pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cocktail recipe cost","mixed drink cost","cocktail pricing","drink recipe calculator"],
  variants: [{
    id: "standard",
    name: "Cocktail Recipe Cost",
    description: "Calculate the exact cost of any cocktail recipe by adding up each spirit, mixer, and garnish component to determine pour cost and optimal pricing.",
    fields: [
      { name: "spirit1Cost", label: "Primary Spirit (cost per oz) ($)", type: "number", min: 0, max: 50, defaultValue: 1.65 },
      { name: "spirit1Oz", label: "Primary Spirit (oz)", type: "number", min: 0, max: 6, defaultValue: 2 },
      { name: "spirit2Cost", label: "Secondary Spirit/Liqueur (cost per oz) ($)", type: "number", min: 0, max: 50, defaultValue: 1.20 },
      { name: "spirit2Oz", label: "Secondary Spirit/Liqueur (oz)", type: "number", min: 0, max: 6, defaultValue: 0.75 },
      { name: "mixerCost", label: "Mixers and Juice (total) ($)", type: "number", min: 0, max: 10, defaultValue: 0.40 },
      { name: "garnishCost", label: "Garnish Cost ($)", type: "number", min: 0, max: 5, defaultValue: 0.25 },
      { name: "targetPourCost", label: "Target Pour Cost (%)", type: "number", min: 10, max: 40, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const s1Cost = inputs.spirit1Cost as number;
    const s1Oz = inputs.spirit1Oz as number;
    const s2Cost = inputs.spirit2Cost as number;
    const s2Oz = inputs.spirit2Oz as number;
    const mixer = inputs.mixerCost as number;
    const garnish = inputs.garnishCost as number;
    const targetPct = inputs.targetPourCost as number;
    const spirit1Total = s1Cost * s1Oz;
    const spirit2Total = s2Cost * s2Oz;
    const totalCost = spirit1Total + spirit2Total + mixer + garnish;
    const idealPrice = targetPct > 0 ? totalCost / (targetPct / 100) : 0;
    const profitAtIdeal = idealPrice - totalCost;
    return {
      primary: { label: "Total Cocktail Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) },
      details: [
        { label: "Primary Spirit Cost", value: "$" + formatNumber(Math.round(spirit1Total * 100) / 100) },
        { label: "Secondary Spirit Cost", value: "$" + formatNumber(Math.round(spirit2Total * 100) / 100) },
        { label: "Mixers and Garnish", value: "$" + formatNumber(Math.round((mixer + garnish) * 100) / 100) },
        { label: "Ideal Menu Price (at target %)", value: "$" + formatNumber(Math.round(idealPrice * 100) / 100) },
        { label: "Profit at Ideal Price", value: "$" + formatNumber(Math.round(profitAtIdeal * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["bar-pour-cost-calculator","happy-hour-profit-calculator"],
  faq: [
    { question: "What is the average cost to make a cocktail?", answer: "A standard cocktail costs $1.50 to $4.50 to make depending on the spirits used. Well drinks cost about $1.00 to $2.00, call drinks $2.00 to $3.50, and premium cocktails $3.50 to $6.00 or more." },
    { question: "How should I price cocktails on my menu?", answer: "Price cocktails at 4 to 5 times ingredient cost for a 20 to 25 percent pour cost. A cocktail that costs $3.00 to make should sell for $12 to $15. Consider also the perceived value, presentation, and competition." },
    { question: "What cocktails have the best profit margins?", answer: "Simple highballs and spirit-forward drinks using well spirits have the best margins. Moscow Mules, Gin and Tonics, and Margaritas are perennial profit leaders. Drinks with expensive liqueurs or fresh juices have lower margins." },
  ],
  formula: "Total Cost = (Spirit 1 Cost x Oz) + (Spirit 2 Cost x Oz) + Mixers + Garnish; Ideal Menu Price = Total Cost / (Target Pour Cost % / 100); Profit = Ideal Menu Price - Total Cost",
};
