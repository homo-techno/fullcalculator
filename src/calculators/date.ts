import type { CalculatorDefinition } from "./types";

export const dateCalculator: CalculatorDefinition = {
  slug: "date-calculator",
  title: "Date Calculator",
  description:
    "Free date calculator. Add or subtract days, weeks, or months from a date. Find the date after a specific number of days.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["date calculator", "add days to date", "date difference", "what date is X days from now", "days from today"],
  variants: [
    {
      id: "add-days",
      name: "Add / Subtract Days",
      description: "Find the date after adding or subtracting days from a start date",
      fields: [
        { name: "year", label: "Start Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2100 },
        { name: "month", label: "Start Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Start Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "addDays", label: "Days to Add (negative to subtract)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const add = inputs.addDays as number;
        if (!y || !m || !d || add === undefined) return null;

        const start = new Date(y, m - 1, d);
        const result = new Date(start);
        result.setDate(result.getDate() + add);

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return {
          primary: {
            label: add >= 0 ? `${add} days from date` : `${Math.abs(add)} days before date`,
            value: `${months[result.getMonth()]} ${result.getDate()}, ${result.getFullYear()}`,
          },
          details: [
            { label: "Day of week", value: days[result.getDay()] },
            { label: "Weeks", value: `${Math.floor(Math.abs(add) / 7)} weeks and ${Math.abs(add) % 7} days` },
          ],
        };
      },
    },
    {
      id: "workdays",
      name: "Working Days",
      description: "Count business days (Mon-Fri) between two dates",
      fields: [
        { name: "sy", label: "Start Year", type: "number", placeholder: "e.g. 2026" },
        { name: "sm", label: "Start Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "sd", label: "Start Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "ey", label: "End Year", type: "number", placeholder: "e.g. 2026" },
        { name: "em", label: "End Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "ed", label: "End Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const sy = inputs.sy as number; const sm = inputs.sm as number; const sd = inputs.sd as number;
        const ey = inputs.ey as number; const em = inputs.em as number; const ed = inputs.ed as number;
        if (!sy || !sm || !sd || !ey || !em || !ed) return null;

        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        let workdays = 0;
        let totalDays = 0;
        const current = new Date(start);

        while (current <= end) {
          totalDays++;
          const dow = current.getDay();
          if (dow !== 0 && dow !== 6) workdays++;
          current.setDate(current.getDate() + 1);
        }

        const weekendDays = totalDays - workdays;

        return {
          primary: { label: "Working Days", value: `${workdays}` },
          details: [
            { label: "Total calendar days", value: `${totalDays}` },
            { label: "Weekend days", value: `${weekendDays}` },
            { label: "Work weeks", value: `${(workdays / 5).toFixed(1)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "salary-calculator"],
  faq: [
    { question: "How do I calculate a date X days from now?", answer: "Enter today's date and the number of days to add. The calculator will show you the exact future date, including the day of the week." },
    { question: "How many working days are in a year?", answer: "A typical year has 260-262 working days (52 weeks x 5 days). The exact number depends on which days of the week January 1 and December 31 fall on." },
  ],
  formula: "Future Date = Start Date + N days",
};
