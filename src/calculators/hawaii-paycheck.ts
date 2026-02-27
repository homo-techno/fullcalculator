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

function calculateHawaiiStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 4800, rate: 0.014 },
          { min: 4800, max: 9600, rate: 0.032 },
          { min: 9600, max: 19200, rate: 0.055 },
          { min: 19200, max: 28800, rate: 0.064 },
          { min: 28800, max: 38400, rate: 0.068 },
          { min: 38400, max: 48000, rate: 0.072 },
          { min: 48000, max: 72000, rate: 0.076 },
          { min: 72000, max: 96000, rate: 0.079 },
          { min: 96000, max: 300000, rate: 0.0825 },
          { min: 300000, max: 350000, rate: 0.09 },
          { min: 350000, max: 400000, rate: 0.10 },
          { min: 400000, max: Infinity, rate: 0.11 },
        ]
      : [
          { min: 0, max: 2400, rate: 0.014 },
          { min: 2400, max: 4800, rate: 0.032 },
          { min: 4800, max: 9600, rate: 0.055 },
          { min: 9600, max: 14400, rate: 0.064 },
          { min: 14400, max: 19200, rate: 0.068 },
          { min: 19200, max: 24000, rate: 0.072 },
          { min: 24000, max: 36000, rate: 0.076 },
          { min: 36000, max: 48000, rate: 0.079 },
          { min: 48000, max: 150000, rate: 0.0825 },
          { min: 150000, max: 175000, rate: 0.09 },
          { min: 175000, max: 200000, rate: 0.10 },
          { min: 200000, max: Infinity, rate: 0.11 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const hawaiiPaycheckCalculator: CalculatorDefinition = {
  slug: "hawaii-paycheck",
  title: "Hawaii Paycheck Calculator",
  description:
    "Calculate your take-home pay in Hawaii. Hawaii has one of the highest state income tax rates in the nation (up to 11%), plus a Temporary Disability Insurance (TDI) payroll deduction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "hawaii paycheck",
    "hawaii salary",
    "hawaii take home pay",
    "HI state tax",
    "hawaii income tax",
    "hawaii TDI",
  ],
  variants: [
    {
      slug: "hawaii-paycheck",
      title: "Hawaii Paycheck Calculator",
      description:
        "Calculate your Hawaii take-home pay with high state income tax rates and TDI.",
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

        const stateTaxAnnual = calculateHawaiiStateTax(annualGross, filingStatus);
        const stateTaxPerPeriod = stateTaxAnnual / payFrequency;

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const tdiRate = 0.005;
        const tdiMax = 6.78;
        const tdi = Math.min(grossPay * tdiRate, tdiMax);

        const totalDeductions = federalTaxPerPeriod + stateTaxPerPeriod + ficaTotal + tdi;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (HI)": formatNumber(stateTaxPerPeriod),
          "Social Security (6.2%)": formatNumber(ssTax),
          "Medicare (1.45%)": formatNumber(medicareTax),
          "Total FICA": formatNumber(ficaTotal),
          "HI TDI (0.5%)": formatNumber(tdi),
          "Total Deductions": formatNumber(totalDeductions),
          "Net Take-Home Pay": formatNumber(netPay),
          "Effective Tax Rate": formatNumber((totalDeductions / grossPay) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "oregon-paycheck",
    "connecticut-paycheck",
    "vermont-paycheck",
    "maine-paycheck",
  ],
  faq: [
    {
      question: "Why is Hawaii's state income tax so high?",
      answer:
        "Hawaii has one of the highest top marginal rates at 11% on income over $200,000 (single) or $400,000 (married). The state has 12 tax brackets, which is among the most of any state.",
    },
    {
      question: "What is Hawaii's Temporary Disability Insurance (TDI)?",
      answer:
        "Hawaii TDI is a mandatory payroll deduction that funds temporary disability benefits. Employees contribute up to 0.5% of wages, capped at a weekly maximum of approximately $6.78.",
    },
    {
      question: "Does Hawaii have any additional payroll taxes?",
      answer:
        "Beyond state income tax and TDI, Hawaii does not impose additional local income taxes. However, the high cost of living in Hawaii means take-home pay purchasing power is lower than many mainland states.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Hawaii State Tax (1.4%-11%) - Social Security (6.2%) - Medicare (1.45%) - HI TDI (0.5%).",
};
