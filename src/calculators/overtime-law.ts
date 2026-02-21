import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overtimeLawCalculator: CalculatorDefinition = {
  slug: "overtime-law-calculator",
  title: "Overtime Calculator",
  description: "Free overtime pay calculator based on FLSA rules. Calculate overtime wages for time-and-a-half, double time, and weekly overtime thresholds.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["overtime calculator", "overtime pay calculator", "FLSA overtime", "time and a half calculator", "overtime wage calculator"],
  variants: [
    {
      id: "weekly-overtime",
      name: "Weekly Overtime (FLSA)",
      description: "Calculate overtime pay based on federal FLSA rules (time-and-a-half after 40 hours)",
      fields: [
        { name: "hourlyRate", label: "Regular Hourly Rate", type: "number", placeholder: "e.g. 25", prefix: "$" },
        { name: "hoursWorked", label: "Total Hours Worked This Week", type: "number", placeholder: "e.g. 52", min: 0 },
        { name: "overtimeThreshold", label: "Overtime Threshold (hours)", type: "number", placeholder: "40", defaultValue: 40 },
        { name: "overtimeMultiplier", label: "Overtime Rate", type: "select", options: [
          { label: "1.5x (Time and a Half)", value: "1.5" },
          { label: "2.0x (Double Time)", value: "2.0" },
        ], defaultValue: "1.5" },
      ],
      calculate: (inputs) => {
        const hourlyRate = inputs.hourlyRate as number;
        const hoursWorked = inputs.hoursWorked as number;
        const overtimeThreshold = (inputs.overtimeThreshold as number) || 40;
        const overtimeMultiplier = parseFloat(inputs.overtimeMultiplier as string) || 1.5;

        if (!hourlyRate || !hoursWorked) return null;

        const regularHours = Math.min(hoursWorked, overtimeThreshold);
        const overtimeHours = Math.max(0, hoursWorked - overtimeThreshold);
        const overtimeRate = hourlyRate * overtimeMultiplier;

        const regularPay = regularHours * hourlyRate;
        const overtimePay = overtimeHours * overtimeRate;
        const totalPay = regularPay + overtimePay;

        const effectiveHourlyRate = totalPay / hoursWorked;
        const annualEstimate = totalPay * 52;

        return {
          primary: { label: "Total Weekly Pay", value: `$${formatNumber(totalPay)}` },
          details: [
            { label: "Regular hours", value: `${regularHours} hrs × $${formatNumber(hourlyRate)} = $${formatNumber(regularPay)}` },
            { label: "Overtime hours", value: `${formatNumber(overtimeHours)} hrs × $${formatNumber(overtimeRate)} = $${formatNumber(overtimePay)}` },
            { label: "Overtime rate", value: `$${formatNumber(overtimeRate)}/hr (${overtimeMultiplier}x)` },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveHourlyRate)}/hr` },
            { label: "Estimated annual (at this rate)", value: `$${formatNumber(annualEstimate)}` },
          ],
          note: "Under the FLSA, non-exempt employees must receive overtime pay of at least 1.5x their regular rate for hours exceeding 40 in a workweek. Some states have additional daily overtime rules (e.g., California requires overtime after 8 hours/day).",
        };
      },
    },
  ],
  relatedSlugs: ["minimum-wage-calculator", "paycheck-calculator", "salary-calculator"],
  faq: [
    { question: "Who is eligible for overtime pay?", answer: "Under the FLSA, non-exempt employees must receive overtime pay. Exempt employees (typically salaried workers earning above the threshold in executive, administrative, or professional roles) are not eligible. The salary threshold for exemption is $684/week ($35,568/year) as of 2024." },
    { question: "Is overtime always time-and-a-half?", answer: "Under federal law, yes - the minimum overtime rate is 1.5x the regular rate. However, some employers offer double time voluntarily or as part of union contracts. California requires double time after 12 hours in a day or after 8 hours on the 7th consecutive workday." },
    { question: "Does overtime apply to salaried workers?", answer: "It depends. Salaried workers who earn below the FLSA salary threshold or whose duties don't meet exemption criteria are still entitled to overtime. Simply being paid a salary doesn't automatically exempt an employee from overtime requirements." },
  ],
  formula: "Regular Pay = Min(Hours, 40) × Hourly Rate. Overtime Pay = Max(0, Hours - 40) × Hourly Rate × Multiplier. Total = Regular Pay + Overtime Pay.",
};
