import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const synodicPeriodCalculator: CalculatorDefinition = {
  slug: "synodic-period-calculator",
  title: "Synodic Period Calculator",
  description: "Free synodic period calculator. Calculate the synodic period between two orbiting bodies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["synodic period", "orbital period", "conjunction period", "opposition period"],
  variants: [
    {
      id: "synodic",
      name: "Calculate Synodic Period",
      description: "1/P_syn = |1/P1 - 1/P2|",
      fields: [
        { name: "period1", label: "Orbital Period of Body 1 (days)", type: "number", placeholder: "e.g. 365.25" },
        { name: "period2", label: "Orbital Period of Body 2 (days)", type: "number", placeholder: "e.g. 687" },
      ],
      calculate: (inputs) => {
        const P1 = inputs.period1 as number;
        const P2 = inputs.period2 as number;
        if (!P1 || !P2) return null;
        const synDays = 1 / Math.abs(1 / P1 - 1 / P2);
        const synYears = synDays / 365.25;
        return {
          primary: { label: "Synodic Period", value: `${formatNumber(synDays, 2)} days` },
          details: [
            { label: "Synodic Period (years)", value: formatNumber(synYears, 4) },
            { label: "Period of Body 1", value: `${formatNumber(P1, 2)} days` },
            { label: "Period of Body 2", value: `${formatNumber(P2, 2)} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kepler-third-law-calculator", "satellite-period-calculator", "angular-diameter-calculator"],
  faq: [
    { question: "What is a synodic period?", answer: "The synodic period is the time between two successive conjunctions or oppositions of two orbiting bodies as seen from a reference point." },
    { question: "What is the synodic period of Mars?", answer: "About 780 days. That is how often Earth and Mars align for optimal launch windows." },
  ],
  formula: "1/P_syn = |1/P1 - 1/P2|",
};
