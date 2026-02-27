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

function calculateIowaStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 6210, rate: 0.044 },
    { min: 6210, max: 31050, rate: 0.0482 },
    { min: 31050, max: Infinity, rate: 0.057 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const iowaPaycheckCalculator: CalculatorDefinition = {
  slug: "iowa-paycheck",
  title: "Iowa Paycheck Calculator",
  description:
    "Calculate your take-home pay in Iowa. Iowa has graduated state income tax brackets with rates from 4.4% to 5.7% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "iowa paycheck",
    "iowa salary",
    "iowa take home pay",
    "IA state tax",
    "iowa income tax",
    "iowa tax brackets",
  ],
  variants: [
    {
      slug: "iowa-paycheck",
      title: "Iowa Paycheck Calculator",
      description: "Calculate your Iowa take-home pay with graduated state income tax brackets.",
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

        const stateTaxAnnual = calculateIowaStateTax(annualGross);
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
          "State Tax (IA)": formatNumber(stateTaxPerPeriod),
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
    "nebraska-paycheck",
    "kansas-paycheck",
    "south-dakota-paycheck",
    "minnesota-paycheck",
  ],
  faq: [
    {
      question: "What are Iowa's state income tax rates for 2024?",
      answer:
        "Iowa has three graduated brackets for 2024: 4.4% on income up to $6,210, 4.82% on income from $6,210 to $31,050, and 5.7% on income above $31,050. Iowa is in the process of reducing rates toward a flat tax.",
    },
    {
      question: "Does Iowa allow federal tax deductions on state returns?",
      answer:
        "Iowa previously allowed a deduction for federal taxes paid on the state return, but this deduction is being phased out as part of recent tax reform. Check current rules for the latest status.",
    },
    {
      question: "Are there local income taxes in Iowa?",
      answer:
        "Some Iowa school districts impose a local income surtax, but this is applied to your state tax liability rather than as a separate payroll deduction. This calculator covers state-level taxes.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Iowa State Tax (4.4%-5.7%) - Social Security (6.2%) - Medicare (1.45%).",
};
