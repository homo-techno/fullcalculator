import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decimalTimeCalculator: CalculatorDefinition = {
  slug: "decimal-time-calculator",
  title: "Decimal Time Converter",
  description:
    "Free decimal time converter. Convert hours and minutes to decimal hours, or decimal hours back to hours and minutes. Essential for payroll and billing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "decimal time converter",
    "hours to decimal",
    "decimal hours calculator",
    "minutes to decimal",
    "time to decimal converter",
  ],
  variants: [
    {
      id: "to-decimal",
      name: "Hours & Minutes to Decimal",
      description: "Convert hours and minutes to decimal hours",
      fields: [
        { name: "hours", label: "Hours", type: "number", placeholder: "e.g. 8", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 45", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const h = (inputs.hours as number) || 0;
        const m = (inputs.minutes as number) || 0;
        if (h === 0 && m === 0) return null;

        const decimal = h + m / 60;
        const totalMinutes = h * 60 + m;

        return {
          primary: {
            label: "Decimal Hours",
            value: formatNumber(decimal, 4),
          },
          details: [
            { label: "Input time", value: `${h}h ${m}m` },
            { label: "Decimal (2 places)", value: formatNumber(decimal, 2) },
            { label: "Decimal (4 places)", value: formatNumber(decimal, 4) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
            { label: "Fraction of 8h day", value: `${formatNumber((decimal / 8) * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "from-decimal",
      name: "Decimal to Hours & Minutes",
      description: "Convert decimal hours to hours and minutes",
      fields: [
        { name: "decimal", label: "Decimal Hours", type: "number", placeholder: "e.g. 8.75", step: 0.01 },
      ],
      calculate: (inputs) => {
        const decimal = inputs.decimal as number;
        if (!decimal && decimal !== 0) return null;

        const totalMinutes = Math.round(decimal * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const totalSeconds = Math.round(decimal * 3600);
        const secs = totalSeconds % 60;

        return {
          primary: {
            label: "Time",
            value: `${hours}h ${minutes}m`,
          },
          details: [
            { label: "Decimal input", value: formatNumber(decimal, 4) },
            { label: "Hours", value: `${hours}` },
            { label: "Minutes", value: `${minutes}` },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
            { label: "HH:MM:SS", value: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}` },
          ],
        };
      },
    },
    {
      id: "minutes-to-decimal",
      name: "Minutes to Decimal Hours",
      description: "Convert a total number of minutes to decimal hours",
      fields: [
        { name: "totalMinutes", label: "Total Minutes", type: "number", placeholder: "e.g. 525", min: 0 },
      ],
      calculate: (inputs) => {
        const totalMin = inputs.totalMinutes as number;
        if (!totalMin) return null;

        const decimal = totalMin / 60;
        const hours = Math.floor(decimal);
        const minutes = totalMin % 60;

        return {
          primary: { label: "Decimal Hours", value: formatNumber(decimal, 4) },
          details: [
            { label: "Hours and minutes", value: `${hours}h ${minutes}m` },
            { label: "Total minutes", value: formatNumber(totalMin) },
            { label: "Fraction of 8h day", value: `${formatNumber((decimal / 8) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "hours-calculator",
    "time-card-calculator",
    "work-hours-calculator",
  ],
  faq: [
    {
      question: "How do I convert minutes to decimal hours?",
      answer:
        "Divide the minutes by 60. For example, 45 minutes = 45/60 = 0.75 decimal hours. So 8 hours 45 minutes = 8.75 decimal hours.",
    },
    {
      question: "Why use decimal time for payroll?",
      answer:
        "Decimal time simplifies pay calculations. Instead of calculating with hours and minutes, you multiply decimal hours by the hourly rate. For example, 8.75 hours x $20/hr = $175.00.",
    },
    {
      question: "What are common minute-to-decimal conversions?",
      answer:
        "15 min = 0.25, 30 min = 0.50, 45 min = 0.75, 10 min = 0.17, 20 min = 0.33, 5 min = 0.08, 6 min = 0.10.",
    },
  ],
  formula: "Decimal Hours = Hours + (Minutes / 60)",
};
