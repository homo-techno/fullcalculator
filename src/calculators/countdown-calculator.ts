import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const countdownCalculator: CalculatorDefinition = {
  slug: "countdown-calculator",
  title: "Countdown Calculator",
  description:
    "Free online countdown calculator. Find out how many days, weeks, hours, and minutes until any future date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "countdown calculator",
    "days until",
    "how many days until",
    "countdown to date",
    "time until event",
  ],
  variants: [
    {
      id: "countdown",
      name: "Countdown to a Date",
      description: "Calculate the time remaining until a specific date",
      fields: [
        {
          name: "targetYear",
          label: "Target Year",
          type: "number",
          placeholder: "e.g. 2027",
          min: 2000,
          max: 2200,
        },
        {
          name: "targetMonth",
          label: "Target Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "targetDay",
          label: "Target Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const year = parseFloat(inputs.targetYear as string) || 0;
        const month = parseFloat(inputs.targetMonth as string) || 0;
        const day = parseFloat(inputs.targetDay as string) || 0;
        if (!year || !month || !day) return null;

        const target = new Date(year, month - 1, day);
        const now = new Date();

        const diffMs = target.getTime() - now.getTime();
        if (diffMs <= 0) {
          return {
            primary: { label: "Status", value: "This date has already passed" },
            details: [
              {
                label: "Days ago",
                value: formatNumber(Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24))),
              },
            ],
          };
        }

        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;

        let years = target.getFullYear() - now.getFullYear();
        let months = target.getMonth() - now.getMonth();
        let days = target.getDate() - now.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        return {
          primary: {
            label: "Time Remaining",
            value: `${years > 0 ? years + " years, " : ""}${months} months, ${days} days`,
          },
          details: [
            { label: "Total days", value: formatNumber(totalDays) },
            {
              label: "Weeks and days",
              value: `${formatNumber(totalWeeks)} weeks, ${formatNumber(remainingDays)} days`,
            },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "anniversary-calculator"],
  faq: [
    {
      question: "How does the countdown calculator work?",
      answer:
        "Enter a future target date (year, month, day) and the calculator computes the exact time remaining in years, months, days, weeks, hours, and minutes.",
    },
    {
      question: "Can I count down to a past date?",
      answer:
        "Yes, if the date has already passed, the calculator will tell you how many days ago the event occurred.",
    },
  ],
  formula: "Time Remaining = Target Date - Current Date",
};
