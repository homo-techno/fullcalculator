import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month: number, year: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

function dayOfYear(year: number, month: number, day: number): number {
  let doy = 0;
  for (let m = 1; m < month; m++) {
    doy += getDaysInMonth(m, year);
  }
  doy += day;
  return doy;
}

function dateFromDOY(year: number, doy: number): { month: number; day: number } {
  let remaining = doy;
  for (let m = 1; m <= 12; m++) {
    const dim = getDaysInMonth(m, year);
    if (remaining <= dim) {
      return { month: m, day: remaining };
    }
    remaining -= dim;
  }
  return { month: 12, day: 31 };
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const dayOfYearCalculator: CalculatorDefinition = {
  slug: "day-of-year-calculator",
  title: "Day of Year Calculator",
  description: "Free day of year calculator. Find the day number for any date or convert a day number back to a date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["day of year calculator", "julian day", "ordinal date", "day number", "date to day number"],
  variants: [
    {
      id: "date-to-doy",
      name: "Date to Day of Year",
      description: "Convert a date to its day-of-year number (1-365/366)",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1, defaultValue: 2026 },
        {
          name: "month",
          label: "Month",
          type: "select",
          options: monthNames.map((m, i) => ({ label: m, value: String(i + 1) })),
          defaultValue: "1",
        },
        { name: "day", label: "Day", type: "number", placeholder: "e.g. 15", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const year = parseFloat(inputs.year as string);
        const month = parseFloat(inputs.month as string);
        const day = parseFloat(inputs.day as string);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        if (month < 1 || month > 12 || day < 1) return null;
        const maxDay = getDaysInMonth(month, year);
        if (day > maxDay) return null;

        const doy = dayOfYear(year, month, day);
        const totalDays = isLeapYear(year) ? 366 : 365;
        const remaining = totalDays - doy;
        const percentComplete = (doy / totalDays) * 100;
        const weekNumber = Math.ceil(doy / 7);

        return {
          primary: { label: "Day of Year", value: formatNumber(doy, 0) },
          details: [
            { label: "Date", value: `${monthNames[month - 1]} ${formatNumber(day, 0)}, ${formatNumber(year, 0)}` },
            { label: "Days Remaining", value: formatNumber(remaining, 0) },
            { label: "Week Number", value: formatNumber(weekNumber, 0) },
            { label: "Year Progress", value: `${formatNumber(percentComplete, 1)}%` },
            { label: "Leap Year", value: isLeapYear(year) ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "doy-to-date",
      name: "Day Number to Date",
      description: "Convert a day-of-year number back to a calendar date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1, defaultValue: 2026 },
        { name: "doy", label: "Day of Year (1-366)", type: "number", placeholder: "e.g. 100", min: 1, max: 366 },
      ],
      calculate: (inputs) => {
        const year = parseFloat(inputs.year as string);
        const doy = parseFloat(inputs.doy as string);
        if (isNaN(year) || isNaN(doy)) return null;
        const totalDays = isLeapYear(year) ? 366 : 365;
        if (doy < 1 || doy > totalDays) return null;

        const { month, day } = dateFromDOY(year, doy);
        const remaining = totalDays - doy;
        const weekNumber = Math.ceil(doy / 7);

        return {
          primary: { label: "Date", value: `${monthNames[month - 1]} ${formatNumber(day, 0)}, ${formatNumber(year, 0)}` },
          details: [
            { label: "Day of Year", value: formatNumber(doy, 0) },
            { label: "Days Remaining", value: formatNumber(remaining, 0) },
            { label: "Week Number", value: formatNumber(weekNumber, 0) },
            { label: "Total Days in Year", value: formatNumber(totalDays, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "time-zone-converter", "age-calculator"],
  faq: [
    { question: "What is the day of year?", answer: "The day of year (also called ordinal date or Julian day number) is a number from 1 to 365 (or 366 in a leap year) representing the sequential day count. January 1 is day 1, February 1 is day 32, etc." },
    { question: "How do I calculate week number from day of year?", answer: "Divide the day of year by 7 and round up. For example, day 50 is in week ceil(50/7) = week 8. Note that ISO week numbering may differ slightly." },
  ],
  formula: "DOY = Σ days_in_months(1..m-1) + day | Week = ⌈DOY / 7⌉",
};
