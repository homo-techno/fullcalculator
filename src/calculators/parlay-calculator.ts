import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parlayCalculator: CalculatorDefinition = {
  slug: "parlay-calculator",
  title: "Parlay Calculator",
  description:
    "Free parlay bet calculator. Calculate parlay payouts, odds, and implied probability for 2 to 10 leg parlays with American or decimal odds.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "parlay calculator",
    "parlay payout",
    "accumulator calculator",
    "multi bet calculator",
    "parlay odds",
    "combo bet",
    "sports parlay",
  ],
  variants: [
    {
      id: "american-parlay",
      name: "Parlay (American Odds)",
      description: "Calculate parlay payout from American odds for each leg",
      fields: [
        {
          name: "betAmount",
          label: "Bet Amount ($)",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 1,
          defaultValue: 100,
        },
        {
          name: "leg1",
          label: "Leg 1 American Odds",
          type: "number",
          placeholder: "e.g. -110",
        },
        {
          name: "leg2",
          label: "Leg 2 American Odds",
          type: "number",
          placeholder: "e.g. +150",
        },
        {
          name: "leg3",
          label: "Leg 3 American Odds (0 = skip)",
          type: "number",
          placeholder: "e.g. -120",
          defaultValue: 0,
        },
        {
          name: "leg4",
          label: "Leg 4 American Odds (0 = skip)",
          type: "number",
          placeholder: "e.g. +200",
          defaultValue: 0,
        },
        {
          name: "leg5",
          label: "Leg 5 American Odds (0 = skip)",
          type: "number",
          placeholder: "e.g. -150",
          defaultValue: 0,
        },
        {
          name: "leg6",
          label: "Leg 6 American Odds (0 = skip)",
          type: "number",
          placeholder: "0",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const bet = (inputs.betAmount as number) || 100;
        const legs: number[] = [];

        for (let i = 1; i <= 6; i++) {
          const odds = inputs[`leg${i}`] as number;
          if (odds && odds !== 0) legs.push(odds);
        }

        if (legs.length < 2) return null;

        const toDecimal = (american: number): number => {
          if (american > 0) return (american / 100) + 1;
          return (100 / Math.abs(american)) + 1;
        };

        const toImpliedProb = (american: number): number => {
          if (american > 0) return 100 / (american + 100);
          return Math.abs(american) / (Math.abs(american) + 100);
        };

        let combinedDecimal = 1;
        let combinedProb = 1;
        const details: { label: string; value: string }[] = [];

        legs.forEach((odds, idx) => {
          const dec = toDecimal(odds);
          const prob = toImpliedProb(odds);
          combinedDecimal *= dec;
          combinedProb *= prob;
          details.push({
            label: `Leg ${idx + 1}`,
            value: `${odds > 0 ? "+" : ""}${odds} (${formatNumber(dec, 3)} decimal, ${formatNumber(prob * 100, 1)}%)`,
          });
        });

        const totalPayout = bet * combinedDecimal;
        const profit = totalPayout - bet;

        // Convert combined decimal back to American
        let combinedAmerican: number;
        if (combinedDecimal >= 2) {
          combinedAmerican = Math.round((combinedDecimal - 1) * 100);
        } else {
          combinedAmerican = Math.round(-100 / (combinedDecimal - 1));
        }

        details.push({ label: "Number of Legs", value: `${legs.length}` });
        details.push({ label: "Combined Decimal Odds", value: formatNumber(combinedDecimal, 3) });
        details.push({ label: "Combined American Odds", value: (combinedAmerican > 0 ? "+" : "") + combinedAmerican });
        details.push({ label: "Implied Win Probability", value: formatNumber(combinedProb * 100, 4) + "%" });
        details.push({ label: "Bet Amount", value: "$" + formatNumber(bet, 2) });
        details.push({ label: "Profit (if all win)", value: "$" + formatNumber(profit, 2) });
        details.push({ label: "Total Payout", value: "$" + formatNumber(totalPayout, 2) });

        return {
          primary: { label: "Parlay Payout", value: "$" + formatNumber(totalPayout, 2) },
          details,
        };
      },
    },
    {
      id: "round-robin",
      name: "Round Robin Calculator",
      description: "Calculate round robin (all possible 2-leg parlays) from your selections",
      fields: [
        {
          name: "betPerParlay",
          label: "Bet per Parlay ($)",
          type: "number",
          placeholder: "e.g. 10",
          prefix: "$",
          min: 1,
          defaultValue: 10,
        },
        {
          name: "sel1",
          label: "Selection 1 Odds (American)",
          type: "number",
          placeholder: "e.g. -110",
        },
        {
          name: "sel2",
          label: "Selection 2 Odds (American)",
          type: "number",
          placeholder: "e.g. +120",
        },
        {
          name: "sel3",
          label: "Selection 3 Odds (American)",
          type: "number",
          placeholder: "e.g. -130",
        },
      ],
      calculate: (inputs) => {
        const betPer = (inputs.betPerParlay as number) || 10;
        const sels: number[] = [];

        for (let i = 1; i <= 3; i++) {
          const odds = inputs[`sel${i}`] as number;
          if (odds && odds !== 0) sels.push(odds);
        }

        if (sels.length < 3) return null;

        const toDecimal = (american: number): number => {
          if (american > 0) return (american / 100) + 1;
          return (100 / Math.abs(american)) + 1;
        };

        // All 2-leg combos from 3 selections
        const combos = [
          [0, 1], [0, 2], [1, 2],
        ];

        const details: { label: string; value: string }[] = [];
        let totalInvested = 0;
        let totalPayoutAllWin = 0;

        combos.forEach((combo, idx) => {
          const dec1 = toDecimal(sels[combo[0]]);
          const dec2 = toDecimal(sels[combo[1]]);
          const parlayDecimal = dec1 * dec2;
          const payout = betPer * parlayDecimal;
          totalInvested += betPer;
          totalPayoutAllWin += payout;

          details.push({
            label: `Parlay ${idx + 1} (Sel ${combo[0] + 1} + Sel ${combo[1] + 1})`,
            value: `$${formatNumber(payout, 2)} payout (${formatNumber(parlayDecimal, 3)}x)`,
          });
        });

        const profitAllWin = totalPayoutAllWin - totalInvested;

        details.push({ label: "Total Invested", value: "$" + formatNumber(totalInvested, 2) + ` (${combos.length} parlays x $${betPer})` });
        details.push({ label: "Total Payout (all win)", value: "$" + formatNumber(totalPayoutAllWin, 2) });
        details.push({ label: "Profit (all win)", value: "$" + formatNumber(profitAllWin, 2) });

        return {
          primary: { label: "Total Payout (all 3 win)", value: "$" + formatNumber(totalPayoutAllWin, 2) },
          details,
          note: "Round robin creates all possible 2-leg parlays from your selections. You can profit even if one selection loses.",
        };
      },
    },
  ],
  relatedSlugs: ["sports-betting-odds-calculator", "lottery-payout-calculator", "probability-calculator"],
  faq: [
    {
      question: "What is a parlay bet?",
      answer:
        "A parlay combines multiple individual bets (legs) into one bet. All legs must win for the parlay to pay out. The odds multiply together, creating much higher potential payouts but lower probability. A 3-leg parlay at -110 each pays about +596.",
    },
    {
      question: "How is parlay payout calculated?",
      answer:
        "Convert each leg to decimal odds, multiply them together, then multiply by your bet amount. Example: Leg 1 (-110 = 1.909), Leg 2 (+150 = 2.500). Combined: 1.909 x 2.500 = 4.773. A $100 bet pays $477.30.",
    },
    {
      question: "What is a round robin bet?",
      answer:
        "A round robin creates all possible parlay combinations of a certain size from your selections. With 3 picks and 2-leg parlays, you get 3 separate parlays. This provides insurance because you can still profit even if one pick loses.",
    },
  ],
  formula:
    "Parlay Decimal = Leg1 Decimal x Leg2 Decimal x ... LegN Decimal | Payout = Bet x Parlay Decimal | Implied Prob = Prob1 x Prob2 x ... ProbN",
};
