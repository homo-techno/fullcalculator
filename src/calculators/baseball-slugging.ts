import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballSluggingCalculator: CalculatorDefinition = {
  slug: "baseball-slugging-calculator",
  title: "Slugging Percentage Calculator",
  description: "Free slugging percentage calculator. Calculate a batter slugging percentage from hits, doubles, triples, home runs, and at-bats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["slugging percentage calculator", "baseball slugging", "slg calculator", "total bases", "batting power"],
  variants: [
    {
      id: "standard",
      name: "Standard Slugging",
      description: "SLG = Total Bases / At Bats",
      fields: [
        { name: "singles", label: "Singles (1B)", type: "number", placeholder: "e.g. 90" },
        { name: "doubles", label: "Doubles (2B)", type: "number", placeholder: "e.g. 30" },
        { name: "triples", label: "Triples (3B)", type: "number", placeholder: "e.g. 5" },
        { name: "homeRuns", label: "Home Runs (HR)", type: "number", placeholder: "e.g. 25" },
        { name: "atBats", label: "At Bats (AB)", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const s = inputs.singles as number;
        const d = inputs.doubles as number;
        const t = inputs.triples as number;
        const hr = inputs.homeRuns as number;
        const ab = inputs.atBats as number;
        if (s === undefined || d === undefined || t === undefined || hr === undefined || !ab) return null;
        const totalBases = s + (d * 2) + (t * 3) + (hr * 4);
        const totalHits = s + d + t + hr;
        const slg = totalBases / ab;
        const battingAvg = totalHits / ab;
        const iso = slg - battingAvg;
        let rating = "Poor";
        if (slg >= 0.550) rating = "Elite";
        else if (slg >= 0.480) rating = "Excellent";
        else if (slg >= 0.430) rating = "Above Average";
        else if (slg >= 0.390) rating = "Average";
        else if (slg >= 0.350) rating = "Below Average";
        return {
          primary: { label: "Slugging %", value: formatNumber(slg, 3) },
          details: [
            { label: "Total Bases", value: formatNumber(totalBases) },
            { label: "Total Hits", value: formatNumber(totalHits) },
            { label: "Batting Average", value: formatNumber(battingAvg, 3) },
            { label: "Isolated Power (ISO)", value: formatNumber(iso, 3) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baseball-obp-calculator", "baseball-ops-calculator", "baseball-era-calculator"],
  faq: [
    { question: "What is slugging percentage?", answer: "Slugging percentage (SLG) measures a batter power by dividing total bases by at-bats. Singles count as 1 base, doubles as 2, triples as 3, and home runs as 4." },
    { question: "What is a good slugging percentage?", answer: "In MLB, a slugging percentage above .480 is excellent, .430-.480 is above average, .390-.430 is average, and below .350 is poor." },
  ],
  formula: "SLG = (1B + 2x2B + 3x3B + 4xHR) / AB",
};