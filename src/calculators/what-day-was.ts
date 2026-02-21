import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const whatDayWasCalculator: CalculatorDefinition = {
  slug: "what-day-was-calculator",
  title: "What Day of the Week Was It Calculator",
  description:
    "Free day of the week calculator. Find out what day of the week any date was or will be.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "what day of the week",
    "what day was",
    "day of week calculator",
    "find day from date",
    "what day is it",
  ],
  variants: [
    {
      id: "what-day",
      name: "What Day Was This Date?",
      description: "Find the day of the week for any date",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2000", min: 1, max: 9999 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        if (!y || !m || !d) return null;

        const date = new Date(y, m - 1, d);
        // Validate the date is real
        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
          return null;
        }

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayOfWeek = dayNames[date.getDay()];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
        const isPast = diffMs > 0;

        // Day of year
        const startOfYear = new Date(y, 0, 1);
        const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Week number (ISO)
        const tempDate = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
        const week1 = new Date(tempDate.getFullYear(), 0, 4);
        const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / (1000 * 60 * 60 * 24) - 3 + ((week1.getDay() + 6) % 7)) / 7);

        // Is leap year
        const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

        return {
          primary: {
            label: `${monthNames[m - 1]} ${d}, ${y}`,
            value: dayOfWeek,
          },
          details: [
            { label: "Weekend?", value: isWeekend ? "Yes" : "No" },
            { label: "Day of year", value: `${dayOfYear} of ${isLeap ? 366 : 365}` },
            { label: "ISO week number", value: `${weekNumber}` },
            { label: "Leap year?", value: isLeap ? "Yes" : "No" },
            { label: isPast ? "Days ago" : "Days from now", value: formatNumber(diffDays) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "date-calculator",
    "day-of-week-calculator",
    "birthday-calculator",
  ],
  faq: [
    {
      question: "What day of the week was I born?",
      answer:
        "Enter your birth year, month, and day into the calculator to instantly see what day of the week you were born on.",
    },
    {
      question: "How does the calculator determine the day of the week?",
      answer:
        "The calculator uses the Gregorian calendar system. It correctly handles leap years and all date ranges to determine the exact day of the week.",
    },
    {
      question: "What is ISO week numbering?",
      answer:
        "ISO 8601 defines week 1 as the week containing the first Thursday of the year. Weeks start on Monday. This means week 1 always contains January 4.",
    },
  ],
  formula: "Day of Week = Date mod 7 (using Gregorian calendar)",
};
