import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fantasyTradeCalculator: CalculatorDefinition = {
  slug: "fantasy-trade-calculator",
  title: "Fantasy Football Trade Analyzer",
  description: "Free fantasy football trade analyzer. Evaluate trades by comparing player values, projections, and positional scarcity to determine trade fairness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fantasy trade calculator", "fantasy football trade", "trade analyzer", "player value calculator", "fantasy sports"],
  variants: [
    {
      id: "two-player",
      name: "1-for-1 Trade",
      description: "Compare two players in a straight-up trade",
      fields: [
        { name: "player1Points", label: "Your Player's Projected Points", type: "number", placeholder: "e.g. 220" },
        { name: "player1Position", label: "Your Player's Position", type: "select", options: [
          { label: "QB", value: "qb" },
          { label: "RB", value: "rb" },
          { label: "WR", value: "wr" },
          { label: "TE", value: "te" },
          { label: "K", value: "k" },
          { label: "DEF", value: "def" },
        ] },
        { name: "player2Points", label: "Their Player's Projected Points", type: "number", placeholder: "e.g. 200" },
        { name: "player2Position", label: "Their Player's Position", type: "select", options: [
          { label: "QB", value: "qb" },
          { label: "RB", value: "rb" },
          { label: "WR", value: "wr" },
          { label: "TE", value: "te" },
          { label: "K", value: "k" },
          { label: "DEF", value: "def" },
        ] },
        { name: "weeksLeft", label: "Weeks Remaining", type: "number", placeholder: "e.g. 10", min: 1, max: 17, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const p1Pts = parseFloat(inputs.player1Points as string);
        const p1Pos = inputs.player1Position as string;
        const p2Pts = parseFloat(inputs.player2Points as string);
        const p2Pos = inputs.player2Position as string;
        const weeks = parseFloat(inputs.weeksLeft as string);
        if (isNaN(p1Pts) || isNaN(p2Pts) || isNaN(weeks)) return null;

        const scarcity: Record<string, number> = { qb: 1.0, rb: 1.25, wr: 1.15, te: 1.2, k: 0.7, def: 0.75 };
        const p1Adj = p1Pts * (scarcity[p1Pos] || 1);
        const p2Adj = p2Pts * (scarcity[p2Pos] || 1);
        const diff = p2Adj - p1Adj;
        const pctDiff = ((p2Adj - p1Adj) / p1Adj) * 100;
        const weeklyGain = (p2Pts - p1Pts) / weeks;
        let verdict = "Even trade";
        if (pctDiff > 10) verdict = "You win this trade";
        else if (pctDiff < -10) verdict = "You lose this trade";

        return {
          primary: { label: "Trade Verdict", value: verdict },
          details: [
            { label: "Your Player Adj. Value", value: formatNumber(p1Adj, 1) },
            { label: "Their Player Adj. Value", value: formatNumber(p2Adj, 1) },
            { label: "Value Difference", value: formatNumber(diff, 1) },
            { label: "Percentage Difference", value: `${formatNumber(pctDiff, 1)}%` },
            { label: "Weekly Point Gain/Loss", value: formatNumber(weeklyGain, 2) },
            { label: "Remaining Season Impact", value: formatNumber(p2Pts - p1Pts, 1) },
          ],
        };
      },
    },
    {
      id: "multi-player",
      name: "2-for-1 Trade",
      description: "Evaluate a 2-for-1 trade with combined player values",
      fields: [
        { name: "give1Points", label: "Your Player 1 Projected Pts", type: "number", placeholder: "e.g. 150" },
        { name: "give2Points", label: "Your Player 2 Projected Pts", type: "number", placeholder: "e.g. 120" },
        { name: "getPoints", label: "Player You Receive Projected Pts", type: "number", placeholder: "e.g. 250" },
        { name: "waiverPoints", label: "Waiver Pickup Replacement Pts", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const g1 = parseFloat(inputs.give1Points as string);
        const g2 = parseFloat(inputs.give2Points as string);
        const get = parseFloat(inputs.getPoints as string);
        const waiver = parseFloat(inputs.waiverPoints as string);
        if (isNaN(g1) || isNaN(g2) || isNaN(get) || isNaN(waiver)) return null;

        const giveTotal = g1 + g2;
        const getTotal = get + waiver;
        const net = getTotal - giveTotal;
        const pctChange = (net / giveTotal) * 100;
        let verdict = "Even trade";
        if (pctChange > 5) verdict = "You win this trade";
        else if (pctChange < -5) verdict = "You lose this trade";

        return {
          primary: { label: "Trade Verdict", value: verdict },
          details: [
            { label: "Your Players Combined", value: formatNumber(giveTotal, 1) },
            { label: "Receive + Waiver Pickup", value: formatNumber(getTotal, 1) },
            { label: "Net Point Change", value: formatNumber(net, 1) },
            { label: "Roster Improvement %", value: `${formatNumber(pctChange, 1)}%` },
            { label: "Consolidation Bonus", value: get > g1 && get > g2 ? "Yes (stud acquired)" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dart-score-calculator", "bowling-handicap-calculator", "pickleball-rating-calculator"],
  faq: [
    { question: "How does positional scarcity affect trade value?", answer: "Running backs and tight ends are scarcer in fantasy football, so their value is weighted higher (1.25x and 1.2x respectively). Kickers and defenses are easily replaceable, so they carry lower multipliers." },
    { question: "Why consider 2-for-1 trades?", answer: "In 2-for-1 trades, the team receiving the single best player usually wins because consolidating talent into fewer roster spots opens space for waiver pickups and reduces start/sit decisions." },
  ],
  formula: "Adjusted Value = Projected Points x Position Scarcity Multiplier | Trade Diff = (Their Adj Value - Your Adj Value) / Your Adj Value x 100",
};
