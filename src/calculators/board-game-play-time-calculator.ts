import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardGamePlayTimeCalculator: CalculatorDefinition = {
  slug: "board-game-play-time-calculator",
  title: "Board Game Play Time Calculator",
  description: "Estimate total board game session time based on game complexity, player count, player experience, and setup time to plan your game night.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board game time estimator","game night planner","board game session length","tabletop play time"],
  variants: [{
    id: "standard",
    name: "Board Game Play Time",
    description: "Estimate total board game session time based on game complexity, player count, player experience, and setup time to plan your game night.",
    fields: [
      { name: "basePlayTime", label: "Box Play Time Estimate (min)", type: "number", min: 5, max: 600, defaultValue: 60 },
      { name: "playerCount", label: "Number of Players", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "experience", label: "Player Experience", type: "select", options: [{ value: "1", label: "First time players" }, { value: "2", label: "Played a few times" }, { value: "3", label: "Experienced" }, { value: "4", label: "Expert" }], defaultValue: "2" },
      { name: "complexity", label: "Game Complexity", type: "select", options: [{ value: "1", label: "Light (party game)" }, { value: "2", label: "Medium (strategy)" }, { value: "3", label: "Heavy (euro/war)" }, { value: "4", label: "Very Heavy (grand strategy)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const baseTime = inputs.basePlayTime as number;
    const players = inputs.playerCount as number;
    const exp = parseInt(inputs.experience as string);
    const complexity = parseInt(inputs.complexity as string);
    const playerScaling = 1 + (players - 2) * 0.12;
    const expMultiplier = { 1: 1.6, 2: 1.2, 3: 1.0, 4: 0.85 };
    const setupTimes = { 1: 5, 2: 15, 3: 25, 4: 40 };
    const ruleExplainTime = exp === 1 ? complexity * 10 : 0;
    const playTime = Math.round(baseTime * playerScaling * (expMultiplier[exp] || 1.0));
    const setup = setupTimes[complexity] || 15;
    const totalTime = playTime + setup + ruleExplainTime;
    const hours = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    return {
      primary: { label: "Total Session Time", value: hours > 0 ? hours + "h " + mins + "m" : mins + " minutes" },
      details: [
        { label: "Actual Play Time", value: formatNumber(playTime) + " min" },
        { label: "Setup Time", value: formatNumber(setup) + " min" },
        { label: "Rules Explanation", value: formatNumber(ruleExplainTime) + " min" },
        { label: "Player Scaling Factor", value: formatNumber(Math.round(playerScaling * 100) / 100) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["tabletop-rpg-encounter-builder-calculator","card-game-deck-value-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Play Time = Base Time x Player Scaling x Experience Multiplier
Setup = Complexity-based estimate
Total Session = Play Time + Setup + Rules Explanation",
};
