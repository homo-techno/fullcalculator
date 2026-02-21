import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lotteryOddsCalculator: CalculatorDefinition = {
  slug: "lottery-odds-calculator",
  title: "Lottery Odds Calculator",
  description:
    "Free lottery odds calculator. Calculate your chances of winning based on total numbers, numbers to pick, and optional bonus ball pool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "lottery odds",
    "lottery probability",
    "lottery calculator",
    "jackpot odds",
    "winning chances",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Lottery Odds",
      fields: [
        {
          name: "totalNumbers",
          label: "Total Numbers in Pool",
          type: "number",
          placeholder: "e.g. 49",
        },
        {
          name: "numbersToPick",
          label: "Numbers to Pick",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "bonusPool",
          label: "Bonus Ball Pool Size (0 if none)",
          type: "number",
          placeholder: "e.g. 26",
        },
      ],
      calculate: (inputs) => {
        const total = inputs.totalNumbers as number;
        const pick = inputs.numbersToPick as number;
        const bonus = inputs.bonusPool as number;

        if (!total || !pick) return null;
        if (pick > total || pick < 1) return null;

        // Calculate C(n, k)
        const combination = (n: number, k: number): number => {
          if (k === 0 || k === n) return 1;
          if (k > n - k) k = n - k;
          let result = 1;
          for (let i = 0; i < k; i++) {
            result = (result * (n - i)) / (i + 1);
          }
          return Math.round(result);
        };

        const mainOdds = combination(total, pick);
        let totalOdds = mainOdds;

        if (bonus && bonus > 0) {
          totalOdds = mainOdds * bonus;
        }

        const probability = 1 / totalOdds;

        const details: { label: string; value: string }[] = [
          { label: "Total Numbers in Pool", value: formatNumber(total, 0) },
          { label: "Numbers to Pick", value: formatNumber(pick, 0) },
          {
            label: "Main Draw Combinations",
            value: formatNumber(mainOdds, 0),
          },
        ];

        if (bonus && bonus > 0) {
          details.push({
            label: "Bonus Ball Pool",
            value: formatNumber(bonus, 0),
          });
          details.push({
            label: "Total Combinations (with Bonus)",
            value: formatNumber(totalOdds, 0),
          });
        }

        details.push({
          label: "Probability",
          value: `${formatNumber(probability * 100, 8)}%`,
        });

        details.push({
          label: "Odds Ratio",
          value: `1 in ${formatNumber(totalOdds, 0)}`,
        });

        return {
          primary: {
            label: "Odds of Winning",
            value: `1 in ${formatNumber(totalOdds, 0)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["coin-flip-calculator", "dice-roller-calculator"],
  faq: [
    {
      question: "How are lottery odds calculated?",
      answer:
        "Lottery odds use combinations: C(n, k) = n! / (k! x (n-k)!) for the main draw. If there is a bonus ball, the main combinations are multiplied by the bonus pool size.",
    },
    {
      question: "What are typical lottery odds?",
      answer:
        "For a 6/49 lottery, the odds are 1 in 13,983,816. For Powerball (5/69 + 1/26), the odds are approximately 1 in 292,201,338.",
    },
  ],
  formula:
    "Main odds = C(n, k) = n! / (k! x (n-k)!). With bonus ball: Total odds = C(n, k) x bonus pool size.",
};
