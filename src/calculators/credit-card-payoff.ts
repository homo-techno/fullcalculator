import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creditCardPayoffCalculator: CalculatorDefinition = {
  slug: "credit-card-payoff-calculator",
  title: "Credit Card Payoff Calculator",
  description:
    "Free credit card payoff calculator. Find out how long it takes to pay off your credit card balance and how much interest you'll pay with minimum or fixed monthly payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "credit card payoff calculator",
    "credit card payment calculator",
    "pay off credit card",
    "credit card interest calculator",
    "minimum payment calculator",
    "debt payoff calculator",
  ],
  variants: [
    {
      id: "credit-card-payoff",
      name: "Credit Card Payoff",
      description: "Calculate time and cost to pay off your credit card",
      fields: [
        {
          name: "balance",
          label: "Current Balance",
          type: "number",
          placeholder: "e.g. 8000",
          prefix: "$",
          min: 0,
        },
        {
          name: "apr",
          label: "Annual Interest Rate (APR)",
          type: "number",
          placeholder: "e.g. 22.99",
          suffix: "%",
          min: 0,
          max: 40,
          step: 0.01,
        },
        {
          name: "monthlyPayment",
          label: "Monthly Payment",
          type: "number",
          placeholder: "e.g. 250",
          prefix: "$",
          min: 0,
        },
        {
          name: "extraPayment",
          label: "Extra Monthly Payment",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = inputs.apr as number;
        const payment = inputs.monthlyPayment as number;
        const extra = (inputs.extraPayment as number) || 0;
        if (!balance || !apr || !payment) return null;

        const totalPayment = payment + extra;
        const mr = apr / 100 / 12;

        if (totalPayment <= balance * mr) {
          return {
            primary: {
              label: "Payoff Time",
              value: "Never (payment too low)",
            },
            details: [
              { label: "Monthly interest charge", value: `$${formatNumber(balance * mr)}` },
              { label: "Your total monthly payment", value: `$${formatNumber(totalPayment)}` },
              { label: "Minimum payment needed", value: `$${formatNumber(balance * mr + 1)}` },
            ],
          };
        }

        // Calculate payoff with current payment
        let bal = balance;
        let months = 0;
        let totalInterest = 0;
        while (bal > 0 && months < 600) {
          const interest = bal * mr;
          totalInterest += interest;
          bal = bal + interest - totalPayment;
          months++;
          if (bal < 0) bal = 0;
        }

        // Calculate minimum payment payoff (2% of balance or $25, whichever is greater)
        let minBal = balance;
        let minMonths = 0;
        let minTotalInterest = 0;
        while (minBal > 0 && minMonths < 600) {
          const interest = minBal * mr;
          minTotalInterest += interest;
          const minPayment = Math.max(minBal * 0.02, 25);
          minBal = minBal + interest - minPayment;
          minMonths++;
          if (minBal < 0) minBal = 0;
        }

        const totalPaid = balance + totalInterest;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        const interestSaved = minTotalInterest - totalInterest;
        const timeSaved = minMonths - months;

        return {
          primary: {
            label: "Payoff Time",
            value: years > 0 ? `${years} yr ${remainingMonths} mo` : `${months} months`,
          },
          details: [
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Monthly payment used", value: `$${formatNumber(totalPayment)}` },
            { label: "Minimum payment payoff time", value: `${minMonths} months` },
            { label: "Minimum payment total interest", value: `$${formatNumber(minTotalInterest)}` },
            { label: "Interest saved vs. minimums", value: `$${formatNumber(Math.max(0, interestSaved))}` },
            { label: "Time saved vs. minimums", value: `${Math.max(0, timeSaved)} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["balance-transfer-calculator", "consolidation-loan-calculator"],
  faq: [
    {
      question: "Why does paying only the minimum take so long?",
      answer:
        "Minimum payments (typically 2% of balance or $25) mostly cover interest, especially early on. On a $8,000 balance at 23% APR, minimum payments could take over 30 years and cost more in interest than the original balance.",
    },
    {
      question: "How can I pay off my credit card faster?",
      answer:
        "Pay more than the minimum each month, make biweekly payments, use the debt avalanche method (highest rate first), consider a balance transfer to a 0% APR card, or consolidate with a lower-rate personal loan.",
    },
    {
      question: "What is the debt avalanche method?",
      answer:
        "The debt avalanche method means paying minimums on all debts and putting extra money toward the highest-interest debt first. This mathematically saves the most on interest compared to other strategies.",
    },
  ],
  formula:
    "Iterative calculation: each month Balance = Balance + (Balance x Monthly Rate) - Payment, until Balance = 0.",
};
