import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fatFireCalculator: CalculatorDefinition = {
  slug: "fat-fire-calculator",
  title: "Fat FIRE Calculator",
  description: "Free fat fire calculator. Calculate and plan with accurate annual expenses estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fat fire calculator", "annual expenses", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Fat FIRE",
      description: "Free fat fire calculator. Calculate and plan with accurate annual expenses estim",
      fields: [
        {
          name: "expenses",
          label: "Annual Expenses",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Withdrawal Rate",
          type: "number",
          placeholder: "e.g. 3.5",
          suffix: "%",
          min: 1,
          max: 10,
          step: 0.1,
          defaultValue: 3.5,
        }
      ],
      calculate: (inputs) => {
        const expenses = inputs.expenses as number;
        const rate = (inputs.rate as number) / 100;
        if (!expenses || !rate) return null;
        const target = expenses / rate;
        return {
          primary: { label: "Fat FIRE Target", value: "$" + formatNumber(target) },
          details: [
            { label: "Annual expenses", value: "$" + formatNumber(expenses) },
            { label: "Monthly expenses", value: "$" + formatNumber(expenses / 12) },
            { label: "Withdrawal rate", value: formatNumber(rate * 100) + "%" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the fat fire work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Target = Annual Expenses / Withdrawal Rate",
};
