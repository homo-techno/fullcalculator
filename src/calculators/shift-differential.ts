import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shiftDifferentialCalculator: CalculatorDefinition = {
  slug: "shift-differential-calculator",
  title: "Shift Differential Calculator",
  description: "Free shift differential pay calculator. Calculate extra pay for evening, night, and weekend shifts. See your total shift pay.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["shift differential calculator", "shift premium calculator", "night shift pay", "weekend differential", "shift pay calculator"],
  variants: [
    {
      id: "basic",
      name: "Shift Differential Pay",
      description: "Calculate pay with shift differential premium",
      fields: [
        { name: "baseRate", label: "Base Hourly Rate", type: "number", placeholder: "e.g. 20", prefix: "$", step: 0.01 },
        { name: "differentialType", label: "Differential Type", type: "select", options: [
          { label: "Percentage (%)", value: "percent" },
          { label: "Flat Amount ($)", value: "flat" },
        ], defaultValue: "percent" },
        { name: "differentialAmount", label: "Differential Amount", type: "number", placeholder: "e.g. 10 (% or $)" },
        { name: "shiftHours", label: "Shift Hours", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const baseRate = inputs.baseRate as number;
        const diffType = inputs.differentialType as string;
        const diffAmount = inputs.differentialAmount as number;
        const hours = inputs.shiftHours as number;
        if (!baseRate || !diffAmount || !hours) return null;
        let premium: number;
        let shiftRate: number;
        if (diffType === "flat") {
          premium = diffAmount;
          shiftRate = baseRate + diffAmount;
        } else {
          premium = baseRate * (diffAmount / 100);
          shiftRate = baseRate + premium;
        }
        const basePay = baseRate * hours;
        const shiftPay = shiftRate * hours;
        const extraPay = shiftPay - basePay;
        return {
          primary: { label: "Total Shift Pay", value: `$${formatNumber(shiftPay)}` },
          details: [
            { label: "Shift Hourly Rate", value: `$${formatNumber(shiftRate)}` },
            { label: "Base Hourly Rate", value: `$${formatNumber(baseRate)}` },
            { label: "Premium per Hour", value: `$${formatNumber(premium)}` },
            { label: "Extra Pay (differential)", value: `$${formatNumber(extraPay)}` },
            { label: "Base Pay (without differential)", value: `$${formatNumber(basePay)}` },
          ],
        };
      },
    },
    {
      id: "weekly",
      name: "Weekly Mixed-Shift Pay",
      description: "Calculate weekly pay with regular and differential hours",
      fields: [
        { name: "baseRate", label: "Base Hourly Rate", type: "number", placeholder: "e.g. 22", prefix: "$", step: 0.01 },
        { name: "regularHours", label: "Regular Shift Hours/Week", type: "number", placeholder: "e.g. 24" },
        { name: "differentialHours", label: "Differential Shift Hours/Week", type: "number", placeholder: "e.g. 16" },
        { name: "differentialPct", label: "Shift Differential %", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const baseRate = inputs.baseRate as number;
        const regHours = inputs.regularHours as number;
        const diffHours = inputs.differentialHours as number;
        const diffPct = inputs.differentialPct as number;
        if (!baseRate || regHours === undefined || !diffHours || !diffPct) return null;
        const premium = baseRate * (diffPct / 100);
        const shiftRate = baseRate + premium;
        const regularPay = regHours * baseRate;
        const differentialPay = diffHours * shiftRate;
        const totalHours = regHours + diffHours;
        const totalPay = regularPay + differentialPay;
        const effectiveRate = totalPay / totalHours;
        const overtimeHours = Math.max(0, totalHours - 40);
        const annualExtra = diffHours * premium * 52;
        return {
          primary: { label: "Weekly Total Pay", value: `$${formatNumber(totalPay)}` },
          details: [
            { label: "Regular Pay", value: `$${formatNumber(regularPay)}` },
            { label: "Differential Pay", value: `$${formatNumber(differentialPay)}` },
            { label: "Effective Hourly Rate", value: `$${formatNumber(effectiveRate)}` },
            { label: "Premium per Hour", value: `$${formatNumber(premium)}` },
            { label: "Total Hours", value: formatNumber(totalHours, 1) },
            { label: "Annual Differential Extra", value: `$${formatNumber(annualExtra)}` },
          ],
          note: overtimeHours > 0 ? `Note: ${formatNumber(overtimeHours, 1)} overtime hours may apply (not calculated here). Check your company's OT policy for differential shifts.` : undefined,
        };
      },
    },
    {
      id: "annual",
      name: "Annual Impact",
      description: "Calculate the annual impact of shift differential pay",
      fields: [
        { name: "baseRate", label: "Base Hourly Rate", type: "number", placeholder: "e.g. 22", prefix: "$", step: 0.01 },
        { name: "differentialPct", label: "Shift Differential %", type: "number", placeholder: "e.g. 10", suffix: "%" },
        { name: "diffHoursPerWeek", label: "Differential Hours per Week", type: "number", placeholder: "e.g. 20" },
        { name: "weeksPerYear", label: "Weeks per Year", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const baseRate = inputs.baseRate as number;
        const diffPct = inputs.differentialPct as number;
        const hoursPerWeek = inputs.diffHoursPerWeek as number;
        const weeks = (inputs.weeksPerYear as number) || 50;
        if (!baseRate || !diffPct || !hoursPerWeek) return null;
        const premium = baseRate * (diffPct / 100);
        const annualExtra = premium * hoursPerWeek * weeks;
        const annualBase = baseRate * 2080;
        const totalAnnual = annualBase + annualExtra;
        return {
          primary: { label: "Annual Extra from Differential", value: `$${formatNumber(annualExtra)}` },
          details: [
            { label: "Base Annual Salary", value: `$${formatNumber(annualBase)}` },
            { label: "Total with Differential", value: `$${formatNumber(totalAnnual)}` },
            { label: "Premium per Hour", value: `$${formatNumber(premium)}` },
            { label: "Extra per Week", value: `$${formatNumber(premium * hoursPerWeek)}` },
            { label: "Extra per Month", value: `$${formatNumber(annualExtra / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "overtime-calculator"],
  faq: [
    { question: "What is shift differential pay?", answer: "Shift differential is extra pay for working less desirable shifts (evenings, nights, weekends). It is typically a percentage (5-15%) or flat dollar amount ($1-$5/hr) added to base pay. It is not required by federal law but is common practice." },
    { question: "What is a typical shift differential?", answer: "Common rates: Evening shift (2nd shift): 5-10% or $1-2/hr extra. Night shift (3rd shift): 10-15% or $2-4/hr extra. Weekend shifts: 10-20% or $2-5/hr extra. Healthcare and manufacturing tend to offer higher differentials." },
    { question: "Is shift differential included in overtime calculations?", answer: "Yes, under FLSA, shift differential must be included when calculating the regular rate of pay for overtime purposes. This means overtime is calculated on the combined base rate plus differential, not just the base rate." },
  ],
  formula: "Shift Rate = Base Rate + (Base Rate × Differential%) | Shift Pay = Shift Rate × Hours | Annual Extra = Premium × Differential Hours/Week × 52",
};
