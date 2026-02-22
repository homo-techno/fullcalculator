import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capacityPlanningCalculator: CalculatorDefinition = {
  slug: "capacity-planning-calculator",
  title: "Team Capacity Planning Calculator",
  description: "Free team capacity planning calculator. Calculate your team's available capacity for sprints, projects, and quarters based on headcount, holidays, and focus time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["capacity planning calculator", "team capacity", "resource planning", "sprint capacity", "workforce planning calculator"],
  variants: [
    {
      id: "sprint",
      name: "Sprint Capacity",
      description: "Calculate available team capacity for a sprint",
      fields: [
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 6" },
        { name: "sprintDays", label: "Sprint Duration (working days)", type: "number", placeholder: "e.g. 10", suffix: "days", defaultValue: 10 },
        { name: "hoursPerDay", label: "Working Hours per Day", type: "number", placeholder: "e.g. 8", suffix: "hours", defaultValue: 8 },
        { name: "ptoTotal", label: "Total PTO Days (all members)", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
        { name: "meetingPct", label: "Meeting / Overhead %", type: "number", placeholder: "e.g. 20", suffix: "%", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const team = inputs.teamSize as number;
        const days = (inputs.sprintDays as number) || 10;
        const hpd = (inputs.hoursPerDay as number) || 8;
        const pto = (inputs.ptoTotal as number) || 0;
        const meetings = (inputs.meetingPct as number) || 20;
        if (!team) return null;

        const totalPersonDays = team * days - pto;
        const totalHours = totalPersonDays * hpd;
        const focusHours = totalHours * (1 - meetings / 100);
        const focusPerPerson = focusHours / team;

        return {
          primary: { label: "Available Focus Hours", value: `${formatNumber(focusHours, 0)}` },
          details: [
            { label: "Total person-days", value: formatNumber(totalPersonDays) },
            { label: "Total hours (before overhead)", value: formatNumber(totalHours) },
            { label: "Meeting / overhead hours", value: formatNumber(totalHours - focusHours) },
            { label: "Focus hours per person", value: formatNumber(focusPerPerson, 1) },
            { label: "Effective capacity", value: `${formatNumber((1 - meetings / 100) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "quarterly",
      name: "Quarterly Capacity",
      description: "Plan capacity for a full quarter",
      fields: [
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 8" },
        { name: "workingDays", label: "Working Days in Quarter", type: "number", placeholder: "e.g. 63", defaultValue: 63 },
        { name: "holidays", label: "Company Holidays", type: "number", placeholder: "e.g. 3", defaultValue: 2 },
        { name: "avgPtoPerPerson", label: "Avg PTO Days per Person", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "focusPct", label: "Focus Factor %", type: "number", placeholder: "e.g. 70", suffix: "%", defaultValue: 70 },
      ],
      calculate: (inputs) => {
        const team = inputs.teamSize as number;
        const workDays = (inputs.workingDays as number) || 63;
        const holidays = (inputs.holidays as number) || 0;
        const avgPto = (inputs.avgPtoPerPerson as number) || 0;
        const focus = (inputs.focusPct as number) || 70;
        if (!team) return null;

        const adjustedDays = workDays - holidays;
        const totalPersonDays = team * adjustedDays - team * avgPto;
        const effectivePersonDays = totalPersonDays * (focus / 100);
        const effectiveHours = effectivePersonDays * 8;
        const weeksOfCapacity = effectivePersonDays / (team * 5);

        return {
          primary: { label: "Effective Person-Days", value: formatNumber(effectivePersonDays, 0) },
          details: [
            { label: "Gross person-days", value: formatNumber(team * adjustedDays) },
            { label: "PTO days lost", value: formatNumber(team * avgPto) },
            { label: "Net person-days", value: formatNumber(totalPersonDays) },
            { label: "Effective hours", value: formatNumber(effectiveHours, 0) },
            { label: "Equivalent full weeks of work", value: formatNumber(weeksOfCapacity, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sprint-velocity-calculator", "story-points-calculator", "time-card-calculator"],
  faq: [
    { question: "What is a focus factor?", answer: "Focus factor is the percentage of available time a team member actually spends on productive work. A focus factor of 70% means 30% of time goes to meetings, email, administrative tasks, and other overhead. Typical focus factors range from 60-80%." },
    { question: "How do I account for part-time team members?", answer: "For part-time team members, count them as a fraction of a full-time equivalent (FTE). For example, someone working 3 days per week is 0.6 FTE. Add all FTEs together for your team size." },
  ],
  formula: "Available Hours = (Team x Days - PTO) x Hours per Day x (1 - Overhead%) | Effective Person-Days = Net Person-Days x Focus Factor",
};
