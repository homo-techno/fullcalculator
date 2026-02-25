import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballTrueShootingCalculator: CalculatorDefinition = {
  slug: "basketball-true-shooting-calculator",
  title: "True Shooting Percentage Calculator",
  description: "Free true shooting percentage calculator. Calculate TS% accounting for field goals, three-pointers, and free throws.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["true shooting percentage", "ts% calculator", "basketball shooting efficiency", "nba ts%", "shooting stats"],
  variants: [
    {
      id: "standard",
      name: "Standard TS%",
      description: "TS% = Points / (2 * TSA)",
      fields: [
        { name: "points", label: "Total Points", type: "number", placeholder: "e.g. 25" },
        { name: "fga", label: "Field Goal Attempts (FGA)", type: "number", placeholder: "e.g. 18" },
        { name: "fta", label: "Free Throw Attempts (FTA)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const pts = inputs.points as number;
        const fga = inputs.fga as number;
        const fta = inputs.fta as number;
        if (pts === undefined || fga === undefined || fta === undefined) return null;
        const tsa = fga + 0.44 * fta;
        if (tsa <= 0) return null;
        const tsPercent = pts / (2 * tsa);
        let rating = "Poor";
        if (tsPercent >= 0.620) rating = "Elite";
        else if (tsPercent >= 0.580) rating = "Above Average";
        else if (tsPercent >= 0.540) rating = "Average";
        else if (tsPercent >= 0.500) rating = "Below Average";
        return {
          primary: { label: "TS%", value: formatNumber(tsPercent * 100, 1) + "%" },
          details: [
            { label: "True Shooting Attempts", value: formatNumber(tsa, 1) },
            { label: "Points per TSA", value: formatNumber(pts / tsa, 3) },
            { label: "Points", value: formatNumber(pts) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed Breakdown",
      description: "Calculate TS% with full shooting splits",
      fields: [
        { name: "fgm", label: "Field Goals Made", type: "number", placeholder: "e.g. 8" },
        { name: "fga", label: "Field Goal Attempts", type: "number", placeholder: "e.g. 18" },
        { name: "tpm", label: "Three-Pointers Made", type: "number", placeholder: "e.g. 3" },
        { name: "ftm", label: "Free Throws Made", type: "number", placeholder: "e.g. 4" },
        { name: "fta", label: "Free Throw Attempts", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const fgm = inputs.fgm as number;
        const fga = inputs.fga as number;
        const tpm = inputs.tpm as number;
        const ftm = inputs.ftm as number;
        const fta = inputs.fta as number;
        if (fgm === undefined || fga === undefined || fta === undefined) return null;
        const pts = (fgm * 2) + (tpm || 0) + (ftm || 0);
        const tsa = fga + 0.44 * fta;
        if (tsa <= 0) return null;
        const tsPercent = pts / (2 * tsa);
        const fgPercent = fga > 0 ? fgm / fga : 0;
        const ftPercent = fta > 0 ? (ftm || 0) / fta : 0;
        return {
          primary: { label: "TS%", value: formatNumber(tsPercent * 100, 1) + "%" },
          details: [
            { label: "Total Points", value: formatNumber(pts) },
            { label: "FG%", value: formatNumber(fgPercent * 100, 1) + "%" },
            { label: "FT%", value: formatNumber(ftPercent * 100, 1) + "%" },
            { label: "eFG%", value: formatNumber(((fgm + 0.5 * (tpm || 0)) / fga) * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["basketball-per-calculator", "basketball-pace-calculator"],
  faq: [
    { question: "What is True Shooting Percentage?", answer: "True Shooting Percentage (TS%) measures shooting efficiency by accounting for field goals, three-pointers, and free throws. It uses 0.44 as the FTA multiplier because not all free throws come from shooting fouls." },
    { question: "What is a good TS%?", answer: "The NBA average TS% is typically around 55-57%. Above 60% is very efficient, and above 65% is elite." },
  ],
  formula: "TS% = Points / (2 * (FGA + 0.44 * FTA))",
};