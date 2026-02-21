import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amortizationCalculator: CalculatorDefinition = {
  slug: "amortization-calculator",
  title: "Amortization Calculator",
  description: "Free amortization calculator. Calculate your loan amortization schedule with monthly payment breakdown of principal and interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["amortization calculator", "amortization schedule", "loan amortization", "payment schedule", "principal and interest"],
  variants: [
    {
      id: "schedule",
      name: "Amortization Schedule",
      fields: [
        { name: "principal", label: "Loan Amount", type: "number", prefix: "$", placeholder: "e.g. 250000" },
        { name: "rate", label: "Annual Interest Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 6.5" },
        { name: "years", label: "Loan Term (years)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const p = inputs.principal as number, r = inputs.rate as number, y = inputs.years as number;
        if (!p || !r || !y) return null;
        const monthlyRate = r / 100 / 12;
        const n = y * 12;
        const payment = p * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        const totalPaid = payment * n;
        const totalInterest = totalPaid - p;

        const firstInterest = p * monthlyRate;
        const firstPrincipal = payment - firstInterest;
        const year1Interest = (() => {
          let balance = p, interest = 0;
          for (let i = 0; i < 12; i++) {
            const mi = balance * monthlyRate;
            interest += mi;
            balance -= (payment - mi);
          }
          return interest;
        })();
        return {
          primary: { label: "Monthly Payment", value: `$${formatNumber(payment, 2)}` },
          details: [
            { label: "Total paid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Interest/principal ratio", value: `${formatNumber((totalInterest / p) * 100, 1)}%` },
            { label: "1st payment interest", value: `$${formatNumber(firstInterest, 2)}` },
            { label: "1st payment principal", value: `$${formatNumber(firstPrincipal, 2)}` },
            { label: "Year 1 total interest", value: `$${formatNumber(year1Interest, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "loan-calculator", "compound-interest-calculator"],
  faq: [{ question: "What is amortization?", answer: "Amortization is the process of paying off a loan with regular payments over time. Each payment covers interest on the remaining balance plus some principal. Early payments are mostly interest; later payments are mostly principal." }],
  formula: "M = P × r(1+r)^n / ((1+r)^n - 1)",
};
