import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coinFlipCalculator: CalculatorDefinition = {
  slug: "coin-flip-calculator",
  title: "Coin Flip Probability Calculator",
  description:
    "Free coin flip probability calculator. Calculate the probability of getting a specific number of heads in a given number of coin flips using binomial distribution.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "coin flip",
    "coin toss",
    "probability",
    "binomial",
    "heads tails",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Coin Flip Probability",
      fields: [
        {
          name: "flips",
          label: "Number of Flips",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "heads",
          label: "Desired Number of Heads",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const n = inputs.flips as number;
        const k = inputs.heads as number;

        if (!n || k === undefined || k === null) return null;
        if (n < 1 || k < 0 || k > n) return null;

        // Calculate C(n, k)
        const combination = (n: number, k: number): number => {
          if (k === 0 || k === n) return 1;
          if (k > n - k) k = n - k;
          let result = 1;
          for (let i = 0; i < k; i++) {
            result = (result * (n - i)) / (i + 1);
          }
          return result;
        };

        const cnk = combination(n, k);
        // P = C(n,k) × 0.5^n
        const probability = cnk * Math.pow(0.5, n);
        const totalOutcomes = Math.pow(2, n);

        // Calculate cumulative probability (k or fewer heads)
        let cumulativeProb = 0;
        for (let i = 0; i <= k; i++) {
          cumulativeProb += combination(n, i) * Math.pow(0.5, n);
        }

        return {
          primary: {
            label: `P(exactly ${k} heads)`,
            value: `${formatNumber(probability * 100, 4)}%`,
          },
          details: [
            { label: "Number of Flips", value: formatNumber(n, 0) },
            { label: "Desired Heads", value: formatNumber(k, 0) },
            {
              label: "Combinations C(n,k)",
              value: formatNumber(cnk, 0),
            },
            {
              label: "Total Possible Outcomes",
              value: formatNumber(totalOutcomes, 0),
            },
            {
              label: "Exact Probability",
              value: `${formatNumber(cnk, 0)} / ${formatNumber(totalOutcomes, 0)}`,
            },
            {
              label: `P(${k} or fewer heads)`,
              value: `${formatNumber(cumulativeProb * 100, 4)}%`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dice-roller-calculator", "lottery-odds-calculator"],
  faq: [
    {
      question: "How is the coin flip probability calculated?",
      answer:
        "Using the binomial probability formula: P = C(n,k) x 0.5^n, where n is the number of flips, k is the desired number of heads, and C(n,k) is the binomial coefficient.",
    },
    {
      question: "What is a fair coin?",
      answer:
        "A fair coin has an equal probability (50%) of landing on heads or tails for each flip. This calculator assumes a fair coin.",
    },
  ],
  formula:
    "P(exactly k heads in n flips) = C(n, k) x 0.5^n, where C(n, k) = n! / (k! x (n-k)!).",
};
