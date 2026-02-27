import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cricketRunRateCalculator: CalculatorDefinition = {
  slug: "cricket-run-rate-calculator",
  title: "Cricket Run Rate Calculator",
  description:
    "Free cricket run rate calculator. Calculate current run rate, required run rate, and net run rate for cricket matches.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cricket run rate",
    "required run rate",
    "net run rate",
    "cricket calculator",
    "NRR calculator",
  ],
  variants: [
    {
      id: "required-run-rate",
      name: "Required Run Rate",
      description: "Calculate run rate needed to win a chase",
      fields: [
        {
          name: "target",
          label: "Target Score",
          type: "number",
          placeholder: "e.g. 280",
          min: 1,
        },
        {
          name: "currentScore",
          label: "Current Score",
          type: "number",
          placeholder: "e.g. 120",
          min: 0,
        },
        {
          name: "oversPlayed",
          label: "Overs Completed",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
          step: 0.1,
        },
        {
          name: "totalOvers",
          label: "Total Overs in Innings",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const target = parseFloat(inputs.target as string);
        const current = parseFloat(inputs.currentScore as string);
        const oversPlayed = parseFloat(inputs.oversPlayed as string);
        const totalOvers = parseFloat(inputs.totalOvers as string);
        if (!target || isNaN(current) || isNaN(oversPlayed) || !totalOvers) return null;

        const oversRemaining = totalOvers - oversPlayed;
        const runsNeeded = target - current;
        const currentRunRate = oversPlayed > 0 ? current / oversPlayed : 0;
        const requiredRunRate = oversRemaining > 0 ? runsNeeded / oversRemaining : Infinity;
        const ballsRemaining = oversRemaining * 6;

        return {
          primary: {
            label: "Required Run Rate",
            value: formatNumber(requiredRunRate, 2),
            suffix: "runs/over",
          },
          details: [
            { label: "Runs Needed", value: formatNumber(runsNeeded, 0) },
            { label: "Overs Remaining", value: formatNumber(oversRemaining, 1) },
            { label: "Balls Remaining", value: formatNumber(ballsRemaining, 0) },
            { label: "Current Run Rate", value: formatNumber(currentRunRate, 2) },
            { label: "Run Rate Difference", value: formatNumber(requiredRunRate - currentRunRate, 2) },
          ],
          note:
            requiredRunRate > 12
              ? "Very difficult target - requires aggressive batting."
              : requiredRunRate > 8
              ? "Challenging but achievable required rate."
              : "Manageable required rate.",
        };
      },
    },
    {
      id: "net-run-rate",
      name: "Net Run Rate",
      description: "Calculate NRR for tournament standings",
      fields: [
        {
          name: "totalRunsScored",
          label: "Total Runs Scored (all matches)",
          type: "number",
          placeholder: "e.g. 850",
          min: 0,
        },
        {
          name: "totalOversFaced",
          label: "Total Overs Faced",
          type: "number",
          placeholder: "e.g. 180",
          min: 0.1,
          step: 0.1,
        },
        {
          name: "totalRunsConceded",
          label: "Total Runs Conceded",
          type: "number",
          placeholder: "e.g. 790",
          min: 0,
        },
        {
          name: "totalOversBowled",
          label: "Total Overs Bowled",
          type: "number",
          placeholder: "e.g. 175",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const runsScored = parseFloat(inputs.totalRunsScored as string);
        const oversFaced = parseFloat(inputs.totalOversFaced as string);
        const runsConceded = parseFloat(inputs.totalRunsConceded as string);
        const oversBowled = parseFloat(inputs.totalOversBowled as string);
        if (isNaN(runsScored) || !oversFaced || isNaN(runsConceded) || !oversBowled) return null;

        const scoringRate = runsScored / oversFaced;
        const concedingRate = runsConceded / oversBowled;
        const nrr = scoringRate - concedingRate;

        return {
          primary: {
            label: "Net Run Rate",
            value: (nrr >= 0 ? "+" : "") + formatNumber(nrr, 3),
          },
          details: [
            { label: "Scoring Rate", value: formatNumber(scoringRate, 3) + " runs/over" },
            { label: "Conceding Rate", value: formatNumber(concedingRate, 3) + " runs/over" },
            { label: "Total Runs Scored", value: formatNumber(runsScored, 0) },
            { label: "Total Runs Conceded", value: formatNumber(runsConceded, 0) },
          ],
          note:
            nrr > 0
              ? "Positive NRR indicates scoring faster than opponents."
              : "Negative NRR indicates opponents have scored faster.",
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "average-calculator", "pace-calculator"],
  faq: [
    {
      question: "What is net run rate (NRR) in cricket?",
      answer:
        "Net Run Rate is the difference between the run rate a team scores at and the run rate scored against them across all matches. It is used as a tiebreaker in tournament group stages. NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled).",
    },
    {
      question: "What is a good run rate in ODI cricket?",
      answer:
        "In modern ODI cricket, a run rate of 5-6 per over is considered steady, while 7+ is aggressive. Chasing teams often need 6-8 runs per over in the final 10 overs. In T20 cricket, a run rate of 8-9 is typical, with 10+ being very aggressive.",
    },
    {
      question: "How is required run rate calculated?",
      answer:
        "Required Run Rate = Runs Needed / Overs Remaining. For example, if a team needs 120 runs in 20 overs, the required rate is 6.00 runs per over.",
    },
  ],
  formula:
    "Required RR = (Target - Current Score) / Overs Remaining | NRR = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)",
};
