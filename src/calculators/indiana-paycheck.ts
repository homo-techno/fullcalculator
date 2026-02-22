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

export const indianaPaycheckCalculator: CalculatorDefinition = {
  slug: "indiana-paycheck-calculator",
  title: "Indiana Paycheck Calculator",
  description:
    "Free Indiana paycheck calculator. Estimate your take-home pay after federal taxes, Indiana flat state income tax (3.05%), and FICA deductions for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["indiana paycheck calculator", "indiana take home pay", "IN paycheck calculator", "indiana state tax", "indiana salary calculator", "indiana income tax calculator"],
  variants: [
    {
      id: "indiana-paycheck",
      name: "Indiana Paycheck Calculator",
      description: "Calculate your Indiana take-home pay after federal, state (3.05% flat), and FICA taxes.",
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
        const stateTaxAnnual = annualIncome * 0.0305;
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
            { label: "Indiana State Tax (3.05%)", value: `-$${formatNumber(stateTax, 2)}` },
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
  relatedSlugs: ["illinois-paycheck-calculator", "ohio-paycheck-calculator", "michigan-paycheck-calculator"],
  faq: [
    {
      question: "What is the Indiana state income tax rate?",
      answer:
        "Indiana has a flat state income tax rate of 3.05% for 2024, one of the lower flat rates among income-tax states.",
    },
    {
      question: "Does Indiana have county income taxes?",
      answer:
        "Yes. Nearly all 92 Indiana counties levy their own income tax (0.5% to 2.864%) on top of the state rate.",
    },
    {
      question: "How does Indianas tax compare to neighboring states?",
      answer:
        "Indianas flat 3.05% is lower than Illinois (4.95%), Michigan (4.05%), and Ohios top bracket (3.688%). County taxes add to the burden.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Indiana Flat Tax (3.05%) - Social Security (6.2%) - Medicare (1.45%)",
};
