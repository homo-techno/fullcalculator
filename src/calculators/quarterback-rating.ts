import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quarterbackRatingCalculator: CalculatorDefinition = {
  slug: "quarterback-rating-calculator",
  title: "Quarterback Rating Calculator",
  description:
    "Free NFL quarterback passer rating calculator. Enter completions, attempts, yards, touchdowns, and interceptions to calculate the official NFL passer rating.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "quarterback rating",
    "passer rating",
    "NFL rating",
    "QB rating",
    "football stats",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Passer Rating",
      fields: [
        {
          name: "completions",
          label: "Completions",
          type: "number",
          placeholder: "e.g. 22",
        },
        {
          name: "attempts",
          label: "Attempts",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "yards",
          label: "Passing Yards",
          type: "number",
          placeholder: "e.g. 280",
        },
        {
          name: "touchdowns",
          label: "Touchdowns",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "interceptions",
          label: "Interceptions",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const comp = inputs.completions as number;
        const att = inputs.attempts as number;
        const yds = inputs.yards as number;
        const td = inputs.touchdowns as number;
        const int = inputs.interceptions as number;

        if (!att || att <= 0) return null;
        if (comp === undefined || comp === null) return null;
        if (yds === undefined || yds === null) return null;
        if (td === undefined || td === null) return null;
        if (int === undefined || int === null) return null;

        // NFL Passer Rating Formula
        // a = ((COMP/ATT) - 0.3) x 5
        // b = ((YDS/ATT) - 3) x 0.25
        // c = (TD/ATT) x 20
        // d = 2.375 - ((INT/ATT) x 25)
        // Each component capped between 0 and 2.375
        // Rating = ((a + b + c + d) / 6) x 100

        const clamp = (val: number): number =>
          Math.max(0, Math.min(2.375, val));

        const a = clamp((comp / att - 0.3) * 5);
        const b = clamp((yds / att - 3) * 0.25);
        const c = clamp((td / att) * 20);
        const d = clamp(2.375 - (int / att) * 25);

        const rating = ((a + b + c + d) / 6) * 100;

        const compPct = (comp / att) * 100;
        const yardsPerAttempt = yds / att;

        let grade = "";
        if (rating >= 100) grade = "Elite";
        else if (rating >= 90) grade = "Excellent";
        else if (rating >= 80) grade = "Good";
        else if (rating >= 70) grade = "Average";
        else if (rating >= 60) grade = "Below Average";
        else grade = "Poor";

        return {
          primary: {
            label: "Passer Rating",
            value: formatNumber(rating, 1),
          },
          details: [
            {
              label: "Completion %",
              value: `${formatNumber(compPct, 1)}%`,
            },
            {
              label: "Yards/Attempt",
              value: formatNumber(yardsPerAttempt, 2),
            },
            {
              label: "TD %",
              value: `${formatNumber((td / att) * 100, 2)}%`,
            },
            {
              label: "INT %",
              value: `${formatNumber((int / att) * 100, 2)}%`,
            },
            { label: "Grade", value: grade },
            {
              label: "Perfect Rating",
              value: `158.3 (max possible)`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["batting-average-calculator", "basketball-stats-calculator"],
  faq: [
    {
      question: "How is NFL passer rating calculated?",
      answer:
        "NFL passer rating uses four components: completion percentage, yards per attempt, touchdown percentage, and interception percentage. Each is scaled and capped between 0 and 2.375, then combined: Rating = ((a + b + c + d) / 6) x 100.",
    },
    {
      question: "What is a perfect passer rating?",
      answer:
        "A perfect NFL passer rating is 158.3. This is achieved when all four components reach the maximum value of 2.375.",
    },
  ],
  formula:
    "a = ((COMP/ATT - 0.3) x 5), b = ((YDS/ATT - 3) x 0.25), c = (TD/ATT x 20), d = (2.375 - INT/ATT x 25). Each clamped to [0, 2.375]. Rating = ((a + b + c + d) / 6) x 100.",
};
