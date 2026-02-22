import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pomodoroTimerCalculator: CalculatorDefinition = {
  slug: "pomodoro-timer-calculator",
  title: "Pomodoro Timer Calculator",
  description: "Free Pomodoro technique calculator. Plan your work sessions, breaks, and estimate how many Pomodoros you need to complete tasks.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pomodoro calculator", "pomodoro timer", "pomodoro technique", "work session calculator", "focus timer calculator"],
  variants: [
    {
      id: "sessions",
      name: "Pomodoro Session Planner",
      description: "Plan Pomodoro sessions for a workday",
      fields: [
        { name: "totalHours", label: "Total Work Hours Available", type: "number", placeholder: "e.g. 8", suffix: "hours" },
        { name: "workLength", label: "Pomodoro Length", type: "number", placeholder: "e.g. 25", suffix: "min", defaultValue: 25 },
        { name: "shortBreak", label: "Short Break Length", type: "number", placeholder: "e.g. 5", suffix: "min", defaultValue: 5 },
        { name: "longBreak", label: "Long Break Length", type: "number", placeholder: "e.g. 15", suffix: "min", defaultValue: 15 },
        { name: "longBreakAfter", label: "Long Break After Every", type: "number", placeholder: "e.g. 4", suffix: "sessions", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const totalHours = inputs.totalHours as number;
        const workLen = (inputs.workLength as number) || 25;
        const shortBrk = (inputs.shortBreak as number) || 5;
        const longBrk = (inputs.longBreak as number) || 15;
        const longAfter = (inputs.longBreakAfter as number) || 4;
        if (!totalHours || totalHours <= 0) return null;

        const totalMinutes = totalHours * 60;
        let elapsed = 0;
        let sessions = 0;

        while (true) {
          elapsed += workLen;
          if (elapsed > totalMinutes) break;
          sessions++;
          const isLongBreak = sessions % longAfter === 0;
          const breakTime = isLongBreak ? longBrk : shortBrk;
          elapsed += breakTime;
          if (elapsed >= totalMinutes) break;
        }

        const focusMinutes = sessions * workLen;
        const focusHours = focusMinutes / 60;
        const longBreaks = Math.floor(sessions / longAfter);
        const shortBreaks = sessions > 0 ? sessions - 1 - longBreaks + (sessions % longAfter === 0 ? 1 : 0) : 0;
        const actualShortBreaks = Math.max(0, sessions - 1 - longBreaks);
        const breakMinutes = actualShortBreaks * shortBrk + longBreaks * longBrk;

        return {
          primary: { label: "Pomodoro Sessions", value: `${sessions}` },
          details: [
            { label: "Total focus time", value: `${formatNumber(focusHours, 1)} hours (${focusMinutes} min)` },
            { label: "Total break time", value: `${breakMinutes} minutes` },
            { label: "Short breaks", value: `${actualShortBreaks}` },
            { label: "Long breaks", value: `${longBreaks}` },
            { label: "Focus-to-break ratio", value: breakMinutes > 0 ? `${formatNumber(focusMinutes / breakMinutes, 1)}:1` : "N/A" },
          ],
        };
      },
    },
    {
      id: "task",
      name: "Task Pomodoro Estimator",
      description: "Estimate how many Pomodoros a task will take",
      fields: [
        { name: "taskMinutes", label: "Estimated Task Duration", type: "number", placeholder: "e.g. 120", suffix: "min" },
        { name: "workLength", label: "Pomodoro Length", type: "number", placeholder: "e.g. 25", suffix: "min", defaultValue: 25 },
        { name: "shortBreak", label: "Short Break", type: "number", placeholder: "e.g. 5", suffix: "min", defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const taskMin = inputs.taskMinutes as number;
        const workLen = (inputs.workLength as number) || 25;
        const shortBrk = (inputs.shortBreak as number) || 5;
        if (!taskMin || taskMin <= 0) return null;

        const pomodoros = Math.ceil(taskMin / workLen);
        const totalBreaks = Math.max(0, pomodoros - 1);
        const breakTime = totalBreaks * shortBrk;
        const totalTime = pomodoros * workLen + breakTime;

        return {
          primary: { label: "Pomodoros Needed", value: `${pomodoros}` },
          details: [
            { label: "Focus time", value: `${pomodoros * workLen} minutes` },
            { label: "Break time", value: `${breakTime} minutes` },
            { label: "Total wall-clock time", value: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m` },
            { label: "Number of breaks", value: `${totalBreaks}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["time-card-calculator", "break-even-calculator", "date-calculator"],
  faq: [
    { question: "What is the Pomodoro Technique?", answer: "The Pomodoro Technique is a time management method where you work in focused 25-minute intervals (called Pomodoros) separated by 5-minute breaks. After every 4 Pomodoros, you take a longer 15-minute break. This helps maintain focus and prevent burnout." },
    { question: "Can I change the Pomodoro length?", answer: "Yes. While the traditional Pomodoro is 25 minutes, many people adjust it. Common variations include 50-minute work / 10-minute break for deep work, or 15-minute work / 3-minute break for tasks requiring frequent context switching." },
  ],
  formula: "Pomodoros = ceil(Task Duration / Work Length) | Total Time = (Pomodoros x Work Length) + ((Pomodoros - 1) x Break Length)",
};
