import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cardGameDeckValueCalculator: CalculatorDefinition = {
  slug: "card-game-deck-value-calculator",
  title: "Card Game Deck Value Calculator",
  description: "Calculate the total value of a trading card game deck based on card rarity distribution and average market prices per rarity tier.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["deck value calculator","TCG deck cost","card game deck price","MTG deck value"],
  variants: [{
    id: "standard",
    name: "Card Game Deck Value",
    description: "Calculate the total value of a trading card game deck based on card rarity distribution and average market prices per rarity tier.",
    fields: [
      { name: "gameSystem", label: "Card Game", type: "select", options: [{ value: "1", label: "Magic: The Gathering" }, { value: "2", label: "Pokemon TCG" }, { value: "3", label: "Yu-Gi-Oh!" }, { value: "4", label: "Flesh and Blood" }], defaultValue: "1" },
      { name: "commonCards", label: "Common/Uncommon Cards", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "rareCards", label: "Rare Cards", type: "number", min: 0, max: 60, defaultValue: 15 },
      { name: "mythicCards", label: "Mythic/Ultra Rare Cards", type: "number", min: 0, max: 30, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const game = parseInt(inputs.gameSystem as string);
    const commons = inputs.commonCards as number;
    const rares = inputs.rareCards as number;
    const mythics = inputs.mythicCards as number;
    const prices = {
      1: { common: 0.25, rare: 3.50, mythic: 15 },
      2: { common: 0.15, rare: 2.50, mythic: 12 },
      3: { common: 0.10, rare: 2.00, mythic: 10 },
      4: { common: 0.30, rare: 4.00, mythic: 18 }
    };
    const p = prices[game] || prices[1];
    const commonValue = commons * p.common;
    const rareValue = rares * p.rare;
    const mythicValue = mythics * p.mythic;
    const totalValue = commonValue + rareValue + mythicValue;
    const totalCards = commons + rares + mythics;
    const avgPerCard = totalCards > 0 ? totalValue / totalCards : 0;
    return {
      primary: { label: "Total Deck Value", value: "$" + formatNumber(Math.round(totalValue * 100) / 100) },
      details: [
        { label: "Common/Uncommon Value", value: "$" + formatNumber(Math.round(commonValue * 100) / 100) },
        { label: "Rare Value", value: "$" + formatNumber(Math.round(rareValue * 100) / 100) },
        { label: "Mythic/Ultra Rare Value", value: "$" + formatNumber(Math.round(mythicValue * 100) / 100) },
        { label: "Average Per Card", value: "$" + formatNumber(Math.round(avgPerCard * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["tabletop-rpg-encounter-builder-calculator","miniatures-army-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Common Value = Common Cards x Avg Common Price; Rare Value = Rare Cards x Avg Rare Price; Mythic Value = Mythic Cards x Avg Mythic Price; Total Deck Value = Common + Rare + Mythic Value",
};
