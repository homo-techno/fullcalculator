import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hockeySavePctCalculator: CalculatorDefinition = {
  slug: "hockey-save-pct-calculator",
  title: "Hockey Save Percentage Calculator",
  description: "Free hockey save percentage calculator. Calculate goaltender save percentage and goals against average.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hockey save percentage", "sv% calculator", "goaltender stats", "nhl goalie stats", "save percentage formula"],
  variants: [
    {
      id: "standard",
      name: "Save Percentage and GAA",
      description: "SV% = Saves / Shots Against",
      fields: [
        { name: "shotsAgainst", label: "Shots Against", type: "number", placeholder: "e.g. 30" },
        { name: "goalsAgainst", label: "Goals Against", type: "number", placeholder: "e.g. 2" },
        { name: "minutesPlayed", label: "Minutes Played", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const sa = inputs.shotsAgainst as number;
        const ga = inputs.goalsAgainst as number;
        const min = (inputs.minutesPlayed as number) || 60;
        if (sa === undefined || ga === undefined || sa <= 0) return null;
        const saves = sa - ga;
        const svPct = saves / sa;
        const gaa = (ga / min) * 60;
        let rating = "Poor";
        if (svPct >= 0.925) rating = "Elite";
        else if (svPct >= 0.915) rating = "Above Average";
        else if (svPct >= 0.905) rating = "Average";
        else if (svPct >= 0.890) rating = "Below Average";
        return {
          primary: { label: "Save %", value: formatNumber(svPct, 3) },
          details: [
            { label: "Saves", value: formatNumber(saves) },
            { label: "Shots Against", value: formatNumber(sa) },
            { label: "Goals Against", value: formatNumber(ga) },
            { label: "GAA (per 60 min)", value: formatNumber(gaa, 2) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hockey-corsi-calculator", "sports-betting-ev-calculator"],
  faq: [
    { question: "What is save percentage in hockey?", answer: "Save percentage (SV%) is the ratio of saves to total shots on goal faced by a goaltender. It is the most commonly used statistic to evaluate goaltender performance." },
    { question: "What is a good save percentage?", answer: "In the NHL, a save percentage above .920 is considered very good, .910-.920 is average, and below .900 is poor." },
  ],
  formula: "SV% = (Shots Against - Goals Against) / Shots Against",
};