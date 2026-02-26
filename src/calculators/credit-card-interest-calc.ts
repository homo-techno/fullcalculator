import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creditCardInterestCalculator: CalculatorDefinition = {
  slug: "credit-card-interest-calculator",
  title: "Credit Card Interest Calculator",
  description:
    "Free credit card interest calculator. See the true cost of carrying a balance with minimum payments, including total interest paid and payoff timeline.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "credit card interest calculator",
    "minimum payment trap",
    "credit card payoff",
    "credit card cost calculator",
    "apr calculator",
  ],
  variants: [
    {
      id: "minimum-payment",
      name: "Minimum Payment Trap",
      description:
        "See how long it takes to pay off a balance with minimum payments only",
      fields: [
        {
          name: "balance",
          label: "Credit Card Balance",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
        },
        {
          name: "apr",
          label: "Annual Percentage Rate (APR)",
          type: "number",
          placeholder: "e.g. 24.99",
          suffix: "%",
        },
        {
          name: "minPaymentType",
          label: "Minimum Payment Type",
          type: "select",
          options: [
            { label: "Percentage of balance (2%)", value: "percent" },
            { label: "Fixed amount", value: "fixed" },
          ],
          defaultValue: "percent",
        },
        {
          name: "fixedMinPayment",
          label: "Fixed Minimum Payment (if applicable)",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          defaultValue: 25,
        },
      ],
      calculate: (inputs) => {
        const balance = parseFloat(inputs.balance as string);
        const apr = parseFloat(inputs.apr as string);
        const payType = inputs.minPaymentType as string;
        const fixedMin = parseFloat(inputs.fixedMinPayment as string) || 25;

        if (!balance || balance <= 0 || !apr || apr <= 0) return null;

        const monthlyRate = apr / 100 / 12;
        let remaining = balance;
        let totalInterest = 0;
        let months = 0;
        const maxMonths = 600;
        const absoluteMin = 25;

        while (remaining > 0.01 && months < maxMonths) {
          const interest = remaining * monthlyRate;
          totalInterest += interest;

          let payment: number;
          if (payType === "percent") {
            payment = Math.max(remaining * 0.02, absoluteMin);
          } else {
            payment = fixedMin;
          }

          payment = Math.min(payment, remaining + interest);
          remaining = remaining + interest - payment;
          months++;
        }

        const totalPaid = balance + totalInterest;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        return {
          primary: {
            label: "Total Interest Paid",
            value: `$${formatNumber(totalInterest)}`,
          },
          details: [
            { label: "Time to pay off", value: `${formatNumber(years)} years, ${formatNumber(remainingMonths)} months` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Original balance", value: `$${formatNumber(balance)}` },
            { label: "Interest as % of balance", value: `${formatNumber((totalInterest / balance) * 100)}%` },
            { label: "APR", value: `${formatNumber(apr)}%` },
          ],
          note: "Making only minimum payments can take decades to pay off a balance. Even small increases in your monthly payment can save thousands in interest and years of payments.",
        };
      },
    },
    {
      id: "fixed-payment",
      name: "Fixed Payment Payoff",
      description:
        "Calculate payoff time and interest with a fixed monthly payment",
      fields: [
        {
          name: "balance",
          label: "Credit Card Balance",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
        },
        {
          name: "apr",
          label: "Annual Percentage Rate (APR)",
          type: "number",
          placeholder: "e.g. 24.99",
          suffix: "%",
        },
        {
          name: "monthlyPayment",
          label: "Monthly Payment Amount",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const balance = parseFloat(inputs.balance as string);
        const apr = parseFloat(inputs.apr as string);
        const payment = parseFloat(inputs.monthlyPayment as string);

        if (!balance || balance <= 0 || !apr || !payment || payment <= 0) return null;

        const monthlyRate = apr / 100 / 12;
        const minRequired = balance * monthlyRate;

        if (payment <= minRequired) {
          return {
            primary: { label: "Status", value: "Payment too low" },
            details: [
              { label: "Monthly interest charge", value: `$${formatNumber(minRequired)}` },
              { label: "Minimum payment needed", value: `$${formatNumber(minRequired + 1)}` },
            ],
            note: "Your payment does not cover the monthly interest. Increase your payment to at least cover interest charges.",
          };
        }

        const months = Math.ceil(
          -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
        );
        const totalPaid = payment * months;
        const totalInterest = totalPaid - balance;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        return {
          primary: { label: "Payoff Time", value: `${formatNumber(years)} years, ${formatNumber(remainingMonths)} months` },
          details: [
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Monthly payment", value: `$${formatNumber(payment)}` },
            { label: "Number of payments", value: formatNumber(months) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["credit-card-calculator", "debt-payoff-calculator", "loan-calculator"],
  faq: [
    {
      question: "Why is the minimum payment trap so costly?",
      answer:
        "Minimum payments (typically 2% of balance or $25) barely cover interest, so most of your payment goes to interest rather than principal. A $5,000 balance at 25% APR with minimum payments can take 30+ years and cost over $8,000 in interest.",
    },
    {
      question: "How is credit card interest calculated?",
      answer:
        "Credit card interest is typically calculated daily using the Daily Periodic Rate (APR / 365) multiplied by your average daily balance. Interest compounds monthly when the balance is not paid in full.",
    },
    {
      question: "How can I reduce credit card interest costs?",
      answer:
        "Pay more than the minimum, transfer to a 0% APR card, negotiate a lower rate, use the debt avalanche method (pay highest APR first), or consider a personal loan at a lower rate for consolidation.",
    },
  ],
  formula:
    "Months to payoff = -ln(1 - (balance x monthly rate) / payment) / ln(1 + monthly rate). Total interest = (payment x months) - balance",
};
