import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const OPERATION_OPTIONS = [
  { label: "Add", value: "add" },
  { label: "Subtract", value: "subtract" },
];

export const dateAddSubtractCalculator: CalculatorDefinition = {
  slug: "date-add-subtract-calculator",
  title: "Date Add/Subtract Calculator",
  description:
    "Free date add and subtract calculator. Add or subtract days, weeks, months, or years from any date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "add days to date",
    "subtract days from date",
    "date add calculator",
    "date subtract calculator",
    "future date calculator",
  ],
  variants: [
    {
      id: "add-days",
      name: "Add/Subtract Days",
      description: "Add or subtract a number of days from a date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2200 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "operation", label: "Operation", type: "select", options: OPERATION_OPTIONS, defaultValue: "add" },
        { name: "days", label: "Number of Days", type: "number", placeholder: "e.g. 30", min: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const op = inputs.operation as string;
        const days = inputs.days as number;
        if (!y || !m || !d || days === undefined) return null;

        const date = new Date(y, m - 1, d);
        const modifier = op === "subtract" ? -1 : 1;
        date.setDate(date.getDate() + (days * modifier));

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const resultStr = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        return {
          primary: { label: "Result Date", value: resultStr },
          details: [
            { label: "Day of week", value: dayNames[date.getDay()] },
            { label: "Operation", value: `${op === "subtract" ? "Subtracted" : "Added"} ${days} days` },
            { label: "Weeks equivalent", value: formatNumber(days / 7, 1) },
          ],
        };
      },
    },
    {
      id: "add-months",
      name: "Add/Subtract Months",
      description: "Add or subtract months from a date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2200 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "operation", label: "Operation", type: "select", options: OPERATION_OPTIONS, defaultValue: "add" },
        { name: "months", label: "Number of Months", type: "number", placeholder: "e.g. 6", min: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const op = inputs.operation as string;
        const months = inputs.months as number;
        if (!y || !m || !d || months === undefined) return null;

        const modifier = op === "subtract" ? -1 : 1;
        const date = new Date(y, m - 1 + (months * modifier), d);

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const resultStr = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        return {
          primary: { label: "Result Date", value: resultStr },
          details: [
            { label: "Day of week", value: dayNames[date.getDay()] },
            { label: "Operation", value: `${op === "subtract" ? "Subtracted" : "Added"} ${months} months` },
            { label: "Years equivalent", value: formatNumber(months / 12, 1) },
          ],
        };
      },
    },
    {
      id: "add-years",
      name: "Add/Subtract Years",
      description: "Add or subtract years from a date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2200 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "operation", label: "Operation", type: "select", options: OPERATION_OPTIONS, defaultValue: "add" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 5", min: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const op = inputs.operation as string;
        const years = inputs.years as number;
        if (!y || !m || !d || years === undefined) return null;

        const modifier = op === "subtract" ? -1 : 1;
        const date = new Date(y + (years * modifier), m - 1, d);

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const resultStr = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

        return {
          primary: { label: "Result Date", value: resultStr },
          details: [
            { label: "Day of week", value: dayNames[date.getDay()] },
            { label: "Operation", value: `${op === "subtract" ? "Subtracted" : "Added"} ${years} years` },
            { label: "Months equivalent", value: formatNumber(years * 12) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "date-calculator",
    "days-between-dates-calculator",
    "weeks-between-dates-calculator",
  ],
  faq: [
    {
      question: "How do I calculate a date 90 days from now?",
      answer:
        "Enter today's date, select 'Add', and enter 90 in the days field. The calculator will find the exact date 90 days in the future, accounting for varying month lengths.",
    },
    {
      question: "What happens when adding months crosses a month boundary?",
      answer:
        "The calculator uses JavaScript's built-in date handling. If you add 1 month to January 31, it rolls forward to March 3 (or March 2 in a leap year), since February doesn't have 31 days.",
    },
  ],
  formula: "Result Date = Start Date ± Days/Months/Years",
};
