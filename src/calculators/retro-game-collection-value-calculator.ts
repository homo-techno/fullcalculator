import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retroGameCollectionValueCalculator: CalculatorDefinition = {
  slug: "retro-game-collection-value-calculator",
  title: "Retro Game Collection Value Calculator",
  description: "Estimate the market value of your retro game collection based on console, condition, completeness, and number of titles.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retro game value","vintage game collection","old game prices","retro gaming calculator"],
  variants: [{
    id: "standard",
    name: "Retro Game Collection Value",
    description: "Estimate the market value of your retro game collection based on console, condition, completeness, and number of titles.",
    fields: [
      { name: "console", label: "Console Generation", type: "select", options: [{ value: "1", label: "NES/Master System" }, { value: "2", label: "SNES/Genesis" }, { value: "3", label: "N64/PS1/Saturn" }, { value: "4", label: "GameCube/PS2/Dreamcast" }, { value: "5", label: "Game Boy/GBA" }], defaultValue: "2" },
      { name: "totalGames", label: "Total Number of Games", type: "number", min: 1, max: 1000, defaultValue: 25 },
      { name: "condition", label: "Average Condition", type: "select", options: [{ value: "1", label: "Poor (loose, damaged)" }, { value: "2", label: "Good (loose, working)" }, { value: "3", label: "Very Good (complete in box)" }, { value: "4", label: "Excellent (CIB, near mint)" }], defaultValue: "2" },
      { name: "rarePercent", label: "Percentage of Rare Titles (%)", type: "number", min: 0, max: 100, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const console = parseInt(inputs.console as string);
    const games = inputs.totalGames as number;
    const condition = parseInt(inputs.condition as string);
    const rarePercent = inputs.rarePercent as number / 100;
    const baseValues = { 1: 15, 2: 20, 3: 18, 4: 12, 5: 10 };
    const conditionMultiplier = { 1: 0.4, 2: 1.0, 3: 2.5, 4: 4.0 };
    const basePerGame = (baseValues[console] || 15) * (conditionMultiplier[condition] || 1.0);
    const commonGames = Math.round(games * (1 - rarePercent));
    const rareGames = games - commonGames;
    const commonValue = commonGames * basePerGame;
    const rareValue = rareGames * basePerGame * 5;
    const totalValue = commonValue + rareValue;
    const avgPerGame = games > 0 ? Math.round(totalValue / games * 100) / 100 : 0;
    return {
      primary: { label: "Estimated Collection Value", value: "$" + formatNumber(Math.round(totalValue)) },
      details: [
        { label: "Common Titles Value", value: "$" + formatNumber(Math.round(commonValue)) },
        { label: "Rare Titles Value", value: "$" + formatNumber(Math.round(rareValue)) },
        { label: "Average Per Game", value: "$" + formatNumber(avgPerGame) },
        { label: "Number of Rare Titles", value: formatNumber(rareGames) }
      ]
    };
  },
  }],
  relatedSlugs: ["card-game-deck-value-calculator","gaming-peripheral-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base Value = Console Base Price x Condition Multiplier; Common Value = Common Games x Base Value; Rare Value = Rare Games x Base Value x 5; Total = Common Value + Rare Value",
};
