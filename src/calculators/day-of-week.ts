import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dayOfWeekCalculator: CalculatorDefinition = {
  slug: "day-of-week-calculator",
  title: "Day of the Week Calculator",
  description: "Free day of the week calculator. Find what day any date falls on, plus the day of year and week number.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["day of the week calculator", "what day was", "what day is", "day of year", "week number calculator"],
  variants: [
    {
      id: "calc",
      name: "Find Day of Week",
      fields: [
        { name: "month", label: "Month (1–12)", type: "number", placeholder: "e.g. 7", min: 1, max: 12 },
        { name: "day", label: "Day (1–31)", type: "number", placeholder: "e.g. 4", min: 1, max: 31 },
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2000", min: 1, max: 9999 },
      ],
      calculate: (inputs) => {
        const month = inputs.month as number;
        const day = inputs.day as number;
        const year = inputs.year as number;
        if (!month || !day || !year) return null;

        const date = new Date(year, month - 1, day);
        // Validate the date
        if (date.getMonth() !== month - 1 || date.getDate() !== day) {
          return { primary: { label: "Error", value: "Invalid date" }, details: [] };
        }

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const dayOfWeek = dayNames[date.getDay()];

        // Day of year
        const startOfYear = new Date(year, 0, 1);
        const diffMs = date.getTime() - startOfYear.getTime();
        const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

        // Week number (ISO 8601)
        const tempDate = new Date(date.getTime());
        tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
        const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
        const weekNumber = Math.round((tempDate.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

        // Days until/since today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffFromToday = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        let relativeStr: string;
        if (diffFromToday === 0) relativeStr = "Today";
        else if (diffFromToday === 1) relativeStr = "Tomorrow";
        else if (diffFromToday === -1) relativeStr = "Yesterday";
        else if (diffFromToday > 0) relativeStr = `${diffFromToday} days from now`;
        else relativeStr = `${Math.abs(diffFromToday)} days ago`;

        // Is it a leap year?
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

        return {
          primary: { label: "Day of the Week", value: dayOfWeek },
          details: [
            { label: "Full Date", value: `${monthNames[month - 1]} ${day}, ${year}` },
            { label: "Day of Year", value: `${dayOfYear} of ${isLeap ? 366 : 365}` },
            { label: "Week Number (ISO)", value: `Week ${weekNumber}` },
            { label: "Relative to Today", value: relativeStr },
            { label: "Leap Year", value: isLeap ? "Yes" : "No" },
            { label: "Quarter", value: `Q${Math.ceil(month / 3)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["date-calculator", "age-calculator", "leap-year-calculator"],
  faq: [
    { question: "How do you calculate the day of the week?", answer: "This calculator uses the JavaScript Date object which implements the Gregorian calendar. Historically, algorithms like Zeller's congruence or the Doomsday algorithm can calculate the day of the week from any date." },
    { question: "What is the ISO week number?", answer: "ISO 8601 defines week 1 as the week containing the first Thursday of the year. Weeks start on Monday. The last days of December may belong to week 1 of the next year." },
    { question: "What day of the week was January 1, 2000?", answer: "January 1, 2000 was a Saturday." },
  ],
  formula: "Uses the Gregorian calendar. ISO week = weeks since first Thursday of the year.",
};
