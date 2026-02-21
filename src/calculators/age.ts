import type { CalculatorDefinition } from "./types";

export const ageCalculator: CalculatorDefinition = {
  slug: "age-calculator",
  title: "Age Calculator",
  description:
    "Free online age calculator. Calculate your exact age in years, months, and days from your date of birth. Find out how many days old you are.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["age calculator", "how old am I", "date of birth calculator", "age in days"],
  variants: [
    {
      id: "age",
      name: "Calculate Your Age",
      description: "Find your exact age from your date of birth",
      fields: [
        {
          name: "birthYear",
          label: "Birth Year",
          type: "number",
          placeholder: "e.g. 1990",
          min: 1900,
          max: 2026,
        },
        {
          name: "birthMonth",
          label: "Birth Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "birthDay",
          label: "Birth Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const year = inputs.birthYear as number;
        const month = inputs.birthMonth as number;
        const day = inputs.birthDay as number;
        if (!year || !month || !day) return null;

        const birth = new Date(year, month - 1, day);
        const now = new Date();

        if (birth > now) return null;

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const totalDays = Math.floor(
          (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;

        return {
          primary: {
            label: "Your Age",
            value: `${years} years, ${months} months, ${days} days`,
          },
          details: [
            { label: "Total months", value: totalMonths.toLocaleString() },
            { label: "Total weeks", value: totalWeeks.toLocaleString() },
            { label: "Total days", value: totalDays.toLocaleString() },
          ],
        };
      },
    },
    {
      id: "between",
      name: "Days Between Dates",
      description: "Calculate the number of days between two dates",
      fields: [
        {
          name: "startYear",
          label: "Start Year",
          type: "number",
          placeholder: "e.g. 2024",
        },
        {
          name: "startMonth",
          label: "Start Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "startDay",
          label: "Start Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
        {
          name: "endYear",
          label: "End Year",
          type: "number",
          placeholder: "e.g. 2026",
        },
        {
          name: "endMonth",
          label: "End Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "endDay",
          label: "End Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
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
        const diffWeeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;

        return {
          primary: {
            label: "Days between dates",
            value: diffDays.toLocaleString(),
            suffix: "days",
          },
          details: [
            {
              label: "In weeks and days",
              value: `${diffWeeks} weeks and ${remainingDays} days`,
            },
            {
              label: "In hours",
              value: (diffDays * 24).toLocaleString(),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "percentage-calculator"],
  faq: [
    {
      question: "How do I calculate my exact age?",
      answer:
        "Enter your date of birth (year, month, day) and the calculator will compute your exact age in years, months, and days, accounting for varying month lengths and leap years.",
    },
    {
      question: "How many days old am I?",
      answer:
        "Enter your birth date in the age calculator above to see your exact age in total days, weeks, and months.",
    },
  ],
  formula: "Age = Current Date - Birth Date",
};
