import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timezoneOverlapCalculator: CalculatorDefinition = {
  slug: "timezone-overlap-calculator",
  title: "Timezone Overlap Calculator",
  description: "Find overlapping working hours between two time zones for scheduling meetings with international contacts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["timezone overlap","time zone meeting planner","international meeting time","working hours overlap"],
  variants: [{
    id: "standard",
    name: "Timezone Overlap",
    description: "Find overlapping working hours between two time zones for scheduling meetings with international contacts.",
    fields: [
      { name: "yourOffset", label: "Your UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: -5 },
      { name: "theirOffset", label: "Their UTC Offset (hours)", type: "number", min: -12, max: 14, defaultValue: 1 },
      { name: "workStart", label: "Work Day Start Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 9 },
      { name: "workEnd", label: "Work Day End Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 17 },
    ],
    calculate: (inputs) => {
    const yourOffset = inputs.yourOffset as number;
    const theirOffset = inputs.theirOffset as number;
    const workStart = inputs.workStart as number;
    const workEnd = inputs.workEnd as number;
    const diff = theirOffset - yourOffset;
    const theirStartInYourTime = workStart + diff;
    const theirEndInYourTime = workEnd + diff;
    const overlapStart = Math.max(workStart, theirStartInYourTime);
    const overlapEnd = Math.min(workEnd, theirEndInYourTime);
    const overlapHours = Math.max(overlapEnd - overlapStart, 0);
    const formatHour = (h: number) => {
      const normalized = ((h % 24) + 24) % 24;
      const ampm = normalized >= 12 ? "PM" : "AM";
      const hour12 = normalized % 12 || 12;
      return hour12 + ":00 " + ampm;
    };
    return {
      primary: { label: "Overlapping Work Hours", value: formatNumber(overlapHours) + " hours" },
      details: [
        { label: "Time Difference", value: formatNumber(Math.abs(diff)) + " hours " + (diff > 0 ? "ahead" : "behind") },
        { label: "Your Working Hours", value: formatHour(workStart) + " - " + formatHour(workEnd) },
        { label: "Their Hours (your time)", value: formatHour(theirStartInYourTime) + " - " + formatHour(theirEndInYourTime) },
        { label: "Best Meeting Window", value: overlapHours > 0 ? formatHour(overlapStart) + " - " + formatHour(overlapEnd) + " your time" : "No overlap" }
      ]
    };
  },
  }],
  relatedSlugs: ["time-zone-meeting-calculator","travel-budget-calculator","jet-lag-recovery-time-calculator"],
  faq: [
    { question: "How do I find overlapping work hours across time zones?", answer: "Convert both schedules to the same time zone, then find the intersection of working hours. Tools and calculators can automate this." },
    { question: "What is the biggest time difference possible?", answer: "The maximum time difference is 26 hours, between UTC-12 (Baker Island) and UTC+14 (Line Islands, Kiribati)." },
    { question: "How do I handle meetings across many time zones?", answer: "Rotate meeting times to share the inconvenience, use async communication when possible, and record meetings for those who cannot attend live." },
  ],
  formula: "Time Difference = Their Offset - Your Offset
Overlap = max(0, min(Your End, Their End in Your Time) - max(Your Start, Their Start in Your Time))",
};
