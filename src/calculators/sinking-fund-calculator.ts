import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sinkingFundCalculator: CalculatorDefinition = {
  slug: "sinking-fund-calculator",
  title: "Sinking Fund Calculator",
  description: "Free sinking fund calculator. Calculate and plan with accurate sinking fund savings estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sinking fund calculator", "sinking fund savings", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Sinking Fund",
      description: "Free sinking fund calculator. Calculate and plan with accurate sinking fund savi",
      fields: [
        {
          name: "target",
          label: "Target Amount",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          min: 0,
        },
        {
          name: "months",
          label: "Time Period",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "months",
          min: 1,
          max: 360,
        },
        {
          name: "rate",
          label: "Interest Rate (Annual)",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.1,
          defaultValue: 4,
        }
      ],
      calculate: (inputs) => {
        const target = inputs.target as number;
        const months = inputs.months as number;
        const rate = (inputs.rate as number) / 100 / 12;
        if (!target || !months) return null;
        const payment = rate > 0 ? target * rate / (Math.pow(1 + rate, months) - 1) : target / months;
        const totalPaid = payment * months;
        const interestEarned = target - totalPaid;
        return {
          primary: { label: "Monthly Payment", value: "$" + formatNumber(payment) },
          details: [
            { label: "Target amount", value: "$" + formatNumber(target) },
            { label: "Total contributed", value: "$" + formatNumber(totalPaid) },
            { label: "Interest earned", value: "$" + formatNumber(interestEarned) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the sinking fund work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Payment = Target x r / ((1+r)^n - 1)",
};
