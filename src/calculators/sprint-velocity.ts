import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sprintVelocityCalculator: CalculatorDefinition = {
  slug: "sprint-velocity-calculator",
  title: "Sprint Velocity Calculator",
  description: "Free Agile sprint velocity calculator. Calculate team velocity, predict sprint capacity, and estimate project completion based on historical data.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sprint velocity calculator", "agile velocity", "scrum velocity", "sprint capacity", "agile planning calculator"],
  variants: [
    {
      id: "average",
      name: "Average Velocity",
      description: "Calculate average velocity from past sprints",
      fields: [
        { name: "sprint1", label: "Sprint 1 Points Completed", type: "number", placeholder: "e.g. 30" },
        { name: "sprint2", label: "Sprint 2 Points Completed", type: "number", placeholder: "e.g. 35" },
        { name: "sprint3", label: "Sprint 3 Points Completed", type: "number", placeholder: "e.g. 28" },
        { name: "sprintLength", label: "Sprint Length", type: "number", placeholder: "e.g. 2", suffix: "weeks", defaultValue: 2 },
        { name: "remainingPoints", label: "Remaining Backlog Points", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const s1 = inputs.sprint1 as number;
        const s2 = inputs.sprint2 as number;
        const s3 = inputs.sprint3 as number;
        const sprintLen = (inputs.sprintLength as number) || 2;
        const remaining = inputs.remainingPoints as number;
        if (!s1 && !s2 && !s3) return null;

        const sprints = [s1, s2, s3].filter((v) => v !== undefined && v > 0);
        if (sprints.length === 0) return null;

        const total = sprints.reduce((a, b) => a + b, 0);
        const avg = total / sprints.length;
        const min = Math.min(...sprints);
        const max = Math.max(...sprints);

        const details = [
          { label: "Sprints analyzed", value: `${sprints.length}` },
          { label: "Min velocity", value: formatNumber(min) },
          { label: "Max velocity", value: formatNumber(max) },
          { label: "Points per week", value: formatNumber(avg / sprintLen, 1) },
        ];

        if (remaining && remaining > 0) {
          const sprintsNeeded = Math.ceil(remaining / avg);
          const weeksNeeded = sprintsNeeded * sprintLen;
          details.push({ label: "Sprints to complete backlog", value: `${sprintsNeeded}` });
          details.push({ label: "Weeks to complete backlog", value: `${weeksNeeded}` });
        }

        return {
          primary: { label: "Average Velocity", value: `${formatNumber(avg, 1)} pts/sprint` },
          details,
        };
      },
    },
    {
      id: "capacity",
      name: "Sprint Capacity",
      description: "Plan sprint capacity based on team availability",
      fields: [
        { name: "teamSize", label: "Team Members", type: "number", placeholder: "e.g. 5" },
        { name: "sprintDays", label: "Sprint Days", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "avgDaysOff", label: "Average Days Off per Person", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "focusFactor", label: "Focus Factor (%)", type: "number", placeholder: "e.g. 70", suffix: "%", defaultValue: 70 },
        { name: "pointsPerDay", label: "Points per Person per Day", type: "number", placeholder: "e.g. 1.5", step: 0.1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const team = inputs.teamSize as number;
        const days = (inputs.sprintDays as number) || 10;
        const daysOff = (inputs.avgDaysOff as number) || 0;
        const focus = (inputs.focusFactor as number) || 70;
        const ppd = (inputs.pointsPerDay as number) || 1;
        if (!team) return null;

        const totalDays = team * days;
        const availableDays = totalDays - team * daysOff;
        const effectiveDays = availableDays * (focus / 100);
        const capacity = effectiveDays * ppd;

        return {
          primary: { label: "Sprint Capacity", value: `${formatNumber(capacity, 0)} points` },
          details: [
            { label: "Total person-days", value: formatNumber(totalDays) },
            { label: "Available person-days", value: formatNumber(availableDays) },
            { label: "Effective person-days", value: formatNumber(effectiveDays, 1) },
            { label: "Capacity per person", value: `${formatNumber(capacity / team, 1)} points` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "percentage-calculator", "average-calculator"],
  faq: [
    { question: "What is sprint velocity?", answer: "Sprint velocity is the average number of story points a team completes per sprint. It is used in Agile/Scrum to predict how much work a team can take on in future sprints and to forecast project completion dates." },
    { question: "How many sprints should I use for velocity?", answer: "Use the last 3-5 sprints for the most accurate velocity. Using fewer sprints makes the average volatile, while using too many dilutes recent changes in team performance or composition." },
  ],
  formula: "Average Velocity = Sum of Completed Points / Number of Sprints | Sprints to Complete = Remaining Points / Average Velocity",
};
