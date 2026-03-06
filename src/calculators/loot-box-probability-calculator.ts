import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lootBoxProbabilityCalculator: CalculatorDefinition = {
  slug: "loot-box-probability-calculator",
  title: "Loot Box Probability Calculator",
  description: "Calculate the probability of getting a specific item from loot boxes based on drop rates, number of boxes opened, and pity system mechanics.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["loot box probability","gacha calculator","drop rate calculator","loot box odds"],
  variants: [{
    id: "standard",
    name: "Loot Box Probability",
    description: "Calculate the probability of getting a specific item from loot boxes based on drop rates, number of boxes opened, and pity system mechanics.",
    fields: [
      { name: "dropRate", label: "Item Drop Rate (%)", type: "number", min: 0.01, max: 100, defaultValue: 5 },
      { name: "boxesOpened", label: "Boxes to Open", type: "number", min: 1, max: 1000, defaultValue: 20 },
      { name: "costPerBox", label: "Cost Per Box ($)", type: "number", min: 0, max: 100, defaultValue: 2.50 },
      { name: "pitySystem", label: "Pity System (Guaranteed After)", type: "number", min: 0, max: 500, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const rate = inputs.dropRate as number / 100;
    const boxes = inputs.boxesOpened as number;
    const cost = inputs.costPerBox as number;
    const pity = inputs.pitySystem as number;
    const probNone = Math.pow(1 - rate, boxes);
    const probAtLeastOne = (1 - probNone) * 100;
    const adjustedProb = pity > 0 && boxes >= pity ? 100 : probAtLeastOne;
    const expectedBoxes = Math.ceil(1 / rate);
    const expectedCost = expectedBoxes * cost;
    const totalSpend = boxes * cost;
    const avgDropsExpected = Math.round(boxes * rate * 100) / 100;
    return {
      primary: { label: "Chance of Getting Item", value: formatNumber(Math.round(adjustedProb * 100) / 100) + "%" },
      details: [
        { label: "Expected Boxes to Get Item", value: formatNumber(expectedBoxes) },
        { label: "Expected Cost for Item", value: "$" + formatNumber(Math.round(expectedCost * 100) / 100) },
        { label: "Total Spend (" + boxes + " boxes)", value: "$" + formatNumber(Math.round(totalSpend * 100) / 100) },
        { label: "Expected Drops in " + boxes + " Boxes", value: formatNumber(avgDropsExpected) }
      ]
    };
  },
  }],
  relatedSlugs: ["poker-pot-odds-calculator","card-game-deck-value-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Prob(0 drops) = (1 - Drop Rate)^Boxes
Prob(at least 1) = 1 - Prob(0 drops)
Expected Boxes = 1 / Drop Rate
Expected Cost = Expected Boxes x Cost Per Box",
};
