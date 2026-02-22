import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeTrackingCalculator: CalculatorDefinition = {
  slug: "time-tracking-calculator",
  title: "Time Tracking Summary Calculator",
  description: "Free time tracking summary calculator. Summarize weekly time entries, calculate total hours by category, and analyze time distribution.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time tracking calculator", "time summary calculator", "weekly hours tracker", "time log calculator", "timesheet summary"],
  variants: [
    {
      id: "weekly",
      name: "Weekly Time Summary",
      description: "Summarize hours across work categories",
      fields: [
        { name: "devHours", label: "Development / Core Work", type: "number", placeholder: "e.g. 20", suffix: "hours" },
        { name: "meetingHours", label: "Meetings", type: "number", placeholder: "e.g. 8", suffix: "hours" },
        { name: "emailHours", label: "Email / Communication", type: "number", placeholder: "e.g. 4", suffix: "hours" },
        { name: "adminHours", label: "Admin / Paperwork", type: "number", placeholder: "e.g. 3", suffix: "hours" },
        { name: "learningHours", label: "Learning / Training", type: "number", placeholder: "e.g. 2", suffix: "hours" },
        { name: "targetHours", label: "Target Weekly Hours", type: "number", placeholder: "e.g. 40", suffix: "hours", defaultValue: 40 },
      ],
      calculate: (inputs) => {
        const dev = (inputs.devHours as number) || 0;
        const meetings = (inputs.meetingHours as number) || 0;
        const email = (inputs.emailHours as number) || 0;
        const admin = (inputs.adminHours as number) || 0;
        const learning = (inputs.learningHours as number) || 0;
        const target = (inputs.targetHours as number) || 40;

        const total = dev + meetings + email + admin + learning;
        if (total === 0) return null;

        const pct = (h: number) => `${formatNumber((h / total) * 100, 1)}%`;
        const diff = total - target;

        return {
          primary: { label: "Total Hours Tracked", value: `${formatNumber(total, 1)}` },
          details: [
            { label: "Core work", value: `${formatNumber(dev, 1)} hrs (${pct(dev)})` },
            { label: "Meetings", value: `${formatNumber(meetings, 1)} hrs (${pct(meetings)})` },
            { label: "Email / Communication", value: `${formatNumber(email, 1)} hrs (${pct(email)})` },
            { label: "Admin / Paperwork", value: `${formatNumber(admin, 1)} hrs (${pct(admin)})` },
            { label: "Learning / Training", value: `${formatNumber(learning, 1)} hrs (${pct(learning)})` },
            { label: "vs. Target", value: `${diff >= 0 ? "+" : ""}${formatNumber(diff, 1)} hrs` },
            { label: "Productive ratio", value: `${formatNumber(((dev + learning) / total) * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "daily",
      name: "Daily Time Log",
      description: "Log and calculate daily hours",
      fields: [
        { name: "startHour", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startMin", label: "Start Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "endHour", label: "End Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "endMin", label: "End Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59, defaultValue: 0 },
        { name: "breakMin", label: "Total Breaks", type: "number", placeholder: "e.g. 60", suffix: "min", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const sH = inputs.startHour as number;
        const sM = (inputs.startMin as number) || 0;
        const eH = inputs.endHour as number;
        const eM = (inputs.endMin as number) || 0;
        const brk = (inputs.breakMin as number) || 0;
        if (sH === undefined || eH === undefined) return null;

        let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
        if (totalMin < 0) totalMin += 24 * 60;
        const workMin = totalMin - brk;
        const hours = workMin / 60;

        return {
          primary: { label: "Net Working Time", value: `${Math.floor(hours)}h ${Math.round(workMin % 60)}m` },
          details: [
            { label: "Gross time", value: `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` },
            { label: "Break time", value: `${brk} minutes` },
            { label: "Decimal hours", value: formatNumber(hours, 2) },
            { label: "8-hour day completion", value: `${formatNumber((hours / 8) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["time-card-calculator", "billable-hours-calculator", "pomodoro-timer-calculator"],
  faq: [
    { question: "How should I categorize my time?", answer: "Common categories include core work (development, design, writing), meetings, email/communication, admin/paperwork, learning/training, and breaks. The key is consistency so you can compare weeks and identify patterns." },
    { question: "What is a good productive ratio?", answer: "A productive ratio of 60-70% is typical for knowledge workers. This means 60-70% of time is spent on core work and learning, with the rest on meetings, email, and admin. If your ratio is below 50%, look for ways to reduce overhead." },
  ],
  formula: "Total Hours = Sum of all category hours | Productive Ratio = (Core Work + Learning) / Total x 100",
};
