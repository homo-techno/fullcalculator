import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeCardCalculator: CalculatorDefinition = {
  slug: "time-card-calculator",
  title: "Time Card Calculator",
  description: "Free time card calculator. Calculate work hours, overtime, and total pay from clock-in and clock-out times.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time card calculator", "hours worked calculator", "work hours calculator", "timesheet calculator", "overtime calculator"],
  variants: [
    {
      id: "hours",
      name: "Daily Hours Worked",
      fields: [
        { name: "inHour", label: "Clock In Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "inMin", label: "Clock In Minutes", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
        { name: "outHour", label: "Clock Out Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "outMin", label: "Clock Out Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "lunchMin", label: "Lunch Break (minutes)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "rate", label: "Hourly Rate (optional)", type: "number", placeholder: "e.g. 25", prefix: "$" },
      ],
      calculate: (inputs) => {
        const inH = inputs.inHour as number;
        const inM = (inputs.inMin as number) || 0;
        const outH = inputs.outHour as number;
        const outM = (inputs.outMin as number) || 0;
        const lunch = (inputs.lunchMin as number) || 0;
        const rate = inputs.rate as number;
        if (inH === undefined || outH === undefined) return null;
        let totalMin = (outH * 60 + outM) - (inH * 60 + inM);
        if (totalMin < 0) totalMin += 24 * 60;
        totalMin -= lunch;
        const hours = totalMin / 60;
        const regularHrs = Math.min(hours, 8);
        const overtimeHrs = Math.max(0, hours - 8);
        const details = [
          { label: "Total hours", value: `${Math.floor(hours)}h ${Math.round(totalMin % 60)}m` },
          { label: "Decimal hours", value: formatNumber(hours, 2) },
          { label: "Regular hours", value: formatNumber(regularHrs, 2) },
          { label: "Overtime hours", value: formatNumber(overtimeHrs, 2) },
        ];
        if (rate) {
          const regularPay = regularHrs * rate;
          const overtimePay = overtimeHrs * rate * 1.5;
          details.push({ label: "Regular pay", value: `$${formatNumber(regularPay)}` });
          if (overtimeHrs > 0) details.push({ label: "Overtime pay (1.5×)", value: `$${formatNumber(overtimePay)}` });
          details.push({ label: "Total pay", value: `$${formatNumber(regularPay + overtimePay)}` });
        }
        return {
          primary: { label: "Hours Worked", value: `${Math.floor(hours)}h ${Math.round(totalMin % 60)}m` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "date-calculator"],
  faq: [
    { question: "How do I calculate overtime?", answer: "In the US, overtime is typically 1.5× pay for hours over 40/week or 8/day. Some states (like California) require daily overtime after 8 hours, regardless of weekly total." },
  ],
  formula: "Hours = (Clock Out - Clock In - Lunch) / 60 | OT = hours > 8 at 1.5× rate",
};
