import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soccerStatsCalculator: CalculatorDefinition = {
  slug: "soccer-stats-calculator",
  title: "Soccer Stats Calculator",
  description:
    "Free soccer stats calculator. Calculate goals per game, shot accuracy, goal conversion rate, and other key soccer performance metrics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "soccer stats",
    "football stats",
    "goals per game",
    "shot accuracy",
    "conversion rate",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Soccer Stats",
      fields: [
        {
          name: "goals",
          label: "Goals",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "assists",
          label: "Assists",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "gamesPlayed",
          label: "Games Played",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "shots",
          label: "Total Shots",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "shotsOnTarget",
          label: "Shots on Target",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const goals = inputs.goals as number;
        const assists = inputs.assists as number;
        const gamesPlayed = inputs.gamesPlayed as number;
        const shots = inputs.shots as number;
        const shotsOnTarget = inputs.shotsOnTarget as number;

        if (goals === undefined || goals === null) return null;
        if (!gamesPlayed || gamesPlayed <= 0) return null;

        const goalsPerGame = goals / gamesPlayed;
        const assistsPerGame = (assists || 0) / gamesPlayed;
        const goalContributions = goals + (assists || 0);
        const contributionsPerGame = goalContributions / gamesPlayed;

        const details: { label: string; value: string }[] = [
          { label: "Goals", value: formatNumber(goals, 0) },
          { label: "Assists", value: formatNumber(assists || 0, 0) },
          { label: "Games Played", value: formatNumber(gamesPlayed, 0) },
          {
            label: "Goals per Game",
            value: formatNumber(goalsPerGame, 2),
          },
          {
            label: "Assists per Game",
            value: formatNumber(assistsPerGame, 2),
          },
          {
            label: "Goal Contributions",
            value: formatNumber(goalContributions, 0),
          },
          {
            label: "Contributions per Game",
            value: formatNumber(contributionsPerGame, 2),
          },
        ];

        if (shots && shots > 0) {
          const conversionRate = (goals / shots) * 100;
          details.push({
            label: "Goal Conversion Rate",
            value: `${formatNumber(conversionRate, 1)}%`,
          });

          if (shotsOnTarget && shotsOnTarget > 0) {
            const accuracy = (shotsOnTarget / shots) * 100;
            const onTargetConversion = (goals / shotsOnTarget) * 100;
            details.push({
              label: "Shot Accuracy",
              value: `${formatNumber(accuracy, 1)}%`,
            });
            details.push({
              label: "On-Target Conversion",
              value: `${formatNumber(onTargetConversion, 1)}%`,
            });
          }
        }

        return {
          primary: {
            label: "Goals per Game",
            value: formatNumber(goalsPerGame, 2),
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["basketball-stats-calculator", "batting-average-calculator"],
  faq: [
    {
      question: "How is goals per game calculated?",
      answer:
        "Goals per game is simply total goals divided by total games played. A rate above 0.5 is considered very good at most levels.",
    },
    {
      question: "What is shot conversion rate?",
      answer:
        "Shot conversion rate = (Goals / Total Shots) x 100. It measures how efficiently a player converts shots into goals. Elite strikers typically have conversion rates of 15-25%.",
    },
  ],
  formula:
    "Goals/Game = Goals / Games. Shot Accuracy = Shots on Target / Total Shots x 100. Conversion Rate = Goals / Total Shots x 100.",
};
