import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leapYearCalculator: CalculatorDefinition = {
  slug: "leap-year-calculator",
  title: "Leap Year Calculator",
  description: "Free leap year calculator. Check if any year is a leap year and find the next and previous leap years.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["leap year calculator", "is it a leap year", "next leap year", "leap year checker", "leap year list"],
  variants: [
    {
      id: "calc",
      name: "Check Leap Year",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2024", min: 1, max: 9999 },
      ],
      calculate: (inputs) => {
        const year = inputs.year as number;
        if (!year) return null;

        const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

        const leap = isLeap(year);
        const totalDays = leap ? 366 : 365;

        // Find next leap year
        let nextLeap = year + 1;
        while (!isLeap(nextLeap)) nextLeap++;

        // Find previous leap year
        let prevLeap = year - 1;
        while (!isLeap(prevLeap) && prevLeap > 0) prevLeap--;

        // Find nearby leap years (5 before and 5 after)
        const nearbyLeaps: number[] = [];
        let searchYear = year - 20;
        while (nearbyLeaps.length < 10 && searchYear <= year + 20) {
          if (isLeap(searchYear) && searchYear !== year) {
            nearbyLeaps.push(searchYear);
          }
          searchYear++;
        }

        // Why is/isn't it a leap year
        let reason: string;
        if (year % 400 === 0) reason = `${year} is divisible by 400 → leap year`;
        else if (year % 100 === 0) reason = `${year} is divisible by 100 but not 400 → NOT a leap year`;
        else if (year % 4 === 0) reason = `${year} is divisible by 4 but not 100 → leap year`;
        else reason = `${year} is not divisible by 4 → NOT a leap year`;

        return {
          primary: { label: `Is ${year} a Leap Year?`, value: leap ? "Yes" : "No" },
          details: [
            { label: "Days in Year", value: `${totalDays}` },
            { label: "February Has", value: leap ? "29 days" : "28 days" },
            { label: "Reason", value: reason },
            { label: "Next Leap Year", value: `${nextLeap}` },
            { label: "Previous Leap Year", value: prevLeap > 0 ? `${prevLeap}` : "N/A" },
            { label: "Nearby Leap Years", value: nearbyLeaps.slice(0, 6).join(", ") },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["day-of-week-calculator", "date-calculator", "age-calculator"],
  faq: [
    { question: "What is the leap year rule?", answer: "A year is a leap year if it is divisible by 4, EXCEPT years divisible by 100 are NOT leap years, UNLESS they are also divisible by 400. So 2000 was a leap year, but 1900 was not." },
    { question: "Why do we have leap years?", answer: "Earth's orbit around the sun takes approximately 365.2422 days. Without leap years, our calendar would drift about 1 day every 4 years, and seasons would eventually shift. Leap years keep the calendar aligned with Earth's orbit." },
    { question: "When is the next leap year?", answer: "Leap years occur every 4 years. Recent leap years: 2020, 2024, 2028, 2032. The exception is century years not divisible by 400." },
  ],
  formula: "Leap year if: (year % 4 === 0 AND year % 100 !== 0) OR (year % 400 === 0)",
};
