import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const secondMortgageCalculator: CalculatorDefinition = {
  slug: "second-mortgage-calculator",
  title: "Second Mortgage Calculator",
  description:
    "Free second mortgage calculator. Estimate monthly payments for a second mortgage, see combined loan-to-value ratio, and compare total costs with your primary mortgage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "second mortgage calculator",
    "2nd mortgage calculator",
    "piggyback loan calculator",
    "subordinate lien",
    "second lien calculator",
  ],
  variants: [
    {
      id: "second-mortgage-payment",
      name: "Second Mortgage Payment",
      description: "Calculate payment for a second mortgage",
      fields: [
        {
          name: "homeValue",
          label: "Home Value",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "firstMortgage",
          label: "First Mortgage Balance",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "firstPayment",
          label: "First Mortgage Payment",
          type: "number",
          placeholder: "e.g. 1800",
          prefix: "$",
          min: 0,
        },
        {
          name: "secondAmount",
          label: "Second Mortgage Amount",
          type: "number",
          placeholder: "e.g. 40000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Second Mortgage Rate",
          type: "number",
          placeholder: "e.g. 9.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Second Mortgage Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const homeVal = inputs.homeValue as number;
        const firstBal = (inputs.firstMortgage as number) || 0;
        const firstPmt = (inputs.firstPayment as number) || 0;
        const secondAmt = inputs.secondAmount as number;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.term as string) || 15;
        if (!homeVal || !secondAmt || !rate) return null;

        const cltv = ((firstBal + secondAmt) / homeVal) * 100;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (secondAmt * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = monthly * payments;
        const totalInterest = totalPaid - secondAmt;
        const combinedPayment = firstPmt + monthly;

        return {
          primary: {
            label: "Second Mortgage Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Combined monthly payment", value: `$${formatNumber(combinedPayment)}` },
            { label: "Combined LTV (CLTV)", value: `${formatNumber(cltv)}` + "%" },
            { label: "Total interest (2nd mortgage)", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid (2nd mortgage)", value: `$${formatNumber(totalPaid)}` },
            { label: "Available equity after", value: `$${formatNumber(homeVal - firstBal - secondAmt)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-equity-loan-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "What is a second mortgage?",
      answer:
        "A second mortgage is a loan taken against your home equity while your primary mortgage is still active. It is subordinate to the first mortgage, meaning the first lender gets paid first in foreclosure.",
    },
    {
      question: "What is CLTV?",
      answer:
        "Combined Loan-to-Value (CLTV) is the ratio of all loans secured by the property to its value. Most lenders require CLTV of 85-90% or less for a second mortgage.",
    },
    {
      question: "Are second mortgage rates higher?",
      answer:
        "Yes, second mortgage rates are typically 1-3% higher than first mortgage rates because the lender takes on more risk being in a subordinate position.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
