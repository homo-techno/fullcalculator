import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeEquityCalculator: CalculatorDefinition = {
  slug: "home-equity-calculator",
  title: "Home Equity Calculator",
  description:
    "Free home equity calculator. Determine your home equity, LTV ratio, and available HELOC borrowing power based on the 80% LTV limit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home equity", "LTV", "HELOC", "equity", "home value"],
  variants: [
    {
      id: "equity",
      name: "Home Equity & HELOC",
      fields: [
        { name: "homeValue", label: "Current Home Value ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "mortgageBalance", label: "Mortgage Balance ($)", type: "number", placeholder: "e.g. 300000" },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const mortgageBalance = inputs.mortgageBalance as number;

        if (!homeValue) return null;

        const balance = mortgageBalance || 0;
        const equity = homeValue - balance;
        const ltv = (balance / homeValue) * 100;
        const equityPct = (equity / homeValue) * 100;

        // HELOC: can borrow up to 80% LTV minus existing mortgage
        const maxLTV = 0.80;
        const maxBorrowable = homeValue * maxLTV;
        const availableHELOC = Math.max(maxBorrowable - balance, 0);

        // 90% LTV option
        const maxBorrowable90 = homeValue * 0.90;
        const availableHELOC90 = Math.max(maxBorrowable90 - balance, 0);

        return {
          primary: { label: "Home Equity", value: `$${formatNumber(equity, 2)}` },
          details: [
            { label: "Equity Percentage", value: `${formatNumber(equityPct, 1)}%` },
            { label: "Loan-to-Value (LTV)", value: `${formatNumber(ltv, 1)}%` },
            { label: "Available HELOC (80% LTV)", value: `$${formatNumber(availableHELOC, 2)}` },
            { label: "Available HELOC (90% LTV)", value: `$${formatNumber(availableHELOC90, 2)}` },
            { label: "Home Value", value: `$${formatNumber(homeValue, 2)}` },
            { label: "Mortgage Balance", value: `$${formatNumber(balance, 2)}` },
          ],
        };
      },
    },
    {
      id: "projection",
      name: "Equity Projection",
      fields: [
        { name: "homeValue", label: "Current Home Value ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "mortgageBalance", label: "Mortgage Balance ($)", type: "number", placeholder: "e.g. 300000" },
        { name: "monthlyPayment", label: "Monthly Mortgage Payment ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "mortgageRate", label: "Mortgage Rate (%)", type: "number", placeholder: "e.g. 6" },
        { name: "appreciationRate", label: "Annual Appreciation (%)", type: "number", placeholder: "e.g. 3" },
        { name: "years", label: "Years to Project", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const homeValue = inputs.homeValue as number;
        const mortgageBalance = inputs.mortgageBalance as number;
        const monthlyPayment = inputs.monthlyPayment as number;
        const mortgageRate = inputs.mortgageRate as number;
        const appreciationRate = inputs.appreciationRate as number || 3;
        const years = inputs.years as number;

        if (!homeValue || !mortgageBalance || !monthlyPayment || !mortgageRate || !years) return null;

        const monthlyRate = (mortgageRate / 100) / 12;
        let balance = mortgageBalance;

        for (let m = 0; m < years * 12; m++) {
          const interest = balance * monthlyRate;
          const principal = monthlyPayment - interest;
          balance = Math.max(balance - principal, 0);
        }

        const futureHomeValue = homeValue * Math.pow(1 + appreciationRate / 100, years);
        const futureEquity = futureHomeValue - balance;
        const currentEquity = homeValue - mortgageBalance;
        const equityGain = futureEquity - currentEquity;
        const futureLTV = (balance / futureHomeValue) * 100;

        return {
          primary: { label: "Projected Equity", value: `$${formatNumber(futureEquity, 2)}` },
          details: [
            { label: "Current Equity", value: `$${formatNumber(currentEquity, 2)}` },
            { label: "Equity Gain", value: `$${formatNumber(equityGain, 2)}` },
            { label: "Future Home Value", value: `$${formatNumber(futureHomeValue, 2)}` },
            { label: "Future Mortgage Balance", value: `$${formatNumber(balance, 2)}` },
            { label: "Future LTV", value: `${formatNumber(futureLTV, 1)}%` },
            { label: "Future HELOC Available (80%)", value: `$${formatNumber(Math.max(futureHomeValue * 0.8 - balance, 0), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-refinance-calculator", "rent-vs-buy-calculator", "budget-calculator"],
  faq: [
    { question: "What is home equity?", answer: "Home equity is the difference between your home's current market value and your outstanding mortgage balance. It represents your ownership stake in the property." },
    { question: "What is a HELOC?", answer: "A HELOC (Home Equity Line of Credit) allows you to borrow against your home equity. Most lenders limit total borrowing to 80% of your home's value (combined LTV), though some go up to 90%." },
  ],
  formula: "Equity = Home Value - Mortgage Balance; LTV = Mortgage Balance / Home Value; Available HELOC = (Home Value × 80%) - Mortgage Balance",
};
