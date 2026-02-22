import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ppfCalculator: CalculatorDefinition = {
  slug: "ppf-calculator",
  title: "PPF Calculator",
  description:
    "Free PPF calculator. Calculate Public Provident Fund maturity amount and interest earned. Plan your PPF investments with yearly breakdowns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "PPF calculator",
    "public provident fund calculator",
    "PPF maturity calculator",
    "PPF interest calculator",
    "PPF investment",
    "PPF returns",
  ],
  variants: [
    {
      id: "basic",
      name: "PPF Maturity Calculator",
      description: "Calculate PPF maturity amount with annual deposits",
      fields: [
        {
          name: "yearlyDeposit",
          label: "Yearly Deposit",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "₹",
          min: 500,
          max: 150000,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 7.1",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.1,
          defaultValue: 7.1,
        },
        {
          name: "tenure",
          label: "Tenure",
          type: "select",
          options: [
            { label: "15 years (Standard)", value: "15" },
            { label: "20 years (1 extension)", value: "20" },
            { label: "25 years (2 extensions)", value: "25" },
            { label: "30 years (3 extensions)", value: "30" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const yearlyDeposit = inputs.yearlyDeposit as number;
        const rate = inputs.rate as number;
        const tenure = parseInt(inputs.tenure as string);
        if (!yearlyDeposit || !rate || !tenure) return null;

        const r = rate / 100;
        let balance = 0;

        for (let i = 0; i < tenure; i++) {
          balance = (balance + yearlyDeposit) * (1 + r);
        }

        const totalInvested = yearlyDeposit * tenure;
        const totalInterest = balance - totalInvested;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Total amount invested", value: `₹${formatNumber(totalInvested)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
            {
              label: "Effective return on investment",
              value: `${formatNumber((totalInterest / totalInvested) * 100)}%`,
            },
            { label: "Tenure", value: `${tenure} years` },
          ],
        };
      },
    },
    {
      id: "monthly",
      name: "Monthly Deposit PPF",
      description: "Calculate PPF returns with monthly deposits",
      fields: [
        {
          name: "monthlyDeposit",
          label: "Monthly Deposit",
          type: "number",
          placeholder: "e.g. 12500",
          prefix: "₹",
          min: 42,
          max: 12500,
        },
        {
          name: "rate",
          label: "Interest Rate (p.a.)",
          type: "number",
          placeholder: "e.g. 7.1",
          suffix: "%",
          min: 1,
          max: 15,
          step: 0.1,
          defaultValue: 7.1,
        },
        {
          name: "tenure",
          label: "Tenure",
          type: "select",
          options: [
            { label: "15 years (Standard)", value: "15" },
            { label: "20 years (1 extension)", value: "20" },
            { label: "25 years (2 extensions)", value: "25" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const monthlyDeposit = inputs.monthlyDeposit as number;
        const rate = inputs.rate as number;
        const tenure = parseInt(inputs.tenure as string);
        if (!monthlyDeposit || !rate || !tenure) return null;

        const yearlyDeposit = monthlyDeposit * 12;
        const r = rate / 100;
        let balance = 0;

        for (let i = 0; i < tenure; i++) {
          balance = (balance + yearlyDeposit) * (1 + r);
        }

        const totalInvested = yearlyDeposit * tenure;
        const totalInterest = balance - totalInvested;

        return {
          primary: { label: "Maturity Amount", value: `₹${formatNumber(balance)}` },
          details: [
            { label: "Monthly deposit", value: `₹${formatNumber(monthlyDeposit)}` },
            { label: "Yearly deposit", value: `₹${formatNumber(yearlyDeposit)}` },
            { label: "Total invested", value: `₹${formatNumber(totalInvested)}` },
            { label: "Total interest earned", value: `₹${formatNumber(totalInterest)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fd-calculator", "rd-calculator", "compound-interest-calculator"],
  faq: [
    {
      question: "What is PPF?",
      answer:
        "PPF (Public Provident Fund) is a long-term savings scheme offered by the Government of India. It has a minimum tenure of 15 years with options for extension in blocks of 5 years. The interest rate is set by the government quarterly.",
    },
    {
      question: "What is the PPF interest rate?",
      answer:
        "The PPF interest rate is set by the Government of India and revised quarterly. It is compounded annually. Check the latest rate on the India Post or SBI website. Historically it has ranged from 7% to 8.7%.",
    },
    {
      question: "Is PPF tax-free?",
      answer:
        "Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) tax status. Contributions up to ₹1.5 lakh per year qualify for tax deduction under Section 80C, the interest earned is tax-free, and the maturity amount is also tax-free.",
    },
  ],
  formula: "Maturity = Σ (Deposit × (1 + r)^(n-i)) for each year i",
};
