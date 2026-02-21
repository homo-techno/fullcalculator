import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const downPaymentCalculator: CalculatorDefinition = {
  slug: "down-payment-calculator",
  title: "Down Payment Calculator",
  description: "Free down payment calculator. Calculate how much you need for a house down payment and see how different down payment amounts affect your mortgage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["down payment calculator", "house down payment", "home down payment calculator", "how much down payment for house", "mortgage down payment"],
  variants: [
    {
      id: "calculate",
      name: "Down Payment Amount",
      description: "Calculate down payment and its effect on your mortgage",
      fields: [
        { name: "homePrice", label: "Home Price", type: "number", placeholder: "e.g. 400000", prefix: "$" },
        { name: "downPercent", label: "Down Payment %", type: "number", placeholder: "e.g. 20", suffix: "%", defaultValue: 20 },
        { name: "rate", label: "Mortgage Rate", type: "number", placeholder: "e.g. 6.5", suffix: "%" },
        { name: "term", label: "Loan Term", type: "select", options: [
          { label: "30 years", value: "30" },
          { label: "15 years", value: "15" },
        ], defaultValue: "30" },
      ],
      calculate: (inputs) => {
        const price = inputs.homePrice as number;
        const pct = (inputs.downPercent as number) || 20;
        const apr = (inputs.rate as number) || 0;
        const years = parseInt(inputs.term as string) || 30;
        if (!price) return null;

        const downAmount = price * (pct / 100);
        const loanAmount = price - downAmount;
        const months = years * 12;
        const needsPMI = pct < 20;

        let monthlyPayment: number;
        let totalInterest: number;
        if (apr === 0) {
          monthlyPayment = loanAmount / months;
          totalInterest = 0;
        } else {
          const r = apr / 100 / 12;
          monthlyPayment = loanAmount * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
          totalInterest = monthlyPayment * months - loanAmount;
        }

        const pmiMonthly = needsPMI ? (loanAmount * 0.005) / 12 : 0;

        return {
          primary: { label: "Down Payment Needed", value: `$${formatNumber(downAmount)}` },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loanAmount)}` },
            { label: "Monthly mortgage", value: `$${formatNumber(monthlyPayment)}` },
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            ...(needsPMI ? [
              { label: "Est. PMI (monthly)", value: `$${formatNumber(pmiMonthly)}` },
              { label: "Total monthly (w/ PMI)", value: `$${formatNumber(monthlyPayment + pmiMonthly)}` },
            ] : []),
            { label: "PMI required?", value: needsPMI ? "Yes (under 20%)" : "No" },
          ],
          note: needsPMI ? "PMI (Private Mortgage Insurance) is typically required when down payment is less than 20%. Estimated at 0.5% of loan annually." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "loan-calculator", "savings-goal-calculator"],
  faq: [
    { question: "How much down payment do I need for a house?", answer: "Conventional loans typically require 3-20%. FHA loans require 3.5%. VA and USDA loans may require 0%. Putting down 20% avoids PMI and gives you better rates." },
    { question: "What is PMI?", answer: "Private Mortgage Insurance (PMI) protects the lender if you default. It's required when down payment is less than 20%. PMI typically costs 0.3-1.5% of the loan amount annually and can be removed once you reach 20% equity." },
  ],
  formula: "Down Payment = Home Price × Down Payment % | Loan = Home Price - Down Payment",
};
