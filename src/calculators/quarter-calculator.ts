import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const FISCAL_YEAR_OPTIONS = [
  { label: "January (Calendar Year)", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April (UK, India)", value: "4" },
  { label: "July (Australia)", value: "7" },
  { label: "October (US Federal)", value: "10" },
];

export const quarterCalculator: CalculatorDefinition = {
  slug: "quarter-calculator",
  title: "Fiscal Quarter Calculator",
  description:
    "Free fiscal quarter calculator. Determine the fiscal quarter for any date based on your fiscal year start.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fiscal quarter calculator",
    "quarter of year",
    "Q1 Q2 Q3 Q4",
    "fiscal year quarter",
    "what quarter is it",
  ],
  variants: [
    {
      id: "find-quarter",
      name: "Find Quarter for a Date",
      description: "Determine what fiscal quarter a date falls in",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2200 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "fyStart", label: "Fiscal Year Starts In", type: "select", options: FISCAL_YEAR_OPTIONS, defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const fyStart = parseInt(inputs.fyStart as string);
        if (!y || !m || !d) return null;

        // Calculate fiscal month (1-12 relative to fiscal year start)
        let fiscalMonth = m - fyStart + 1;
        if (fiscalMonth <= 0) fiscalMonth += 12;

        const quarter = Math.ceil(fiscalMonth / 3);
        const quarterStart = ((quarter - 1) * 3 + fyStart - 1) % 12;
        const quarterEnd = (quarterStart + 2) % 12;

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Days remaining in quarter
        const qEndMonth = (quarterStart + 3) % 12;
        const qEndYear = qEndMonth < fyStart && m >= fyStart ? y + 1 : y;
        const quarterEndDate = new Date(qEndYear, qEndMonth, 0);
        const currentDate = new Date(y, m - 1, d);
        const daysRemaining = Math.max(0, Math.floor((quarterEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));

        // Fiscal year
        const fiscalYear = m >= fyStart ? y : y - 1;

        return {
          primary: {
            label: "Fiscal Quarter",
            value: `Q${quarter}`,
          },
          details: [
            { label: "Fiscal year", value: `FY${fiscalYear}` },
            { label: "Quarter range", value: `${monthNames[quarterStart]} - ${monthNames[quarterEnd]}` },
            { label: "Fiscal month", value: `${fiscalMonth} of 12` },
            { label: "Days remaining in quarter", value: formatNumber(daysRemaining) },
          ],
        };
      },
    },
    {
      id: "quarter-dates",
      name: "Quarter Start & End Dates",
      description: "Get the start and end dates of each quarter for a year",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1900, max: 2200 },
        { name: "fyStart", label: "Fiscal Year Starts In", type: "select", options: FISCAL_YEAR_OPTIONS, defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const fyStart = parseInt(inputs.fyStart as string);
        if (!y) return null;

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const details = [];

        for (let q = 0; q < 4; q++) {
          const startMonth = (fyStart - 1 + q * 3) % 12;
          const endMonth = (startMonth + 2) % 12;
          const startYear = startMonth < fyStart - 1 ? y + 1 : y;
          const endYear = endMonth < fyStart - 1 ? y + 1 : y;
          const lastDay = new Date(endYear, endMonth + 1, 0).getDate();
          details.push({
            label: `Q${q + 1}`,
            value: `${monthNames[startMonth]} 1, ${startYear} - ${monthNames[endMonth]} ${lastDay}, ${endYear}`,
          });
        }

        return {
          primary: {
            label: `FY${y} Quarters`,
            value: `${monthNames[fyStart - 1]} ${y} Start`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "date-calculator",
    "business-days-calculator",
    "pay-period-calculator",
  ],
  faq: [
    {
      question: "What are the calendar year quarters?",
      answer:
        "For a standard calendar fiscal year: Q1 is January-March, Q2 is April-June, Q3 is July-September, Q4 is October-December.",
    },
    {
      question: "What is the US federal fiscal year?",
      answer:
        "The US federal fiscal year starts October 1. So FY2026 Q1 = Oct-Dec 2025, Q2 = Jan-Mar 2026, Q3 = Apr-Jun 2026, Q4 = Jul-Sep 2026.",
    },
  ],
  formula: "Quarter = ceil((Month - FY Start + 1) / 3)",
};
