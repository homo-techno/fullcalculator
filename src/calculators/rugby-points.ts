import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rugbyPointsCalculator: CalculatorDefinition = {
  slug: "rugby-points-calculator",
  title: "Rugby Points Calculator",
  description:
    "Free rugby scoring and point differential calculator. Calculate match scores for rugby union and rugby league with tries, conversions, penalties, and drop goals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rugby points calculator",
    "rugby scoring",
    "rugby union score",
    "rugby league score",
    "point differential rugby",
  ],
  variants: [
    {
      id: "union",
      name: "Rugby Union",
      description: "Calculate score for rugby union (15s)",
      fields: [
        {
          name: "tries",
          label: "Tries",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "conversions",
          label: "Conversions",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
        },
        {
          name: "penalties",
          label: "Penalty Kicks",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
        },
        {
          name: "dropGoals",
          label: "Drop Goals",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
        {
          name: "penaltyTries",
          label: "Penalty Tries",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const tries = parseFloat(inputs.tries as string) || 0;
        const conversions = parseFloat(inputs.conversions as string) || 0;
        const penalties = parseFloat(inputs.penalties as string) || 0;
        const dropGoals = parseFloat(inputs.dropGoals as string) || 0;
        const penaltyTries = parseFloat(inputs.penaltyTries as string) || 0;

        const tryPoints = tries * 5;
        const penaltyTryPoints = penaltyTries * 7; // auto conversion
        const conversionPoints = conversions * 2;
        const penaltyPoints = penalties * 3;
        const dropGoalPoints = dropGoals * 3;
        const total = tryPoints + penaltyTryPoints + conversionPoints + penaltyPoints + dropGoalPoints;

        const bonusPoint = tries + penaltyTries >= 4 ? "Yes (4+ tries)" : "No";

        return {
          primary: {
            label: "Total Points",
            value: formatNumber(total, 0),
          },
          details: [
            { label: "Try Points", value: formatNumber(tryPoints, 0) + ` (${formatNumber(tries, 0)} × 5)` },
            { label: "Penalty Try Points", value: formatNumber(penaltyTryPoints, 0) + ` (${formatNumber(penaltyTries, 0)} × 7)` },
            { label: "Conversion Points", value: formatNumber(conversionPoints, 0) + ` (${formatNumber(conversions, 0)} × 2)` },
            { label: "Penalty Points", value: formatNumber(penaltyPoints, 0) + ` (${formatNumber(penalties, 0)} × 3)` },
            { label: "Drop Goal Points", value: formatNumber(dropGoalPoints, 0) + ` (${formatNumber(dropGoals, 0)} × 3)` },
            { label: "Try Bonus Point", value: bonusPoint },
          ],
        };
      },
    },
    {
      id: "league",
      name: "Rugby League",
      description: "Calculate score for rugby league (13s)",
      fields: [
        {
          name: "tries",
          label: "Tries",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
        },
        {
          name: "goals",
          label: "Goals (Conversions)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
        },
        {
          name: "penaltyGoals",
          label: "Penalty Goals",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
        },
        {
          name: "fieldGoals",
          label: "Field Goals (Drop Goals)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const tries = parseFloat(inputs.tries as string) || 0;
        const goals = parseFloat(inputs.goals as string) || 0;
        const penaltyGoals = parseFloat(inputs.penaltyGoals as string) || 0;
        const fieldGoals = parseFloat(inputs.fieldGoals as string) || 0;

        const tryPoints = tries * 4;
        const goalPoints = goals * 2;
        const penaltyGoalPoints = penaltyGoals * 2;
        const fieldGoalPoints = fieldGoals * 1;
        const total = tryPoints + goalPoints + penaltyGoalPoints + fieldGoalPoints;

        return {
          primary: {
            label: "Total Points",
            value: formatNumber(total, 0),
          },
          details: [
            { label: "Try Points", value: formatNumber(tryPoints, 0) + ` (${formatNumber(tries, 0)} × 4)` },
            { label: "Goal Points", value: formatNumber(goalPoints, 0) + ` (${formatNumber(goals, 0)} × 2)` },
            { label: "Penalty Goals", value: formatNumber(penaltyGoalPoints, 0) + ` (${formatNumber(penaltyGoals, 0)} × 2)` },
            { label: "Field Goals", value: formatNumber(fieldGoalPoints, 0) + ` (${formatNumber(fieldGoals, 0)} × 1)` },
          ],
        };
      },
    },
    {
      id: "differential",
      name: "Point Differential",
      description: "Calculate point differential across matches",
      fields: [
        {
          name: "pointsFor",
          label: "Total Points For",
          type: "number",
          placeholder: "e.g. 185",
          min: 0,
        },
        {
          name: "pointsAgainst",
          label: "Total Points Against",
          type: "number",
          placeholder: "e.g. 140",
          min: 0,
        },
        {
          name: "matchesPlayed",
          label: "Matches Played",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const pf = parseFloat(inputs.pointsFor as string);
        const pa = parseFloat(inputs.pointsAgainst as string);
        const matches = parseFloat(inputs.matchesPlayed as string);
        if (isNaN(pf) || isNaN(pa) || !matches) return null;

        const diff = pf - pa;
        const avgFor = pf / matches;
        const avgAgainst = pa / matches;
        const avgDiff = diff / matches;

        return {
          primary: {
            label: "Point Differential",
            value: (diff >= 0 ? "+" : "") + formatNumber(diff, 0),
          },
          details: [
            { label: "Avg Points For", value: formatNumber(avgFor, 1) },
            { label: "Avg Points Against", value: formatNumber(avgAgainst, 1) },
            { label: "Avg Differential", value: (avgDiff >= 0 ? "+" : "") + formatNumber(avgDiff, 1) },
            { label: "Points For Ratio", value: formatNumber(pf / (pf + pa) * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "average-calculator"],
  faq: [
    {
      question: "How does scoring work in rugby union?",
      answer:
        "In rugby union: a try is worth 5 points, a conversion kick after a try is 2 points, a penalty kick is 3 points, a drop goal is 3 points, and a penalty try is 7 points (includes automatic conversion). Teams can also earn bonus points in league competitions for scoring 4+ tries.",
    },
    {
      question: "What is the difference between rugby union and rugby league scoring?",
      answer:
        "In rugby league, a try is worth 4 points (vs 5 in union), conversions and penalty goals are both 2 points, and a field goal (drop goal) is only 1 point (vs 3 in union). League does not have penalty tries.",
    },
  ],
  formula:
    "Union: Total = (Tries × 5) + (Conversions × 2) + (Penalties × 3) + (Drop Goals × 3) + (Penalty Tries × 7) | League: Total = (Tries × 4) + (Goals × 2) + (Field Goals × 1)",
};
