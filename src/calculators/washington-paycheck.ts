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

export const washingtonPaycheckCalculator: CalculatorDefinition = {
  slug: "washington-paycheck-calculator",
  title: "Washington Paycheck Calculator",
  description:
    "Free Washington paycheck calculator. Estimate your take-home pay with no state income tax. Calculate federal taxes and FICA deductions for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["washington paycheck calculator", "washington take home pay", "WA paycheck calculator", "washington salary calculator", "washington no state tax", "washington net pay calculator"],
  variants: [
    {
      id: "washington-paycheck",
      name: "Washington Paycheck Calculator",
      description: "Calculate your Washington take-home pay. Washington has no state income tax.",
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
        const stateTaxAnnual = 0;
        const fica = calcFICA(annualIncome);
        const ficaAnnual = fica.ss + fica.medicare;
        const federalTax = federalTaxAnnual / periods;
        const ficaPerPeriod = ficaAnnual / periods;
        const netPay = grossPay - federalTax - ficaPerPeriod;
        return {
          primary: { label: "Net Take-Home Pay", value: `$${formatNumber(netPay, 2)}` },
          details: [
            { label: "Gross Pay", value: `$${formatNumber(grossPay, 2)}` },
            { label: "Federal Income Tax", value: `-$${formatNumber(federalTax, 2)}` },
            { label: "Washington State Tax", value: "$0.00 (No State Tax)" },
            { label: "Social Security (6.2%)", value: `-$${formatNumber(fica.ss / periods, 2)}` },
            { label: "Medicare (1.45%)", value: `-$${formatNumber(fica.medicare / periods, 2)}` },
            { label: "Total Deductions", value: `-$${formatNumber(federalTax + ficaPerPeriod, 2)}` },
            { label: "Effective Tax Rate", value: `${formatNumber((federalTax + ficaPerPeriod) / grossPay * 100, 1)}%` },
            { label: "Annual Gross Pay", value: `$${formatNumber(annualIncome, 2)}` },
            { label: "Annual Take-Home", value: `$${formatNumber(netPay * periods, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["texas-paycheck-calculator", "florida-paycheck-calculator", "california-paycheck-calculator"],
  faq: [
    {
      question: "Does Washington have a state income tax?",
      answer:
        "No. Washington does not tax wages or salaries. Since 2022, a 7% tax applies to capital gains over 50,000, but this does not affect paychecks.",
    },
    {
      question: "What is Washingtons capital gains tax?",
      answer:
        "Washington levies a 7% tax on long-term capital gains exceeding 50,000 per year. This does not affect regular paycheck withholdings.",
    },
    {
      question: "How does Washington fund state services?",
      answer:
        "Washington relies on sales tax (6.5% state rate, up to 10.5% with local), business taxes, and property taxes instead of income tax.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Social Security (6.2%%) - Medicare (1.45%%) [No State Tax]",
};
