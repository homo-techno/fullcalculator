import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const daysBetweenDatesCalculator: CalculatorDefinition = {
  slug: "days-between-dates-calculator",
  title: "Days Between Dates Calculator",
  description:
    "Free days between dates calculator. Find the exact number of days, weeks, and remaining days between any two dates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "days between dates",
    "date difference",
    "date calculator",
    "days count",
    "date duration",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Days Between Dates",
      fields: [
        {
          name: "month1",
          label: "Start Month (1-12)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "day1",
          label: "Start Day (1-31)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "year1",
          label: "Start Year",
          type: "number",
          placeholder: "e.g. 2024",
        },
        {
          name: "month2",
          label: "End Month (1-12)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "day2",
          label: "End Day (1-31)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "year2",
          label: "End Year",
          type: "number",
          placeholder: "e.g. 2025",
        },
      ],
      calculate: (inputs) => {
        const month1 = inputs.month1 as number;
        const day1 = inputs.day1 as number;
        const year1 = inputs.year1 as number;
        const month2 = inputs.month2 as number;
        const day2 = inputs.day2 as number;
        const year2 = inputs.year2 as number;

        if (!month1 || !day1 || !year1 || !month2 || !day2 || !year2)
          return null;

        const date1 = new Date(year1, month1 - 1, day1);
        const date2 = new Date(year2, month2 - 1, day2);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;

        return {
          primary: {
            label: "Days Between",
            value: formatNumber(diffDays, 0),
          },
          details: [
            {
              label: "Start Date",
              value: `${month1}/${day1}/${year1}`,
            },
            {
              label: "End Date",
              value: `${month2}/${day2}/${year2}`,
            },
            {
              label: "Weeks + Days",
              value: `${formatNumber(weeks, 0)} weeks and ${formatNumber(remainingDays, 0)} days`,
            },
            {
              label: "Total Hours",
              value: formatNumber(diffDays * 24, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["business-days-calculator"],
  faq: [
    {
      question: "How are the days calculated?",
      answer:
        "Days are calculated using the absolute difference between two Date objects, converted from milliseconds to days. This accounts for leap years and varying month lengths.",
    },
    {
      question: "Does it count the start and end dates?",
      answer:
        "The calculation gives the number of days between the two dates, not including the start date. If you need to include both dates, add 1 to the result.",
    },
  ],
  formula:
    "Days = |Date2 - Date1| in milliseconds / (1000 × 60 × 60 × 24). Weeks = Days ÷ 7 (integer), Remaining = Days mod 7.",
};
