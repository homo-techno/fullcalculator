import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annualIncomeCalculator: CalculatorDefinition = {
  slug: "annual-income-calculator",
  title: "Annual Income Calculator",
  description:
    "Free annual income calculator. Convert hourly, weekly, bi-weekly, or monthly pay to annual income and see equivalent rates across all pay periods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "annual income calculator",
    "hourly to annual salary",
    "yearly income calculator",
    "income converter",
    "salary conversion",
  ],
  variants: [
    {
      id: "standard",
      name: "Annual Income Converter",
      description:
        "Convert any pay rate to annual income and all equivalent periods",
      fields: [
        {
          name: "payAmount",
          label: "Pay Amount",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
        },
        {
          name: "payPeriod",
          label: "Pay Period",
          type: "select",
          options: [
            { label: "Hourly", value: "hourly" },
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Bi-Weekly", value: "biweekly" },
            { label: "Semi-Monthly", value: "semimonthly" },
            { label: "Monthly", value: "monthly" },
            { label: "Annual", value: "annual" },
          ],
          defaultValue: "hourly",
        },
        {
          name: "hoursPerWeek",
          label: "Hours Per Week (for hourly)",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "hours",
          defaultValue: 40,
        },
        {
          name: "weeksPerYear",
          label: "Weeks Worked Per Year",
          type: "number",
          placeholder: "e.g. 52",
          suffix: "weeks",
          defaultValue: 52,
        },
      ],
      calculate: (inputs) => {
        const amount = parseFloat(inputs.payAmount as string);
        const period = inputs.payPeriod as string;
        const hoursPerWeek = parseFloat(inputs.hoursPerWeek as string) || 40;
        const weeksPerYear = parseFloat(inputs.weeksPerYear as string) || 52;

        if (!amount || amount <= 0) return null;

        let annual: number;
        switch (period) {
          case "hourly":
            annual = amount * hoursPerWeek * weeksPerYear;
            break;
          case "daily":
            annual = amount * (hoursPerWeek / 8) * weeksPerYear;
            break;
          case "weekly":
            annual = amount * weeksPerYear;
            break;
          case "biweekly":
            annual = amount * 26;
            break;
          case "semimonthly":
            annual = amount * 24;
            break;
          case "monthly":
            annual = amount * 12;
            break;
          case "annual":
            annual = amount;
            break;
          default:
            annual = amount;
        }

        const hourly = annual / (hoursPerWeek * weeksPerYear);
        const daily = annual / (weeksPerYear * (hoursPerWeek / 8));
        const weekly = annual / weeksPerYear;
        const biweekly = annual / 26;
        const semimonthly = annual / 24;
        const monthly = annual / 12;

        return {
          primary: { label: "Annual Income", value: `$${formatNumber(annual)}` },
          details: [
            { label: "Hourly", value: `$${formatNumber(hourly)}` },
            { label: "Daily", value: `$${formatNumber(daily)}` },
            { label: "Weekly", value: `$${formatNumber(weekly)}` },
            { label: "Bi-weekly", value: `$${formatNumber(biweekly)}` },
            { label: "Semi-monthly", value: `$${formatNumber(semimonthly)}` },
            { label: "Monthly", value: `$${formatNumber(monthly)}` },
          ],
          note: `Based on ${formatNumber(hoursPerWeek)} hours/week and ${formatNumber(weeksPerYear)} weeks/year. Adjust weeks for unpaid vacation time.`,
        };
      },
    },
    {
      id: "multiple-income",
      name: "Multiple Income Sources",
      description:
        "Calculate total annual income from multiple sources",
      fields: [
        {
          name: "primaryIncome",
          label: "Primary Job Annual Income",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
        {
          name: "secondJobHourly",
          label: "Second Job Hourly Rate",
          type: "number",
          placeholder: "e.g. 18",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "secondJobHours",
          label: "Second Job Hours/Week",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "hours",
          defaultValue: 0,
        },
        {
          name: "freelanceMonthly",
          label: "Freelance/Side Income (Monthly)",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "passiveIncome",
          label: "Passive Income (Monthly)",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const primary = parseFloat(inputs.primaryIncome as string) || 0;
        const secondRate = parseFloat(inputs.secondJobHourly as string) || 0;
        const secondHours = parseFloat(inputs.secondJobHours as string) || 0;
        const freelance = parseFloat(inputs.freelanceMonthly as string) || 0;
        const passive = parseFloat(inputs.passiveIncome as string) || 0;

        const secondJobAnnual = secondRate * secondHours * 52;
        const freelanceAnnual = freelance * 12;
        const passiveAnnual = passive * 12;
        const totalAnnual = primary + secondJobAnnual + freelanceAnnual + passiveAnnual;

        if (totalAnnual <= 0) return null;

        return {
          primary: { label: "Total Annual Income", value: `$${formatNumber(totalAnnual)}` },
          details: [
            { label: "Primary job", value: `$${formatNumber(primary)}` },
            { label: "Second job", value: `$${formatNumber(secondJobAnnual)}` },
            { label: "Freelance/side income", value: `$${formatNumber(freelanceAnnual)}` },
            { label: "Passive income", value: `$${formatNumber(passiveAnnual)}` },
            { label: "Monthly total", value: `$${formatNumber(totalAnnual / 12)}` },
            { label: "Effective hourly (2080 hrs)", value: `$${formatNumber(totalAnnual / 2080)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "net-to-gross-pay-calculator"],
  faq: [
    {
      question: "How do I convert hourly pay to annual salary?",
      answer:
        "Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks per year). For example: $25/hour x 40 hours x 52 weeks = $52,000 per year. Adjust for unpaid time off.",
    },
    {
      question: "What is the difference between bi-weekly and semi-monthly pay?",
      answer:
        "Bi-weekly means every two weeks (26 pay periods/year). Semi-monthly means twice a month, usually the 1st and 15th (24 pay periods/year). Bi-weekly results in 2 extra paychecks per year compared to semi-monthly.",
    },
  ],
  formula:
    "Annual Income = Hourly Rate x Hours/Week x Weeks/Year. Monthly = Annual / 12. Bi-weekly = Annual / 26.",
};
