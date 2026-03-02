import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diceProbabilityCalculator: CalculatorDefinition = {
  slug: "dice-probability-calculator",
  title: "Dice Probability Calculator",
  description: "Calculate the probability of rolling a target sum with dice.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["dice probability","dice roll calculator"],
  variants: [{
    id: "standard",
    name: "Dice Probability",
    description: "Calculate the probability of rolling a target sum with dice.",
    fields: [
      { name: "numDice", label: "Number of Dice", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "sides", label: "Sides Per Die", type: "number", min: 2, max: 100, defaultValue: 6 },
      { name: "target", label: "Target Sum", type: "number", min: 1, max: 1000, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const n = inputs.numDice as number;
      const s = inputs.sides as number;
      const t = inputs.target as number;
      if (!n || !s || !t) return null;
      if (t < n || t > n * s) return { primary: { label: "Probability", value: "0%" }, details: [{ label: "Outcome", value: "Impossible with these dice" }] };
      const total = Math.pow(s, n);
      let ways = 0;
      for (let k = 0; k <= Math.floor((t - n) / s); k++) {
        const sign = k % 2 === 0 ? 1 : -1;
        let binom = 1;
        for (let i = 0; i < k; i++) { binom = binom * (n - i) / (i + 1); }
        let combo = 1;
        const val = t - 1 - k * s;
        for (let i = 0; i < n - 1; i++) { combo = combo * (val - i) / (i + 1); }
        ways += sign * binom * combo;
      }
      const prob = Math.round(ways / total * 10000) / 100;
      return {
        primary: { label: "Probability", value: prob + "%" },
        details: [
          { label: "Favorable Outcomes", value: formatNumber(Math.round(ways)) },
          { label: "Total Outcomes", value: formatNumber(total) },
          { label: "Odds", value: "1 in " + formatNumber(Math.round(total / Math.max(ways, 1))) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the most common roll with 2d6?", answer: "A sum of 7 is the most common with a 16.67% chance." },
    { question: "How are dice probabilities calculated?", answer: "By counting favorable outcomes and dividing by total outcomes." },
  ],
  formula: "P = favorable outcomes / total outcomes (s^n)",
};
