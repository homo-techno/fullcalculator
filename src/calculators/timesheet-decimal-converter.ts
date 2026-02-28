import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timesheetDecimalConverterCalculator: CalculatorDefinition = {
  slug: "timesheet-decimal-converter",
  title: "Timesheet Decimal Converter",
  description: "Free timesheet converter. Convert hours and minutes to decimal format for payroll processing and invoicing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["timesheet decimal converter", "hours to decimal converter", "time to decimal payroll"],
  variants: [{
    id: "standard",
    name: "Timesheet Decimal",
    description: "Free timesheet converter",
    fields: [
      { name: "hours", label: "Hours", type: "number", min: 0, max: 24, defaultValue: 8 },
      { name: "minutes", label: "Minutes", type: "number", min: 0, max: 59, defaultValue: 30 },
      { name: "rate", label: "Hourly Rate (optional)", type: "number", prefix: "$", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const hours = inputs.hours as number;
      const minutes = inputs.minutes as number;
      const rate = (inputs.rate as number) || 0;
      if (hours === undefined && minutes === undefined) return null;
      const decimal = (hours || 0) + (minutes || 0) / 60;
      const earnings = rate > 0 ? decimal * rate : 0;
      return {
        primary: { label: "Decimal Hours", value: formatNumber(decimal) },
        details: [
          { label: "Time", value: (hours || 0) + "h " + (minutes || 0) + "m" },
          { label: "Decimal format", value: formatNumber(decimal) },
          ...(rate > 0 ? [{ label: "Earnings", value: "$" + formatNumber(earnings) }] : []),
          { label: "Common: 15 min", value: "0.25" },
          { label: "Common: 30 min", value: "0.50" },
          { label: "Common: 45 min", value: "0.75" },
        ],
      };
    },
  }],
  relatedSlugs: ["hourly-to-salary-calculator", "overtime-pay-calc"],
  faq: [
    { question: "How do I convert minutes to decimal?", answer: "Divide minutes by 60. Examples: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75, 20 min = 0.33." },
    { question: "Why use decimal time for payroll?", answer: "Payroll systems calculate pay as hours × rate. 8 hours 30 minutes = 8.50 decimal hours × $25/hr = $212.50." },
  ],
  formula: "Decimal Hours = Hours + (Minutes / 60)",
};
