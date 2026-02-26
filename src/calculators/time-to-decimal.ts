import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeToDecimalConverter: CalculatorDefinition = {
  slug: "time-to-decimal-converter",
  title: "Time to Decimal Converter",
  description:
    "Free online time to decimal converter. Convert hours, minutes, and seconds to decimal hours for timesheets and payroll calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "time to decimal",
    "decimal hours",
    "time converter",
    "timesheet calculator",
    "hours to decimal",
    "minutes to decimal",
  ],
  variants: [
    {
      id: "time-to-decimal",
      name: "Time to Decimal Hours",
      description: "Convert hours, minutes, and seconds to decimal hours",
      fields: [
        {
          name: "hours",
          label: "Hours",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
        },
        {
          name: "minutes",
          label: "Minutes",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          max: 59,
        },
        {
          name: "seconds",
          label: "Seconds",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 59,
        },
      ],
      calculate: (inputs) => {
        const h = parseFloat(inputs.hours as string) || 0;
        const m = parseFloat(inputs.minutes as string) || 0;
        const s = parseFloat(inputs.seconds as string) || 0;

        const decimalHours = h + m / 60 + s / 3600;
        const totalMinutes = h * 60 + m + s / 60;
        const totalSeconds = h * 3600 + m * 60 + s;

        return {
          primary: {
            label: "Decimal Hours",
            value: formatNumber(decimalHours, 4),
          },
          details: [
            { label: "Total minutes", value: formatNumber(totalMinutes, 2) },
            { label: "Total seconds", value: formatNumber(totalSeconds) },
            { label: "Fraction of a day", value: formatNumber(decimalHours / 24, 4) },
          ],
        };
      },
    },
    {
      id: "decimal-to-time",
      name: "Decimal Hours to Time",
      description: "Convert decimal hours back to hours, minutes, and seconds",
      fields: [
        {
          name: "decimalHours",
          label: "Decimal Hours",
          type: "number",
          placeholder: "e.g. 8.75",
          min: 0,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const dec = parseFloat(inputs.decimalHours as string) || 0;
        if (dec < 0) return null;

        const totalSeconds = Math.round(dec * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, "0");

        return {
          primary: {
            label: "Time",
            value: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
          },
          details: [
            { label: "Hours", value: formatNumber(hours) },
            { label: "Minutes", value: formatNumber(minutes) },
            { label: "Seconds", value: formatNumber(seconds) },
            { label: "Total minutes", value: formatNumber(dec * 60, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["add-time-calculator", "subtract-time-calculator"],
  faq: [
    {
      question: "Why convert time to decimal?",
      answer:
        "Decimal hours are commonly used in timesheets, payroll, and billing. For example, 8 hours and 30 minutes is 8.5 decimal hours, which makes it easier to multiply by an hourly rate.",
    },
    {
      question: "How do I convert minutes to decimal?",
      answer:
        "Divide the minutes by 60. For example, 45 minutes = 45/60 = 0.75 decimal hours.",
    },
  ],
  formula: "Decimal Hours = Hours + (Minutes / 60) + (Seconds / 3600)",
};
