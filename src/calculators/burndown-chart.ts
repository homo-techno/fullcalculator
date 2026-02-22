import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const burndownChartCalculator: CalculatorDefinition = {
  slug: "burndown-chart-calculator",
  title: "Burndown Chart Calculator",
  description: "Free burndown chart calculator. Track sprint progress, calculate ideal burn rate, and determine if your team is on track to complete the sprint.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["burndown chart calculator", "sprint burndown", "agile burndown", "scrum burndown", "sprint progress calculator"],
  variants: [
    {
      id: "progress",
      name: "Sprint Burndown Progress",
      description: "Calculate if your sprint is on track",
      fields: [
        { name: "totalPoints", label: "Total Sprint Points", type: "number", placeholder: "e.g. 40" },
        { name: "completedPoints", label: "Points Completed So Far", type: "number", placeholder: "e.g. 18" },
        { name: "totalDays", label: "Sprint Length (days)", type: "number", placeholder: "e.g. 10", suffix: "days", defaultValue: 10 },
        { name: "daysElapsed", label: "Days Elapsed", type: "number", placeholder: "e.g. 5", suffix: "days" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalPoints as number;
        const completed = inputs.completedPoints as number;
        const totalDays = (inputs.totalDays as number) || 10;
        const elapsed = inputs.daysElapsed as number;
        if (!total || completed === undefined || !elapsed) return null;

        const remaining = total - completed;
        const daysLeft = totalDays - elapsed;
        const idealBurnRate = total / totalDays;
        const idealRemaining = total - idealBurnRate * elapsed;
        const actualBurnRate = elapsed > 0 ? completed / elapsed : 0;
        const projectedCompletion = actualBurnRate > 0 ? total / actualBurnRate : Infinity;
        const variance = completed - idealBurnRate * elapsed;
        const requiredRate = daysLeft > 0 ? remaining / daysLeft : Infinity;

        let status = "On Track";
        if (variance < -total * 0.1) status = "Behind Schedule";
        else if (variance > total * 0.1) status = "Ahead of Schedule";

        return {
          primary: { label: "Sprint Status", value: status },
          details: [
            { label: "Points remaining", value: formatNumber(remaining) },
            { label: "Ideal burn rate", value: `${formatNumber(idealBurnRate, 1)} pts/day` },
            { label: "Actual burn rate", value: `${formatNumber(actualBurnRate, 1)} pts/day` },
            { label: "Required rate to finish", value: daysLeft > 0 ? `${formatNumber(requiredRate, 1)} pts/day` : "Sprint ended" },
            { label: "Ideal remaining (expected)", value: `${formatNumber(idealRemaining, 1)} pts` },
            { label: "Variance", value: `${variance > 0 ? "+" : ""}${formatNumber(variance, 1)} pts` },
            { label: "Projected completion", value: projectedCompletion <= totalDays ? `Day ${formatNumber(projectedCompletion, 1)}` : `Day ${formatNumber(projectedCompletion, 1)} (late)` },
          ],
        };
      },
    },
    {
      id: "ideal",
      name: "Ideal Burndown",
      description: "Calculate the ideal burndown rate for a sprint",
      fields: [
        { name: "totalPoints", label: "Total Story Points", type: "number", placeholder: "e.g. 50" },
        { name: "sprintDays", label: "Sprint Working Days", type: "number", placeholder: "e.g. 10", suffix: "days", defaultValue: 10 },
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalPoints as number;
        const days = (inputs.sprintDays as number) || 10;
        const team = (inputs.teamSize as number) || 1;
        if (!total) return null;

        const dailyRate = total / days;
        const perPerson = dailyRate / team;

        return {
          primary: { label: "Ideal Daily Burn Rate", value: `${formatNumber(dailyRate, 1)} pts/day` },
          details: [
            { label: "Per person per day", value: `${formatNumber(perPerson, 2)} pts` },
            { label: "Midpoint target (day 5)", value: `${formatNumber(total - dailyRate * 5, 1)} pts remaining` },
            { label: "75% target (day 7.5)", value: `${formatNumber(total * 0.25, 1)} pts remaining` },
            { label: "Weekly burn target", value: `${formatNumber(dailyRate * 5, 1)} pts/week` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sprint-velocity-calculator", "story-points-calculator", "percentage-calculator"],
  faq: [
    { question: "What is a burndown chart?", answer: "A burndown chart is a graphical representation of work remaining versus time in a sprint. The ideal line shows steady progress from total points to zero. If the actual line is above the ideal, the team is behind; below means ahead." },
    { question: "What causes a flat burndown?", answer: "A flat burndown (no progress) can indicate blockers, stories that are too large (not broken down), scope creep (new work added mid-sprint), or that work is in progress but not yet completed (WIP too high)." },
  ],
  formula: "Ideal Burn Rate = Total Points / Sprint Days | Variance = Completed - (Ideal Rate x Days Elapsed) | Required Rate = Remaining / Days Left",
};
