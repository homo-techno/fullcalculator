import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeZoneMeetingCalculator: CalculatorDefinition = {
  slug: "time-zone-meeting-calculator",
  title: "Time Zone Meeting Calculator",
  description: "Find the best overlapping meeting time across different time zones for your team.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time zone meeting", "meeting time zones", "best meeting time calculator"],
  variants: [{
    id: "standard",
    name: "Time Zone Meeting",
    description: "Find the best overlapping meeting time across different time zones for your team",
    fields: [
      { name: "yourOffset", label: "Your UTC Offset", type: "number", suffix: "hours", min: -12, max: 14, defaultValue: -5 },
      { name: "theirOffset", label: "Other Party UTC Offset", type: "number", suffix: "hours", min: -12, max: 14, defaultValue: 1 },
      { name: "workStart", label: "Earliest Acceptable Hour", type: "number", suffix: "(24h)", min: 6, max: 12, defaultValue: 9 },
      { name: "workEnd", label: "Latest Acceptable Hour", type: "number", suffix: "(24h)", min: 15, max: 22, defaultValue: 18 },
    ],
    calculate: (inputs) => {
      const myOffset = inputs.yourOffset as number;
      const theirOffset = inputs.theirOffset as number;
      const workStart = inputs.workStart as number;
      const workEnd = inputs.workEnd as number;
      if (workStart >= workEnd) return null;
      const diff = theirOffset - myOffset;
      const theirStart = workStart + diff;
      const theirEnd = workEnd + diff;
      const overlapStart = Math.max(workStart, theirStart);
      const overlapEnd = Math.min(workEnd, theirEnd);
      const overlapHours = Math.max(0, overlapEnd - overlapStart);
      const bestMeetingLocal = overlapHours > 0 ? Math.round((overlapStart + overlapEnd) / 2) : -1;
      const bestMeetingTheirs = bestMeetingLocal >= 0 ? bestMeetingLocal + diff : -1;
      const formatHour = (h: number) => { const hr = ((h % 24) + 24) % 24; return hr + ":00"; };
      return {
        primary: { label: "Overlapping Hours", value: overlapHours > 0 ? formatNumber(overlapHours) + " hours" : "No overlap found" },
        details: [
          { label: "Best Meeting Time (Your Time)", value: bestMeetingLocal >= 0 ? formatHour(bestMeetingLocal) : "N/A" },
          { label: "Best Meeting Time (Their Time)", value: bestMeetingTheirs >= 0 ? formatHour(bestMeetingTheirs) : "N/A" },
          { label: "Time Difference", value: formatNumber(Math.abs(diff)) + " hours " + (diff > 0 ? "ahead" : diff < 0 ? "behind" : "same") },
        ],
      };
    },
  }],
  relatedSlugs: ["moving-day-tip-calculator", "potluck-planner-calculator"],
  faq: [
    { question: "How do I find the best meeting time across time zones?", answer: "Identify the working hours for all participants and find the overlapping window. The middle of the overlap is usually the best compromise for everyone." },
    { question: "What is UTC and how does it work?", answer: "UTC (Coordinated Universal Time) is the global time standard. Time zones are expressed as offsets from UTC. For example, US Eastern is UTC-5 and Central European is UTC+1." },
  ],
  formula: "Overlap = Max(0, Min(End1, End2 + Offset) - Max(Start1, Start2 + Offset))",
};
