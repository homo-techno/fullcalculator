import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diceRollerCalculator: CalculatorDefinition = {
  slug: "dice-roller-calculator",
  title: "Dice Roller Calculator",
  description:
    "Free dice roller calculator. Calculate min, max, average, total outcomes, and probability of a specific sum for any combination of dice.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dice roller",
    "dice probability",
    "dice calculator",
    "roll dice",
    "dice statistics",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Dice Statistics",
      fields: [
        {
          name: "numDice",
          label: "Number of Dice",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "sides",
          label: "Sides per Die",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "targetSum",
          label: "Target Sum (optional)",
          type: "number",
          placeholder: "e.g. 7",
        },
      ],
      calculate: (inputs) => {
        const numDice = inputs.numDice as number;
        const sides = inputs.sides as number;
        const targetSum = inputs.targetSum as number;

        if (!numDice || !sides) return null;
        if (numDice < 1 || sides < 2) return null;

        const min = numDice;
        const max = numDice * sides;
        const average = (numDice * (sides + 1)) / 2;
        const totalOutcomes = Math.pow(sides, numDice);

        const details: { label: string; value: string }[] = [
          { label: "Number of Dice", value: formatNumber(numDice, 0) },
          { label: "Sides per Die", value: formatNumber(sides, 0) },
          { label: "Minimum Sum", value: formatNumber(min, 0) },
          { label: "Maximum Sum", value: formatNumber(max, 0) },
          { label: "Average Sum", value: formatNumber(average, 2) },
          {
            label: "Total Possible Outcomes",
            value: formatNumber(totalOutcomes, 0),
          },
        ];

        if (targetSum && targetSum >= min && targetSum <= max) {
          // Count ways to achieve target sum using inclusion-exclusion
          let ways = 0;
          for (let i = 0; i <= numDice; i++) {
            const remaining = targetSum - numDice - i * sides;
            if (remaining < 0) break;
            const sign = i % 2 === 0 ? 1 : -1;
            // C(numDice, i) * C(remaining + numDice - 1, numDice - 1)
            let cni = 1;
            for (let j = 0; j < i; j++) {
              cni = (cni * (numDice - j)) / (j + 1);
            }
            let cnr = 1;
            for (let j = 0; j < numDice - 1; j++) {
              cnr = (cnr * (remaining + numDice - 1 - j)) / (j + 1);
            }
            ways += sign * cni * cnr;
          }
          const probability = ways / totalOutcomes;
          details.push({
            label: `Probability of Sum = ${targetSum}`,
            value: `${formatNumber(probability * 100, 4)}% (${ways}/${formatNumber(totalOutcomes, 0)})`,
          });
        }

        return {
          primary: {
            label: "Average Roll",
            value: formatNumber(average, 2),
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["coin-flip-calculator", "lottery-odds-calculator"],
  faq: [
    {
      question: "How is the average dice roll calculated?",
      answer:
        "The average (expected value) for rolling N dice with S sides each is N x (S + 1) / 2. For example, the average of 2d6 is 2 x 3.5 = 7.",
    },
    {
      question: "How is the probability of a specific sum calculated?",
      answer:
        "The probability uses an inclusion-exclusion formula to count the number of ways to achieve the target sum, then divides by the total number of outcomes (sides^dice).",
    },
  ],
  formula:
    "Min = N, Max = N x S, Average = N x (S+1)/2, Total Outcomes = S^N. Probability of specific sum uses the inclusion-exclusion principle.",
};
