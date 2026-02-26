import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dndEncounterCalculator: CalculatorDefinition = {
  slug: "dnd-encounter-calculator",
  title: "D&D Encounter Difficulty Calculator",
  description: "Free online D&D encounter difficulty calculator. Calculate encounter difficulty, XP thresholds, and adjusted XP for Dungeons & Dragons 5th Edition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dnd encounter calculator", "d&d encounter difficulty", "encounter builder", "5e encounter calculator", "xp threshold calculator"],
  variants: [
    {
      id: "difficulty",
      name: "Encounter Difficulty",
      description: "Calculate encounter difficulty based on party and monster XP",
      fields: [
        { name: "partySize", label: "Number of Players", type: "select", options: [
          { label: "3 players", value: "3" },
          { label: "4 players", value: "4" },
          { label: "5 players", value: "5" },
          { label: "6 players", value: "6" },
          { label: "7 players", value: "7" },
        ], defaultValue: "4" },
        { name: "avgLevel", label: "Average Party Level", type: "number", placeholder: "e.g. 5" },
        { name: "totalMonsterXp", label: "Total Monster XP", type: "number", placeholder: "e.g. 1800" },
        { name: "numMonsters", label: "Number of Monsters", type: "select", options: [
          { label: "1 monster", value: "1" },
          { label: "2 monsters", value: "2" },
          { label: "3-6 monsters", value: "4" },
          { label: "7-10 monsters", value: "8" },
          { label: "11-14 monsters", value: "12" },
          { label: "15+ monsters", value: "15" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const partySize = parseFloat(inputs.partySize as string) || 4;
        const avgLevel = parseFloat(inputs.avgLevel as string) || 0;
        const totalXp = parseFloat(inputs.totalMonsterXp as string) || 0;
        const numMonsters = parseFloat(inputs.numMonsters as string) || 1;
        if (!avgLevel || !totalXp) return null;

        const xpThresholds: Record<number, number[]> = {
          1: [25, 50, 75, 100], 2: [50, 100, 150, 200], 3: [75, 150, 225, 400],
          4: [125, 250, 375, 500], 5: [250, 500, 750, 1100], 6: [300, 600, 900, 1400],
          7: [350, 750, 1100, 1700], 8: [450, 900, 1400, 2100], 9: [550, 1100, 1600, 2400],
          10: [600, 1200, 1900, 2800], 11: [800, 1600, 2400, 3600], 12: [1000, 2000, 3000, 4500],
          13: [1100, 2200, 3400, 5100], 14: [1250, 2500, 3800, 5700], 15: [1400, 2800, 4300, 6400],
          16: [1600, 3200, 4800, 7200], 17: [2000, 3900, 5900, 8800], 18: [2100, 4200, 6300, 9500],
          19: [2400, 4900, 7300, 10900], 20: [2800, 5700, 8500, 12700],
        };

        let multiplier: number;
        if (numMonsters <= 1) multiplier = 1;
        else if (numMonsters <= 2) multiplier = 1.5;
        else if (numMonsters <= 6) multiplier = 2;
        else if (numMonsters <= 10) multiplier = 2.5;
        else if (numMonsters <= 14) multiplier = 3;
        else multiplier = 4;

        if (partySize < 3) multiplier += 0.5;
        else if (partySize >= 6) multiplier = Math.max(1, multiplier - 0.5);

        const adjustedXp = totalXp * multiplier;
        const level = Math.min(20, Math.max(1, Math.round(avgLevel)));
        const thresholds = xpThresholds[level] || xpThresholds[1];
        const partyEasy = thresholds[0] * partySize;
        const partyMedium = thresholds[1] * partySize;
        const partyHard = thresholds[2] * partySize;
        const partyDeadly = thresholds[3] * partySize;

        let difficulty: string;
        if (adjustedXp < partyEasy) difficulty = "Trivial";
        else if (adjustedXp < partyMedium) difficulty = "Easy";
        else if (adjustedXp < partyHard) difficulty = "Medium";
        else if (adjustedXp < partyDeadly) difficulty = "Hard";
        else difficulty = "Deadly";

        return {
          primary: { label: "Encounter Difficulty", value: difficulty },
          details: [
            { label: "Adjusted XP", value: formatNumber(adjustedXp, 0) },
            { label: "Raw monster XP", value: formatNumber(totalXp, 0) },
            { label: "XP multiplier", value: `${formatNumber(multiplier, 1)}x (${formatNumber(numMonsters, 0)} monsters)` },
            { label: "Easy threshold", value: formatNumber(partyEasy, 0) },
            { label: "Medium threshold", value: formatNumber(partyMedium, 0) },
            { label: "Hard threshold", value: formatNumber(partyHard, 0) },
            { label: "Deadly threshold", value: formatNumber(partyDeadly, 0) },
            { label: "XP award (per player)", value: formatNumber(totalXp / partySize, 0) },
          ],
          note: "Based on D&D 5th Edition DMG encounter building rules. Adjusted XP is only for determining difficulty, not for XP rewards.",
        };
      },
    },
    {
      id: "daily-budget",
      name: "Adventuring Day XP Budget",
      description: "Calculate the daily XP budget for adventuring encounters",
      fields: [
        { name: "partySize", label: "Number of Players", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "avgLevel", label: "Average Party Level", type: "number", placeholder: "e.g. 5" },
        { name: "numEncounters", label: "Planned Encounters", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const partySize = parseFloat(inputs.partySize as string) || 4;
        const avgLevel = parseFloat(inputs.avgLevel as string) || 0;
        const numEncounters = parseFloat(inputs.numEncounters as string) || 6;
        if (!avgLevel) return null;

        const dailyBudgets: Record<number, number> = {
          1: 300, 2: 600, 3: 1200, 4: 1700, 5: 3500, 6: 4000, 7: 5000, 8: 6000,
          9: 7500, 10: 9000, 11: 10500, 12: 11500, 13: 13500, 14: 15000, 15: 18000,
          16: 20000, 17: 25000, 18: 27000, 19: 30000, 20: 40000,
        };

        const level = Math.min(20, Math.max(1, Math.round(avgLevel)));
        const dailyPerPlayer = dailyBudgets[level] || 300;
        const totalDailyBudget = dailyPerPlayer * partySize;
        const perEncounter = totalDailyBudget / numEncounters;

        return {
          primary: { label: "Daily XP Budget", value: formatNumber(totalDailyBudget, 0) },
          details: [
            { label: "XP budget per encounter", value: formatNumber(perEncounter, 0) },
            { label: "Budget per player", value: formatNumber(dailyPerPlayer, 0) },
            { label: "Planned encounters", value: formatNumber(numEncounters, 0) },
            { label: "Party size", value: formatNumber(partySize, 0) },
            { label: "Average level", value: formatNumber(level, 0) },
          ],
          note: "The daily budget assumes 2 short rests. Fewer encounters means each should be harder. More encounters means each should be easier.",
        };
      },
    },
  ],
  relatedSlugs: ["random-number-generator", "probability-calculator"],
  faq: [
    { question: "How does the encounter multiplier work?", answer: "More monsters make encounters harder due to action economy. The XP multiplier adjusts difficulty calculation: 1 monster = 1x, 2 = 1.5x, 3-6 = 2x, 7-10 = 2.5x, 11-14 = 3x, 15+ = 4x. This only affects difficulty rating, not XP rewards." },
    { question: "What is the adventuring day XP budget?", answer: "The DMG suggests a daily XP budget representing the total adjusted XP of all encounters before the party needs a long rest. At level 5, it is 3,500 XP per player. Spread this across 6-8 medium encounters or fewer hard/deadly ones." },
    { question: "What difficulty should I aim for?", answer: "For a standard session, mix Medium and Hard encounters. Use Easy encounters for flavor or resource drain. Reserve Deadly encounters for boss fights or climactic moments. A Deadly encounter risks character death." },
  ],
  formula: "Adjusted XP = Total Monster XP × Encounter Multiplier (based on monster count)",
};
