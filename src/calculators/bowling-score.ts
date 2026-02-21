import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bowlingScoreCalculator: CalculatorDefinition = {
  slug: "bowling-score-calculator",
  title: "Bowling Score Calculator",
  description:
    "Free bowling score calculator. Estimate your game score based on average pins per frame and compare to a perfect 300 game.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bowling score",
    "bowling calculator",
    "bowling average",
    "bowling game",
    "pin count",
  ],
  variants: [
    {
      id: "calc",
      name: "Estimate Bowling Score",
      fields: [
        {
          name: "avgPins",
          label: "Average Pins per Frame (0-10)",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "strikes",
          label: "Number of Strikes (0-12)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "spares",
          label: "Number of Spares (0-10)",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const avgPins = inputs.avgPins as number;
        const strikes = inputs.strikes as number;
        const spares = inputs.spares as number;

        if (avgPins === undefined || avgPins === null) return null;
        if (avgPins < 0 || avgPins > 10) return null;

        const numStrikes = strikes || 0;
        const numSpares = spares || 0;
        const normalFrames = 10 - numStrikes - numSpares;

        // Simplified scoring estimation
        // Strike = 10 + next two balls (estimate as 10 + avgPins * 2 if not strike)
        // Spare = 10 + next ball (estimate as 10 + avgPins)
        // Normal frame = avgPins (first ball average)

        let estimatedScore = 0;

        // Strike bonus: 10 + estimated next two balls
        estimatedScore += numStrikes * (10 + avgPins * 2);

        // Spare bonus: 10 + estimated next ball
        estimatedScore += numSpares * (10 + avgPins);

        // Normal frames: just average pins
        if (normalFrames > 0) {
          estimatedScore += normalFrames * avgPins;
        }

        // Cap at 300
        estimatedScore = Math.min(estimatedScore, 300);
        estimatedScore = Math.max(estimatedScore, 0);

        const perfectGame = 300;
        const percentage = (estimatedScore / perfectGame) * 100;

        return {
          primary: {
            label: "Estimated Game Score",
            value: formatNumber(Math.round(estimatedScore), 0),
          },
          details: [
            {
              label: "Average Pins/Frame",
              value: formatNumber(avgPins, 1),
            },
            { label: "Strikes", value: formatNumber(numStrikes, 0) },
            { label: "Spares", value: formatNumber(numSpares, 0) },
            {
              label: "Normal Frames",
              value: formatNumber(Math.max(normalFrames, 0), 0),
            },
            { label: "Perfect Game", value: formatNumber(perfectGame, 0) },
            {
              label: "% of Perfect",
              value: `${formatNumber(percentage, 1)}%`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["golf-handicap-calculator"],
  faq: [
    {
      question: "How is bowling scored?",
      answer:
        "A bowling game has 10 frames. A strike (all 10 pins on first ball) earns 10 plus the next two ball scores as a bonus. A spare (all 10 pins in two balls) earns 10 plus the next ball as a bonus. A perfect game of all strikes scores 300.",
    },
    {
      question: "Is this an exact score?",
      answer:
        "This is an estimation based on averages. Actual bowling scores depend on the specific pin counts for each frame and the sequence of strikes and spares.",
    },
  ],
  formula:
    "Estimated Score = (Strikes x (10 + 2 x avgPins)) + (Spares x (10 + avgPins)) + (Normal Frames x avgPins). Perfect game = 300 (12 consecutive strikes).",
};
