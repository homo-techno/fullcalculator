import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ageDifferenceCalculator: CalculatorDefinition = {
  slug: "age-difference-calculator",
  title: "Age Difference Calculator",
  description: "Free age difference calculator. Calculate the exact age gap between two people in years, months, and days, plus the half-your-age-plus-7 rule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["age difference calculator", "age gap calculator", "age difference between two dates", "how old were you when", "half your age plus 7"],
  variants: [
    {
      id: "calc",
      name: "Calculate Age Difference",
      fields: [
        { name: "month1", label: "Person 1 — Birth Month (1–12)", type: "number", placeholder: "e.g. 3", min: 1, max: 12 },
        { name: "day1", label: "Person 1 — Birth Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
        { name: "year1", label: "Person 1 — Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2100 },
        { name: "month2", label: "Person 2 — Birth Month (1–12)", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
        { name: "day2", label: "Person 2 — Birth Day", type: "number", placeholder: "e.g. 20", min: 1, max: 31 },
        { name: "year2", label: "Person 2 — Birth Year", type: "number", placeholder: "e.g. 1995", min: 1900, max: 2100 },
      ],
      calculate: (inputs) => {
        const month1 = inputs.month1 as number;
        const day1 = inputs.day1 as number;
        const year1 = inputs.year1 as number;
        const month2 = inputs.month2 as number;
        const day2 = inputs.day2 as number;
        const year2 = inputs.year2 as number;
        if (!month1 || !day1 || !year1 || !month2 || !day2 || !year2) return null;

        const date1 = new Date(year1, month1 - 1, day1);
        const date2 = new Date(year2, month2 - 1, day2);

        if (date1.getMonth() !== month1 - 1 || date2.getMonth() !== month2 - 1) {
          return { primary: { label: "Error", value: "Invalid date(s)" }, details: [] };
        }

        // Ensure date1 is the earlier date
        const earlier = date1 <= date2 ? date1 : date2;
        const later = date1 <= date2 ? date2 : date1;

        // Calculate difference in years, months, days
        let years = later.getFullYear() - earlier.getFullYear();
        let months = later.getMonth() - earlier.getMonth();
        let days = later.getDate() - earlier.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        // Total days
        const totalDays = Math.round((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;

        // Half your age plus 7 rule
        const today = new Date();
        const age1 = (today.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        const age2 = (today.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

        const olderAge = Math.max(age1, age2);
        const youngerAge = Math.min(age1, age2);
        const minAcceptable = olderAge / 2 + 7;
        const halfPlusSeven = youngerAge >= minAcceptable ? "Yes — within rule" : "No — outside rule";

        return {
          primary: { label: "Age Difference", value: `${years} year${years !== 1 ? "s" : ""}${months > 0 ? `, ${months} month${months !== 1 ? "s" : ""}` : ""}${days > 0 ? `, ${days} day${days !== 1 ? "s" : ""}` : ""}` },
          details: [
            { label: "Total Days", value: formatNumber(totalDays, 0) },
            { label: "Total Weeks", value: formatNumber(totalWeeks, 0) },
            { label: "Total Months", value: formatNumber(totalMonths, 0) },
            { label: "Person 1 Age", value: `${formatNumber(age1, 1)} years` },
            { label: "Person 2 Age", value: `${formatNumber(age2, 1)} years` },
            { label: "\"Half Age + 7\" Rule", value: halfPlusSeven },
            { label: "Min. Acceptable Age (for older)", value: `${formatNumber(minAcceptable, 1)} years` },
          ],
          note: "The \"half your age plus 7\" rule is a social guideline for acceptable age gaps in relationships, not a scientific measure.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "date-calculator", "day-of-week-calculator"],
  faq: [
    { question: "What is the half-your-age-plus-7 rule?", answer: "The rule states that the younger person in a relationship should be at least half the older person's age plus 7 years. For example, if you're 30, the youngest acceptable partner would be 30/2 + 7 = 22." },
    { question: "How is age difference calculated?", answer: "Age difference is calculated by finding the exact number of years, months, and days between two birth dates. We account for varying month lengths and leap years." },
    { question: "What is the average age difference in couples?", answer: "Studies show the average age difference in heterosexual couples is about 2–3 years, with the man typically being older. Same-sex couples tend to have slightly larger age gaps on average." },
  ],
  formula: "Difference = later date − earlier date (in years, months, days) | Half+7 rule: younger ≥ older/2 + 7",
};
