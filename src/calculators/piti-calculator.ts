import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pitiCalculator: CalculatorDefinition = {
  slug: "piti-calculator",
  title: "PITI Calculator",
  description:
    "Free PITI calculator. Estimate your total monthly mortgage payment including Principal, Interest, Taxes, and Insurance to understand the true cost of homeownership.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "piti calculator",
    "principal interest tax insurance",
    "total mortgage payment",
    "monthly housing cost",
    "mortgage piti",
    "homeowner payment calculator",
  ],
  variants: [
    {
      id: "piti-payment",
      name: "PITI Payment",
      description: "Calculate your full monthly housing payment",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
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
            { label: "10 years", value: "10" },
          ],
          defaultValue: "30",
        },
        {
          name: "annualTax",
          label: "Annual Property Tax",
          type: "number",
          placeholder: "e.g. 4200",
          prefix: "$",
          min: 0,
        },
        {
          name: "annualInsurance",
          label: "Annual Homeowner's Insurance",
          type: "number",
          placeholder: "e.g. 1800",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyPMI",
          label: "Monthly PMI (if applicable)",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 30;
        const annualTax = (inputs.annualTax as number) || 0;
        const annualInsurance = (inputs.annualInsurance as number) || 0;
        const pmi = (inputs.monthlyPMI as number) || 0;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const n = years * 12;
        const pi =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1);
        const monthlyTax = annualTax / 12;
        const monthlyInsurance = annualInsurance / 12;
        const totalPITI = pi + monthlyTax + monthlyInsurance + pmi;
        const totalOverLife = totalPITI * n;
        const totalInterest = pi * n - loan;

        return {
          primary: {
            label: "Total Monthly PITI Payment",
            value: `$${formatNumber(totalPITI)}`,
          },
          details: [
            { label: "Principal & Interest (P&I)", value: `$${formatNumber(pi)}` },
            { label: "Monthly property tax", value: `$${formatNumber(monthlyTax)}` },
            { label: "Monthly insurance", value: `$${formatNumber(monthlyInsurance)}` },
            { label: "Monthly PMI", value: `$${formatNumber(pmi)}` },
            { label: "Total interest over loan life", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid over loan life", value: `$${formatNumber(totalOverLife)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-equity-loan-calculator"],
  faq: [
    {
      question: "What does PITI stand for?",
      answer:
        "PITI stands for Principal, Interest, Taxes, and Insurance. It represents the four components of a typical monthly mortgage payment. Lenders use PITI to assess your ability to afford a home.",
    },
    {
      question: "Why is PITI important?",
      answer:
        "PITI gives you the complete picture of your monthly housing cost, not just the loan payment. Lenders typically require that your PITI payment be no more than 28% of your gross monthly income.",
    },
    {
      question: "What is PMI and when is it required?",
      answer:
        "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's value. It protects the lender if you default. PMI can be removed once you reach 20% equity.",
    },
  ],
  formula:
    "PITI = P&I + Monthly Tax + Monthly Insurance + PMI, where P&I = L[r(1+r)^n]/[(1+r)^n - 1]",
};
