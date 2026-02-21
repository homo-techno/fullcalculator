import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irrCalculator: CalculatorDefinition = {
  slug: "irr-calculator",
  title: "IRR Calculator",
  description:
    "Free IRR (Internal Rate of Return) calculator. Estimate the annualized return on investments using Newton's method approximation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["IRR", "internal rate of return", "investment return", "cash flow", "Newton's method"],
  variants: [
    {
      id: "standard",
      name: "IRR from Cash Flows",
      fields: [
        { name: "initialInvestment", label: "Initial Investment ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "cashFlows", label: "Annual Cash Flows (comma-separated)", type: "text" as "number", placeholder: "e.g. 20000, 30000, 40000, 50000" },
      ],
      calculate: (inputs) => {
        const initialInvestment = inputs.initialInvestment as number;
        const cashFlowsStr = inputs.cashFlows as string || "";

        if (!initialInvestment) return null;

        const cashFlows = cashFlowsStr
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));

        if (cashFlows.length === 0) return null;

        // All cash flows including initial investment (negative)
        const allFlows = [-initialInvestment, ...cashFlows];

        // Newton's method to find IRR
        const npvAt = (rate: number): number => {
          return allFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
        };

        const npvDerivative = (rate: number): number => {
          return allFlows.reduce((sum, cf, t) => {
            if (t === 0) return sum;
            return sum - t * cf / Math.pow(1 + rate, t + 1);
          }, 0);
        };

        let guess = 0.1;
        for (let i = 0; i < 1000; i++) {
          const npv = npvAt(guess);
          const deriv = npvDerivative(guess);
          if (Math.abs(deriv) < 1e-12) break;
          const newGuess = guess - npv / deriv;
          if (Math.abs(newGuess - guess) < 1e-10) break;
          guess = newGuess;
        }

        const irr = guess;
        const totalCashIn = cashFlows.reduce((sum, cf) => sum + (cf > 0 ? cf : 0), 0);
        const totalCashOut = initialInvestment + cashFlows.reduce((sum, cf) => sum + (cf < 0 ? Math.abs(cf) : 0), 0);
        const netProfit = totalCashIn - totalCashOut;

        return {
          primary: { label: "IRR", value: `${formatNumber(irr * 100, 2)}%` },
          details: [
            { label: "Initial Investment", value: `$${formatNumber(initialInvestment, 2)}` },
            { label: "Total Cash Inflows", value: `$${formatNumber(totalCashIn, 2)}` },
            { label: "Net Profit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Number of Periods", value: `${cashFlows.length} years` },
            { label: "NPV at IRR", value: `$${formatNumber(npvAt(irr), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["npv-calculator", "present-value-calculator", "future-value-calculator"],
  faq: [
    { question: "What is IRR?", answer: "IRR (Internal Rate of Return) is the discount rate that makes the net present value of all cash flows equal to zero. It represents the annualized effective compounded return rate of an investment." },
    { question: "How is IRR calculated?", answer: "IRR is found iteratively using methods like Newton's method. There is no closed-form solution, so the calculator uses numerical approximation to find the rate where NPV equals zero." },
  ],
  formula: "IRR is the rate r where: 0 = -Investment + CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n",
};
