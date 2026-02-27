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

function calculateMississippiStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 10000, rate: 0.0 },
    { min: 10000, max: Infinity, rate: 0.047 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const mississippiPaycheckCalculator: CalculatorDefinition = {
  slug: "mississippi-paycheck",
  title: "Mississippi Paycheck Calculator",
  description:
    "Calculate your take-home pay in Mississippi. Mississippi has a flat-like state income tax with 0% on the first $10,000 and 4.7% on income above that for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mississippi paycheck",
    "mississippi salary",
    "mississippi take home pay",
    "MS state tax",
    "mississippi income tax",
    "mississippi tax brackets",
  ],
  variants: [
    {
      slug: "mississippi-paycheck",
      title: "Mississippi Paycheck Calculator",
      description: "Calculate your Mississippi take-home pay with state income tax brackets.",
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

        const stateTaxAnnual = calculateMississippiStateTax(annualGross);
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
          "State Tax (MS)": formatNumber(stateTaxPerPeriod),
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
    "kentucky-paycheck",
    "oklahoma-paycheck",
    "west-virginia-paycheck",
  ],
  faq: [
    {
      question: "What are Mississippi's state income tax rates for 2024?",
      answer:
        "Mississippi exempts the first $10,000 of taxable income from state tax. Income above $10,000 is taxed at a flat rate of 4.7%. The state has been simplifying its bracket structure in recent years.",
    },
    {
      question: "Does Mississippi have local income taxes?",
      answer:
        "No, Mississippi does not impose local or municipal income taxes. Your paycheck deductions include only federal tax, state tax, and FICA contributions.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Mississippi State Tax (0% on first $10K, 4.7% above) - Social Security (6.2%) - Medicare (1.45%).",
};
