import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeSinceCalculator: CalculatorDefinition = {
  slug: "time-since-calculator",
  title: "Time Since Date Calculator",
  description:
    "Free time since calculator. Calculate the exact elapsed time since any past date in years, months, days, hours, and minutes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "time since date",
    "elapsed time calculator",
    "how long since",
    "time elapsed",
    "time passed since date",
  ],
  variants: [
    {
      id: "time-since",
      name: "Time Since a Date",
      description: "Calculate exactly how much time has passed since a date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2020", min: 1900, max: 2026 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "hour", label: "Hour (0-23, optional)", type: "number", placeholder: "e.g. 12", min: 0, max: 23, defaultValue: 0 },
        { name: "minute", label: "Minute (optional)", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const h = (inputs.hour as number) || 0;
        const min = (inputs.minute as number) || 0;
        if (!y || !m || !d) return null;

        const past = new Date(y, m - 1, d, h, min);
        const now = new Date();
        if (past > now) return null;

        const diffMs = now.getTime() - past.getTime();

        // Precise year/month/day breakdown
        let years = now.getFullYear() - past.getFullYear();
        let months = now.getMonth() - past.getMonth();
        let days = now.getDate() - past.getDate();
        let hours = now.getHours() - past.getHours();
        let minutes = now.getMinutes() - past.getMinutes();

        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { days--; hours += 24; }
        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) { years--; months += 12; }

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalWeeks = Math.floor(totalDays / 7);

        return {
          primary: {
            label: "Time Since",
            value: `${years}y ${months}m ${days}d ${hours}h ${minutes}m`,
          },
          details: [
            { label: "Years", value: `${years}` },
            { label: "Months", value: `${years * 12 + months}` },
            { label: "Weeks", value: formatNumber(totalWeeks) },
            { label: "Days", value: formatNumber(totalDays) },
            { label: "Hours", value: formatNumber(totalHours) },
            { label: "Minutes", value: formatNumber(totalMinutes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-until-calculator",
    "days-between-dates-calculator",
    "age-calculator",
  ],
  faq: [
    {
      question: "How is time since calculated?",
      answer:
        "The calculator finds the exact difference between the given date/time and the current moment, broken down into years, months, days, hours, and minutes.",
    },
    {
      question: "Does this account for daylight saving time?",
      answer:
        "The calculation uses your browser's local time. Daylight saving shifts may affect hour-level precision by up to 1 hour.",
    },
  ],
  formula: "Elapsed Time = Now - Past Date",
};
