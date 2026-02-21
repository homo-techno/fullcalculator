import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vaLoanCalculator: CalculatorDefinition = {
  slug: "va-loan-calculator",
  title: "VA Loan Calculator",
  description:
    "Free VA loan calculator. Calculate VA mortgage payments with zero down payment and no PMI. Includes VA funding fee estimates for eligible veterans and service members.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "va loan calculator",
    "va mortgage calculator",
    "va home loan calculator",
    "veteran loan calculator",
    "va funding fee calculator",
  ],
  variants: [
    {
      id: "va-payment",
      name: "VA Loan Payment",
      description: "Calculate monthly VA loan payment including funding fee",
      fields: [
        {
          name: "homePrice",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPaymentPct",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 0",
          suffix: "%",
          min: 0,
          max: 100,
          step: 0.1,
          defaultValue: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.0",
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
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
        {
          name: "usage",
          label: "VA Loan Usage",
          type: "select",
          options: [
            { label: "First time use", value: "first" },
            { label: "Subsequent use", value: "subsequent" },
          ],
          defaultValue: "first",
        },
      ],
      calculate: (inputs) => {
        const homePrice = inputs.homePrice as number;
        const downPct = (inputs.downPaymentPct as number) || 0;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 30;
        const usage = inputs.usage as string;
        if (!homePrice || !rate) return null;

        const downPayment = homePrice * (downPct / 100);
        const baseLoan = homePrice - downPayment;

        // VA Funding Fee rates (first-time vs subsequent)
        let fundingFeeRate: number;
        if (downPct >= 10) {
          fundingFeeRate = 0.0125; // 1.25% with 10%+ down
        } else if (downPct >= 5) {
          fundingFeeRate = 0.015; // 1.5% with 5-9.99% down
        } else {
          fundingFeeRate = usage === "first" ? 0.0215 : 0.033; // 2.15% first / 3.3% subsequent
        }

        const fundingFee = baseLoan * fundingFeeRate;
        const totalLoan = baseLoan + fundingFee; // funding fee can be financed

        const monthlyRate = rate / 100 / 12;
        const numPayments = years * 12;
        const monthlyPayment =
          (totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

        const totalPaid = monthlyPayment * numPayments;
        const totalInterest = totalPaid - baseLoan;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthlyPayment)}`,
          },
          details: [
            { label: "Base loan amount", value: `$${formatNumber(baseLoan)}` },
            { label: "VA funding fee", value: `$${formatNumber(fundingFee)}` },
            { label: "Funding fee rate", value: `${formatNumber(fundingFeeRate * 100, 2)}%` },
            { label: "Total loan (with fee)", value: `$${formatNumber(totalLoan)}` },
            { label: "Down payment", value: `$${formatNumber(downPayment)}` },
            { label: "PMI", value: "None (VA benefit)" },
            { label: "Total interest paid", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost over loan life", value: `$${formatNumber(totalPaid)}` },
          ],
          note: "VA loans require no PMI and allow 0% down payment. Disabled veterans may be exempt from the funding fee.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "fha-loan-calculator", "home-affordability-calculator"],
  faq: [
    {
      question: "What is the VA funding fee?",
      answer:
        "The VA funding fee is a one-time fee charged on VA loans to help offset the cost to taxpayers. For first-time use with 0% down, it is 2.15% of the loan amount. It decreases with larger down payments. Veterans with service-connected disabilities are exempt.",
    },
    {
      question: "Do VA loans require a down payment?",
      answer:
        "No. VA loans are one of the few loan types that allow 100% financing (0% down payment). However, making a down payment reduces the VA funding fee and lowers your monthly payment.",
    },
    {
      question: "Why don't VA loans have PMI?",
      answer:
        "VA loans are guaranteed by the Department of Veterans Affairs, which replaces the need for private mortgage insurance (PMI). The VA funding fee serves a similar purpose but is a one-time charge rather than an ongoing monthly cost.",
    },
  ],
  formula:
    "Funding Fee = Base Loan × Fee Rate (2.15% first use, 0% down). Total Loan = Base Loan + Funding Fee. Monthly Payment = L[r(1+r)^n]/[(1+r)^n-1].",
};
