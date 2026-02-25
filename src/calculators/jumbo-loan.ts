import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jumboLoanCalculator: CalculatorDefinition = {
  slug: "jumbo-loan-calculator",
  title: "Jumbo Loan Calculator",
  description:
    "Free jumbo loan calculator. Estimate monthly payments for jumbo mortgages that exceed conforming loan limits. Compare rates and see total interest costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "jumbo loan calculator",
    "jumbo mortgage calculator",
    "jumbo loan rates",
    "non-conforming loan",
    "jumbo mortgage payment",
  ],
  variants: [
    {
      id: "jumbo-payment",
      name: "Jumbo Loan Payment",
      description: "Calculate monthly payment for a jumbo loan",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 900000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 180000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.75",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.homePrice as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.term as string) || 30;
        if (!price || !rate) return null;

        const loan = price - down;
        const conformingLimit = 766550;
        const isJumbo = loan > conformingLimit;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = monthly * payments;
        const totalInterest = totalPaid - loan;
        const downPct = (down / price) * 100;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Jumbo status", value: isJumbo ? "Yes - Jumbo Loan" : "Conforming Loan" },
            { label: "Down payment", value: `${formatNumber(downPct)}` + "%" },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-affordability-calculator"],
  faq: [
    {
      question: "What is a jumbo loan?",
      answer:
        "A jumbo loan exceeds the conforming loan limits set by the FHFA (currently $766,550 in most areas). These loans cannot be purchased by Fannie Mae or Freddie Mac and typically require higher credit scores and larger down payments.",
    },
    {
      question: "What are jumbo loan requirements?",
      answer:
        "Jumbo loans typically require a credit score of 700+, a down payment of 10-20%, a debt-to-income ratio below 43%, and cash reserves of 6-12 months of payments.",
    },
    {
      question: "Are jumbo loan rates higher?",
      answer:
        "Historically jumbo rates were higher, but today they are often comparable to or even lower than conforming rates due to competition among lenders for high-value borrowers.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
