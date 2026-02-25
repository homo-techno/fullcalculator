import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sbaLoanCalculator: CalculatorDefinition = {
  slug: "sba-loan-calculator",
  title: "SBA Loan Calculator",
  description:
    "Free SBA loan calculator. Estimate monthly payments, total interest, and total cost for Small Business Administration loans including SBA 7(a), 504, and microloans.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "sba loan calculator",
    "sba 7a loan",
    "sba 504 loan",
    "small business loan calculator",
    "sba microloan",
    "business loan payment",
  ],
  variants: [
    {
      id: "sba-loan-payment",
      name: "SBA Loan Payment",
      description: "Calculate payments for an SBA loan",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.01,
        },
        {
          name: "loanType",
          label: "SBA Loan Type",
          type: "select",
          options: [
            { label: "SBA 7(a) - General", value: "7a" },
            { label: "SBA 504 - Real Estate/Equipment", value: "504" },
            { label: "SBA Microloan", value: "micro" },
            { label: "SBA Express", value: "express" },
          ],
          defaultValue: "7a",
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "25 years", value: "25" },
          ],
          defaultValue: "10",
        },
        {
          name: "guaranteeFee",
          label: "SBA Guarantee Fee",
          type: "select",
          options: [
            { label: "0% (under $150K)", value: "0" },
            { label: "2% ($150K-$700K)", value: "2" },
            { label: "3% ($700K-$1M)", value: "3" },
            { label: "3.5% (over $1M)", value: "3.5" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 10;
        const guaranteePct = parseFloat(inputs.guaranteeFee as string) || 2;
        if (!loan || !rate) return null;

        const mr = rate / 100 / 12;
        const n = years * 12;
        const monthly =
          (loan * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - loan;
        const guaranteeFee = loan * (guaranteePct / 100);
        const totalCost = totalInterest + guaranteeFee;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "SBA guarantee fee", value: `$${formatNumber(guaranteeFee)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost (interest + fees)", value: `$${formatNumber(totalCost)}` },
            { label: "Total amount repaid", value: `$${formatNumber(totalPaid + guaranteeFee)}` },
            { label: "Annual debt service", value: `$${formatNumber(monthly * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["equipment-loan-calculator", "personal-loan-calculator"],
  faq: [
    {
      question: "What are the different types of SBA loans?",
      answer:
        "The SBA 7(a) is the most common for general business use (up to $5M). The SBA 504 is for real estate and equipment (up to $5.5M). Microloans are up to $50,000 for startups. SBA Express offers faster approval up to $500K.",
    },
    {
      question: "What is the SBA guarantee fee?",
      answer:
        "The SBA charges a guarantee fee based on loan amount and maturity. It ranges from 0% for loans under $150K to 3.5% for loans over $1M. This fee can be financed into the loan.",
    },
    {
      question: "What are typical SBA loan rates?",
      answer:
        "SBA 7(a) rates are typically Prime + 2.25% to 4.75% depending on loan size and term. SBA 504 rates are often fixed and slightly lower. Microloans range from 8-13%.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Total Cost = Total Interest + SBA Guarantee Fee.",
};
