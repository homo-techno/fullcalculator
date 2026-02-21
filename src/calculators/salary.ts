import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salaryCalculator: CalculatorDefinition = {
  slug: "salary-calculator",
  title: "Salary Calculator",
  description:
    "Free salary calculator. Convert between hourly, weekly, monthly, and annual pay. Estimate take-home pay after taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "salary calculator",
    "hourly to salary",
    "annual salary calculator",
    "paycheck calculator",
    "wage calculator",
  ],
  variants: [
    {
      id: "convert",
      name: "Salary Converter",
      description: "Convert between different pay periods",
      fields: [
        {
          name: "amount",
          label: "Pay Amount",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          min: 0,
        },
        {
          name: "period",
          label: "Pay Period",
          type: "select",
          options: [
            { label: "Per Hour", value: "hourly" },
            { label: "Per Day", value: "daily" },
            { label: "Per Week", value: "weekly" },
            { label: "Bi-Weekly", value: "biweekly" },
            { label: "Per Month", value: "monthly" },
            { label: "Per Year", value: "annual" },
          ],
          defaultValue: "hourly",
        },
        {
          name: "hoursPerWeek",
          label: "Hours per Week",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "hrs",
          min: 1,
          max: 168,
          defaultValue: 40,
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const period = inputs.period as string;
        const hpw = (inputs.hoursPerWeek as number) || 40;
        if (!amount) return null;

        let annual: number;
        switch (period) {
          case "hourly": annual = amount * hpw * 52; break;
          case "daily": annual = amount * (hpw / 8) * 52; break;
          case "weekly": annual = amount * 52; break;
          case "biweekly": annual = amount * 26; break;
          case "monthly": annual = amount * 12; break;
          case "annual": annual = amount; break;
          default: return null;
        }

        const monthly = annual / 12;
        const biweekly = annual / 26;
        const weekly = annual / 52;
        const daily = annual / 260;
        const hourly = annual / (hpw * 52);

        return {
          primary: { label: "Annual Salary", value: `$${formatNumber(annual)}` },
          details: [
            { label: "Monthly", value: `$${formatNumber(monthly)}` },
            { label: "Bi-weekly", value: `$${formatNumber(biweekly)}` },
            { label: "Weekly", value: `$${formatNumber(weekly)}` },
            { label: "Daily", value: `$${formatNumber(daily)}` },
            { label: "Hourly", value: `$${formatNumber(hourly)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "How do I convert hourly rate to annual salary?",
      answer:
        "Multiply your hourly rate by the number of hours worked per week, then multiply by 52 weeks. For example, $25/hour x 40 hours x 52 weeks = $52,000/year.",
    },
    {
      question: "How many working hours are in a year?",
      answer:
        "A standard full-time year is 2,080 hours (40 hours/week x 52 weeks). After holidays and typical PTO, effective working hours are about 1,920-2,000.",
    },
  ],
  formula: "Annual = Hourly x Hours/Week x 52",
};
