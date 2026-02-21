import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const AMPM_OPTIONS = [
  { label: "AM", value: "am" },
  { label: "PM", value: "pm" },
];

export const militaryTimeCalculator: CalculatorDefinition = {
  slug: "military-time-calculator",
  title: "Military Time Converter",
  description:
    "Free military time converter. Convert between 24-hour (military) and 12-hour time formats instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "military time converter",
    "24 hour to 12 hour",
    "military time calculator",
    "convert military time",
    "24h time converter",
  ],
  variants: [
    {
      id: "to-12h",
      name: "Military (24h) to Standard (12h)",
      description: "Convert 24-hour military time to 12-hour standard time",
      fields: [
        { name: "hour", label: "Hour (0-23)", type: "number", placeholder: "e.g. 14", min: 0, max: 23 },
        { name: "minute", label: "Minute", type: "number", placeholder: "e.g. 30", min: 0, max: 59, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const h = inputs.hour as number;
        const m = (inputs.minute as number) || 0;
        if (h === undefined || h === null) return null;

        const period = h >= 12 ? "PM" : "AM";
        let standardHour = h % 12;
        if (standardHour === 0) standardHour = 12;

        const militaryStr = `${h.toString().padStart(2, "0")}${m.toString().padStart(2, "0")}`;
        const standardStr = `${standardHour}:${m.toString().padStart(2, "0")} ${period}`;

        // Spoken form
        let spoken: string;
        if (h === 0 && m === 0) spoken = "Zero hundred hours (midnight)";
        else if (h === 12 && m === 0) spoken = "Twelve hundred hours (noon)";
        else if (m === 0) spoken = `${h.toString().padStart(2, "0")} hundred hours`;
        else spoken = `${h.toString().padStart(2, "0")} ${m.toString().padStart(2, "0")} hours`;

        return {
          primary: { label: `${militaryStr} Military Time`, value: standardStr },
          details: [
            { label: "Military notation", value: militaryStr },
            { label: "Standard notation", value: standardStr },
            { label: "Spoken form", value: spoken },
            { label: "Period", value: period === "AM" ? "Morning (AM)" : "Afternoon/Evening (PM)" },
          ],
        };
      },
    },
    {
      id: "to-24h",
      name: "Standard (12h) to Military (24h)",
      description: "Convert 12-hour standard time to 24-hour military time",
      fields: [
        { name: "hour", label: "Hour (1-12)", type: "number", placeholder: "e.g. 2", min: 1, max: 12 },
        { name: "minute", label: "Minute", type: "number", placeholder: "e.g. 30", min: 0, max: 59, defaultValue: 0 },
        { name: "period", label: "AM/PM", type: "select", options: AMPM_OPTIONS, defaultValue: "pm" },
      ],
      calculate: (inputs) => {
        const h = inputs.hour as number;
        const m = (inputs.minute as number) || 0;
        const period = inputs.period as string;
        if (!h) return null;

        let militaryHour = h;
        if (period === "am") {
          if (h === 12) militaryHour = 0;
        } else {
          if (h !== 12) militaryHour = h + 12;
        }

        const militaryStr = `${militaryHour.toString().padStart(2, "0")}${m.toString().padStart(2, "0")}`;
        const standardStr = `${h}:${m.toString().padStart(2, "0")} ${period.toUpperCase()}`;

        return {
          primary: { label: `${standardStr}`, value: militaryStr },
          details: [
            { label: "Military time", value: `${militaryHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` },
            { label: "Standard time", value: standardStr },
            { label: "24-hour format", value: `${militaryHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-zone-converter",
    "hours-calculator",
    "time-card-calculator",
  ],
  faq: [
    {
      question: "How does military time work?",
      answer:
        "Military time uses a 24-hour clock. Hours run from 00 (midnight) to 23 (11 PM). There is no AM or PM. For example, 1:00 PM = 1300, 6:00 AM = 0600, midnight = 0000.",
    },
    {
      question: "How do I convert PM times to military time?",
      answer:
        "For PM times, add 12 to the hour. 1 PM = 13, 2 PM = 14, ..., 11 PM = 23. Exception: 12 PM (noon) stays as 12. For AM: 12 AM (midnight) = 00, all other AM hours stay the same.",
    },
    {
      question: "Why is military time used?",
      answer:
        "Military time eliminates ambiguity between AM and PM. It is used by the military, aviation, hospitals, emergency services, and in most countries outside the US as the standard time format.",
    },
  ],
  formula: "Military Hour = Standard Hour + 12 (for PM, except 12 PM) | 0 (for 12 AM)",
};
