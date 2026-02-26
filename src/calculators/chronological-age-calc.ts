import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chronologicalAgeCalc: CalculatorDefinition = {
  slug: "chronological-age-calculator",
  title: "Chronological Age Calculator",
  description:
    "Free online chronological age calculator. Calculate exact age in years, months, and days from any date of birth to any other date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "chronological age",
    "exact age calculator",
    "age in years months days",
    "precise age",
    "age from date of birth",
  ],
  variants: [
    {
      id: "chrono-age",
      name: "Chronological Age",
      description: "Calculate exact chronological age between two dates",
      fields: [
        {
          name: "birthYear",
          label: "Birth Year",
          type: "number",
          placeholder: "e.g. 1990",
          min: 1900,
          max: 2100,
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
        {
          name: "toYear",
          label: "To Year (leave blank for today)",
          type: "number",
          placeholder: "e.g. 2026",
          min: 1900,
          max: 2200,
        },
        {
          name: "toMonth",
          label: "To Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "toDay",
          label: "To Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const bY = parseFloat(inputs.birthYear as string) || 0;
        const bM = parseFloat(inputs.birthMonth as string) || 0;
        const bD = parseFloat(inputs.birthDay as string) || 0;
        if (!bY || !bM || !bD) return null;

        const birth = new Date(bY, bM - 1, bD);

        let to: Date;
        const tY = parseFloat(inputs.toYear as string) || 0;
        const tM = parseFloat(inputs.toMonth as string) || 0;
        const tD = parseFloat(inputs.toDay as string) || 0;
        if (tY && tM && tD) {
          to = new Date(tY, tM - 1, tD);
        } else {
          to = new Date();
        }

        if (birth > to) return null;

        let years = to.getFullYear() - birth.getFullYear();
        let months = to.getMonth() - birth.getMonth();
        let days = to.getDate() - birth.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const totalDays = Math.floor(
          (to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;

        return {
          primary: {
            label: "Chronological Age",
            value: `${years} years, ${months} months, ${days} days`,
          },
          details: [
            { label: "Total years (approx)", value: formatNumber(totalDays / 365.25, 2) },
            { label: "Total months", value: formatNumber(totalMonths) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Total minutes", value: formatNumber(totalMinutes) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "baby-age-calculator"],
  faq: [
    {
      question: "What is chronological age?",
      answer:
        "Chronological age is the exact amount of time that has passed since a person was born, measured in years, months, and days. It is different from biological age, which measures physical health.",
    },
    {
      question: "Can I calculate age to a specific date?",
      answer:
        "Yes. Enter the birth date and optionally a target date. If you leave the target date blank, today's date will be used automatically.",
    },
  ],
  formula: "Chronological Age = Target Date - Birth Date (years, months, days)",
};
