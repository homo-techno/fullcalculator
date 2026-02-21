import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageInDaysCalculator: CalculatorDefinition = {
  slug: "age-in-days-calculator",
  title: "Age in Days Calculator",
  description: "Free age in days calculator. Find out exactly how many days, hours, minutes, and seconds old you are.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["age in days", "how many days old", "days alive", "exact age", "age in hours"],
  variants: [
    {
      id: "calculate",
      name: "Calculate Age in Days",
      fields: [
        { name: "year", label: "Birth Year", type: "number", placeholder: "e.g. 1990" },
        { name: "month", label: "Birth Month (1-12)", type: "number", placeholder: "e.g. 6", min: 1, max: 12 },
        { name: "day", label: "Birth Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number, m = inputs.month as number, d = inputs.day as number;
        if (!y || !m || !d) return null;
        const birth = new Date(y, m - 1, d);
        if (isNaN(birth.getTime())) return null;
        const now = new Date();
        const diffMs = now.getTime() - birth.getTime();
        if (diffMs < 0) return null;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor(diffMs / (1000 * 60));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44);
        const years = days / 365.25;
        const nextThousand = Math.ceil(days / 1000) * 1000;
        const daysToMilestone = nextThousand - days;
        const milestoneDate = new Date(now.getTime() + daysToMilestone * 24 * 60 * 60 * 1000);
        return {
          primary: { label: "Days Alive", value: formatNumber(days, 0) },
          details: [
            { label: "Hours", value: formatNumber(hours, 0) },
            { label: "Minutes", value: formatNumber(minutes, 0) },
            { label: "Weeks", value: formatNumber(weeks, 0) },
            { label: "Months", value: formatNumber(months, 0) },
            { label: "Years (decimal)", value: formatNumber(years, 2) },
            { label: `Next milestone (${formatNumber(nextThousand, 0)} days)`, value: milestoneDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "date-calculator", "event-countdown-calculator"],
  faq: [{ question: "How many days have I been alive?", answer: "Enter your birth date to find out. At age 30 you've been alive about 10,957 days. At 40, about 14,610 days. Your 10,000th day alive is a fun milestone to celebrate!" }],
  formula: "Days = (Today - Birthday) in days",
};
