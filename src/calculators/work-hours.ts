import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const workHoursCalculator: CalculatorDefinition = {
  slug: "work-hours-calculator",
  title: "Work Hours Calculator",
  description: "Free work hours calculator. Calculate total hours worked, overtime, and pay from clock-in/clock-out times.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["work hours calculator", "hours worked calculator", "overtime calculator", "hourly pay calculator"],
  variants: [
    {
      id: "daily",
      name: "Daily Hours & Pay",
      fields: [
        { name: "startH", label: "Start Hour (0-23)", type: "number", placeholder: "e.g. 9", min: 0, max: 23 },
        { name: "startM", label: "Start Minute", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "endH", label: "End Hour (0-23)", type: "number", placeholder: "e.g. 17", min: 0, max: 23 },
        { name: "endM", label: "End Minute", type: "number", placeholder: "e.g. 30", min: 0, max: 59, defaultValue: 0 },
        { name: "breakMin", label: "Break (minutes)", type: "number", placeholder: "e.g. 30", defaultValue: 0 },
        { name: "rate", label: "Hourly Rate", type: "number", prefix: "$", placeholder: "e.g. 25" },
      ],
      calculate: (inputs) => {
        const sH = inputs.startH as number, sM = (inputs.startM as number) || 0;
        const eH = inputs.endH as number, eM = (inputs.endM as number) || 0;
        const brk = (inputs.breakMin as number) || 0;
        const rate = inputs.rate as number;
        if (sH === undefined || eH === undefined) return null;
        let totalMin = (eH * 60 + eM) - (sH * 60 + sM);
        if (totalMin < 0) totalMin += 24 * 60;
        totalMin -= brk;
        if (totalMin < 0) totalMin = 0;
        const hours = totalMin / 60;
        const h = Math.floor(hours), m = totalMin % 60;
        const details = [
          { label: "Total time", value: `${h}h ${m}m` },
          { label: "Decimal hours", value: formatNumber(hours, 2) },
        ];
        if (rate) {
          const regularHrs = Math.min(hours, 8);
          const overtimeHrs = Math.max(hours - 8, 0);
          details.push({ label: "Regular pay", value: `$${formatNumber(regularHrs * rate, 2)}` });
          if (overtimeHrs > 0) {
            details.push({ label: "Overtime hours", value: formatNumber(overtimeHrs, 2) });
            details.push({ label: "Overtime pay (1.5×)", value: `$${formatNumber(overtimeHrs * rate * 1.5, 2)}` });
          }
          details.push({ label: "Total pay", value: `$${formatNumber(regularHrs * rate + overtimeHrs * rate * 1.5, 2)}` });
        }
        return {
          primary: { label: "Hours Worked", value: `${h}h ${m}m` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["time-card-calculator", "salary-calculator", "paycheck-calculator"],
  faq: [{ question: "How do I calculate hours worked?", answer: "Subtract start time from end time, then subtract break time. For 9:00 to 17:30 with a 30-minute break: 8.5 hours - 0.5 hours = 8 hours worked." }],
  formula: "Hours = (End - Start) - Breaks",
};
