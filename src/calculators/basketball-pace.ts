import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const basketballPaceCalculator: CalculatorDefinition = {
  slug: "basketball-pace-calculator",
  title: "Basketball Pace Calculator",
  description: "Free basketball pace calculator. Calculate a team pace (possessions per 48 minutes) from game statistics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["basketball pace calculator", "possessions per game", "nba pace", "tempo calculator", "basketball analytics"],
  variants: [
    {
      id: "standard",
      name: "Standard Pace",
      description: "Pace = 48 * Possessions / Minutes",
      fields: [
        { name: "fga", label: "Field Goal Attempts", type: "number", placeholder: "e.g. 88" },
        { name: "fta", label: "Free Throw Attempts", type: "number", placeholder: "e.g. 22" },
        { name: "oreb", label: "Offensive Rebounds", type: "number", placeholder: "e.g. 10" },
        { name: "turnovers", label: "Turnovers", type: "number", placeholder: "e.g. 14" },
        { name: "minutesPlayed", label: "Team Minutes Played", type: "number", placeholder: "e.g. 240", defaultValue: 240 },
      ],
      calculate: (inputs) => {
        const fga = inputs.fga as number;
        const fta = inputs.fta as number;
        const oreb = inputs.oreb as number;
        const tov = inputs.turnovers as number;
        if (fga === undefined || fta === undefined || tov === undefined) return null;
        const min = (inputs.minutesPlayed as number) || 240;
        const possessions = fga + 0.44 * fta - (oreb || 0) + tov;
        const pace = 48 * (possessions / min) * 5;
        let tempo = "Slow";
        if (pace >= 102) tempo = "Very Fast";
        else if (pace >= 98) tempo = "Fast";
        else if (pace >= 95) tempo = "Average";
        else if (pace >= 92) tempo = "Below Average";
        return {
          primary: { label: "Pace", value: formatNumber(pace, 1) },
          details: [
            { label: "Estimated Possessions", value: formatNumber(possessions, 1) },
            { label: "Possessions per Minute", value: formatNumber(possessions / min, 3) },
            { label: "Tempo", value: tempo },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["basketball-per-calculator", "basketball-true-shooting-calculator"],
  faq: [
    { question: "What is pace in basketball?", answer: "Pace measures the number of possessions a team uses per 48 minutes. A higher pace means a faster-paced, more up-tempo style of play." },
    { question: "What is a normal NBA pace?", answer: "The modern NBA average pace is around 98-100 possessions per 48 minutes. Historically, it has ranged from the low 90s to over 105." },
  ],
  formula: "Pace = 48 * (Possessions / Minutes) * 5",
};