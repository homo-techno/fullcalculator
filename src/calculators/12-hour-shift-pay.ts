import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twelveHourShiftPayCalculator: CalculatorDefinition = {
  slug: "12-hour-shift-pay-calculator",
  title: "12-Hour Shift Pay Calculator",
  description:
    "Free 12-hour shift pay calculator. Calculate earnings for 12-hour shifts including regular pay, overtime, night differentials, and weekend premiums.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "12 hour shift pay",
    "shift pay calculator",
    "night shift pay",
    "overtime shift calculator",
    "nursing shift pay",
    "12 hour work schedule pay",
  ],
  variants: [
    {
      id: "standard",
      name: "12-Hour Shift Pay",
      description:
        "Calculate pay for 12-hour shifts with overtime and differentials",
      fields: [
        {
          name: "hourlyRate",
          label: "Base Hourly Rate",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
        },
        {
          name: "shiftsPerWeek",
          label: "Shifts Per Week",
          type: "select",
          options: [
            { label: "3 shifts (36 hours)", value: "3" },
            { label: "4 shifts (48 hours)", value: "4" },
            { label: "5 shifts (60 hours)", value: "5" },
          ],
          defaultValue: "3",
        },
        {
          name: "nightDifferential",
          label: "Night Shift Differential",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "weekendPremium",
          label: "Weekend Premium ($/hr)",
          type: "number",
          placeholder: "e.g. 2",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "weekendShifts",
          label: "Weekend Shifts Per Week",
          type: "select",
          options: [
            { label: "0", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
          ],
          defaultValue: "0",
        },
        {
          name: "overtimeRule",
          label: "Overtime After",
          type: "select",
          options: [
            { label: "40 hours/week", value: "40" },
            { label: "8 hours/day (CA rule)", value: "8" },
            { label: "No overtime", value: "none" },
          ],
          defaultValue: "40",
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.hourlyRate as string);
        const shifts = parseInt(inputs.shiftsPerWeek as string, 10);
        const nightDiff = parseFloat(inputs.nightDifferential as string) || 0;
        const weekendPremium = parseFloat(inputs.weekendPremium as string) || 0;
        const weekendShifts = parseInt(inputs.weekendShifts as string, 10) || 0;
        const otRule = inputs.overtimeRule as string;

        if (!rate || rate <= 0) return null;

        const hoursPerShift = 12;
        const totalWeeklyHours = shifts * hoursPerShift;
        const weekdayShifts = shifts - weekendShifts;

        let regularHours: number;
        let overtimeHours: number;

        if (otRule === "40") {
          regularHours = Math.min(totalWeeklyHours, 40);
          overtimeHours = Math.max(0, totalWeeklyHours - 40);
        } else if (otRule === "8") {
          regularHours = shifts * 8;
          overtimeHours = shifts * (hoursPerShift - 8);
        } else {
          regularHours = totalWeeklyHours;
          overtimeHours = 0;
        }

        const regularPay = regularHours * rate;
        const overtimePay = overtimeHours * rate * 1.5;
        const nightPay = totalWeeklyHours * nightDiff;
        const weekendPay = weekendShifts * hoursPerShift * weekendPremium;

        const weeklyGross = regularPay + overtimePay + nightPay + weekendPay;
        const biweeklyGross = weeklyGross * 2;
        const monthlyGross = weeklyGross * 4.333;
        const annualGross = weeklyGross * 52;

        return {
          primary: { label: "Weekly Gross Pay", value: `$${formatNumber(weeklyGross)}` },
          details: [
            { label: "Regular pay", value: `$${formatNumber(regularPay)}` },
            { label: "Overtime pay (1.5x)", value: `$${formatNumber(overtimePay)}` },
            { label: "Night differential pay", value: `$${formatNumber(nightPay)}` },
            { label: "Weekend premium pay", value: `$${formatNumber(weekendPay)}` },
            { label: "Bi-weekly gross", value: `$${formatNumber(biweeklyGross)}` },
            { label: "Monthly gross", value: `$${formatNumber(monthlyGross)}` },
            { label: "Annual gross", value: `$${formatNumber(annualGross)}` },
            { label: "Total weekly hours", value: formatNumber(totalWeeklyHours) },
            { label: "Overtime hours", value: formatNumber(overtimeHours) },
          ],
          note: "Overtime rules vary by state. California requires OT after 8 hrs/day. Federal FLSA requires OT after 40 hrs/week. Night and weekend differentials are common in healthcare and manufacturing.",
        };
      },
    },
  ],
  relatedSlugs: ["time-and-half-calculator", "salary-calculator", "paycheck-calculator"],
  faq: [
    {
      question: "How is overtime calculated for 12-hour shifts?",
      answer:
        "Under federal FLSA rules, overtime (1.5x pay) kicks in after 40 hours/week. Three 12-hour shifts (36 hrs) have no overtime. Four shifts (48 hrs) have 8 overtime hours. In California, overtime starts after 8 hours per day, so every 12-hour shift includes 4 OT hours.",
    },
    {
      question: "What is a night shift differential?",
      answer:
        "Night differential is extra pay for working evening or overnight shifts, typically $2-$6/hour extra. It is common in healthcare, manufacturing, and public safety. Federal employees receive a 7.5-10% differential for night shifts.",
    },
  ],
  formula:
    "Weekly Pay = (Regular Hours x Rate) + (OT Hours x Rate x 1.5) + (Total Hours x Night Diff) + (Weekend Hours x Weekend Premium)",
};
