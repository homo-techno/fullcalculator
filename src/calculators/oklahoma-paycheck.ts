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

function calculateOklahomaStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 2000, rate: 0.0025 },
          { min: 2000, max: 5000, rate: 0.0075 },
          { min: 5000, max: 7500, rate: 0.0175 },
          { min: 7500, max: 9800, rate: 0.0275 },
          { min: 9800, max: 12200, rate: 0.0375 },
          { min: 12200, max: Infinity, rate: 0.0475 },
        ]
      : [
          { min: 0, max: 1000, rate: 0.0025 },
          { min: 1000, max: 2500, rate: 0.0075 },
          { min: 2500, max: 3750, rate: 0.0175 },
          { min: 3750, max: 4900, rate: 0.0275 },
          { min: 4900, max: 7200, rate: 0.0375 },
          { min: 7200, max: Infinity, rate: 0.0475 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const oklahomaPaycheckCalculator: CalculatorDefinition = {
  slug: "oklahoma-paycheck",
  title: "Oklahoma Paycheck Calculator",
  description:
    "Calculate your take-home pay in Oklahoma. Oklahoma has graduated state income tax rates from 0.25% to 4.75% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "oklahoma paycheck",
    "oklahoma salary",
    "oklahoma take home pay",
    "OK state tax",
    "oklahoma income tax",
    "oklahoma tax brackets",
  ],
  variants: [
    {
      slug: "oklahoma-paycheck",
      title: "Oklahoma Paycheck Calculator",
      description:
        "Calculate your Oklahoma take-home pay with graduated state income tax.",
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

        const stateTaxAnnual = calculateOklahomaStateTax(annualGross, filingStatus);
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
          "State Tax (OK)": formatNumber(stateTaxPerPeriod),
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
    "arkansas-paycheck",
    "kansas-paycheck",
    "new-mexico-paycheck",
    "nebraska-paycheck",
  ],
  faq: [
    {
      question: "What are Oklahoma's state income tax rates for 2024?",
      answer:
        "Oklahoma has six graduated brackets ranging from 0.25% to 4.75%. The top rate of 4.75% applies to income above $7,200 (single) or $12,200 (married filing jointly).",
    },
    {
      question: "Does Oklahoma have local income taxes?",
      answer:
        "No, Oklahoma does not impose local or city income taxes. Your paycheck deductions include only federal tax, state income tax, and FICA contributions.",
    },
    {
      question: "Can I deduct federal taxes on my Oklahoma state return?",
      answer:
        "Oklahoma does not allow a deduction for federal income taxes paid. However, the state does conform to many federal deductions and exemptions on the state return.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Oklahoma State Tax (0.25%-4.75%) - Social Security (6.2%) - Medicare (1.45%).",
};
