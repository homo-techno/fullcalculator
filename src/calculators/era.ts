import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eraCalculator: CalculatorDefinition = {
  slug: "era-calculator",
  title: "ERA Calculator",
  description:
    "Free ERA (Earned Run Average) calculator. Calculate a pitcher's ERA from earned runs and innings pitched for baseball and softball.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ERA",
    "earned run average",
    "pitching stats",
    "baseball calculator",
    "pitcher stats",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate ERA",
      fields: [
        {
          name: "earnedRuns",
          label: "Earned Runs (ER)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "inningsPitched",
          label: "Innings Pitched (IP)",
          type: "number",
          placeholder: "e.g. 85.1",
        },
      ],
      calculate: (inputs) => {
        const earnedRuns = inputs.earnedRuns as number;
        const inningsPitched = inputs.inningsPitched as number;

        if (earnedRuns === undefined || earnedRuns === null) return null;
        if (!inningsPitched || inningsPitched <= 0) return null;

        // Handle fractional innings (e.g., 85.1 = 85 and 1/3, 85.2 = 85 and 2/3)
        const fullInnings = Math.floor(inningsPitched);
        const fraction = inningsPitched - fullInnings;
        let actualInnings = fullInnings;

        if (fraction >= 0.09 && fraction <= 0.15) {
          actualInnings += 1 / 3; // .1 = 1/3 inning
        } else if (fraction >= 0.19 && fraction <= 0.25) {
          actualInnings += 2 / 3; // .2 = 2/3 inning
        } else {
          actualInnings += fraction;
        }

        const era = (earnedRuns * 9) / actualInnings;

        // ERA rating
        let rating = "";
        if (era < 2.0) rating = "Elite";
        else if (era < 3.0) rating = "Excellent";
        else if (era < 3.5) rating = "Very Good";
        else if (era < 4.0) rating = "Above Average";
        else if (era < 4.5) rating = "Average";
        else if (era < 5.0) rating = "Below Average";
        else rating = "Poor";

        return {
          primary: {
            label: "ERA",
            value: formatNumber(era, 2),
          },
          details: [
            {
              label: "Earned Runs",
              value: formatNumber(earnedRuns, 0),
            },
            {
              label: "Innings Pitched",
              value: formatNumber(actualInnings, 2),
            },
            { label: "ERA", value: formatNumber(era, 2) },
            { label: "Rating", value: rating },
            {
              label: "Earned Runs per Inning",
              value: formatNumber(earnedRuns / actualInnings, 3),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["batting-average-calculator", "quarterback-rating-calculator"],
  faq: [
    {
      question: "How is ERA calculated?",
      answer:
        "ERA (Earned Run Average) = (Earned Runs x 9) / Innings Pitched. It represents the average number of earned runs a pitcher allows per 9 innings.",
    },
    {
      question: "What is a good ERA?",
      answer:
        "In MLB, an ERA below 3.00 is considered excellent, 3.00-3.50 is very good, 3.50-4.00 is above average, and 4.00-4.50 is about average. The all-time record is 1.12 by Bob Gibson in 1968.",
    },
  ],
  formula:
    "ERA = (Earned Runs x 9) / Innings Pitched. Fractional innings: .1 = 1/3 inning, .2 = 2/3 inning.",
};
