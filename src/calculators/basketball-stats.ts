import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballStatsCalculator: CalculatorDefinition = {
  slug: "basketball-stats-calculator",
  title: "Basketball Stats Calculator",
  description:
    "Free basketball stats calculator. Calculate per-game averages for points, rebounds, assists, and a simplified Player Efficiency Rating (PER).",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "basketball stats",
    "per game average",
    "PER",
    "player efficiency",
    "NBA stats",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Basketball Stats",
      fields: [
        {
          name: "points",
          label: "Total Points",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "rebounds",
          label: "Total Rebounds",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "assists",
          label: "Total Assists",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "games",
          label: "Games Played",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "steals",
          label: "Total Steals (optional)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "blocks",
          label: "Total Blocks (optional)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "turnovers",
          label: "Total Turnovers (optional)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const points = inputs.points as number;
        const rebounds = inputs.rebounds as number;
        const assists = inputs.assists as number;
        const games = inputs.games as number;
        const steals = (inputs.steals as number) || 0;
        const blocks = (inputs.blocks as number) || 0;
        const turnovers = (inputs.turnovers as number) || 0;

        if (!games || games <= 0) return null;
        if (points === undefined || points === null) return null;

        const ppg = points / games;
        const rpg = (rebounds || 0) / games;
        const apg = (assists || 0) / games;
        const spg = steals / games;
        const bpg = blocks / games;
        const topg = turnovers / games;

        // Simplified PER estimation
        // PER (simplified) = (Points + Rebounds + Assists + Steals + Blocks - Turnovers) / Games
        const simplifiedPER =
          (points +
            (rebounds || 0) +
            (assists || 0) +
            steals +
            blocks -
            turnovers) /
          games;

        let perRating = "";
        if (simplifiedPER >= 30) perRating = "MVP Level";
        else if (simplifiedPER >= 25) perRating = "All-Star";
        else if (simplifiedPER >= 20) perRating = "Above Average";
        else if (simplifiedPER >= 15) perRating = "Average";
        else if (simplifiedPER >= 10) perRating = "Below Average";
        else perRating = "Bench Player";

        return {
          primary: {
            label: "Points per Game",
            value: formatNumber(ppg, 1),
          },
          details: [
            { label: "PPG (Points)", value: formatNumber(ppg, 1) },
            { label: "RPG (Rebounds)", value: formatNumber(rpg, 1) },
            { label: "APG (Assists)", value: formatNumber(apg, 1) },
            { label: "SPG (Steals)", value: formatNumber(spg, 1) },
            { label: "BPG (Blocks)", value: formatNumber(bpg, 1) },
            { label: "TOPG (Turnovers)", value: formatNumber(topg, 1) },
            {
              label: "Games Played",
              value: formatNumber(games, 0),
            },
            {
              label: "Simplified PER",
              value: formatNumber(simplifiedPER, 1),
            },
            { label: "PER Rating", value: perRating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["soccer-stats-calculator", "quarterback-rating-calculator"],
  faq: [
    {
      question: "What are per-game averages?",
      answer:
        "Per-game averages are calculated by dividing total statistics by the number of games played. For example, PPG = Total Points / Games Played.",
    },
    {
      question: "What is PER?",
      answer:
        "Player Efficiency Rating (PER) is a measure of a player's overall efficiency. The simplified version here sums positive stats (points, rebounds, assists, steals, blocks) and subtracts turnovers, divided by games. The official NBA PER is more complex.",
    },
  ],
  formula:
    "PPG = Points / Games. RPG = Rebounds / Games. APG = Assists / Games. Simplified PER = (PTS + REB + AST + STL + BLK - TO) / Games.",
};
