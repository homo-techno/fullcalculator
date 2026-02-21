import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weeksBetweenDatesCalculator: CalculatorDefinition = {
  slug: "weeks-between-dates-calculator",
  title: "Weeks Between Dates Calculator",
  description:
    "Free weeks between dates calculator. Calculate the exact number of weeks between any two dates instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "weeks between dates",
    "date difference in weeks",
    "week calculator",
    "how many weeks between",
    "number of weeks",
  ],
  variants: [
    {
      id: "weeks-between",
      name: "Weeks Between Two Dates",
      description: "Calculate the number of weeks between any two dates",
      fields: [
        { name: "startYear", label: "Start Year", type: "number", placeholder: "e.g. 2024", min: 1900, max: 2100 },
        { name: "startMonth", label: "Start Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "startDay", label: "Start Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "endYear", label: "End Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2100 },
        { name: "endMonth", label: "End Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "endDay", label: "End Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const sy = inputs.startYear as number;
        const sm = inputs.startMonth as number;
        const sd = inputs.startDay as number;
        const ey = inputs.endYear as number;
        const em = inputs.endMonth as number;
        const ed = inputs.endDay as number;
        if (!sy || !sm || !sd || !ey || !em || !ed) return null;

        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        const diffMs = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const fullWeeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        const decimalWeeks = diffDays / 7;

        return {
          primary: {
            label: "Weeks Between Dates",
            value: formatNumber(fullWeeks),
            suffix: "weeks",
          },
          details: [
            { label: "Full weeks", value: formatNumber(fullWeeks) },
            { label: "Remaining days", value: `${remainingDays}` },
            { label: "Decimal weeks", value: formatNumber(decimalWeeks, 2) },
            { label: "Total days", value: formatNumber(diffDays) },
            { label: "Total hours", value: formatNumber(diffDays * 24) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "days-between-dates-calculator",
    "months-between-dates-calculator",
    "date-calculator",
  ],
  faq: [
    {
      question: "How do you calculate weeks between two dates?",
      answer:
        "Divide the total number of days between the two dates by 7. For example, if there are 30 days between two dates, that equals 4 weeks and 2 days.",
    },
    {
      question: "Does the calculator account for leap years?",
      answer:
        "Yes. The calculator uses actual calendar dates and correctly handles leap years, so February 29 is included in leap year calculations.",
    },
    {
      question: "What if the start date is after the end date?",
      answer:
        "The calculator uses the absolute difference, so the result is always a positive number regardless of the order of the dates.",
    },
  ],
  formula: "Weeks = floor(|End Date - Start Date| / 7)",
};
