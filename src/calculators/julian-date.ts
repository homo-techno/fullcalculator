import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const julianDateCalculator: CalculatorDefinition = {
  slug: "julian-date-calculator",
  title: "Julian Date Converter",
  description:
    "Free Julian date converter. Convert between Julian Day Numbers and Gregorian calendar dates. Used in astronomy and historical dating.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "julian date converter",
    "julian day number",
    "JDN calculator",
    "gregorian to julian",
    "julian calendar converter",
  ],
  variants: [
    {
      id: "to-julian",
      name: "Gregorian to Julian Day Number",
      description: "Convert a Gregorian calendar date to a Julian Day Number",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: -4713, max: 9999 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        if (y === undefined || !m || !d) return null;

        // Julian Day Number algorithm (Meeus)
        const a = Math.floor((14 - m) / 12);
        const yAdj = y + 4800 - a;
        const mAdj = m + 12 * a - 3;
        const jdn = d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj + Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;

        // Modified Julian Date
        const mjd = jdn - 2400000.5;

        // Day of year
        const date = new Date(y, m - 1, d);
        const startOfYear = new Date(y, 0, 1);
        const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return {
          primary: { label: "Julian Day Number", value: formatNumber(jdn) },
          details: [
            { label: "Modified Julian Date", value: formatNumber(mjd, 1) },
            { label: "Day of year", value: `${dayOfYear}` },
            { label: "Day of week", value: dayNames[date.getDay()] },
            { label: "Julian century (J2000)", value: formatNumber((jdn - 2451545.0) / 36525, 6) },
          ],
        };
      },
    },
    {
      id: "from-julian",
      name: "Julian Day Number to Gregorian",
      description: "Convert a Julian Day Number back to a Gregorian date",
      fields: [
        { name: "jdn", label: "Julian Day Number", type: "number", placeholder: "e.g. 2460676" },
      ],
      calculate: (inputs) => {
        const jdn = inputs.jdn as number;
        if (!jdn) return null;

        // Reverse algorithm (Meeus)
        const a = jdn + 32044;
        const b = Math.floor((4 * a + 3) / 146097);
        const c = a - Math.floor(146097 * b / 4);
        const dVal = Math.floor((4 * c + 3) / 1461);
        const e = c - Math.floor(1461 * dVal / 4);
        const mVal = Math.floor((5 * e + 2) / 153);

        const day = e - Math.floor((153 * mVal + 2) / 5) + 1;
        const month = mVal + 3 - 12 * Math.floor(mVal / 10);
        const year = 100 * b + dVal - 4800 + Math.floor(mVal / 10);

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(year, month - 1, day);

        return {
          primary: {
            label: "Gregorian Date",
            value: `${monthNames[month - 1]} ${day}, ${year}`,
          },
          details: [
            { label: "Day of week", value: dayNames[date.getDay()] },
            { label: "Modified Julian Date", value: formatNumber(jdn - 2400000.5, 1) },
            { label: "ISO format", value: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "date-calculator",
    "unix-timestamp-calculator",
    "what-day-was-calculator",
  ],
  faq: [
    {
      question: "What is a Julian Day Number?",
      answer:
        "The Julian Day Number (JDN) is a continuous count of days since the beginning of the Julian Period on January 1, 4713 BC (proleptic Julian calendar). It is used in astronomy, chronology, and historical dating.",
    },
    {
      question: "What is the Modified Julian Date?",
      answer:
        "The Modified Julian Date (MJD) equals JDN minus 2400000.5. It was introduced to use smaller numbers and to start the day at midnight rather than noon. MJD 0 is November 17, 1858.",
    },
    {
      question: "Is this the same as the Julian Calendar?",
      answer:
        "No. The Julian Day Number is a continuous day count used in astronomy. The Julian Calendar is the calendar system introduced by Julius Caesar in 46 BC, predecessor to the Gregorian calendar.",
    },
  ],
  formula: "JDN = d + floor((153m+2)/5) + 365y + floor(y/4) - floor(y/100) + floor(y/400) - 32045",
};
