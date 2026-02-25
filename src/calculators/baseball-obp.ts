import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballObpCalculator: CalculatorDefinition = {
  slug: "baseball-obp-calculator",
  title: "Baseball OBP Calculator",
  description: "Free baseball OBP calculator. Calculate a batter's On-Base Percentage from hits, walks, hit-by-pitch, at-bats, and sacrifice flies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseball obp calculator", "on-base percentage", "batting stats", "baseball statistics", "obp formula"],
  variants: [
    {
      id: "standard",
      name: "Standard OBP",
      description: "OBP = (H + BB + HBP) / (AB + BB + HBP + SF)",
      fields: [
        { name: "hits", label: "Hits (H)", type: "number", placeholder: "e.g. 150" },
        { name: "walks", label: "Walks (BB)", type: "number", placeholder: "e.g. 60" },
        { name: "hbp", label: "Hit By Pitch (HBP)", type: "number", placeholder: "e.g. 5", defaultValue: 0 },
        { name: "atBats", label: "At Bats (AB)", type: "number", placeholder: "e.g. 500" },
        { name: "sacFlies", label: "Sacrifice Flies (SF)", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const h = inputs.hits as number;
        const bb = inputs.walks as number;
        const hbp = inputs.hbp as number;
        const ab = inputs.atBats as number;
        const sf = inputs.sacFlies as number;
        if (h === undefined || bb === undefined || ab === undefined) return null;
        const denominator = ab + bb + (hbp || 0) + (sf || 0);
        if (denominator <= 0) return null;
        const obp = (h + bb + (hbp || 0)) / denominator;
        let rating = "Poor";
        if (obp >= 0.400) rating = "Elite";
        else if (obp >= 0.360) rating = "Excellent";
        else if (obp >= 0.330) rating = "Above Average";
        else if (obp >= 0.310) rating = "Average";
        else if (obp >= 0.290) rating = "Below Average";
        return {
          primary: { label: "OBP", value: formatNumber(obp, 3) },
          details: [
            { label: "Times on Base", value: formatNumber(h + bb + (hbp || 0)) },
            { label: "Plate Appearances", value: formatNumber(denominator) },
            { label: "Batting Average", value: formatNumber(h / ab, 3) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baseball-era-calculator", "baseball-ops-calculator", "baseball-slugging-calculator"],
  faq: [
    { question: "What is OBP in baseball?", answer: "OBP (On-Base Percentage) measures how frequently a batter reaches base. It includes hits, walks, and hit-by-pitches divided by plate appearances (excluding sacrifices other than sac flies)." },
    { question: "What is a good OBP?", answer: "In MLB, an OBP above .360 is excellent, .330-.360 is above average, .310-.330 is average, and below .290 is poor." },
  ],
  formula: "OBP = (H + BB + HBP) / (AB + BB + HBP + SF)",
};