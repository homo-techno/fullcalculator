import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studyBreakCalculator: CalculatorDefinition = {
  slug: "study-break-calculator",
  title: "Study Break Timer Calculator",
  description:
    "Free study break timer calculator. Optimize your study sessions with Pomodoro and other timing techniques for maximum productivity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "study break calculator",
    "pomodoro calculator",
    "study session timer",
    "break timer calculator",
    "study productivity timer",
  ],
  variants: [
    {
      id: "pomodoro",
      name: "Pomodoro Technique",
      description: "Calculate study and break intervals using the Pomodoro method (25 min study / 5 min break)",
      fields: [
        { name: "totalStudyMinutes", label: "Total Available Time (minutes)", type: "number", placeholder: "e.g. 120", min: 25 },
        { name: "sessionLength", label: "Study Session Length (minutes)", type: "number", placeholder: "e.g. 25", min: 10, max: 60, defaultValue: 25 },
        { name: "shortBreak", label: "Short Break Length (minutes)", type: "number", placeholder: "e.g. 5", min: 1, max: 15, defaultValue: 5 },
        { name: "longBreak", label: "Long Break After 4 Sessions (min)", type: "number", placeholder: "e.g. 15", min: 5, max: 30, defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const total = inputs.totalStudyMinutes as number;
        const session = (inputs.sessionLength as number) || 25;
        const shortB = (inputs.shortBreak as number) || 5;
        const longB = (inputs.longBreak as number) || 15;
        if (!total) return null;

        let elapsed = 0;
        let sessions = 0;
        let totalStudy = 0;
        let totalBreak = 0;

        while (elapsed + session <= total) {
          elapsed += session;
          totalStudy += session;
          sessions++;

          if (elapsed >= total) break;

          if (sessions % 4 === 0) {
            elapsed += longB;
            totalBreak += longB;
          } else {
            elapsed += shortB;
            totalBreak += shortB;
          }
        }

        const efficiency = (totalStudy / total) * 100;

        return {
          primary: { label: "Study Sessions", value: formatNumber(sessions, 0) },
          details: [
            { label: "Actual study time", value: `${formatNumber(totalStudy, 0)} min` },
            { label: "Total break time", value: `${formatNumber(totalBreak, 0)} min` },
            { label: "Study efficiency", value: `${formatNumber(efficiency, 0)}%` },
            { label: "Long breaks", value: formatNumber(Math.floor(sessions / 4), 0) },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Study Plan",
      description: "Design your own study-to-break ratio",
      fields: [
        { name: "studyHours", label: "Total Study Goal (hours)", type: "number", placeholder: "e.g. 4", min: 0.5, max: 16, step: 0.5 },
        { name: "focusLength", label: "Focus Duration (minutes)", type: "number", placeholder: "e.g. 45", min: 10, max: 90 },
        { name: "breakLength", label: "Break Duration (minutes)", type: "number", placeholder: "e.g. 10", min: 1, max: 30 },
      ],
      calculate: (inputs) => {
        const hours = inputs.studyHours as number;
        const focus = inputs.focusLength as number;
        const breakLen = inputs.breakLength as number;
        if (!hours || !focus || !breakLen) return null;

        const totalMinutes = hours * 60;
        const cycleLength = focus + breakLen;
        const fullCycles = Math.floor(totalMinutes / cycleLength);
        const remainingMinutes = totalMinutes - fullCycles * cycleLength;
        const extraStudy = Math.min(remainingMinutes, focus);
        const actualStudy = fullCycles * focus + extraStudy;
        const actualBreak = fullCycles * breakLen;
        const totalUsed = actualStudy + actualBreak;

        return {
          primary: { label: "Study Cycles", value: formatNumber(fullCycles + (extraStudy > 0 ? 1 : 0), 0) },
          details: [
            { label: "Actual study time", value: `${formatNumber(actualStudy, 0)} min (${formatNumber(actualStudy / 60, 1)} hrs)` },
            { label: "Total break time", value: `${formatNumber(actualBreak, 0)} min` },
            { label: "Time used", value: `${formatNumber(totalUsed, 0)} of ${formatNumber(totalMinutes, 0)} min` },
            { label: "Study-to-break ratio", value: `${focus}:${breakLen}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["study-time-calculator", "reading-time-calculator"],
  faq: [
    {
      question: "What is the Pomodoro Technique?",
      answer:
        "The Pomodoro Technique uses 25-minute focused study sessions separated by 5-minute breaks. After every 4 sessions, take a longer 15-30 minute break. It helps maintain focus and prevent mental fatigue.",
    },
    {
      question: "How long should study breaks be?",
      answer:
        "Research suggests 5-10 minutes for short breaks and 15-30 minutes for longer breaks. The key is to truly rest - step away from your desk, stretch, or get a snack.",
    },
  ],
  formula: "Sessions = Total Time / (Session Length + Break Length)",
};
