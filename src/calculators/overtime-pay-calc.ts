import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const overtimePayCalc: CalculatorDefinition = {
  slug: "overtime-pay-calc",
  title: "Overtime Pay Calculator",
  description: "Free online overtime pay calculator. Calculate overtime earnings for regular, double time, and holiday pay rates under FLSA guidelines.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["overtime pay", "overtime calculator", "time and a half", "double time", "holiday pay", "FLSA", "overtime hours"],
  variants: [
    {
      id: "weekly-overtime",
      name: "Weekly Overtime Calculation",
      fields: [
        {
          name: "hourlyRate",
          label: "Regular Hourly Rate ($)",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
        },
        {
          name: "regularHours",
          label: "Regular Hours Worked (up to 40)",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
          max: 168,
        },
        {
          name: "overtimeHours",
          label: "Overtime Hours (over 40)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "doubleTimeHours",
          label: "Double Time Hours",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
        {
          name: "holidayHours",
          label: "Holiday Hours",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
        },
        {
          name: "overtimeRate",
          label: "Overtime Rate Multiplier",
          type: "select",
          options: [
            { label: "1.5x (Time and a Half - Standard)", value: "1.5" },
            { label: "1.25x (Some states)", value: "1.25" },
            { label: "2.0x (Double Time)", value: "2.0" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 0;
        const regularHours = parseFloat(inputs.regularHours as string) || 0;
        const overtimeHours = parseFloat(inputs.overtimeHours as string) || 0;
        const doubleTimeHours = parseFloat(inputs.doubleTimeHours as string) || 0;
        const holidayHours = parseFloat(inputs.holidayHours as string) || 0;
        const overtimeRate = parseFloat(inputs.overtimeRate as string) || 1.5;

        const regularPay = hourlyRate * regularHours;
        const overtimePay = hourlyRate * overtimeRate * overtimeHours;
        const doubleTimePay = hourlyRate * 2.0 * doubleTimeHours;
        const holidayPay = hourlyRate * 1.5 * holidayHours;
        const totalPay = regularPay + overtimePay + doubleTimePay + holidayPay;
        const totalHours = regularHours + overtimeHours + doubleTimeHours + holidayHours;
        const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;

        return {
          primary: { label: "Total Weekly Pay", value: "$" + formatNumber(totalPay) },
          details: [
            { label: "Regular Pay (" + regularHours + " hrs)", value: "$" + formatNumber(regularPay) },
            { label: "Overtime Pay (" + overtimeHours + " hrs @ " + overtimeRate + "x)", value: "$" + formatNumber(overtimePay) },
            { label: "Double Time Pay (" + doubleTimeHours + " hrs)", value: "$" + formatNumber(doubleTimePay) },
            { label: "Holiday Pay (" + holidayHours + " hrs)", value: "$" + formatNumber(holidayPay) },
            { label: "Total Hours", value: formatNumber(totalHours, 1) },
            { label: "Effective Hourly Rate", value: "$" + formatNumber(effectiveRate) },
          ],
        };
      },
    },
    {
      id: "salary-to-overtime",
      name: "Salary to Overtime Rate",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary ($)",
          type: "number",
          placeholder: "e.g. 50000",
          min: 0,
        },
        {
          name: "hoursPerWeek",
          label: "Standard Hours Per Week",
          type: "number",
          placeholder: "e.g. 40",
          min: 1,
        },
        {
          name: "overtimeHours",
          label: "Overtime Hours This Week",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const annualSalary = parseFloat(inputs.annualSalary as string) || 0;
        const hoursPerWeek = parseFloat(inputs.hoursPerWeek as string) || 40;
        const overtimeHours = parseFloat(inputs.overtimeHours as string) || 0;

        const weeksPerYear = 52;
        const weeklyPay = annualSalary / weeksPerYear;
        const hourlyRate = weeklyPay / hoursPerWeek;
        const overtimeRate = hourlyRate * 1.5;
        const overtimePay = overtimeRate * overtimeHours;
        const totalWeeklyPay = weeklyPay + overtimePay;

        // 2024 FLSA threshold
        const flsaThreshold = 43888;
        const overtimeEligible = annualSalary < flsaThreshold;

        return {
          primary: { label: "Overtime Rate Per Hour", value: "$" + formatNumber(overtimeRate) },
          details: [
            { label: "Regular Hourly Rate", value: "$" + formatNumber(hourlyRate) },
            { label: "Weekly Base Pay", value: "$" + formatNumber(weeklyPay) },
            { label: "Overtime Pay This Week", value: "$" + formatNumber(overtimePay) },
            { label: "Total Weekly Pay", value: "$" + formatNumber(totalWeeklyPay) },
            { label: "FLSA Overtime Eligible", value: overtimeEligible ? "Likely Yes (under $43,888)" : "Possibly Exempt" },
          ],
          note: "Salaried employees earning below the FLSA salary threshold ($43,888 in 2024) are generally entitled to overtime pay. Some exemptions apply based on job duties.",
        };
      },
    },
  ],
  relatedSlugs: ["consulting-rate-calc", "side-hustle-tax", "wrongful-termination"],
  faq: [
    {
      question: "When am I entitled to overtime pay?",
      answer: "Under the FLSA, non-exempt employees must receive overtime pay of at least 1.5x their regular rate for hours worked over 40 in a workweek. Some states (like California) also require overtime for hours over 8 in a single day.",
    },
    {
      question: "What is double time?",
      answer: "Double time is pay at 2x the regular rate. It is required in California for hours over 12 in a single day or hours over 8 on the 7th consecutive workday. It is not required under federal law but may be offered by employers.",
    },
    {
      question: "Are salaried employees entitled to overtime?",
      answer: "It depends on their salary level and job duties. Employees earning below the FLSA salary threshold (currently $43,888/year) are generally entitled to overtime regardless of job title. Certain executive, administrative, and professional employees may be exempt.",
    },
  ],
  formula: "Overtime Pay = Hourly Rate x Overtime Multiplier x Overtime Hours\nTotal Pay = Regular Pay + Overtime Pay + Double Time Pay + Holiday Pay",
};
