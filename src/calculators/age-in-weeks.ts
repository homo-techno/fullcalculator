import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageInWeeksCalculator: CalculatorDefinition = {
  slug: "age-in-weeks-calculator",
  title: "Age in Weeks Calculator",
  description:
    "Free age in weeks calculator. Find out exactly how many weeks old you are from your date of birth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "age in weeks",
    "weeks old calculator",
    "how many weeks old am I",
    "age weeks calculator",
    "weeks since birth",
  ],
  variants: [
    {
      id: "age-weeks",
      name: "Your Age in Weeks",
      description: "Calculate your exact age in weeks from your birth date",
      fields: [
        { name: "birthYear", label: "Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "birthMonth", label: "Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "birthDay", label: "Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day);
        const now = new Date();
        if (birth > now) return null;

        const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const totalMonths = Math.floor(totalDays / 30.4375);
        const years = Math.floor(totalDays / 365.25);

        return {
          primary: {
            label: "Your Age in Weeks",
            value: formatNumber(totalWeeks),
            suffix: "weeks",
          },
          details: [
            { label: "Weeks and days", value: `${formatNumber(totalWeeks)} weeks, ${remainingDays} days` },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Approximate months", value: formatNumber(totalMonths) },
            { label: "Approximate years", value: formatNumber(years) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "age-calculator",
    "age-in-months-calculator",
    "age-in-days-calculator",
  ],
  faq: [
    {
      question: "How many weeks are in a year?",
      answer:
        "There are 52.1775 weeks in a year on average (365.25 days / 7). A common year has 52 weeks and 1 day, while a leap year has 52 weeks and 2 days.",
    },
    {
      question: "How do I calculate my age in weeks?",
      answer:
        "Calculate the total number of days between your birth date and today, then divide by 7. The calculator handles this automatically, including leap years.",
    },
  ],
  formula: "Age in Weeks = floor(Total Days Since Birth / 7)",
};
