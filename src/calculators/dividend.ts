import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dividendCalculator: CalculatorDefinition = {
  slug: "dividend-calculator",
  title: "Dividend Calculator",
  description: "Free dividend calculator. Calculate dividend yield, annual income, and growth from stock dividends.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dividend calculator", "dividend yield calculator", "dividend income", "stock dividend", "dividend growth"],
  variants: [
    {
      id: "yield",
      name: "Dividend Yield & Income",
      fields: [
        { name: "price", label: "Share Price", type: "number", prefix: "$", placeholder: "e.g. 150" },
        { name: "dividend", label: "Annual Dividend per Share", type: "number", prefix: "$", placeholder: "e.g. 3.60" },
        { name: "shares", label: "Number of Shares", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number, div = inputs.dividend as number;
        const shares = (inputs.shares as number) || 1;
        if (!price || !div) return null;
        const yld = (div / price) * 100;
        const annualIncome = div * shares;
        return {
          primary: { label: "Dividend Yield", value: `${formatNumber(yld, 2)}%` },
          details: [
            { label: "Annual income", value: `$${formatNumber(annualIncome, 2)}` },
            { label: "Monthly income", value: `$${formatNumber(annualIncome / 12, 2)}` },
            { label: "Quarterly dividend", value: `$${formatNumber(div / 4, 2)}/share` },
            { label: "Total investment", value: `$${formatNumber(price * shares, 2)}` },
          ],
        };
      },
    },
    {
      id: "growth",
      name: "Dividend Growth (DRIP)",
      fields: [
        { name: "investment", label: "Initial Investment", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "yield", label: "Dividend Yield (%)", type: "number", suffix: "%", placeholder: "e.g. 3.5" },
        { name: "growth", label: "Annual Dividend Growth (%)", type: "number", suffix: "%", placeholder: "e.g. 5" },
        { name: "years", label: "Years", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const inv = inputs.investment as number, yld = inputs.yield as number;
        const growth = (inputs.growth as number) || 0, years = inputs.years as number;
        if (!inv || !yld || !years) return null;
        let balance = inv, totalDiv = 0, currentYield = yld;
        for (let i = 0; i < years; i++) {
          const divIncome = balance * (currentYield / 100);
          totalDiv += divIncome;
          balance += divIncome;
          currentYield *= (1 + growth / 100);
        }
        return {
          primary: { label: `Value after ${years} years`, value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total dividends earned", value: `$${formatNumber(totalDiv, 2)}` },
            { label: "Original investment", value: `$${formatNumber(inv, 2)}` },
            { label: "Growth", value: `${formatNumber(((balance - inv) / inv) * 100, 1)}%` },
            { label: "Final yield on cost", value: `${formatNumber(currentYield, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["stock-return-calculator", "investment-calculator", "compound-interest-calculator"],
  faq: [{ question: "What is dividend yield?", answer: "Dividend yield = Annual Dividend per Share / Share Price × 100. A $150 stock paying $3.60/year has a 2.4% yield. Reinvesting dividends (DRIP) compounds returns over time." }],
  formula: "Yield = Annual Dividend / Price × 100",
};
