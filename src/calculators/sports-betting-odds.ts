import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sportsBettingOddsCalculator: CalculatorDefinition = {
  slug: "sports-betting-odds-calculator",
  title: "Sports Betting Odds Calculator",
  description:
    "Free sports betting odds calculator. Convert between American, decimal, and fractional odds. Calculate implied probability and potential payouts.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "betting odds calculator",
    "odds converter",
    "American odds",
    "decimal odds",
    "fractional odds",
    "implied probability",
    "sports betting",
  ],
  variants: [
    {
      id: "american-odds",
      name: "American Odds Converter",
      description: "Convert American odds (+/-) to decimal, fractional, and implied probability",
      fields: [
        {
          name: "americanOdds",
          label: "American Odds (e.g. -110 or +250)",
          type: "number",
          placeholder: "e.g. -110",
        },
        {
          name: "betAmount",
          label: "Bet Amount ($)",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          defaultValue: 100,
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const american = inputs.americanOdds as number;
        const bet = (inputs.betAmount as number) || 100;
        if (american === undefined || american === 0) return null;

        let decimalOdds: number;
        let impliedProb: number;
        let profit: number;

        if (american > 0) {
          decimalOdds = (american / 100) + 1;
          impliedProb = 100 / (american + 100);
          profit = bet * (american / 100);
        } else {
          const absAmerican = Math.abs(american);
          decimalOdds = (100 / absAmerican) + 1;
          impliedProb = absAmerican / (absAmerican + 100);
          profit = bet * (100 / absAmerican);
        }

        const totalPayout = bet + profit;

        // Convert to fractional
        const fractNum = Math.round((decimalOdds - 1) * 100);
        const fractDen = 100;
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(Math.abs(fractNum), fractDen);
        const fracStr = `${fractNum / g}/${fractDen / g}`;

        return {
          primary: { label: "Potential Payout", value: "$" + formatNumber(totalPayout, 2) },
          details: [
            { label: "American Odds", value: (american > 0 ? "+" : "") + american },
            { label: "Decimal Odds", value: formatNumber(decimalOdds, 3) },
            { label: "Fractional Odds", value: fracStr },
            { label: "Implied Probability", value: formatNumber(impliedProb * 100, 2) + "%" },
            { label: "Bet Amount", value: "$" + formatNumber(bet, 2) },
            { label: "Profit (if win)", value: "$" + formatNumber(profit, 2) },
            { label: "Total Payout (if win)", value: "$" + formatNumber(totalPayout, 2) },
            { label: "ROI (if win)", value: formatNumber((profit / bet) * 100, 1) + "%" },
          ],
        };
      },
    },
    {
      id: "decimal-odds",
      name: "Decimal Odds Converter",
      description: "Convert decimal odds to American, fractional, and probability",
      fields: [
        {
          name: "decimalOdds",
          label: "Decimal Odds",
          type: "number",
          placeholder: "e.g. 2.50",
          min: 1.01,
          step: 0.01,
        },
        {
          name: "betAmount",
          label: "Bet Amount ($)",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          defaultValue: 100,
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const decimal = inputs.decimalOdds as number;
        const bet = (inputs.betAmount as number) || 100;
        if (!decimal || decimal <= 1) return null;

        const impliedProb = 1 / decimal;
        const profit = bet * (decimal - 1);
        const totalPayout = bet * decimal;

        let american: number;
        if (decimal >= 2) {
          american = Math.round((decimal - 1) * 100);
        } else {
          american = Math.round(-100 / (decimal - 1));
        }

        const fractNum = Math.round((decimal - 1) * 100);
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(Math.abs(fractNum), 100);
        const fracStr = `${fractNum / g}/${100 / g}`;

        return {
          primary: { label: "Potential Payout", value: "$" + formatNumber(totalPayout, 2) },
          details: [
            { label: "Decimal Odds", value: formatNumber(decimal, 3) },
            { label: "American Odds", value: (american > 0 ? "+" : "") + american },
            { label: "Fractional Odds", value: fracStr },
            { label: "Implied Probability", value: formatNumber(impliedProb * 100, 2) + "%" },
            { label: "Bet Amount", value: "$" + formatNumber(bet, 2) },
            { label: "Profit (if win)", value: "$" + formatNumber(profit, 2) },
          ],
        };
      },
    },
    {
      id: "vig-calculator",
      name: "Vig / Juice Calculator",
      description: "Calculate the sportsbook's edge (vig/juice) from a two-sided market",
      fields: [
        {
          name: "odds1",
          label: "Team/Side 1 American Odds",
          type: "number",
          placeholder: "e.g. -110",
        },
        {
          name: "odds2",
          label: "Team/Side 2 American Odds",
          type: "number",
          placeholder: "e.g. -110",
        },
      ],
      calculate: (inputs) => {
        const odds1 = inputs.odds1 as number;
        const odds2 = inputs.odds2 as number;
        if (!odds1 || !odds2) return null;

        const impliedProb = (american: number): number => {
          if (american > 0) return 100 / (american + 100);
          return Math.abs(american) / (Math.abs(american) + 100);
        };

        const p1 = impliedProb(odds1);
        const p2 = impliedProb(odds2);
        const totalImplied = p1 + p2;
        const vig = totalImplied - 1;
        const trueP1 = p1 / totalImplied;
        const trueP2 = p2 / totalImplied;

        // No-vig fair odds
        const fairDecimal1 = 1 / trueP1;
        const fairDecimal2 = 1 / trueP2;

        return {
          primary: { label: "Vig / Juice", value: formatNumber(vig * 100, 2) + "%" },
          details: [
            { label: "Side 1 Implied Prob", value: formatNumber(p1 * 100, 2) + "%" },
            { label: "Side 2 Implied Prob", value: formatNumber(p2 * 100, 2) + "%" },
            { label: "Total Implied Prob", value: formatNumber(totalImplied * 100, 2) + "%" },
            { label: "Overround (vig)", value: formatNumber(vig * 100, 2) + "%" },
            { label: "Side 1 True Probability", value: formatNumber(trueP1 * 100, 2) + "%" },
            { label: "Side 2 True Probability", value: formatNumber(trueP2 * 100, 2) + "%" },
            { label: "Side 1 Fair Decimal Odds", value: formatNumber(fairDecimal1, 3) },
            { label: "Side 2 Fair Decimal Odds", value: formatNumber(fairDecimal2, 3) },
          ],
          note: "The vig represents the sportsbook's built-in edge. Standard vig on a -110/-110 market is ~4.5%. Lower vig means better value for bettors.",
        };
      },
    },
  ],
  relatedSlugs: ["parlay-calculator", "lottery-payout-calculator", "probability-calculator"],
  faq: [
    {
      question: "What do American odds mean?",
      answer:
        "Negative American odds (e.g., -150) show how much you must bet to win $100. Positive odds (e.g., +200) show how much you win on a $100 bet. -150 means bet $150 to profit $100. +200 means a $100 bet profits $200.",
    },
    {
      question: "How do I convert American odds to implied probability?",
      answer:
        "For negative odds: Implied % = |odds| / (|odds| + 100). For positive odds: Implied % = 100 / (odds + 100). Example: -150 = 150/250 = 60%. +200 = 100/300 = 33.3%.",
    },
    {
      question: "What is the vig or juice?",
      answer:
        "The vig (vigorish) or juice is the sportsbook's commission built into the odds. In a fair coin flip, both sides would be +100. Instead, books offer -110 on each side. The combined implied probability exceeds 100%, and the excess is the vig (about 4.5% for -110/-110).",
    },
  ],
  formula:
    "Positive: Decimal = (American/100) + 1 | Negative: Decimal = (100/|American|) + 1 | Implied Prob = 1 / Decimal | Vig = Sum of implied probs - 1",
};
