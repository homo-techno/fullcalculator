import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const SHIFT_TYPE_OPTIONS = [
  { label: "Standard (9-5)", value: "standard" },
  { label: "Early (6-2)", value: "early" },
  { label: "Late (2-10)", value: "late" },
  { label: "Night (10-6)", value: "night" },
  { label: "12-Hour Day (7-7)", value: "12day" },
  { label: "12-Hour Night (7-7)", value: "12night" },
  { label: "Custom", value: "custom" },
];

const SCHEDULE_PATTERN_OPTIONS = [
  { label: "5 days on, 2 off (M-F)", value: "5-2" },
  { label: "4 days on, 3 off", value: "4-3" },
  { label: "4 on, 4 off (rotating)", value: "4-4" },
  { label: "3 on, 3 off (rotating)", value: "3-3" },
  { label: "2 on, 2 off, 3 on (DuPont)", value: "dupont" },
  { label: "Custom days per week", value: "custom" },
];

export const workScheduleCalculator: CalculatorDefinition = {
  slug: "work-schedule-calculator",
  title: "Work Schedule Calculator",
  description:
    "Free work schedule calculator. Calculate total work hours per week, month, and year based on your shift pattern and schedule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "work schedule calculator",
    "shift schedule calculator",
    "work hours per week",
    "shift pattern calculator",
    "rotating schedule calculator",
  ],
  variants: [
    {
      id: "shift-hours",
      name: "Shift Hours Calculator",
      description: "Calculate total hours for your work schedule",
      fields: [
        { name: "startHour", label: "Shift Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startMin", label: "Shift Start Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "endHour", label: "Shift End Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "endMin", label: "Shift End Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "breakMin", label: "Break (minutes)", type: "number", placeholder: "e.g. 30", defaultValue: 30, min: 0 },
        { name: "daysPerWeek", label: "Days Per Week", type: "number", placeholder: "e.g. 5", min: 1, max: 7, defaultValue: 5 },
        { name: "hourlyRate", label: "Hourly Rate (optional)", type: "number", placeholder: "e.g. 25", prefix: "$" },
      ],
      calculate: (inputs) => {
        const sh = inputs.startHour as number;
        const sm = (inputs.startMin as number) || 0;
        const eh = inputs.endHour as number;
        const em = (inputs.endMin as number) || 0;
        const breakMin = (inputs.breakMin as number) || 0;
        const daysPerWeek = (inputs.daysPerWeek as number) || 5;
        const rate = inputs.hourlyRate as number;
        if (sh === undefined || eh === undefined) return null;

        let shiftMin = (eh * 60 + em) - (sh * 60 + sm);
        if (shiftMin <= 0) shiftMin += 24 * 60; // overnight shift
        const netMin = shiftMin - breakMin;
        const shiftHours = netMin / 60;

        const weeklyHours = shiftHours * daysPerWeek;
        const monthlyHours = weeklyHours * 4.345; // average weeks per month
        const yearlyHours = weeklyHours * 52;

        const details = [
          { label: "Shift length (gross)", value: `${Math.floor(shiftMin / 60)}h ${shiftMin % 60}m` },
          { label: "Net shift (after break)", value: `${Math.floor(netMin / 60)}h ${netMin % 60}m` },
          { label: "Decimal hours per shift", value: formatNumber(shiftHours, 2) },
          { label: "Weekly hours", value: formatNumber(weeklyHours, 1) },
          { label: "Monthly hours (avg)", value: formatNumber(monthlyHours, 0) },
          { label: "Yearly hours", value: formatNumber(yearlyHours, 0) },
        ];

        if (rate) {
          details.push({ label: "Daily gross pay", value: `$${formatNumber(shiftHours * rate, 2)}` });
          details.push({ label: "Weekly gross pay", value: `$${formatNumber(weeklyHours * rate, 2)}` });
          details.push({ label: "Monthly gross pay (avg)", value: `$${formatNumber(monthlyHours * rate, 2)}` });
          details.push({ label: "Yearly gross pay", value: `$${formatNumber(yearlyHours * rate, 2)}` });
        }

        return {
          primary: {
            label: "Weekly Work Hours",
            value: formatNumber(weeklyHours, 1),
            suffix: "hours/week",
          },
          details,
        };
      },
    },
    {
      id: "schedule-pattern",
      name: "Schedule Pattern",
      description: "Calculate work hours for common shift patterns",
      fields: [
        { name: "pattern", label: "Schedule Pattern", type: "select", options: SCHEDULE_PATTERN_OPTIONS, defaultValue: "5-2" },
        { name: "shiftLength", label: "Shift Length (hours)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "breakMin", label: "Break Per Shift (minutes)", type: "number", placeholder: "e.g. 30", defaultValue: 30, min: 0 },
      ],
      calculate: (inputs) => {
        const pattern = inputs.pattern as string;
        const shiftLength = inputs.shiftLength as number;
        const breakMin = (inputs.breakMin as number) || 0;
        if (!shiftLength) return null;

        const netShift = shiftLength - breakMin / 60;
        let daysOn: number;
        let cycleDays: number;
        let patternDesc: string;

        switch (pattern) {
          case "5-2": daysOn = 5; cycleDays = 7; patternDesc = "5 on, 2 off (Mon-Fri)"; break;
          case "4-3": daysOn = 4; cycleDays = 7; patternDesc = "4 on, 3 off"; break;
          case "4-4": daysOn = 4; cycleDays = 8; patternDesc = "4 on, 4 off (rotating)"; break;
          case "3-3": daysOn = 3; cycleDays = 6; patternDesc = "3 on, 3 off (rotating)"; break;
          case "dupont": daysOn = 3.5; cycleDays = 7; patternDesc = "DuPont (avg 3.5 days/week)"; break;
          default: daysOn = 5; cycleDays = 7; patternDesc = "Custom";
        }

        const avgDaysPerWeek = (daysOn / cycleDays) * 7;
        const weeklyHours = netShift * avgDaysPerWeek;
        const yearlyHours = weeklyHours * 52;
        const yearlyDays = Math.round(avgDaysPerWeek * 52);

        return {
          primary: {
            label: "Average Weekly Hours",
            value: formatNumber(weeklyHours, 1),
            suffix: "hours/week",
          },
          details: [
            { label: "Pattern", value: patternDesc },
            { label: "Net shift length", value: `${formatNumber(netShift, 2)} hours` },
            { label: "Avg days per week", value: formatNumber(avgDaysPerWeek, 1) },
            { label: "Yearly work days", value: formatNumber(yearlyDays) },
            { label: "Yearly work hours", value: formatNumber(yearlyHours, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "time-card-calculator",
    "work-hours-calculator",
    "pay-period-calculator",
  ],
  faq: [
    {
      question: "How many hours is a standard work week?",
      answer:
        "A standard full-time work week in the US is 40 hours (8 hours/day, 5 days/week). The Fair Labor Standards Act (FLSA) requires overtime pay after 40 hours per week.",
    },
    {
      question: "What is a rotating shift schedule?",
      answer:
        "A rotating schedule means employees cycle through different shifts (day, evening, night) or different on/off patterns. Common rotations include 4-on-4-off and the DuPont 12-hour schedule.",
    },
    {
      question: "How do I calculate yearly work hours?",
      answer:
        "Multiply your weekly hours by 52. For a standard 40-hour week: 40 x 52 = 2,080 hours/year. Subtract vacation and holiday hours for net working hours.",
    },
  ],
  formula: "Weekly Hours = Net Shift Hours x Days Per Week",
};
