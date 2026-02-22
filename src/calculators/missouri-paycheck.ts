import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const PAY_FREQUENCIES: Record<string, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

function calcFederalTax(annualIncome: number, status: string): number {
  const brackets = status === "married"
    ? [
        { min: 0, max: 23200, rate: 0.1 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 },
      ]
    : [
        { min: 0, max: 11600, rate: 0.1 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
      ];
  let tax = 0;
  for (const b of brackets) {
    if (annualIncome <= b.min) break;
    tax += (Math.min(annualIncome, b.max) - b.min) * b.rate;
  }
  return tax;
}

function calcFICA(annualIncome: number): { ss: number; medicare: number } {
  return { ss: Math.min(annualIncome, 168600) * 0.062, medicare: annualIncome * 0.0145 };
}

function calcStateTax(annualIncome: number, status: string): number {
  const brackets = status === "married"
    ? [
        { min: 0, max: 1207, rate: 0.0 },
        { min: 1207, max: 2414, rate: 0.02 },
        { min: 2414, max: 3621, rate: 0.025 },
        { min: 3621, max: 4828, rate: 0.03 },
        { min: 4828, max: 6035, rate: 0.035 },
        { min: 6035, max: 7242, rate: 0.04 },
        { min: 7242, max: 8449, rate: 0.045 },
        { min: 8449, max: Infinity, rate: 0.048 },
      ]
    : [
        { min: 0, max: 1207, rate: 0.0 },
        { min: 1207, max: 2414, rate: 0.02 },
        { min: 2414, max: 3621, rate: 0.025 },
        { min: 3621, max: 4828, rate: 0.03 },
        { min: 4828, max: 6035, rate: 0.035 },
        { min: 6035, max: 7242, rate: 0.04 },
        { min: 7242, max: 8449, rate: 0.045 },
        { min: 8449, max: Infinity, rate: 0.048 },
      ];
  let tax = 0;
  for (const b of brackets) {
    if (annualIncome <= b.min) break;
    tax += (Math.min(annualIncome, b.max) - b.min) * b.rate;
  }
  return tax;
}

export const missouriPaycheckCalculator: CalculatorDefinition = {
  slug: "missouri-paycheck-calculator",
  title: "Missouri Paycheck Calculator",
  description:
    "Free Missouri paycheck calculator. Estimate your take-home pay after federal taxes, Missouri state income tax, and FICA deductions for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["missouri paycheck calculator", "missouri take home pay", "MO paycheck calculator", "missouri state tax", "missouri salary calculator", "missouri income tax calculator"],
  variants: [
    {
      id: "missouri-paycheck",
      name: "Missouri Paycheck Calculator",
      description: "Calculate your Missouri take-home pay after federal, state, and FICA taxes.",
      fields: [
        { name: "grossPay", label: "Gross Pay Per Period ($)", type: "number", placeholder: "e.g. 5000", min: 0 },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Weekly", value: "weekly" },
            { label: "Biweekly", value: "biweekly" },
            { label: "Semi-Monthly", value: "semimonthly" },
            { label: "Monthly", value: "monthly" },
          ],
          defaultValue: "biweekly",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const grossPay = inputs.grossPay as number;
        const payFrequency = (inputs.payFrequency as string) || "biweekly";
        const filingStatus = (inputs.filingStatus as string) || "single";
        if (!grossPay || grossPay <= 0) return null;
        const periods = PAY_FREQUENCIES[payFrequency] || 26;
        const annualIncome = grossPay * periods;
        const federalTaxAnnual = calcFederalTax(annualIncome, filingStatus);
        const stateTaxAnnual = calcStateTax(annualIncome, filingStatus);
        const fica = calcFICA(annualIncome);
        const ficaAnnual = fica.ss + fica.medicare;
        const federalTax = federalTaxAnnual / periods;
        const stateTax = stateTaxAnnual / periods;
        const ficaPerPeriod = ficaAnnual / periods;
        const netPay = grossPay - federalTax - stateTax - ficaPerPeriod;
        return {
          primary: { label: "Net Take-Home Pay", value: `$${formatNumber(netPay, 2)}` },
          details: [
            { label: "Gross Pay", value: `$${formatNumber(grossPay, 2)}` },
            { label: "Federal Income Tax", value: `-$${formatNumber(federalTax, 2)}` },
            { label: "Missouri State Tax", value: `-$${formatNumber(stateTax, 2)}` },
            { label: "Social Security (6.2%)", value: `-$${formatNumber(fica.ss / periods, 2)}` },
            { label: "Medicare (1.45%)", value: `-$${formatNumber(fica.medicare / periods, 2)}` },
            { label: "Total Deductions", value: `-$${formatNumber(federalTax + stateTax + ficaPerPeriod, 2)}` },
            { label: "Effective Tax Rate", value: `${formatNumber((federalTax + stateTax + ficaPerPeriod) / grossPay * 100, 1)}%` },
            { label: "Annual Gross Pay", value: `$${formatNumber(annualIncome, 2)}` },
            { label: "Annual Take-Home", value: `$${formatNumber(netPay * periods, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["illinois-paycheck-calculator", "indiana-paycheck-calculator", "louisiana-paycheck-calculator"],
  faq: [
    {
      question: "What is the Missouri state income tax rate?",
      answer:
        "Missouri has progressive rates from 0% to 4.8%. The top rate applies to taxable income over ,449.",
    },
    {
      question: "Does Missouri have local income taxes?",
      answer:
        "Yes. Kansas City and St. Louis both levy a 1% earnings tax on residents and non-residents working within city limits.",
    },
    {
      question: "How has Missouris tax rate changed recently?",
      answer:
        "Missouri lowered its top rate from 5.3% in 2022 to 4.8% in 2024, with further reductions planned if revenue targets are met.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Missouri State Tax - Social Security (6.2%) - Medicare (1.45%)",
};
