import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sprintCapacityCalculator: CalculatorDefinition = {
  slug: "sprint-capacity-calculator",
  title: "Sprint Capacity Calculator (Agile)",
  description: "Free sprint capacity calculator for Agile teams. Calculate available story points, team velocity, and sprint planning capacity based on team size and availability.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["sprint capacity calculator", "agile capacity planning", "story points calculator", "velocity calculator", "scrum capacity"],
  variants: [
    {
      id: "team-capacity",
      name: "Team Sprint Capacity",
      description: "Calculate available capacity for a sprint",
      fields: [
        { name: "teamSize", label: "Team Size (developers)", type: "number", placeholder: "e.g. 5", min: 1 },
        { name: "sprintDays", label: "Sprint Length (working days)", type: "number", placeholder: "e.g. 10", min: 1, defaultValue: 10 },
        { name: "hoursPerDay", label: "Working Hours per Day", type: "number", placeholder: "e.g. 8", min: 1, max: 24, defaultValue: 8 },
        { name: "focusFactor", label: "Focus Factor (%)", type: "select", options: [
          { label: "Low (50% - new team)", value: "50" },
          { label: "Medium (65% - typical)", value: "65" },
          { label: "High (75% - experienced)", value: "75" },
          { label: "Very High (85% - dedicated)", value: "85" },
        ], defaultValue: "65" },
        { name: "ptoDays", label: "Total PTO/Holiday Days (team)", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 0 },
        { name: "avgVelocity", label: "Avg Story Points per Person-Day", type: "number", placeholder: "e.g. 1.5", min: 0.1, step: 0.1, defaultValue: 1.5 },
      ],
      calculate: (inputs) => {
        const teamSize = inputs.teamSize as number;
        const sprintDays = (inputs.sprintDays as number) || 10;
        const hoursPerDay = (inputs.hoursPerDay as number) || 8;
        const focusFactor = parseFloat(inputs.focusFactor as string) || 65;
        const ptoDays = (inputs.ptoDays as number) || 0;
        const avgVelocity = (inputs.avgVelocity as number) || 1.5;
        if (!teamSize) return null;

        const totalPersonDays = (teamSize * sprintDays) - ptoDays;
        const totalHours = totalPersonDays * hoursPerDay;
        const availableHours = totalHours * (focusFactor / 100);
        const ceremonyHours = sprintDays * 1; // ~1 hour/day for ceremonies
        const netAvailableHours = availableHours - ceremonyHours;
        const estimatedStoryPoints = totalPersonDays * avgVelocity * (focusFactor / 100);

        return {
          primary: { label: "Sprint Capacity", value: `${formatNumber(estimatedStoryPoints, 0)} story points` },
          details: [
            { label: "Team Size", value: `${teamSize} developers` },
            { label: "Sprint Length", value: `${sprintDays} working days` },
            { label: "Total Person-Days", value: formatNumber(totalPersonDays, 0) },
            { label: "PTO/Holiday Days", value: formatNumber(ptoDays, 0) },
            { label: "Total Hours", value: formatNumber(totalHours, 0) },
            { label: "Focus Factor", value: `${focusFactor}%` },
            { label: "Available Hours (net)", value: formatNumber(netAvailableHours, 0) },
            { label: "Ceremony Overhead", value: `${formatNumber(ceremonyHours, 0)} hours` },
            { label: "Estimated Story Points", value: formatNumber(estimatedStoryPoints, 0) },
            { label: "Points per Person", value: formatNumber(estimatedStoryPoints / teamSize, 1) },
          ],
        };
      },
    },
    {
      id: "velocity-tracking",
      name: "Velocity Projection",
      description: "Project completion based on historical velocity",
      fields: [
        { name: "totalStoryPoints", label: "Total Backlog (story points)", type: "number", placeholder: "e.g. 200", min: 1 },
        { name: "avgVelocity", label: "Avg Sprint Velocity (points)", type: "number", placeholder: "e.g. 30", min: 1 },
        { name: "sprintLength", label: "Sprint Length (weeks)", type: "number", placeholder: "e.g. 2", min: 1, defaultValue: 2 },
        { name: "completedPoints", label: "Already Completed (points)", type: "number", placeholder: "e.g. 50", min: 0, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const totalStoryPoints = inputs.totalStoryPoints as number;
        const avgVelocity = inputs.avgVelocity as number;
        const sprintLength = (inputs.sprintLength as number) || 2;
        const completedPoints = (inputs.completedPoints as number) || 0;
        if (!totalStoryPoints || !avgVelocity) return null;

        const remainingPoints = totalStoryPoints - completedPoints;
        const sprintsRemaining = Math.ceil(remainingPoints / avgVelocity);
        const weeksRemaining = sprintsRemaining * sprintLength;
        const monthsRemaining = weeksRemaining / 4.33;
        const completionPercent = (completedPoints / totalStoryPoints) * 100;

        // Optimistic/pessimistic (+-20% velocity)
        const optimisticSprints = Math.ceil(remainingPoints / (avgVelocity * 1.2));
        const pessimisticSprints = Math.ceil(remainingPoints / (avgVelocity * 0.8));

        return {
          primary: { label: "Sprints to Complete", value: `${sprintsRemaining} sprints (~${formatNumber(weeksRemaining, 0)} weeks)` },
          details: [
            { label: "Total Backlog", value: `${formatNumber(totalStoryPoints, 0)} points` },
            { label: "Completed", value: `${formatNumber(completedPoints, 0)} points (${formatNumber(completionPercent, 1)}%)` },
            { label: "Remaining", value: `${formatNumber(remainingPoints, 0)} points` },
            { label: "Avg Velocity", value: `${formatNumber(avgVelocity, 0)} points/sprint` },
            { label: "Sprints Remaining", value: formatNumber(sprintsRemaining, 0) },
            { label: "Weeks Remaining", value: formatNumber(weeksRemaining, 0) },
            { label: "Months Remaining", value: formatNumber(monthsRemaining, 1) },
            { label: "Optimistic (+20% velocity)", value: `${optimisticSprints} sprints` },
            { label: "Pessimistic (-20% velocity)", value: `${pessimisticSprints} sprints` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["function-point-calculator", "code-review-time-estimator", "cloud-cost-calculator"],
  faq: [
    { question: "What is focus factor?", answer: "Focus factor is the percentage of time developers actually spend on sprint work (coding, testing, design). The rest goes to meetings, Slack, email, interruptions, and unplanned work. New teams are typically 50-60%. Experienced, dedicated teams can reach 75-85%. It is rarely above 85%." },
    { question: "How do I calculate team velocity?", answer: "Velocity is the average story points completed per sprint over the last 3-5 sprints. Only count stories that are fully done (meet Definition of Done). Do not count partially completed stories. Velocity naturally varies 10-20% between sprints -- use the average for planning." },
  ],
  formula: "Capacity = Person-Days x Focus Factor x Points per Person-Day | Sprints = Remaining Points / Velocity",
};
