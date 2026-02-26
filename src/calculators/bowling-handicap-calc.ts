import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bowlingHandicapCalculator: CalculatorDefinition = {
  slug: "bowling-handicap-calculator",
  title: "Bowling Handicap Calculator",
  description: "Free bowling handicap calculator. Compute your USBC bowling handicap based on your average score, basis score, and handicap percentage factor.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bowling handicap calculator", "usbc handicap", "bowling average", "league handicap", "bowling score calculator"],
  variants: [
    {
      id: "standard",
      name: "Standard Handicap",
      description: "Calculate your bowling handicap from your average and league settings",
      fields: [
        { name: "average", label: "Your Bowling Average", type: "number", placeholder: "e.g. 150", min: 0, max: 300 },
        { name: "basisScore", label: "Basis Score", type: "number", placeholder: "e.g. 220", min: 0, max: 300, defaultValue: 220 },
        { name: "percentage", label: "Handicap Percentage (%)", type: "number", placeholder: "e.g. 90", min: 0, max: 100, defaultValue: 90 },
      ],
      calculate: (inputs) => {
        const avg = parseFloat(inputs.average as string);
        const basis = parseFloat(inputs.basisScore as string);
        const pct = parseFloat(inputs.percentage as string);
        if (isNaN(avg) || isNaN(basis) || isNaN(pct)) return null;
        if (avg >= basis) {
          return {
            primary: { label: "Handicap", value: "0" },
            details: [
              { label: "Your Average", value: formatNumber(avg, 0) },
              { label: "Basis Score", value: formatNumber(basis, 0) },
              { label: "Handicap %", value: `${formatNumber(pct, 0)}%` },
            ],
            note: "Your average meets or exceeds the basis score, so no handicap is applied.",
          };
        }
        const handicap = Math.floor((basis - avg) * (pct / 100));
        const handicapScore = avg + handicap;
        return {
          primary: { label: "Your Handicap", value: formatNumber(handicap, 0) },
          details: [
            { label: "Your Average", value: formatNumber(avg, 0) },
            { label: "Basis Score", value: formatNumber(basis, 0) },
            { label: "Handicap %", value: `${formatNumber(pct, 0)}%` },
            { label: "Adjusted Score (Avg + Handicap)", value: formatNumber(handicapScore, 0) },
            { label: "Difference (Basis - Avg)", value: formatNumber(basis - avg, 0) },
          ],
        };
      },
    },
    {
      id: "from-games",
      name: "From Game Scores",
      description: "Calculate your average and handicap from individual game scores",
      fields: [
        { name: "game1", label: "Game 1 Score", type: "number", placeholder: "e.g. 145", min: 0, max: 300 },
        { name: "game2", label: "Game 2 Score", type: "number", placeholder: "e.g. 160", min: 0, max: 300 },
        { name: "game3", label: "Game 3 Score", type: "number", placeholder: "e.g. 138", min: 0, max: 300 },
        { name: "basisScore", label: "Basis Score", type: "number", placeholder: "e.g. 220", defaultValue: 220 },
        { name: "percentage", label: "Handicap Percentage (%)", type: "number", placeholder: "e.g. 90", defaultValue: 90 },
      ],
      calculate: (inputs) => {
        const g1 = parseFloat(inputs.game1 as string);
        const g2 = parseFloat(inputs.game2 as string);
        const g3 = parseFloat(inputs.game3 as string);
        const basis = parseFloat(inputs.basisScore as string);
        const pct = parseFloat(inputs.percentage as string);
        if (isNaN(g1) || isNaN(g2) || isNaN(g3) || isNaN(basis) || isNaN(pct)) return null;
        const avg = (g1 + g2 + g3) / 3;
        const handicap = avg >= basis ? 0 : Math.floor((basis - avg) * (pct / 100));
        const series = g1 + g2 + g3;
        const handicapSeries = series + handicap * 3;
        return {
          primary: { label: "Your Handicap", value: formatNumber(handicap, 0) },
          details: [
            { label: "Calculated Average", value: formatNumber(avg, 1) },
            { label: "Scratch Series", value: formatNumber(series, 0) },
            { label: "Handicap Series", value: formatNumber(handicapSeries, 0) },
            { label: "Best Game", value: formatNumber(Math.max(g1, g2, g3), 0) },
            { label: "Lowest Game", value: formatNumber(Math.min(g1, g2, g3), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dart-score-calculator", "calorie-calculator", "bmi-calculator"],
  faq: [
    { question: "How is a bowling handicap calculated?", answer: "The standard formula is: Handicap = (Basis Score - Your Average) x Handicap Percentage. Most leagues use a basis of 210-230 and a percentage of 80-100%. The result is rounded down (floored) to a whole number." },
    { question: "What is a good bowling average?", answer: "A beginner averages 100-130, an intermediate bowler 130-170, an advanced bowler 170-200, and a professional bowler typically averages 200+. The basis score is usually set above the highest average in the league." },
    { question: "Why do bowling leagues use handicaps?", answer: "Handicaps level the playing field so bowlers of different skill levels can compete fairly. A higher handicap is given to bowlers with lower averages, allowing them to be competitive against more skilled bowlers." },
  ],
  formula: "Handicap = floor((Basis Score - Average) x (Percentage / 100))",
};
