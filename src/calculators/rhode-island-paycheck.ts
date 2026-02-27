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

function calculateRhodeIslandStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 73450, rate: 0.0375 },
    { min: 73450, max: 166950, rate: 0.0475 },
    { min: 166950, max: Infinity, rate: 0.0599 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const rhodeIslandPaycheckCalculator: CalculatorDefinition = {
  slug: "rhode-island-paycheck",
  title: "Rhode Island Paycheck Calculator",
  description:
    "Calculate your take-home pay in Rhode Island. Rhode Island has graduated state income tax rates of 3.75%, 4.75%, and 5.99%, plus a Temporary Disability Insurance (TDI) payroll deduction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rhode island paycheck",
    "rhode island salary",
    "rhode island take home pay",
    "RI state tax",
    "rhode island income tax",
    "rhode island TDI",
  ],
  variants: [
    {
      slug: "rhode-island-paycheck",
      title: "Rhode Island Paycheck Calculator",
      description:
        "Calculate your Rhode Island take-home pay with state income tax and TDI.",
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

        const stateTaxAnnual = calculateRhodeIslandStateTax(annualGross);
        const stateTaxPerPeriod = stateTaxAnnual / payFrequency;

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const tdiRate = 0.011;
        const tdiTaxableWageBase = 87000;
        const annualTdiMax = tdiTaxableWageBase * tdiRate;
        const tdiAnnual = Math.min(annualGross * tdiRate, annualTdiMax);
        const tdiPerPeriod = tdiAnnual / payFrequency;

        const totalDeductions = federalTaxPerPeriod + stateTaxPerPeriod + ficaTotal + tdiPerPeriod;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (RI)": formatNumber(stateTaxPerPeriod),
          "Social Security (6.2%)": formatNumber(ssTax),
          "Medicare (1.45%)": formatNumber(medicareTax),
          "Total FICA": formatNumber(ficaTotal),
          "RI TDI (1.1%)": formatNumber(tdiPerPeriod),
          "Total Deductions": formatNumber(totalDeductions),
          "Net Take-Home Pay": formatNumber(netPay),
          "Effective Tax Rate": formatNumber((totalDeductions / grossPay) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "connecticut-paycheck",
    "maine-paycheck",
    "vermont-paycheck",
    "delaware-paycheck",
  ],
  faq: [
    {
      question: "What are Rhode Island's state income tax rates for 2024?",
      answer:
        "Rhode Island has three brackets: 3.75% on income up to $73,450, 4.75% on income from $73,450 to $166,950, and 5.99% on income above $166,950. These brackets apply to all filing statuses.",
    },
    {
      question: "What is Rhode Island's TDI deduction?",
      answer:
        "Rhode Island's Temporary Disability Insurance (TDI) is a mandatory employee payroll deduction of 1.1% on wages up to a taxable wage base of approximately $87,000. It funds temporary disability benefits.",
    },
    {
      question: "Does Rhode Island have local income taxes?",
      answer:
        "No, Rhode Island does not impose local or city income taxes. Your paycheck deductions include federal tax, state income tax, FICA, and the TDI contribution.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - RI State Tax (3.75%-5.99%) - Social Security (6.2%) - Medicare (1.45%) - RI TDI (1.1%).",
};
