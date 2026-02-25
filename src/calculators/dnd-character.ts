import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dndCharacterCalculator: CalculatorDefinition = {
  slug: "dnd-character",
  title: "D&D Character Stats Calculator",
  description: "Generate and calculate D&D character ability scores using different methods: Standard Array, Point Buy, or simulated dice rolls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dnd", "d&d", "dungeons and dragons", "character stats", "ability scores", "point buy", "standard array"],
  variants: [
    {
      id: "calc",
      name: "Generate Character Stats",
      fields: [
        {
          name: "method",
          label: "Generation Method",
          type: "select",
          options: [
            { label: "Standard Array (15,14,13,12,10,8)", value: "standard" },
            { label: "Point Buy (27 points)", value: "pointbuy" },
            { label: "Roll 4d6 Drop Lowest (simulated)", value: "roll" },
          ],
        },
        {
          name: "charClass",
          label: "Class",
          type: "select",
          options: [
            { label: "Fighter", value: "fighter" },
            { label: "Wizard", value: "wizard" },
            { label: "Rogue", value: "rogue" },
            { label: "Cleric", value: "cleric" },
            { label: "Ranger", value: "ranger" },
            { label: "Bard", value: "bard" },
          ],
        },
        { name: "seed", label: "Lucky Number (for rolls)", type: "number", placeholder: "Any number", min: 1, max: 9999, defaultValue: 42 },
      ],
      calculate: (inputs) => {
        const method = String(inputs.method || "standard");
        const charClass = String(inputs.charClass || "fighter");
        const seed = Number(inputs.seed) || 42;

        const abilities = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
        let scores: number[];

        if (method === "standard") {
          scores = [15, 14, 13, 12, 10, 8];
        } else if (method === "pointbuy") {
          const builds: Record<string, number[]> = {
            fighter: [15, 13, 14, 8, 10, 12],
            wizard: [8, 13, 14, 15, 12, 10],
            rogue: [10, 15, 13, 12, 14, 8],
            cleric: [14, 10, 13, 8, 15, 12],
            ranger: [13, 15, 14, 10, 12, 8],
            bard: [10, 14, 12, 13, 8, 15],
          };
          scores = builds[charClass] || builds.fighter;
        } else {
          // Seeded pseudo-random 4d6 drop lowest
          let s = seed;
          const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; };
          scores = [];
          for (let i = 0; i < 6; i++) {
            const rolls = [1 + (rand() % 6), 1 + (rand() % 6), 1 + (rand() % 6), 1 + (rand() % 6)];
            rolls.sort((a, b) => a - b);
            scores.push(rolls[1] + rolls[2] + rolls[3]);
          }
          // Sort descending for optimal assignment
          scores.sort((a, b) => b - a);
        }

        // Assign based on class priority
        const priority: Record<string, number[]> = {
          fighter: [0, 2, 1, 5, 4, 3],
          wizard: [3, 2, 4, 0, 1, 5],
          rogue: [1, 4, 2, 3, 0, 5],
          cleric: [4, 0, 2, 5, 1, 3],
          ranger: [1, 4, 2, 0, 3, 5],
          bard: [5, 1, 2, 3, 4, 0],
        };

        const order = priority[charClass] || priority.fighter;
        const assigned: number[] = new Array(6);
        const sortedScores = [...scores].sort((a, b) => b - a);
        order.forEach((abilityIdx, priorityIdx) => {
          assigned[abilityIdx] = sortedScores[priorityIdx];
        });

        const modifiers = assigned.map((s) => Math.floor((s - 10) / 2));
        const totalPoints = assigned.reduce((s, v) => s + v, 0);

        return {
          primary: { label: "Character Stats", value: charClass.charAt(0).toUpperCase() + charClass.slice(1) + " (" + method + ")" },
          details: [
            ...abilities.map((ab, i) => ({ label: ab, value: assigned[i] + " (mod " + (modifiers[i] >= 0 ? "+" : "") + modifiers[i] + ")" })),
            { label: "Total Points", value: formatNumber(totalPoints) },
            { label: "Method", value: method === "standard" ? "Standard Array" : method === "pointbuy" ? "Point Buy" : "4d6 Drop Lowest" },
          ],
          note: "Stats are optimally assigned for the selected class. For rolled stats, change the lucky number to get different results.",
        };
      },
    },
  ],
  relatedSlugs: ["hogwarts-house-calculator", "spirit-animal-calculator", "minecraft-crafting-calculator"],
  faq: [
    { question: "What is the Standard Array?", answer: "A fixed set of scores (15, 14, 13, 12, 10, 8) that ensures balanced characters. Used in D&D 5th Edition." },
    { question: "How does Point Buy work?", answer: "You get 27 points to distribute among six abilities. Each ability starts at 8, and increasing costs more at higher values. Max is 15 before racial bonuses." },
  ],
  formula: "Standard Array: [15,14,13,12,10,8] | Point Buy: 27pts distributed | Roll: 4d6 drop lowest per stat",
};
