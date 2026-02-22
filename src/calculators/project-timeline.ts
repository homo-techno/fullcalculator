import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectTimelineCalculator: CalculatorDefinition = {
  slug: "project-timeline-calculator",
  title: "Project Timeline Calculator",
  description: "Free project timeline calculator. Estimate project duration based on tasks, resources, and working hours. Plan realistic project timelines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["project timeline calculator", "project duration calculator", "project planning", "project schedule calculator", "timeline estimator"],
  variants: [
    {
      id: "duration",
      name: "Project Duration Estimate",
      description: "Estimate project duration from total effort and team size",
      fields: [
        { name: "totalEffort", label: "Total Effort (person-hours)", type: "number", placeholder: "e.g. 500" },
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 4" },
        { name: "hoursPerDay", label: "Productive Hours per Day", type: "number", placeholder: "e.g. 6", suffix: "hours", defaultValue: 6 },
        { name: "daysPerWeek", label: "Working Days per Week", type: "number", placeholder: "e.g. 5", suffix: "days", defaultValue: 5 },
        { name: "bufferPct", label: "Buffer / Contingency", type: "number", placeholder: "e.g. 20", suffix: "%", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const effort = inputs.totalEffort as number;
        const team = inputs.teamSize as number;
        const hrsPerDay = (inputs.hoursPerDay as number) || 6;
        const daysPerWeek = (inputs.daysPerWeek as number) || 5;
        const buffer = (inputs.bufferPct as number) || 0;
        if (!effort || !team) return null;

        const teamHoursPerDay = team * hrsPerDay;
        const daysNeeded = effort / teamHoursPerDay;
        const bufferedDays = daysNeeded * (1 + buffer / 100);
        const weeks = bufferedDays / daysPerWeek;
        const months = weeks / 4.33;

        return {
          primary: { label: "Estimated Duration", value: `${Math.ceil(bufferedDays)} working days` },
          details: [
            { label: "Base duration (no buffer)", value: `${formatNumber(daysNeeded, 1)} days` },
            { label: "With buffer", value: `${formatNumber(bufferedDays, 1)} days` },
            { label: "Weeks", value: formatNumber(weeks, 1) },
            { label: "Calendar months", value: formatNumber(months, 1) },
            { label: "Team hours per day", value: `${formatNumber(teamHoursPerDay)} hours` },
            { label: "Buffer days added", value: `${formatNumber(bufferedDays - daysNeeded, 1)} days` },
          ],
        };
      },
    },
    {
      id: "effort",
      name: "Effort Estimator",
      description: "Estimate total effort from number of tasks",
      fields: [
        { name: "numTasks", label: "Number of Tasks", type: "number", placeholder: "e.g. 25" },
        { name: "avgHours", label: "Average Hours per Task", type: "number", placeholder: "e.g. 8", suffix: "hours" },
        { name: "complexity", label: "Complexity Multiplier", type: "select", options: [
          { label: "Simple (0.8x)", value: "0.8" },
          { label: "Normal (1.0x)", value: "1.0" },
          { label: "Complex (1.5x)", value: "1.5" },
          { label: "Very Complex (2.0x)", value: "2.0" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const tasks = inputs.numTasks as number;
        const avgHrs = inputs.avgHours as number;
        const complexity = parseFloat(inputs.complexity as string) || 1.0;
        if (!tasks || !avgHrs) return null;

        const baseEffort = tasks * avgHrs;
        const adjustedEffort = baseEffort * complexity;

        return {
          primary: { label: "Total Estimated Effort", value: `${formatNumber(adjustedEffort)} person-hours` },
          details: [
            { label: "Base effort", value: `${formatNumber(baseEffort)} hours` },
            { label: "Complexity multiplier", value: `${complexity}x` },
            { label: "Person-days (6hr/day)", value: formatNumber(adjustedEffort / 6, 1) },
            { label: "Person-weeks", value: formatNumber(adjustedEffort / 30, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "time-card-calculator", "break-even-calculator"],
  faq: [
    { question: "How much buffer should I add to a project timeline?", answer: "A common rule of thumb is 15-25% buffer for well-understood projects. For projects with significant unknowns, use 30-50%. The buffer accounts for unexpected issues, scope changes, meetings, and context-switching overhead." },
    { question: "What are productive hours per day?", answer: "Most knowledge workers are productive for 5-6 hours in an 8-hour workday. The rest is spent on meetings, email, breaks, and context switching. Using 6 hours is a realistic estimate for planning." },
  ],
  formula: "Duration = Total Effort / (Team Size x Hours per Day) x (1 + Buffer%) | Effort = Tasks x Avg Hours x Complexity",
};
