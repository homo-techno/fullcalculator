import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainyDayFundCalculator: CalculatorDefinition = {
  slug: "rainy-day-fund-calculator",
  title: "Rainy Day Fund Calculator",
  description: "Free rainy day fund calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rainy day fund calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Rainy Day Fund",
      description: "Calculate rainy day fund",
      fields: [
        {
          name: "income",
          label: "Monthly Income",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "expenses",
          label: "Monthly Expenses",
          type: "number",
          placeholder: "e.g. 3500",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Savings Rate / Interest",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.1,
        }
      ],
      calculate: (inputs) => {
        const income = inputs.income as number;
        const expenses = inputs.expenses as number;
        const rate = (inputs.rate as number) / 100;
        if (!income) return null;
        const surplus = income - (expenses || 0);
        const savingsRate = (surplus / income) * 100;
        const annualSavings = surplus * 12;
        const fv10 = annualSavings * ((Math.pow(1+(rate||0), 10) - 1) / Math.max(rate||0.001, 0.001));
        return {
          primary: { label: "Monthly Surplus", value: "$" + formatNumber(surplus) },
          details: [
            { label: "Savings rate", value: formatNumber(savingsRate) + "%" },
            { label: "Annual savings", value: "$" + formatNumber(annualSavings) },
            { label: "10-year projection", value: "$" + formatNumber(fv10) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the rainy day fund calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
