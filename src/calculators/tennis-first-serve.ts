import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tennisFirstServeCalculator: CalculatorDefinition = {
  slug: "tennis-first-serve-calculator",
  title: "Tennis First Serve Percentage Calculator",
  description: "Free tennis first serve percentage calculator. Calculate first serve percentage, ace rate, and service game stats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tennis first serve percentage", "serve stats", "tennis statistics", "first serve calculator", "ace percentage"],
  variants: [
    {
      id: "standard",
      name: "First Serve Stats",
      description: "First Serve % = First Serves In / Total First Serves",
      fields: [
        { name: "firstServesIn", label: "First Serves In", type: "number", placeholder: "e.g. 55" },
        { name: "totalFirstServes", label: "Total First Serve Attempts", type: "number", placeholder: "e.g. 80" },
        { name: "firstServePointsWon", label: "Points Won on First Serve", type: "number", placeholder: "e.g. 42" },
        { name: "aces", label: "Aces", type: "number", placeholder: "e.g. 8", defaultValue: 0 },
        { name: "doubleFaults", label: "Double Faults", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const serveIn = inputs.firstServesIn as number;
        const total = inputs.totalFirstServes as number;
        const won = inputs.firstServePointsWon as number;
        const aces = (inputs.aces as number) || 0;
        const df = (inputs.doubleFaults as number) || 0;
        if (serveIn === undefined || !total || total <= 0) return null;
        const firstServePct = (serveIn / total) * 100;
        const winPct = serveIn > 0 && won !== undefined ? (won / serveIn) * 100 : 0;
        const acePct = (aces / total) * 100;
        let rating = "Poor";
        if (firstServePct >= 70) rating = "Excellent";
        else if (firstServePct >= 62) rating = "Above Average";
        else if (firstServePct >= 55) rating = "Average";
        else if (firstServePct >= 48) rating = "Below Average";
        return {
          primary: { label: "First Serve %", value: formatNumber(firstServePct, 1) + "%" },
          details: [
            { label: "1st Serve Points Won", value: won !== undefined ? formatNumber(winPct, 1) + "%" : "N/A" },
            { label: "Aces", value: formatNumber(aces) },
            { label: "Double Faults", value: formatNumber(df) },
            { label: "Ace Rate", value: formatNumber(acePct, 1) + "%" },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sports-betting-ev-calculator", "baseball-era-calculator"],
  faq: [
    { question: "What is a good first serve percentage?", answer: "In professional tennis, 60-65% is average, 65-70% is above average, and above 70% is excellent." },
    { question: "Why is first serve percentage important?", answer: "A higher first serve percentage means more chances to win points on the stronger first serve. Players typically win 70-80% of first serve points vs only 45-55% on second serve." },
  ],
  formula: "First Serve % = (First Serves In / Total First Serve Attempts) * 100",
};