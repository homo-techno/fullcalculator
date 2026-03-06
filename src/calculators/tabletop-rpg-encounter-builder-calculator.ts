import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tabletopRpgEncounterBuilderCalculator: CalculatorDefinition = {
  slug: "tabletop-rpg-encounter-builder-calculator",
  title: "Tabletop RPG Encounter Builder Calculator",
  description: "Build balanced RPG encounters by calculating difficulty ratings based on party size, level, number of enemies, and challenge rating for D&D style games.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["D&D encounter builder","RPG encounter calculator","tabletop combat difficulty","encounter challenge rating"],
  variants: [{
    id: "standard",
    name: "Tabletop RPG Encounter Builder",
    description: "Build balanced RPG encounters by calculating difficulty ratings based on party size, level, number of enemies, and challenge rating for D&D style games.",
    fields: [
      { name: "partySize", label: "Party Size (players)", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "partyLevel", label: "Average Party Level", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "numEnemies", label: "Number of Enemies", type: "number", min: 1, max: 30, defaultValue: 4 },
      { name: "enemyCR", label: "Enemy Challenge Rating", type: "number", min: 0.125, max: 30, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const partySize = inputs.partySize as number;
    const level = inputs.partyLevel as number;
    const numEnemies = inputs.numEnemies as number;
    const cr = inputs.enemyCR as number;
    const xpByCR = cr <= 0.125 ? 25 : cr <= 0.25 ? 50 : cr <= 0.5 ? 100 : cr <= 1 ? 200 : cr <= 2 ? 450 : cr <= 3 ? 700 : cr <= 4 ? 1100 : cr <= 5 ? 1800 : cr <= 6 ? 2300 : cr <= 7 ? 2900 : cr <= 8 ? 3900 : cr <= 9 ? 5000 : cr <= 10 ? 5900 : cr * 700;
    const encounterMultiplier = numEnemies <= 1 ? 1 : numEnemies <= 2 ? 1.5 : numEnemies <= 6 ? 2 : numEnemies <= 10 ? 2.5 : numEnemies <= 14 ? 3 : 4;
    const adjustedXP = xpByCR * numEnemies * encounterMultiplier;
    const easyThreshold = level * 25 * partySize;
    const mediumThreshold = level * 50 * partySize;
    const hardThreshold = level * 75 * partySize;
    const deadlyThreshold = level * 100 * partySize;
    const difficulty = adjustedXP >= deadlyThreshold ? "Deadly" : adjustedXP >= hardThreshold ? "Hard" : adjustedXP >= mediumThreshold ? "Medium" : "Easy";
    return {
      primary: { label: "Encounter Difficulty", value: difficulty },
      details: [
        { label: "Adjusted XP", value: formatNumber(Math.round(adjustedXP)) },
        { label: "XP Per Player", value: formatNumber(Math.round(xpByCR * numEnemies / partySize)) },
        { label: "Easy/Medium Threshold", value: formatNumber(easyThreshold) + " / " + formatNumber(mediumThreshold) },
        { label: "Hard/Deadly Threshold", value: formatNumber(hardThreshold) + " / " + formatNumber(deadlyThreshold) }
      ]
    };
  },
  }],
  relatedSlugs: ["card-game-deck-value-calculator","board-game-play-time-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "XP per Enemy = CR-based XP Table Lookup
Adjusted XP = XP per Enemy x Number of Enemies x Group Multiplier
Difficulty = Compare Adjusted XP to Party Thresholds (Easy/Medium/Hard/Deadly)",
};
