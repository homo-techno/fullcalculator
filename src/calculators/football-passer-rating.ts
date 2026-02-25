import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const footballPasserRatingCalculator: CalculatorDefinition = {
  slug: "football-passer-rating-calculator",
  title: "NFL Passer Rating Calculator",
  description: "Free NFL passer rating calculator. Calculate a quarterback's passer rating from completions, attempts, yards, touchdowns, and interceptions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["nfl passer rating calculator", "qb rating", "quarterback rating", "passer rating formula", "nfl qbr"],
  variants: [
    {
      id: "nfl",
      name: "NFL Passer Rating",
      description: "Standard NFL passer rating (scale 0-158.3)",
      fields: [
        { name: "completions", label: "Completions", type: "number", placeholder: "e.g. 22" },
        { name: "attempts", label: "Pass Attempts", type: "number", placeholder: "e.g. 35" },
        { name: "yards", label: "Passing Yards", type: "number", placeholder: "e.g. 280" },
        { name: "touchdowns", label: "Touchdowns", type: "number", placeholder: "e.g. 3" },
        { name: "interceptions", label: "Interceptions", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const comp = inputs.completions as number;
        const att = inputs.attempts as number;
        const yds = inputs.yards as number;
        const td = inputs.touchdowns as number;
        const ints = inputs.interceptions as number;
        if (comp === undefined || !att || att <= 0) return null;
        const a = Math.min(Math.max(((comp / att) - 0.3) * 5, 0), 2.375);
        const b = Math.min(Math.max((((yds || 0) / att) - 3) * 0.25, 0), 2.375);
        const c = Math.min(Math.max(((td || 0) / att) * 20, 0), 2.375);
        const d = Math.min(Math.max(2.375 - (((ints || 0) / att) * 25), 0), 2.375);
        const rating = ((a + b + c + d) / 6) * 100;
        let grade = "Poor";
        if (rating >= 110) grade = "Elite";
        else if (rating >= 95) grade = "Excellent";
        else if (rating >= 85) grade = "Above Average";
        else if (rating >= 75) grade = "Average";
        else if (rating >= 60) grade = "Below Average";
        return {
          primary: { label: "Passer Rating", value: formatNumber(rating, 1) },
          details: [
            { label: "Completion %", value: formatNumber((comp / att) * 100, 1) + "%" },
            { label: "Yards per Attempt", value: formatNumber((yds || 0) / att, 2) },
            { label: "TD %", value: formatNumber(((td || 0) / att) * 100, 1) + "%" },
            { label: "INT %", value: formatNumber(((ints || 0) / att) * 100, 1) + "%" },
            { label: "Grade", value: grade },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["football-fantasy-points-calculator", "baseball-era-calculator"],
  faq: [
    { question: "What is NFL passer rating?", answer: "NFL passer rating is a formula that rates a quarterback's performance on a scale of 0 to 158.3, based on completion percentage, yards per attempt, touchdown percentage, and interception percentage." },
    { question: "What is a perfect passer rating?", answer: "A perfect NFL passer rating is 158.3. This requires a minimum completion percentage of 77.5%, 12.5+ yards per attempt, 11.875% TD rate, and 0% interception rate." },
  ],
  formula: "Rating = ((a + b + c + d) / 6) * 100 where a,b,c,d are capped components",
};