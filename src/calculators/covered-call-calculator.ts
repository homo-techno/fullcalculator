import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coveredCallCalculator: CalculatorDefinition = {
  slug: "covered-call-calculator",
  title: "Covered Call Calculator",
  description: "Free covered call calculator. Calculate potential returns, breakeven, and max profit for covered call options strategy.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["covered call", "options strategy", "call option premium", "options calculator"],
  variants: [
    {
      id: "standard",
      name: "Covered Call",
      description: "Free covered call calculator. Calculate potential returns, breakeven, and max pr",
      fields: [
        {
          name: "shares",
          label: "Number of Shares",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
          defaultValue: 100,
        },
        {
          name: "stockPrice",
          label: "Stock Purchase Price",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "strikePrice",
          label: "Strike Price",
          type: "number",
          placeholder: "e.g. 55",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "premium",
          label: "Option Premium",
          type: "number",
          placeholder: "e.g. 2.50",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "days",
          label: "Days to Expiration",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "days",
          min: 1,
          max: 365,
        }
      ],
      calculate: (inputs) => {
        const shares = inputs.shares as number;
        const stock = inputs.stockPrice as number;
        const strike = inputs.strikePrice as number;
        const premium = inputs.premium as number;
        const days = inputs.days as number;
        if (!shares || !stock || !strike || !premium || !days) return null;
        const totalPremium = premium * shares;
        const maxProfit = ((strike - stock) + premium) * shares;
        const breakeven = stock - premium;
        const returnOnInvestment = (totalPremium / (stock * shares)) * 100;
        const annualizedReturn = returnOnInvestment * (365 / days);
        return {
          primary: { label: "Premium Income", value: "$" + formatNumber(totalPremium) },
          details: [
            { label: "Max profit (if assigned)", value: "$" + formatNumber(maxProfit) },
            { label: "Breakeven price", value: "$" + formatNumber(breakeven) },
            { label: "Return on investment", value: formatNumber(returnOnInvestment) + "%" },
            { label: "Annualized return", value: formatNumber(annualizedReturn) + "%" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["roi-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is a covered call?",
      answer: "A covered call involves owning stock and selling call options against it. You earn premium income but cap your upside at the strike price.",
    },
    {
      question: "When should I use covered calls?",
      answer: "Covered calls work best in flat or slightly bullish markets. They generate income from stocks you already own but limit upside if the stock rises significantly.",
    }
  ],
  formula: "Premium Income = Option Premium x Number of Shares",
};
