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
        { min: 0, max: 46330, rate: 0.0535 },
        { min: 46330, max: 184040, rate: 0.068 },
        { min: 184040, max: 321450, rate: 0.0785 },
        { min: 321450, max: Infinity, rate: 0.0985 },
      ]
    : [
        { min: 0, max: 31690, rate: 0.0535 },
        { min: 31690, max: 104090, rate: 0.068 },
        { min: 104090, max: 193240, rate: 0.0785 },
        { min: 193240, max: Infinity, rate: 0.0985 },
      ];
  let tax = 0;
  for (const b of brackets) {
    if (annualIncome <= b.min) break;
    tax += (Math.min(annualIncome, b.max) - b.min) * b.rate;
  }
  return tax;
}

export const minnesotaPaycheckCalculator: CalculatorDefinition = {
  slug: "minnesota-paycheck-calculator",
  title: "Minnesota Paycheck Calculator",
  description:
    "Free Minnesota paycheck calculator. Estimate your take-home pay after federal taxes, Minnesota state income tax, and FICA deductions for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["minnesota paycheck calculator", "minnesota take home pay", "MN paycheck calculator", "minnesota state tax", "minnesota salary calculator", "minnesota income tax calculator"],
  variants: [
    {
      id: "minnesota-paycheck",
      name: "Minnesota Paycheck Calculator",
      description: "Calculate your Minnesota take-home pay after federal, state, and FICA taxes.",
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
            { label: "Minnesota State Tax", value: `-$${formatNumber(stateTax, 2)}` },
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
  relatedSlugs: ["wisconsin-paycheck-calculator", "illinois-paycheck-calculator", "california-paycheck-calculator"],
  faq: [
    {
      question: "What is the Minnesota state income tax rate?",
      answer:
        "Minnesota has four brackets: 5.35%, 6.8%, 7.85%, and 9.85%. The top rate is among the highest in the nation.",
    },
    {
      question: "Does Minnesota have local income taxes?",
      answer:
        "No. Minnesota does not levy local or municipal income taxes.",
    },
    {
      question: "How does Minnesotas top tax rate compare?",
      answer:
        "Minnesotas 9.85% top rate is the fifth-highest nationally, behind California (13.3%), Hawaii (11%), New Jersey (10.75%), and Oregon (9.9%).",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Minnesota State Tax - Social Security (6.2%) - Medicare (1.45%)",
};
