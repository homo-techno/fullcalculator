import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballPerCalculator: CalculatorDefinition = {
  slug: "basketball-per-calculator",
  title: "Basketball PER Calculator",
  description: "Free basketball PER calculator. Calculate a player's Player Efficiency Rating from their game statistics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["basketball per calculator", "player efficiency rating", "nba per", "basketball statistics", "per formula"],
  variants: [
    {
      id: "simplified",
      name: "Simplified PER",
      description: "Simplified PER estimate from basic stats",
      fields: [
        { name: "points", label: "Points", type: "number", placeholder: "e.g. 25" },
        { name: "rebounds", label: "Total Rebounds", type: "number", placeholder: "e.g. 8" },
        { name: "assists", label: "Assists", type: "number", placeholder: "e.g. 5" },
        { name: "steals", label: "Steals", type: "number", placeholder: "e.g. 1.5", step: 0.1 },
        { name: "blocks", label: "Blocks", type: "number", placeholder: "e.g. 1", step: 0.1 },
        { name: "turnovers", label: "Turnovers", type: "number", placeholder: "e.g. 3", step: 0.1 },
        { name: "fgMissed", label: "FG Missed", type: "number", placeholder: "e.g. 8" },
        { name: "ftMissed", label: "FT Missed", type: "number", placeholder: "e.g. 2" },
        { name: "minutesPlayed", label: "Minutes Played", type: "number", placeholder: "e.g. 36", step: 0.1 },
      ],
      calculate: (inputs) => {
        const pts = inputs.points as number;
        const reb = inputs.rebounds as number;
        const ast = inputs.assists as number;
        const stl = inputs.steals as number;
        const blk = inputs.blocks as number;
        const tov = inputs.turnovers as number;
        const fgm = inputs.fgMissed as number;
        const ftm = inputs.ftMissed as number;
        const min = inputs.minutesPlayed as number;
        if (pts === undefined || !min || min <= 0) return null;
        const positives = (pts || 0) + (reb || 0) * 1.2 + (ast || 0) * 1.5 + (stl || 0) * 2 + (blk || 0) * 2;
        const negatives = (tov || 0) * 1.5 + (fgm || 0) * 0.5 + (ftm || 0) * 0.5;
        const perMinute = (positives - negatives) / min;
        const per = perMinute * 48 * (1 / 1.5);
        let rating = "Poor";
        if (per >= 27) rating = "MVP Level";
        else if (per >= 22) rating = "All-Star";
        else if (per >= 18) rating = "Above Average Starter";
        else if (per >= 15) rating = "Average";
        else if (per >= 11) rating = "Below Average";
        return {
          primary: { label: "Estimated PER", value: formatNumber(per, 1) },
          details: [
            { label: "Positive Contributions", value: formatNumber(positives, 1) },
            { label: "Negative Contributions", value: formatNumber(negatives, 1) },
            { label: "Net Per Minute", value: formatNumber(perMinute, 2) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["basketball-true-shooting-calculator", "basketball-pace-calculator"],
  faq: [
    { question: "What is PER in basketball?", answer: "PER (Player Efficiency Rating) is a per-minute rating developed by John Hollinger that sums up a player's positive and negative contributions. The league average PER is always 15.0." },
    { question: "What is a good PER?", answer: "A PER of 15 is league average. Above 20 is All-Star level, above 25 is MVP caliber, and the best seasons ever are around 30+." },
  ],
  formula: "PER = (Positive Stats - Negative Stats) / Minutes * 48 (simplified)",
};