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

function calculateNebraskaStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 7390, rate: 0.0246 },
          { min: 7390, max: 44250, rate: 0.0351 },
          { min: 44250, max: 71160, rate: 0.0501 },
          { min: 71160, max: Infinity, rate: 0.0584 },
        ]
      : [
          { min: 0, max: 3700, rate: 0.0246 },
          { min: 3700, max: 22170, rate: 0.0351 },
          { min: 22170, max: 35730, rate: 0.0501 },
          { min: 35730, max: Infinity, rate: 0.0584 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const nebraskaPaycheckCalculator: CalculatorDefinition = {
  slug: "nebraska-paycheck",
  title: "Nebraska Paycheck Calculator",
  description:
    "Calculate your take-home pay in Nebraska. Nebraska has graduated state income tax brackets with rates from 2.46% to 5.84% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "nebraska paycheck",
    "nebraska salary",
    "nebraska take home pay",
    "NE state tax",
    "nebraska income tax",
    "nebraska tax brackets",
  ],
  variants: [
    {
      slug: "nebraska-paycheck",
      title: "Nebraska Paycheck Calculator",
      description: "Calculate your Nebraska take-home pay with state income tax brackets.",
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

        const stateTaxAnnual = calculateNebraskaStateTax(annualGross, filingStatus);
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
          "State Tax (NE)": formatNumber(stateTaxPerPeriod),
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
    "iowa-paycheck",
    "kansas-paycheck",
    "south-dakota-paycheck",
    "wyoming-paycheck",
  ],
  faq: [
    {
      question: "What are Nebraska's state income tax rates for 2024?",
      answer:
        "Nebraska has four brackets: 2.46% on the lowest tier, 3.51%, 5.01%, and a top rate of 5.84%. Brackets differ for single vs. married filers, with married thresholds approximately double.",
    },
    {
      question: "Is Nebraska reducing its income tax rates?",
      answer:
        "Yes, Nebraska has been gradually reducing its top income tax rate. The state aims to lower the top rate over several years as part of tax reform legislation passed in 2022.",
    },
    {
      question: "Does Nebraska have local income taxes?",
      answer:
        "No, Nebraska does not impose local or city income taxes. Your paycheck deductions include federal tax, state tax, and FICA.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Nebraska State Tax (2.46%-5.84%) - Social Security (6.2%) - Medicare (1.45%).",
};
