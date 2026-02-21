import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventCountdownCalculator: CalculatorDefinition = {
  slug: "event-countdown-calculator",
  title: "Event Countdown Calculator",
  description: "Free event countdown calculator. Calculate days, weeks, hours, and minutes until a future date or event.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["countdown calculator", "days until calculator", "event countdown", "how many days until", "date countdown"],
  variants: [
    {
      id: "countdown",
      name: "Countdown to Date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026" },
        { name: "month", label: "Month (1-12)", type: "number", placeholder: "e.g. 12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "e.g. 25", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number, m = inputs.month as number, d = inputs.day as number;
        if (!y || !m || !d) return null;
        const target = new Date(y, m - 1, d);
        if (isNaN(target.getTime())) return null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffMs = target.getTime() - today.getTime();
        const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const isPast = totalDays < 0;
        const absDays = Math.abs(totalDays);
        const weeks = Math.floor(absDays / 7);
        const remainDays = absDays % 7;
        const months = Math.floor(absDays / 30.44);
        const hours = absDays * 24;
        return {
          primary: { label: isPast ? "Days Ago" : "Days Until", value: `${absDays} days` },
          details: [
            { label: "Weeks + days", value: `${weeks} weeks, ${remainDays} days` },
            { label: "Months (approx)", value: formatNumber(months, 0) },
            { label: "Hours", value: formatNumber(hours, 0) },
            { label: "Minutes", value: formatNumber(hours * 60, 0) },
            { label: "Target date", value: target.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "age-calculator", "time-duration-calculator"],
  faq: [{ question: "How many days until a date?", answer: "Subtract today's date from the target date. For example, if today is March 1 and the event is December 25, there are 299 days remaining." }],
  formula: "Days = Target Date - Today",
};
