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

function calculateDelawareStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 2000, rate: 0.0 },
    { min: 2000, max: 5000, rate: 0.022 },
    { min: 5000, max: 10000, rate: 0.039 },
    { min: 10000, max: 20000, rate: 0.048 },
    { min: 20000, max: 25000, rate: 0.052 },
    { min: 25000, max: 60000, rate: 0.0555 },
    { min: 60000, max: Infinity, rate: 0.066 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const delawarePaycheckCalculator: CalculatorDefinition = {
  slug: "delaware-paycheck",
  title: "Delaware Paycheck Calculator",
  description:
    "Calculate your take-home pay in Delaware. Delaware has graduated state income tax rates from 2.2% to 6.6% but no sales tax, making it unique for overall tax burden.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "delaware paycheck",
    "delaware salary",
    "delaware take home pay",
    "DE state tax",
    "delaware income tax",
    "delaware no sales tax",
  ],
  variants: [
    {
      slug: "delaware-paycheck",
      title: "Delaware Paycheck Calculator",
      description: "Calculate your Delaware take-home pay with graduated state income tax.",
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

        const stateTaxAnnual = calculateDelawareStateTax(annualGross);
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
          "State Tax (DE)": formatNumber(stateTaxPerPeriod),
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
    "west-virginia-paycheck",
    "rhode-island-paycheck",
    "connecticut-paycheck",
    "montana-paycheck",
  ],
  faq: [
    {
      question: "What are Delaware's state income tax rates for 2024?",
      answer:
        "Delaware has graduated brackets: 0% on the first $2,000, then rates of 2.2%, 3.9%, 4.8%, 5.2%, 5.55%, and a top rate of 6.6% on income over $60,000.",
    },
    {
      question: "Does Delaware have a sales tax?",
      answer:
        "No. Delaware is one of five states with no sales tax. While your paycheck deductions are not directly affected, the absence of sales tax lowers your overall cost of living.",
    },
    {
      question: "Are there local taxes in Delaware?",
      answer:
        "Wilmington residents pay a city wage tax of 1.25%. This calculator covers state-level taxes; if you work in Wilmington, your actual take-home pay may be slightly lower.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Delaware State Tax (0%-6.6%) - Social Security (6.2%) - Medicare (1.45%).",
};
