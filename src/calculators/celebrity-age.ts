import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const celebrityAgeCalculator: CalculatorDefinition = {
  slug: "celebrity-age",
  title: "Celebrity Age Difference Calculator",
  description: "Calculate the exact age difference between two people by entering their birth dates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["celebrity age", "age difference", "age gap", "birth date comparison"],
  variants: [
    {
      id: "calc",
      name: "Calculate Age Difference",
      fields: [
        { name: "year1", label: "Person 1 Birth Year", type: "number", placeholder: "e.g. 1985", min: 1900, max: 2026 },
        { name: "month1", label: "Person 1 Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day1", label: "Person 1 Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "year2", label: "Person 2 Birth Year", type: "number", placeholder: "e.g. 1990", min: 1900, max: 2026 },
        { name: "month2", label: "Person 2 Birth Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day2", label: "Person 2 Birth Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y1 = Number(inputs.year1); const m1 = Number(inputs.month1); const d1 = Number(inputs.day1);
        const y2 = Number(inputs.year2); const m2 = Number(inputs.month2); const d2 = Number(inputs.day2);
        if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;

        const date1 = new Date(y1, m1 - 1, d1);
        const date2 = new Date(y2, m2 - 1, d2);
        const diffMs = Math.abs(date1.getTime() - date2.getTime());
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffYears = Math.floor(diffDays / 365.25);
        const diffMonths = Math.floor((diffDays % 365.25) / 30.44);
        const remainDays = Math.floor((diffDays % 365.25) % 30.44);
        const older = date1 < date2 ? "Person 1" : "Person 2";

        return {
          primary: { label: "Age Difference", value: diffYears + " years, " + diffMonths + " months, " + remainDays + " days" },
          details: [
            { label: "Total Days Apart", value: formatNumber(diffDays) },
            { label: "Total Weeks Apart", value: formatNumber(Math.floor(diffDays / 7)) },
            { label: "Who Is Older", value: older },
            { label: "Half-Your-Age-Plus-7 Min", value: formatNumber(Math.floor(Math.max(diffYears / 2 + 7, 18))) + " years" },
          ],
          note: "A fun tool for comparing ages between any two people.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "age-difference-calculator", "how-old-am-i-calculator"],
  faq: [
    { question: "How is the age difference calculated?", answer: "We subtract the earlier birth date from the later one and convert the difference into years, months, and days." },
    { question: "What is the half-your-age-plus-7 rule?", answer: "A popular rule of thumb that suggests the youngest person you should date is half your age plus 7 years." },
  ],
  formula: "Age Difference = |Date1 - Date2| converted to years, months, days",
};
