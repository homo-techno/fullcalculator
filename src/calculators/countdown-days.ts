import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const countdownDaysCalculator: CalculatorDefinition = {
  slug: "countdown-days-calculator",
  title: "Countdown to Date Calculator",
  description:
    "Free countdown to date calculator. See exactly how many days, hours, and minutes until any future date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "countdown to date",
    "days until date",
    "how many days until",
    "countdown calculator",
    "days remaining",
  ],
  variants: [
    {
      id: "countdown",
      name: "Countdown to Date",
      description: "Count down the days, hours, and minutes until a future date",
      fields: [
        { name: "targetYear", label: "Target Year", type: "number", placeholder: "e.g. 2026", min: 2024, max: 2100 },
        { name: "targetMonth", label: "Target Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "targetDay", label: "Target Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.targetYear as number;
        const m = inputs.targetMonth as number;
        const d = inputs.targetDay as number;
        if (!y || !m || !d) return null;

        const target = new Date(y, m - 1, d);
        const now = new Date();
        const diffMs = target.getTime() - now.getTime();

        if (diffMs <= 0) {
          const pastDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
          return {
            primary: { label: "Countdown", value: "Date has passed!" },
            details: [
              { label: "Days ago", value: formatNumber(pastDays) },
            ],
          };
        }

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalSeconds = Math.floor(diffMs / 1000);
        const weeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const months = Math.floor(totalDays / 30.4375);

        // Weekdays
        let weekdays = 0;
        const current = new Date(now);
        current.setHours(0, 0, 0, 0);
        const targetNorm = new Date(y, m - 1, d);
        while (current < targetNorm) {
          const dow = current.getDay();
          if (dow !== 0 && dow !== 6) weekdays++;
          current.setDate(current.getDate() + 1);
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return {
          primary: {
            label: "Days Remaining",
            value: formatNumber(totalDays),
            suffix: "days",
          },
          details: [
            { label: "Target date", value: `${dayNames[target.getDay()]}, ${monthNames[m - 1]} ${d}, ${y}` },
            { label: "Weeks and days", value: `${weeks} weeks, ${remainingDays} days` },
            { label: "Approximate months", value: formatNumber(months) },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
            { label: "Weekdays remaining", value: formatNumber(weekdays) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "event-countdown-calculator",
    "days-between-dates-calculator",
    "time-until-calculator",
  ],
  faq: [
    {
      question: "How do I count days until a specific date?",
      answer:
        "Enter the target year, month, and day. The calculator computes the difference from today and shows the countdown in days, weeks, hours, and minutes.",
    },
    {
      question: "Does this include today in the count?",
      answer:
        "The countdown shows the remaining time from this moment to midnight of the target date. It does not include today as a full day.",
    },
  ],
  formula: "Days Until = Target Date - Today",
};
