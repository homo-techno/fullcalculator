import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proratedSalaryCalculator: CalculatorDefinition = {
  slug: "prorated-salary-calculator",
  title: "Prorated Salary Calculator",
  description:
    "Free prorated salary calculator. Calculate partial pay for mid-period starts, terminations, or leave by prorating your salary for the actual days worked.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "prorated salary calculator",
    "partial pay calculator",
    "prorated pay period",
    "mid month start salary",
    "partial period pay",
  ],
  variants: [
    {
      id: "days",
      name: "Prorate by Days Worked",
      description:
        "Calculate prorated salary based on actual days worked in a period",
      fields: [
        {
          name: "annualSalary",
          label: "Annual Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
        },
        {
          name: "daysWorked",
          label: "Days Worked in Period",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "totalWorkDays",
          label: "Total Work Days in Period",
          type: "number",
          placeholder: "e.g. 22",
        },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Monthly (12/year)", value: "12" },
            { label: "Semi-Monthly (24/year)", value: "24" },
            { label: "Bi-Weekly (26/year)", value: "26" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string);
        const daysWorked = parseFloat(inputs.daysWorked as string);
        const totalDays = parseFloat(inputs.totalWorkDays as string);
        const frequency = parseInt(inputs.payFrequency as string, 10);

        if (!salary || salary <= 0 || !daysWorked || !totalDays || totalDays <= 0) return null;

        const fullPeriodPay = salary / frequency;
        const dailyRate = fullPeriodPay / totalDays;
        const proratedPay = dailyRate * daysWorked;
        const reduction = fullPeriodPay - proratedPay;

        return {
          primary: { label: "Prorated Pay", value: `$${formatNumber(proratedPay)}` },
          details: [
            { label: "Full period pay", value: `$${formatNumber(fullPeriodPay)}` },
            { label: "Daily rate", value: `$${formatNumber(dailyRate)}` },
            { label: "Days worked", value: formatNumber(daysWorked) },
            { label: "Total work days in period", value: formatNumber(totalDays) },
            { label: "Pay reduction", value: `$${formatNumber(reduction)}` },
            { label: "Percentage of full pay", value: `${formatNumber((daysWorked / totalDays) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Prorated Annual Salary",
      description:
        "Calculate prorated annual salary for partial-year employment",
      fields: [
        {
          name: "annualSalary",
          label: "Full Annual Salary",
          type: "number",
          placeholder: "e.g. 90000",
          prefix: "$",
        },
        {
          name: "startMonth",
          label: "Start Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
          defaultValue: "1",
        },
        {
          name: "endMonth",
          label: "End Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
          defaultValue: "12",
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string);
        const startMonth = parseInt(inputs.startMonth as string, 10);
        const endMonth = parseInt(inputs.endMonth as string, 10);

        if (!salary || salary <= 0) return null;

        const monthsWorked = endMonth >= startMonth
          ? endMonth - startMonth + 1
          : 12 - startMonth + 1 + endMonth;

        const proratedSalary = (salary / 12) * monthsWorked;
        const monthlyPay = salary / 12;

        return {
          primary: { label: "Prorated Annual Salary", value: `$${formatNumber(proratedSalary)}` },
          details: [
            { label: "Full annual salary", value: `$${formatNumber(salary)}` },
            { label: "Monthly salary", value: `$${formatNumber(monthlyPay)}` },
            { label: "Months worked", value: formatNumber(monthsWorked) },
            { label: "Proration factor", value: `${formatNumber(monthsWorked)}/12` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "annual-income-calculator"],
  faq: [
    {
      question: "How is a prorated salary calculated?",
      answer:
        "Prorated Salary = (Annual Salary / Pay Periods) x (Days Worked / Total Work Days in Period). For example, if you earn $72,000/year (monthly pay of $6,000) and work 15 of 22 days, your prorated pay is $6,000 x (15/22) = $4,090.91.",
    },
    {
      question: "When would I need to prorate my salary?",
      answer:
        "Prorating is common when starting or leaving a job mid-pay period, taking unpaid leave, switching from part-time to full-time (or vice versa), or receiving a mid-period salary change.",
    },
  ],
  formula:
    "Prorated Pay = (Annual Salary / Pay Periods) x (Days Worked / Total Work Days in Period)",
};
