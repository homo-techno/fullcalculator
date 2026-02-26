import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const consultingRateCalc: CalculatorDefinition = {
  slug: "consulting-rate-calc",
  title: "Consulting Rate Calculator",
  description: "Free online consulting rate calculator. Convert your salary to an equivalent hourly consulting rate accounting for overhead, taxes, and benefits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["consulting rate", "hourly rate", "freelance rate", "contractor rate", "salary to hourly", "consulting fee", "freelance pricing"],
  variants: [
    {
      id: "salary-to-rate",
      name: "Salary to Consulting Rate",
      fields: [
        {
          name: "annualSalary",
          label: "Equivalent Annual Salary ($)",
          type: "number",
          placeholder: "e.g. 100000",
          min: 0,
        },
        {
          name: "billableHoursPerWeek",
          label: "Billable Hours Per Week",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 60,
        },
        {
          name: "weeksOff",
          label: "Weeks Off Per Year (vacation, sick, holidays)",
          type: "number",
          placeholder: "e.g. 4",
          min: 0,
          max: 20,
        },
        {
          name: "profitMargin",
          label: "Desired Profit Margin",
          type: "select",
          options: [
            { label: "10% (Conservative)", value: "10" },
            { label: "20% (Standard)", value: "20" },
            { label: "30% (Comfortable)", value: "30" },
            { label: "40% (Premium)", value: "40" },
          ],
        },
        {
          name: "overheadPercent",
          label: "Overhead (insurance, software, etc.)",
          type: "select",
          options: [
            { label: "10% (Home office, minimal)", value: "10" },
            { label: "20% (Moderate)", value: "20" },
            { label: "30% (Office + staff)", value: "30" },
            { label: "40% (Full office)", value: "40" },
          ],
        },
      ],
      calculate: (inputs) => {
        const salary = parseFloat(inputs.annualSalary as string) || 0;
        const billableHours = parseFloat(inputs.billableHoursPerWeek as string) || 30;
        const weeksOff = parseFloat(inputs.weeksOff as string) || 4;
        const profitMargin = parseFloat(inputs.profitMargin as string) || 20;
        const overheadPercent = parseFloat(inputs.overheadPercent as string) || 20;

        const workWeeks = 52 - weeksOff;
        const annualBillableHours = billableHours * workWeeks;

        // Add self-employment tax (15.3%) and benefits cost (~20%)
        const selfEmploymentTax = salary * 0.153;
        const benefitsCost = salary * 0.20;
        const overhead = salary * (overheadPercent / 100);
        const totalCosts = salary + selfEmploymentTax + benefitsCost + overhead;
        const withProfit = totalCosts / (1 - profitMargin / 100);
        const hourlyRate = annualBillableHours > 0 ? withProfit / annualBillableHours : 0;

        const dailyRate = hourlyRate * 8;
        const monthlyRetainer = hourlyRate * billableHours * 4;

        return {
          primary: { label: "Recommended Hourly Rate", value: "$" + formatNumber(hourlyRate) },
          details: [
            { label: "Base Salary Equivalent", value: "$" + formatNumber(salary) },
            { label: "Self-Employment Tax (15.3%)", value: "$" + formatNumber(selfEmploymentTax) },
            { label: "Benefits Cost (20%)", value: "$" + formatNumber(benefitsCost) },
            { label: "Overhead (" + overheadPercent + "%)", value: "$" + formatNumber(overhead) },
            { label: "Total Annual Costs", value: "$" + formatNumber(totalCosts) },
            { label: "Annual Billable Hours", value: formatNumber(annualBillableHours, 0) },
            { label: "Daily Rate (8 hrs)", value: "$" + formatNumber(dailyRate) },
            { label: "Monthly Retainer (est.)", value: "$" + formatNumber(monthlyRetainer) },
          ],
        };
      },
    },
    {
      id: "rate-comparison",
      name: "Rate Comparison",
      fields: [
        {
          name: "currentHourlyRate",
          label: "Current/Proposed Hourly Rate ($)",
          type: "number",
          placeholder: "e.g. 150",
          min: 0,
        },
        {
          name: "billableHoursPerWeek",
          label: "Billable Hours Per Week",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
        },
        {
          name: "weeksWorked",
          label: "Weeks Worked Per Year",
          type: "number",
          placeholder: "e.g. 48",
          min: 1,
          max: 52,
        },
        {
          name: "overheadMonthly",
          label: "Monthly Overhead Expenses ($)",
          type: "number",
          placeholder: "e.g. 2000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.currentHourlyRate as string) || 0;
        const hours = parseFloat(inputs.billableHoursPerWeek as string) || 30;
        const weeks = parseFloat(inputs.weeksWorked as string) || 48;
        const overhead = parseFloat(inputs.overheadMonthly as string) || 0;

        const grossAnnual = rate * hours * weeks;
        const annualOverhead = overhead * 12;
        const selfEmploymentTax = grossAnnual * 0.153;
        const netAnnual = grossAnnual - annualOverhead - selfEmploymentTax;
        const equivalentSalary = netAnnual * 0.80; // adjust for benefits
        const effectiveHourlyRate = netAnnual / (hours * weeks);

        return {
          primary: { label: "Gross Annual Revenue", value: "$" + formatNumber(grossAnnual) },
          details: [
            { label: "Annual Overhead", value: "-$" + formatNumber(annualOverhead) },
            { label: "Self-Employment Tax", value: "-$" + formatNumber(selfEmploymentTax) },
            { label: "Net Annual Income", value: "$" + formatNumber(netAnnual) },
            { label: "Equivalent W-2 Salary", value: "$" + formatNumber(equivalentSalary) },
            { label: "Effective Hourly Rate", value: "$" + formatNumber(effectiveHourlyRate) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["overtime-pay-calc", "side-hustle-tax", "startup-cost-calc"],
  faq: [
    {
      question: "Why should my consulting rate be higher than my hourly salary?",
      answer: "As a consultant, you pay self-employment taxes (15.3%), fund your own benefits (health insurance, retirement, PTO), cover business overhead, and have non-billable hours. A good rule of thumb is to charge 2-3x your equivalent hourly salary rate.",
    },
    {
      question: "What is a typical consulting rate?",
      answer: "Rates vary widely by industry and expertise. Management consultants charge $150-$400/hr, IT consultants $100-$250/hr, and marketing consultants $100-$300/hr. Specialized expertise commands premium rates.",
    },
    {
      question: "How many hours should I expect to bill?",
      answer: "Most independent consultants bill 25-35 hours per week. The remaining time goes to business development, administration, marketing, and professional development. Plan for about 60-70% utilization rate.",
    },
  ],
  formula: "Hourly Rate = (Salary + SE Tax + Benefits + Overhead) / (1 - Profit Margin) / Annual Billable Hours",
};
