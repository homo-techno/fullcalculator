import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const putOptionCalculator: CalculatorDefinition = {
  slug: "put-option-calculator",
  title: "Put Option Calculator",
  description: "Free put option calculator. Calculate and plan with accurate put option profit estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["put option calculator", "put option profit", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Put Option",
      description: "Free put option calculator. Calculate and plan with accurate put option profit e",
      fields: [
        {
          name: "strikePrice",
          label: "Strike Price",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "premium",
          label: "Premium Paid",
          type: "number",
          placeholder: "e.g. 3",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "currentPrice",
          label: "Current Stock Price",
          type: "number",
          placeholder: "e.g. 45",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "contracts",
          label: "Number of Contracts",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          defaultValue: 1,
        }
      ],
      calculate: (inputs) => {
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const current = inputs.currentPrice as number;
        const contracts = inputs.contracts as number;
        if (!strike || !premium || !current || !contracts) return null;
        const shares = contracts * 100;
        const intrinsic = Math.max(strike - current, 0);
        const profitPerShare = intrinsic - premium;
        const totalProfit = profitPerShare * shares;
        const breakeven = strike - premium;
        const maxLoss = premium * shares;
        return {
          primary: { label: "Total Profit/Loss", value: "$" + formatNumber(totalProfit) },
          details: [
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Intrinsic value", value: "$" + formatNumber(intrinsic) },
            { label: "Max loss (premium paid)", value: "$" + formatNumber(maxLoss) },
            { label: "Max profit (if stock goes to 0)", value: "$" + formatNumber((strike - premium) * shares) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the put option work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Profit = (Strike - Stock Price - Premium) x Shares",
};
