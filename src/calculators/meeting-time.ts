import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const MEETING_TZ_OPTIONS = [
  { label: "UTC-10 (Hawaii)", value: "-10" },
  { label: "UTC-9 (Alaska)", value: "-9" },
  { label: "UTC-8 (Pacific / LA)", value: "-8" },
  { label: "UTC-7 (Mountain / Denver)", value: "-7" },
  { label: "UTC-6 (Central / Chicago)", value: "-6" },
  { label: "UTC-5 (Eastern / NY)", value: "-5" },
  { label: "UTC-4 (Atlantic)", value: "-4" },
  { label: "UTC-3 (Buenos Aires)", value: "-3" },
  { label: "UTC+0 (London / GMT)", value: "0" },
  { label: "UTC+1 (Berlin / Paris)", value: "1" },
  { label: "UTC+2 (Cairo / Helsinki)", value: "2" },
  { label: "UTC+3 (Moscow / Istanbul)", value: "3" },
  { label: "UTC+4 (Dubai)", value: "4" },
  { label: "UTC+5 (Karachi)", value: "5" },
  { label: "UTC+5:30 (India)", value: "5.5" },
  { label: "UTC+6 (Dhaka)", value: "6" },
  { label: "UTC+7 (Bangkok)", value: "7" },
  { label: "UTC+8 (Singapore / Beijing)", value: "8" },
  { label: "UTC+9 (Tokyo / Seoul)", value: "9" },
  { label: "UTC+10 (Sydney)", value: "10" },
  { label: "UTC+12 (Auckland)", value: "12" },
];

export const meetingTimeCalculator: CalculatorDefinition = {
  slug: "meeting-time-calculator",
  title: "Meeting Time Across Time Zones Calculator",
  description:
    "Free meeting time calculator. Find the best time for meetings across multiple time zones. See what time it will be in each location.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "meeting time calculator",
    "meeting across time zones",
    "best meeting time",
    "schedule international meeting",
    "world meeting planner",
  ],
  variants: [
    {
      id: "meeting-planner",
      name: "Meeting Time Planner",
      description: "Set a meeting time and see it in other time zones",
      fields: [
        { name: "hour", label: "Meeting Hour (0-23)", type: "number", placeholder: "e.g. 10", min: 0, max: 23 },
        { name: "minute", label: "Meeting Minute", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "yourZone", label: "Your Time Zone", type: "select", options: MEETING_TZ_OPTIONS, defaultValue: "-5" },
        { name: "zone2", label: "Participant 2 Zone", type: "select", options: MEETING_TZ_OPTIONS, defaultValue: "0" },
        { name: "zone3", label: "Participant 3 Zone", type: "select", options: MEETING_TZ_OPTIONS, defaultValue: "5.5" },
      ],
      calculate: (inputs) => {
        const hour = inputs.hour as number;
        const minute = (inputs.minute as number) || 0;
        const yourZone = parseFloat(inputs.yourZone as string);
        const z2 = parseFloat(inputs.zone2 as string);
        const z3 = parseFloat(inputs.zone3 as string);
        if (hour === undefined || hour === null) return null;

        const convertTime = (sourceHour: number, sourceMin: number, fromOffset: number, toOffset: number) => {
          const diff = toOffset - fromOffset;
          let totalMin = sourceHour * 60 + sourceMin + diff * 60;
          let dayShift = 0;
          while (totalMin >= 24 * 60) { totalMin -= 24 * 60; dayShift++; }
          while (totalMin < 0) { totalMin += 24 * 60; dayShift--; }
          const h = Math.floor(totalMin / 60);
          const m = totalMin % 60;
          return { h, m, dayShift };
        };

        const fmtTime = (h: number, m: number, dayShift: number) => {
          const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
          const dayStr = dayShift > 0 ? ` (+${dayShift}d)` : dayShift < 0 ? ` (${dayShift}d)` : "";
          return timeStr + dayStr;
        };

        const isBusinessHours = (h: number) => h >= 8 && h <= 18;

        const t2 = convertTime(hour, minute, yourZone, z2);
        const t3 = convertTime(hour, minute, yourZone, z3);

        const z1Label = MEETING_TZ_OPTIONS.find((z) => z.value === String(yourZone))?.label || `UTC${yourZone}`;
        const z2Label = MEETING_TZ_OPTIONS.find((z) => z.value === String(z2))?.label || `UTC${z2}`;
        const z3Label = MEETING_TZ_OPTIONS.find((z) => z.value === String(z3))?.label || `UTC${z3}`;

        const yourBiz = isBusinessHours(hour) ? "Yes" : "No";
        const p2Biz = isBusinessHours(t2.h) ? "Yes" : "No";
        const p3Biz = isBusinessHours(t3.h) ? "Yes" : "No";

        return {
          primary: {
            label: "Your Meeting Time",
            value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          },
          details: [
            { label: `You (${z1Label})`, value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} - Business hours: ${yourBiz}` },
            { label: `P2 (${z2Label})`, value: `${fmtTime(t2.h, t2.m, t2.dayShift)} - Business hours: ${p2Biz}` },
            { label: `P3 (${z3Label})`, value: `${fmtTime(t3.h, t3.m, t3.dayShift)} - Business hours: ${p3Biz}` },
            { label: "All in business hours?", value: yourBiz === "Yes" && p2Biz === "Yes" && p3Biz === "Yes" ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-zone-converter",
    "time-zone-difference-calculator",
    "hours-calculator",
  ],
  faq: [
    {
      question: "How do I find the best meeting time across time zones?",
      answer:
        "Enter your proposed meeting time, then select the time zones of all participants. The calculator shows what time it will be in each zone and whether it falls within typical business hours (8 AM - 6 PM).",
    },
    {
      question: "What are typical business hours for international meetings?",
      answer:
        "Business hours are generally 8:00 AM to 6:00 PM local time. When scheduling across many time zones, look for overlap windows. For US-Europe, morning US / afternoon Europe works well. For US-Asia, it is harder and may require early morning or late evening for one party.",
    },
  ],
  formula: "Target Time = Meeting Time + (Target Zone Offset - Your Zone Offset)",
};
