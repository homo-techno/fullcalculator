import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgagePointsCalculator: CalculatorDefinition = {
  slug: "mortgage-points-calculator",
  title: "Mortgage Points Calculator",
  description:
    "Free mortgage points calculator. Determine if buying mortgage discount points is worth it by calculating break-even time and total savings over the life of the loan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mortgage points calculator",
    "discount points calculator",
    "buy down rate calculator",
    "mortgage point calculator",
    "is it worth buying points",
  ],
  variants: [
    {
      id: "buy-points",
      name: "Should I Buy Points?",
      description: "Calculate if buying mortgage points saves you money",
      fields: [
        { name: "loanAmount", label: "Loan Amount", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "originalRate", label: "Original Interest Rate", type: "number", placeholder: "e.g. 7.0", suffix: "%", min: 0, max: 20, step: 0.01 },
        { name: "rateReduction", label: "Rate Reduction Per Point", type: "number", placeholder: "e.g. 0.25", suffix: "%", min: 0, max: 1, step: 0.01, defaultValue: 0.25 },
        {
          name: "points",
          label: "Number of Points to Buy",
          type: "select",
          options: [
            { label: "0.5 points", value: "0.5" },
            { label: "1 point", value: "1" },
            { label: "1.5 points", value: "1.5" },
            { label: "2 points", value: "2" },
            { label: "3 points", value: "3" },
          ],
          defaultValue: "1",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const originalRate = inputs.originalRate as number;
        const reductionPerPoint = (inputs.rateReduction as number) || 0.25;
        const points = parseFloat(inputs.points as string) || 1;
        const years = parseInt(inputs.term as string) || 30;
        if (!loan || !originalRate) return null;

        const newRate = Math.max(0, originalRate - reductionPerPoint * points);
        const pointsCost = loan * (points / 100);
        const months = years * 12;

        // Calculate original payment
        const r1 = originalRate / 100 / 12;
        const payment1 = (loan * (r1 * Math.pow(1 + r1, months))) / (Math.pow(1 + r1, months) - 1);

        // Calculate new payment
        const r2 = newRate / 100 / 12;
        const payment2 = newRate === 0 ? loan / months : (loan * (r2 * Math.pow(1 + r2, months))) / (Math.pow(1 + r2, months) - 1);

        const monthlySavings = payment1 - payment2;
        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : Infinity;
        const totalSavings = monthlySavings * months - pointsCost;
        const totalInterest1 = payment1 * months - loan;
        const totalInterest2 = payment2 * months - loan;

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(monthlySavings)}` },
          details: [
            { label: "Cost of points", value: `$${formatNumber(pointsCost)}` },
            { label: "Break-even time", value: breakEvenMonths === Infinity ? "Never" : `${breakEvenMonths} months (${formatNumber(breakEvenMonths / 12, 1)} years)` },
            { label: "Total savings over loan life", value: `$${formatNumber(totalSavings)}` },
            { label: "Original rate", value: `${formatNumber(originalRate, 3)}%` },
            { label: "New rate", value: `${formatNumber(newRate, 3)}%` },
            { label: "Original payment", value: `$${formatNumber(payment1)}` },
            { label: "New payment", value: `$${formatNumber(payment2)}` },
            { label: "Interest saved", value: `$${formatNumber(totalInterest1 - totalInterest2)}` },
          ],
          note: breakEvenMonths <= 36
            ? "Break-even within 3 years: buying points is likely worth it if you plan to keep the loan."
            : breakEvenMonths <= 60
              ? "Break-even in 3-5 years: worth it if you plan to stay in the home long term."
              : "Long break-even period: may not be worth buying points unless you plan to hold the mortgage for many years.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "mortgage-refinance-calculator", "closing-cost-calculator"],
  faq: [
    {
      question: "What are mortgage points?",
      answer:
        "Mortgage points (discount points) are upfront fees paid to the lender to reduce your interest rate. One point costs 1% of the loan amount and typically reduces the rate by 0.125-0.25%. For a $300,000 loan, 1 point costs $3,000.",
    },
    {
      question: "Is it worth buying mortgage points?",
      answer:
        "It depends on how long you'll keep the loan. Calculate the break-even point (cost of points / monthly savings). If you'll stay past the break-even, points save money. If you might sell or refinance within a few years, skip the points.",
    },
    {
      question: "Are mortgage points tax deductible?",
      answer:
        "Mortgage points are generally tax deductible. Points paid on a purchase loan are usually deductible in the year paid. Points on a refinance must be amortized over the loan term. Consult a tax advisor for your specific situation.",
    },
  ],
  formula:
    "Point Cost = Loan Amount × (Points / 100) | New Rate = Original Rate − (Points × Rate Reduction) | Break Even = Point Cost / Monthly Savings",
};
