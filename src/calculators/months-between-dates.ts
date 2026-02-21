import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const monthsBetweenDatesCalculator: CalculatorDefinition = {
  slug: "months-between-dates-calculator",
  title: "Months Between Dates Calculator",
  description:
    "Free months between dates calculator. Calculate the exact number of months between any two dates, including partial months.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "months between dates",
    "date difference in months",
    "month calculator",
    "how many months between",
    "number of months",
  ],
  variants: [
    {
      id: "months-between",
      name: "Months Between Two Dates",
      description: "Calculate the number of months between any two dates",
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
        if (start > end) return null;

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
          days += prevMonth.getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        const totalMonths = years * 12 + months;
        const diffMs = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);

        return {
          primary: {
            label: "Months Between Dates",
            value: formatNumber(totalMonths),
            suffix: "months",
          },
          details: [
            { label: "Years and months", value: `${years} years, ${months} months` },
            { label: "Remaining days", value: `${days}` },
            { label: "Total days", value: formatNumber(totalDays) },
            { label: "Total weeks", value: formatNumber(totalWeeks) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "weeks-between-dates-calculator",
    "days-between-dates-calculator",
    "date-calculator",
  ],
  faq: [
    {
      question: "How are months calculated between two dates?",
      answer:
        "The calculator counts full calendar months from the start date to the end date, then adds remaining days. It accounts for different month lengths (28-31 days).",
    },
    {
      question: "Does this include partial months?",
      answer:
        "The primary result shows full months. The remaining days are shown separately in the details so you know the exact difference.",
    },
  ],
  formula:
    "Months = (End Year - Start Year) × 12 + (End Month - Start Month) ± day adjustment",
};
