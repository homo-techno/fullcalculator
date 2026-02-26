import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeAndHalfCalculator: CalculatorDefinition = {
  slug: "time-and-half-calculator",
  title: "Time and a Half Calculator",
  description:
    "Free time and a half calculator. Quickly calculate your overtime rate and total pay including regular hours and overtime hours at 1.5x your hourly rate.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "time and a half calculator",
    "overtime rate calculator",
    "1.5x pay",
    "overtime pay",
    "time and half pay",
  ],
  variants: [
    {
      id: "standard",
      name: "Time and a Half Calculator",
      description:
        "Calculate overtime rate and total pay with regular and OT hours",
      fields: [
        {
          name: "hourlyRate",
          label: "Regular Hourly Rate",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
        },
        {
          name: "regularHours",
          label: "Regular Hours Worked",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "hours",
        },
        {
          name: "overtimeHours",
          label: "Overtime Hours Worked",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "hours",
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.hourlyRate as string);
        const regular = parseFloat(inputs.regularHours as string);
        const overtime = parseFloat(inputs.overtimeHours as string);

        if (!rate || rate <= 0 || !regular) return null;

        const otRate = rate * 1.5;
        const regularPay = regular * rate;
        const overtimePay = (overtime || 0) * otRate;
        const totalPay = regularPay + overtimePay;
        const totalHours = regular + (overtime || 0);
        const effectiveRate = totalPay / totalHours;

        return {
          primary: { label: "Total Gross Pay", value: `$${formatNumber(totalPay)}` },
          details: [
            { label: "Regular hourly rate", value: `$${formatNumber(rate)}` },
            { label: "Overtime rate (1.5x)", value: `$${formatNumber(otRate)}` },
            { label: "Regular pay", value: `$${formatNumber(regularPay)}` },
            { label: "Overtime pay", value: `$${formatNumber(overtimePay)}` },
            { label: "Total hours", value: formatNumber(totalHours) },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveRate)}` },
          ],
        };
      },
    },
    {
      id: "double-time",
      name: "Overtime Rates Comparison",
      description:
        "Compare time-and-a-half, double-time, and other premium rates",
      fields: [
        {
          name: "hourlyRate",
          label: "Regular Hourly Rate",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
        },
        {
          name: "hoursWorked",
          label: "Premium Hours Worked",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "hours",
        },
        {
          name: "multiplier",
          label: "Pay Multiplier",
          type: "select",
          options: [
            { label: "1.25x (Some states)", value: "1.25" },
            { label: "1.5x (Standard OT)", value: "1.5" },
            { label: "2.0x (Double Time)", value: "2.0" },
            { label: "2.5x (Holiday Premium)", value: "2.5" },
            { label: "3.0x (Triple Time)", value: "3.0" },
          ],
          defaultValue: "1.5",
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.hourlyRate as string);
        const hours = parseFloat(inputs.hoursWorked as string);
        const multiplier = parseFloat(inputs.multiplier as string);

        if (!rate || rate <= 0 || !hours || hours <= 0) return null;

        const premiumRate = rate * multiplier;
        const premiumPay = hours * premiumRate;
        const regularPay = hours * rate;
        const extraPay = premiumPay - regularPay;

        return {
          primary: { label: "Premium Pay", value: `$${formatNumber(premiumPay)}` },
          details: [
            { label: "Premium hourly rate", value: `$${formatNumber(premiumRate)}` },
            { label: "Regular pay equivalent", value: `$${formatNumber(regularPay)}` },
            { label: "Extra premium earned", value: `$${formatNumber(extraPay)}` },
            { label: "Pay multiplier", value: `${formatNumber(multiplier)}x` },
            { label: "Hours at premium rate", value: formatNumber(hours) },
          ],
          note: "Federal FLSA requires 1.5x for hours over 40/week. California requires double time after 12 hours/day. Some union contracts provide triple time for holidays.",
        };
      },
    },
  ],
  relatedSlugs: ["12-hour-shift-pay-calculator", "salary-calculator", "paycheck-calculator"],
  faq: [
    {
      question: "What is time and a half?",
      answer:
        "Time and a half means your hourly rate multiplied by 1.5. If you earn $20/hour, your overtime rate is $30/hour. Under the FLSA, non-exempt employees must receive time-and-a-half for hours worked over 40 in a workweek.",
    },
    {
      question: "Who qualifies for overtime pay?",
      answer:
        "Non-exempt employees under the FLSA qualify for overtime. Most hourly workers qualify. Salaried employees earning under $35,568/year generally qualify. Exempt employees (salaried managers, professionals earning above the threshold) typically do not receive overtime.",
    },
  ],
  formula:
    "Overtime Rate = Hourly Rate x 1.5. Total Pay = (Regular Hours x Rate) + (OT Hours x Rate x 1.5)",
};
