import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelancerRateCalculator: CalculatorDefinition = {
  slug: "freelancer-rate-calculator",
  title: "Freelancer Rate Calculator",
  description: "Free freelancer rate calculator. Calculate and plan with accurate freelance hourly rate estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["freelancer rate calculator", "freelance hourly rate", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Freelancer Rate",
      description: "Free freelancer rate calculator. Calculate and plan with accurate freelance hour",
      fields: [
        {
          name: "targetSalary",
          label: "Target Annual Income",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "billableWeeks",
          label: "Billable Weeks/Year",
          type: "number",
          placeholder: "e.g. 46",
          min: 1,
          max: 52,
          defaultValue: 46,
        },
        {
          name: "billableHours",
          label: "Billable Hours/Week",
          type: "number",
          placeholder: "e.g. 30",
          min: 1,
          max: 60,
          defaultValue: 30,
        },
        {
          name: "taxRate",
          label: "Self-Employment Tax Rate",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 30,
        },
        {
          name: "expenses",
          label: "Annual Business Expenses",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const target = inputs.targetSalary as number;
        const weeks = inputs.billableWeeks as number;
        const hours = inputs.billableHours as number;
        const taxRate = (inputs.taxRate as number) / 100;
        const expenses = inputs.expenses as number || 0;
        if (!target || !weeks || !hours) return null;
        const grossNeeded = (target + expenses) / (1 - taxRate);
        const hourlyRate = grossNeeded / (weeks * hours);
        const totalBillableHours = weeks * hours;
        return {
          primary: { label: "Minimum Hourly Rate", value: "$" + formatNumber(hourlyRate) },
          details: [
            { label: "Gross income needed", value: "$" + formatNumber(grossNeeded) },
            { label: "Total billable hours/year", value: formatNumber(totalBillableHours) },
            { label: "Taxes (estimated)", value: "$" + formatNumber(grossNeeded * taxRate) },
            { label: "Daily rate (8hr)", value: "$" + formatNumber(hourlyRate * 8) },
            { label: "Weekly rate", value: "$" + formatNumber(hourlyRate * hours) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the freelancer rate work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Hourly Rate = (Target Income + Expenses) / (1 - Tax Rate) / Billable Hours",
};
