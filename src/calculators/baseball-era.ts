import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballEraCalculator: CalculatorDefinition = {
  slug: "baseball-era-calculator",
  title: "Baseball ERA Calculator",
  description: "Free baseball ERA calculator. Calculate a pitcher's Earned Run Average from earned runs and innings pitched.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseball era calculator", "earned run average", "pitcher era", "pitching stats", "baseball statistics"],
  variants: [
    {
      id: "standard",
      name: "Standard ERA",
      description: "ERA = (Earned Runs / Innings Pitched) x 9",
      fields: [
        { name: "earnedRuns", label: "Earned Runs", type: "number", placeholder: "e.g. 30" },
        { name: "inningsPitched", label: "Innings Pitched", type: "number", placeholder: "e.g. 100", step: 0.1 },
      ],
      calculate: (inputs) => {
        const er = inputs.earnedRuns as number;
        const ip = inputs.inningsPitched as number;
        if (er === undefined || !ip || ip <= 0) return null;
        const era = (er / ip) * 9;
        let rating = "Poor";
        if (era < 2.0) rating = "Elite";
        else if (era < 3.0) rating = "Excellent";
        else if (era < 3.5) rating = "Above Average";
        else if (era < 4.0) rating = "Average";
        else if (era < 5.0) rating = "Below Average";
        return {
          primary: { label: "ERA", value: formatNumber(era, 2) },
          details: [
            { label: "Earned Runs", value: formatNumber(er) },
            { label: "Innings Pitched", value: formatNumber(ip, 1) },
            { label: "Earned Runs per Inning", value: formatNumber(er / ip, 3) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "era-plus",
      name: "ERA+ (Adjusted ERA)",
      description: "ERA+ = (League ERA / Pitcher ERA) x 100",
      fields: [
        { name: "pitcherEra", label: "Pitcher ERA", type: "number", placeholder: "e.g. 3.20", step: 0.01 },
        { name: "leagueEra", label: "League ERA", type: "number", placeholder: "e.g. 4.00", step: 0.01 },
      ],
      calculate: (inputs) => {
        const pEra = inputs.pitcherEra as number;
        const lEra = inputs.leagueEra as number;
        if (!pEra || pEra <= 0 || !lEra || lEra <= 0) return null;
        const eraPlus = (lEra / pEra) * 100;
        return {
          primary: { label: "ERA+", value: formatNumber(eraPlus, 0) },
          details: [
            { label: "Pitcher ERA", value: formatNumber(pEra, 2) },
            { label: "League ERA", value: formatNumber(lEra, 2) },
            { label: "Above/Below Average", value: eraPlus >= 100 ? formatNumber(eraPlus - 100, 0) + "% better" : formatNumber(100 - eraPlus, 0) + "% worse" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baseball-obp-calculator", "baseball-ops-calculator", "baseball-slugging-calculator"],
  faq: [
    { question: "What is ERA in baseball?", answer: "ERA (Earned Run Average) is the average number of earned runs a pitcher allows per nine innings pitched. It is calculated as (Earned Runs / Innings Pitched) x 9. A lower ERA indicates better pitching performance." },
    { question: "What is a good ERA?", answer: "In modern MLB, an ERA below 3.00 is considered excellent, 3.00-3.50 is above average, 3.50-4.00 is average, and above 4.50 is below average." },
  ],
  formula: "ERA = (Earned Runs / Innings Pitched) x 9",
};