import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function calculateFederalTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 23200, rate: 0.10 },
          { min: 23200, max: 94300, rate: 0.12 },
          { min: 94300, max: 201050, rate: 0.22 },
          { min: 201050, max: 383900, rate: 0.24 },
          { min: 383900, max: 487450, rate: 0.32 },
          { min: 487450, max: 731200, rate: 0.35 },
          { min: 731200, max: Infinity, rate: 0.37 },
        ]
      : [
          { min: 0, max: 11600, rate: 0.10 },
          { min: 11600, max: 47150, rate: 0.12 },
          { min: 47150, max: 100525, rate: 0.22 },
          { min: 100525, max: 191950, rate: 0.24 },
          { min: 191950, max: 243725, rate: 0.32 },
          { min: 243725, max: 609350, rate: 0.35 },
          { min: 609350, max: Infinity, rate: 0.37 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

function calculateNewMexicoStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 8000, rate: 0.017 },
          { min: 8000, max: 16000, rate: 0.032 },
          { min: 16000, max: 24000, rate: 0.047 },
          { min: 24000, max: 315000, rate: 0.049 },
          { min: 315000, max: Infinity, rate: 0.059 },
        ]
      : [
          { min: 0, max: 5500, rate: 0.017 },
          { min: 5500, max: 11000, rate: 0.032 },
          { min: 11000, max: 16000, rate: 0.047 },
          { min: 16000, max: 210000, rate: 0.049 },
          { min: 210000, max: Infinity, rate: 0.059 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const newMexicoPaycheckCalculator: CalculatorDefinition = {
  slug: "new-mexico-paycheck",
  title: "New Mexico Paycheck Calculator",
  description:
    "Calculate your take-home pay in New Mexico. New Mexico has graduated state income tax rates from 1.7% to 5.9% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "new mexico paycheck",
    "new mexico salary",
    "new mexico take home pay",
    "NM state tax",
    "new mexico income tax",
    "new mexico tax brackets",
  ],
  variants: [
    {
      slug: "new-mexico-paycheck",
      title: "New Mexico Paycheck Calculator",
      description:
        "Calculate your New Mexico take-home pay with graduated state income tax.",
      fields: [
        {
          id: "grossPay",
          label: "Gross Pay Per Period",
          type: "number",
        },
        {
          id: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Weekly (52x/year)", value: "52" },
            { label: "Bi-Weekly (26x/year)", value: "26" },
            { label: "Semi-Monthly (24x/year)", value: "24" },
            { label: "Monthly (12x/year)", value: "12" },
          ],
        },
        {
          id: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
          ],
        },
      ],
      calculate(inputs) {
        const grossPay = parseFloat(inputs.grossPay as string);
        const payFrequency = parseFloat(inputs.payFrequency as string);
        const filingStatus = inputs.filingStatus as string;

        const annualGross = grossPay * payFrequency;

        const federalTax = calculateFederalTax(annualGross, filingStatus);
        const federalTaxPerPeriod = federalTax / payFrequency;

        const stateTaxAnnual = calculateNewMexicoStateTax(annualGross, filingStatus);
        const stateTaxPerPeriod = stateTaxAnnual / payFrequency;

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const totalDeductions = federalTaxPerPeriod + stateTaxPerPeriod + ficaTotal;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (NM)": formatNumber(stateTaxPerPeriod),
          "Social Security (6.2%)": formatNumber(ssTax),
          "Medicare (1.45%)": formatNumber(medicareTax),
          "Total FICA": formatNumber(ficaTotal),
          "Total Deductions": formatNumber(totalDeductions),
          "Net Take-Home Pay": formatNumber(netPay),
          "Annual Gross": formatNumber(annualGross),
          "Effective Tax Rate": formatNumber((totalDeductions / grossPay) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "oklahoma-paycheck",
    "utah-paycheck",
    "nevada-paycheck",
    "arkansas-paycheck",
  ],
  faq: [
    {
      question: "What are New Mexico's state income tax rates for 2024?",
      answer:
        "New Mexico has five brackets: 1.7% on the lowest income, then 3.2%, 4.7%, 4.9%, and a top rate of 5.9% on income above $210,000 (single) or $315,000 (married).",
    },
    {
      question: "Does New Mexico have local income taxes?",
      answer:
        "No, New Mexico does not impose local or city income taxes. Your paycheck deductions include federal tax, state tax, and FICA contributions only.",
    },
    {
      question: "Does New Mexico tax Social Security benefits?",
      answer:
        "New Mexico exempts Social Security benefits from state income tax for most residents. This is relevant for retirees but does not affect paycheck withholding for active workers.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - New Mexico State Tax (1.7%-5.9%) - Social Security (6.2%) - Medicare (1.45%).",
};
