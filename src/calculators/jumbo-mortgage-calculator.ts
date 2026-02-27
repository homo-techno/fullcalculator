import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jumboMortgageCalculator: CalculatorDefinition = {
  slug: "jumbo-mortgage-calculator",
  title: "Jumbo Mortgage Calculator",
  description: "Free jumbo mortgage calculator. Plan your finances with accurate calculations and projections.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["jumbo mortgage calculator", "financial calculator", "money calculator", "finance tool"],
  variants: [
    {
      id: "standard",
      name: "Jumbo Mortgage",
      description: "Free jumbo mortgage calculator. Plan your finances with accurate calculations an",
      fields: [
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Rate / Percentage",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
        },
        {
          name: "years",
          label: "Time Period",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 0.5,
          max: 50,
          step: 0.5,
        }
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rate = (inputs.rate as number) / 100;
        const years = inputs.years as number;
        if (!amount) return null;
        const result = amount * Math.pow(1 + (rate || 0), years || 1);
        const change = result - amount;
        return {
          primary: { label: "Result", value: "$" + formatNumber(result) },
          details: [
            { label: "Initial amount", value: "$" + formatNumber(amount) },
            { label: "Change", value: "$" + formatNumber(change) },
            { label: "Rate applied", value: formatNumber((rate || 0) * 100) + "%" },
            { label: "Time period", value: (years || 1) + " years" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "What does the Jumbo Mortgage Calculator calculate?",
      answer: "This calculator helps you estimate jumbo mortgage based on your specific financial situation and inputs.",
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides estimates based on the values you enter. Actual results may vary due to market conditions, fees, and other factors.",
    }
  ],
  formula: "Result = Amount x (1 + Rate)^Years",
};
