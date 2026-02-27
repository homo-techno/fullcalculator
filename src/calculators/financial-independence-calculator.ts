import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const financialIndependenceCalculator: CalculatorDefinition = {
  slug: "financial-independence-calculator",
  title: "Financial Independence Calculator",
  description: "Free financial independence calculator. Calculate and plan with accurate financial independence estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["financial independence calculator", "financial independence", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Financial Independence",
      description: "Free financial independence calculator. Calculate and plan with accurate financi",
      fields: [
        {
          name: "expenses",
          label: "Annual Expenses",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "savings",
          label: "Current Savings",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthly",
          label: "Monthly Savings",
          type: "number",
          placeholder: "e.g. 3000",
          prefix: "$",
          min: 0,
        },
        {
          name: "returnRate",
          label: "Expected Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.1,
        }
      ],
      calculate: (inputs) => {
        const expenses = inputs.expenses as number;
        const savings = inputs.savings as number;
        const monthly = inputs.monthly as number;
        const rate = (inputs.returnRate as number) / 100;
        if (!expenses || !savings || !monthly || !rate) return null;
        const target = expenses * 25;
        const monthlyRate = rate / 12;
        let current = savings;
        let months = 0;
        while (current < target && months < 600) {
          current = current * (1 + monthlyRate) + monthly;
          months++;
        }
        const years = months / 12;
        return {
          primary: { label: "Years to FI", value: formatNumber(years) + " years" },
          details: [
            { label: "FI target (25x expenses)", value: "$" + formatNumber(target) },
            { label: "Current savings", value: "$" + formatNumber(savings) },
            { label: "Gap to close", value: "$" + formatNumber(target - savings) },
            { label: "FI date", value: "~" + Math.ceil(years) + " years from now" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the financial independence work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "FI Number = Annual Expenses x 25",
};
