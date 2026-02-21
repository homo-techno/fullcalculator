import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeUntilCalculator: CalculatorDefinition = {
  slug: "time-until-calculator",
  title: "Time Until Date Calculator",
  description:
    "Free time until calculator. Calculate exactly how much time remains until any future date in years, months, days, hours, and minutes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "time until date",
    "how long until",
    "time remaining calculator",
    "countdown timer",
    "days hours until",
  ],
  variants: [
    {
      id: "time-until",
      name: "Time Until a Date",
      description: "Calculate how much time remains until a future date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2027", min: 2024, max: 2200 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "hour", label: "Hour (0-23, optional)", type: "number", placeholder: "e.g. 9", min: 0, max: 23, defaultValue: 0 },
        { name: "minute", label: "Minute (optional)", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const h = (inputs.hour as number) || 0;
        const min = (inputs.minute as number) || 0;
        if (!y || !m || !d) return null;

        const future = new Date(y, m - 1, d, h, min);
        const now = new Date();
        if (future <= now) {
          return {
            primary: { label: "Time Until", value: "Date has already passed" },
            details: [],
          };
        }

        const diffMs = future.getTime() - now.getTime();

        // Precise breakdown
        let years = future.getFullYear() - now.getFullYear();
        let months = future.getMonth() - now.getMonth();
        let days = future.getDate() - now.getDate();
        let hours = future.getHours() - now.getHours();
        let minutes = future.getMinutes() - now.getMinutes();

        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { days--; hours += 24; }
        if (days < 0) {
          months--;
          const prevMonth = new Date(future.getFullYear(), future.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) { years--; months += 12; }

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalWeeks = Math.floor(totalDays / 7);

        // Business days
        let businessDays = 0;
        const counter = new Date(now);
        counter.setHours(0, 0, 0, 0);
        const futureNorm = new Date(y, m - 1, d);
        while (counter < futureNorm) {
          const dow = counter.getDay();
          if (dow !== 0 && dow !== 6) businessDays++;
          counter.setDate(counter.getDate() + 1);
        }

        return {
          primary: {
            label: "Time Until",
            value: `${years}y ${months}m ${days}d ${hours}h ${minutes}m`,
          },
          details: [
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
            { label: "Business days", value: formatNumber(businessDays) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-since-calculator",
    "countdown-days-calculator",
    "event-countdown-calculator",
  ],
  faq: [
    {
      question: "How is time until a date calculated?",
      answer:
        "The calculator measures the exact difference from the current moment to the target date and time, broken down into years, months, days, hours, and minutes.",
    },
    {
      question: "What are business days?",
      answer:
        "Business days (or working days) count only Monday through Friday, excluding Saturday and Sunday. Holidays are not excluded in this calculation.",
    },
  ],
  formula: "Time Until = Future Date - Now",
};
