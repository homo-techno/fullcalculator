import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageInHoursCalculator: CalculatorDefinition = {
  slug: "age-in-hours-calculator",
  title: "Age in Hours Calculator",
  description:
    "Free age in hours calculator. Find out exactly how many hours old you are from your date of birth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "age in hours",
    "hours old calculator",
    "how many hours old am I",
    "hours since birth",
    "age hours calculator",
  ],
  variants: [
    {
      id: "age-hours",
      name: "Your Age in Hours",
      description: "Calculate your exact age in hours from your birth date",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "birthHour", label: "Birth Hour (0-23, optional)", type: "number", placeholder: "e.g. 14", min: 0, max: 23, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        const hour = (inputs.birthHour as number) || 0;
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day, hour);
        const now = new Date();
        if (birth > now) return null;

        const diffMs = now.getTime() - birth.getTime();
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalSeconds = Math.floor(diffMs / 1000);

        return {
          primary: {
            label: "Your Age in Hours",
            value: formatNumber(totalHours),
            suffix: "hours",
          },
          details: [
            { label: "Total minutes", value: formatNumber(totalMinutes) },
            { label: "Total seconds", value: formatNumber(totalSeconds) },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "age-in-weeks-calculator",
    "age-in-months-calculator",
  ],
  faq: [
    {
      question: "How many hours are in a year?",
      answer:
        "A common year has 8,760 hours (365 days x 24). A leap year has 8,784 hours (366 days x 24).",
    },
    {
      question: "Can I include my exact birth time?",
      answer:
        "Yes. Enter your birth hour (0-23) for a more precise calculation. If you leave it blank, midnight (0) is assumed.",
    },
  ],
  formula: "Age in Hours = (Current Date/Time - Birth Date/Time) / 3,600,000 ms",
};
