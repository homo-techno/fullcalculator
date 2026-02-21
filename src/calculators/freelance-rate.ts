import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelanceRateCalculator: CalculatorDefinition = {
  slug: "freelance-rate-calculator",
  title: "Freelance Rate Calculator",
  description:
    "Free freelance hourly rate calculator. Calculate the minimum rate to charge based on desired salary, billable hours, expenses, and taxes. Set profitable freelance pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "freelance rate calculator",
    "freelance hourly rate",
    "consulting rate calculator",
    "freelance pricing calculator",
    "contractor rate calculator",
  ],
  variants: [
    {
      id: "hourly-rate",
      name: "Calculate Freelance Hourly Rate",
      description: "Determine your minimum freelance hourly rate",
      fields: [
        {
          name: "desiredSalary",
          label: "Desired Annual Salary (Net)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "billableHours",
          label: "Billable Hours per Week",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 60,
          step: 1,
          defaultValue: 30,
        },
        {
          name: "weeksPerYear",
          label: "Working Weeks per Year",
          type: "number",
          placeholder: "e.g. 48",
          min: 1,
          max: 52,
          step: 1,
          defaultValue: 48,
        },
        {
          name: "annualExpenses",
          label: "Annual Business Expenses",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "taxRate",
          label: "Estimated Total Tax Rate",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "%",
          min: 0,
          max: 60,
          step: 1,
          defaultValue: 30,
        },
        {
          name: "healthInsurance",
          label: "Annual Health Insurance Cost",
          type: "number",
          placeholder: "e.g. 6000",
          prefix: "$",
          min: 0,
        },
        {
          name: "retirementPct",
          label: "Retirement Savings",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          min: 0,
          max: 50,
          step: 1,
          defaultValue: 15,
        },
      ],
      calculate: (inputs) => {
        const desiredSalary = inputs.desiredSalary as number;
        const billableHours = (inputs.billableHours as number) || 30;
        const weeksPerYear = (inputs.weeksPerYear as number) || 48;
        const expenses = (inputs.annualExpenses as number) || 0;
        const taxRate = (inputs.taxRate as number) || 30;
        const healthInsurance = (inputs.healthInsurance as number) || 0;
        const retirementPct = (inputs.retirementPct as number) || 15;
        if (!desiredSalary) return null;

        const totalBillableHours = billableHours * weeksPerYear;

        // Retirement savings based on desired salary
        const retirementSavings = desiredSalary * (retirementPct / 100);

        // Total needed before tax = (salary + expenses + insurance + retirement) / (1 - tax rate)
        const totalNeeded = desiredSalary + expenses + healthInsurance + retirementSavings;
        const grossRequired = totalNeeded / (1 - taxRate / 100);
        const taxes = grossRequired - totalNeeded;

        const hourlyRate = grossRequired / totalBillableHours;

        // Suggested rates with profit margin
        const rate10Margin = hourlyRate * 1.10;
        const rate20Margin = hourlyRate * 1.20;

        // Day rate and monthly retainer
        const dayRate = hourlyRate * 8;
        const monthlyRetainer = hourlyRate * billableHours * (52 / 12);

        return {
          primary: {
            label: "Minimum Hourly Rate",
            value: `$${formatNumber(hourlyRate)}`,
          },
          details: [
            { label: "Desired net salary", value: `$${formatNumber(desiredSalary)}` },
            { label: "Business expenses", value: `$${formatNumber(expenses)}` },
            { label: "Health insurance", value: `$${formatNumber(healthInsurance)}` },
            { label: "Retirement savings", value: `$${formatNumber(retirementSavings)}` },
            { label: "Estimated taxes", value: `$${formatNumber(taxes)}` },
            { label: "Total gross revenue needed", value: `$${formatNumber(grossRequired)}` },
            { label: "Annual billable hours", value: `${formatNumber(totalBillableHours, 0)}` },
            { label: "Rate with 10% margin", value: `$${formatNumber(rate10Margin)}/hr` },
            { label: "Rate with 20% margin", value: `$${formatNumber(rate20Margin)}/hr` },
            { label: "Day rate (8 hrs)", value: `$${formatNumber(dayRate)}` },
            { label: "Monthly retainer (est.)", value: `$${formatNumber(monthlyRetainer)}` },
          ],
          note: "This is your minimum rate. Add a 10-20% profit margin for business growth, unexpected costs, and non-billable time. Rates should also reflect market rates and your expertise level.",
        };
      },
    },
  ],
  relatedSlugs: ["self-employment-tax-calculator", "hourly-to-salary-calculator", "invoice-calculator"],
  faq: [
    {
      question: "How do I calculate my freelance rate?",
      answer:
        "Hourly Rate = (Desired Salary + Expenses + Insurance + Retirement + Taxes) / Annual Billable Hours. For example, to net $80K with $10K expenses, 30% taxes, and 1,440 billable hours: ($80K + $10K) / 0.70 / 1,440 = ~$89/hr.",
    },
    {
      question: "What is a billable hour?",
      answer:
        "A billable hour is time spent directly working on client projects that you can charge for. Non-billable time includes marketing, admin, invoicing, and professional development. Most freelancers are only billable 60-75% of their working hours.",
    },
    {
      question: "Should I charge hourly or project-based?",
      answer:
        "Both have merit. Hourly rates are simpler and protect against scope creep. Project-based pricing rewards efficiency and can earn more as you get faster. Many experienced freelancers use value-based pricing tied to the outcome rather than hours worked.",
    },
  ],
  formula:
    "Minimum Hourly Rate = (Desired Salary + Expenses + Insurance + Retirement) / (1 - Tax Rate) / (Billable Hours/Week × Weeks/Year).",
};
