import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const callOptionCalculator: CalculatorDefinition = {
  slug: "call-option-calculator",
  title: "Call Option Calculator",
  description: "Free call option calculator. Calculate and plan with accurate call option profit estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["call option calculator", "call option profit", "calculator", "finance calculator"],
  variants: [
    {
      id: "standard",
      name: "Call Option",
      description: "Free call option calculator. Calculate and plan with accurate call option profit",
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
          placeholder: "e.g. 55",
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
        const intrinsic = Math.max(current - strike, 0);
        const profitPerShare = intrinsic - premium;
        const totalProfit = profitPerShare * shares;
        const breakeven = strike + premium;
        return {
          primary: { label: "Total Profit/Loss", value: "$" + formatNumber(totalProfit) },
          details: [
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Intrinsic value", value: "$" + formatNumber(intrinsic) },
            { label: "Max loss", value: "$" + formatNumber(premium * shares) },
            { label: "Return on premium", value: formatNumber((profitPerShare / premium) * 100) + "%" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator"],
  faq: [
    {
      question: "How does the call option work?",
      answer: "Enter your values and the calculator will instantly compute the results based on standard financial formulas.",
    },
    {
      question: "What assumptions does this calculator make?",
      answer: "This calculator uses simplified models. Real-world results may vary based on market conditions, fees, and other factors.",
    }
  ],
  formula: "Profit = (Stock Price - Strike - Premium) x Shares",
};
