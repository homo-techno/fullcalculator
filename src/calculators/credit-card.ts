import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creditCardCalculator: CalculatorDefinition = {
  slug: "credit-card-calculator",
  title: "Credit Card Payoff Calculator",
  description: "Free credit card payoff calculator. See how long it takes to pay off credit card debt and how much interest you'll pay.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["credit card payoff calculator", "credit card payment calculator", "credit card interest calculator", "minimum payment calculator", "credit card debt calculator"],
  variants: [
    {
      id: "payoff",
      name: "Credit Card Payoff",
      fields: [
        { name: "balance", label: "Current Balance", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "apr", label: "APR", type: "number", placeholder: "e.g. 22.99", suffix: "%" },
        { name: "payment", label: "Monthly Payment", type: "number", placeholder: "e.g. 200", prefix: "$" },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = (inputs.apr as number) || 0;
        const payment = inputs.payment as number;
        if (!balance || !payment) return null;
        const r = apr / 100 / 12;
        if (r === 0) {
          const months = Math.ceil(balance / payment);
          return { primary: { label: "Payoff Time", value: `${months} months` }, details: [{ label: "Total paid", value: `$${formatNumber(balance)}` }] };
        }
        const minPayment = balance * r;
        if (payment <= minPayment) {
          return { primary: { label: "Payoff Time", value: "Never at this payment" }, details: [{ label: "Monthly interest", value: `$${formatNumber(minPayment)}` }, { label: "Minimum to pay off", value: `$${formatNumber(minPayment + 10)}+` }], note: "Your payment doesn't cover the monthly interest charges." };
        }
        const months = Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
        const totalPaid = payment * months;
        const totalInterest = totalPaid - balance;
        const years = Math.floor(months / 12);
        const mo = months % 12;
        return {
          primary: { label: "Payoff Time", value: years > 0 ? `${years} yr ${mo} mo` : `${months} months` },
          details: [
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Interest as % of balance", value: `${formatNumber((totalInterest / balance) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "minimum",
      name: "Minimum Payment Impact",
      description: "See what happens if you only pay the minimum",
      fields: [
        { name: "balance", label: "Current Balance", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "apr", label: "APR", type: "number", placeholder: "e.g. 22.99", suffix: "%" },
        { name: "minPct", label: "Minimum Payment %", type: "number", placeholder: "e.g. 2", suffix: "%", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = (inputs.apr as number) || 0;
        const minPct = (inputs.minPct as number) || 2;
        if (!balance || !apr) return null;
        const r = apr / 100 / 12;
        let remaining = balance;
        let totalPaid = 0;
        let months = 0;
        while (remaining > 0.01 && months < 600) {
          const payment = Math.max(remaining * (minPct / 100), 25);
          const interest = remaining * r;
          const principal = payment - interest;
          if (principal <= 0) break;
          remaining -= principal;
          totalPaid += payment;
          months++;
        }
        const totalInterest = totalPaid - balance;
        const years = Math.floor(months / 12);
        return {
          primary: { label: "Payoff w/ Minimum", value: months >= 600 ? "40+ years" : `${years} yr ${months % 12} mo` },
          details: [
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "First month payment", value: `$${formatNumber(Math.max(balance * (minPct / 100), 25))}` },
          ],
          note: "Paying only the minimum is extremely expensive. Even $50-100 extra per month drastically reduces payoff time and interest.",
        };
      },
    },
  ],
  relatedSlugs: ["debt-payoff-calculator", "loan-calculator", "savings-goal-calculator"],
  faq: [
    { question: "Why is paying the minimum so expensive?", answer: "At 22% APR on $5,000, the minimum payment (~$100) mostly goes to interest. It would take 30+ years and cost $10,000+ in interest. Paying $200/month instead cuts it to ~2.5 years and ~$1,200 in interest." },
  ],
  formula: "Months = -ln(1 - Br/P) / ln(1+r) | Minimum = max(Balance × min%, $25)",
};
