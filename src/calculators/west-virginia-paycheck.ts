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

function calculateWestVirginiaStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 10000, rate: 0.0236 },
    { min: 10000, max: 25000, rate: 0.0315 },
    { min: 25000, max: 40000, rate: 0.0354 },
    { min: 40000, max: 60000, rate: 0.0472 },
    { min: 60000, max: Infinity, rate: 0.0512 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const westVirginiaPaycheckCalculator: CalculatorDefinition = {
  slug: "west-virginia-paycheck",
  title: "West Virginia Paycheck Calculator",
  description:
    "Calculate your take-home pay in West Virginia. West Virginia has graduated state income tax brackets with rates from 2.36% to 5.12% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "west virginia paycheck",
    "west virginia salary",
    "west virginia take home pay",
    "WV state tax",
    "west virginia income tax",
    "west virginia tax brackets",
  ],
  variants: [
    {
      slug: "west-virginia-paycheck",
      title: "West Virginia Paycheck Calculator",
      description:
        "Calculate your West Virginia take-home pay with graduated state income tax.",
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

        const stateTaxAnnual = calculateWestVirginiaStateTax(annualGross);
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
          "State Tax (WV)": formatNumber(stateTaxPerPeriod),
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
    "kentucky-paycheck",
    "delaware-paycheck",
    "arkansas-paycheck",
    "oklahoma-paycheck",
  ],
  faq: [
    {
      question: "What are West Virginia's state income tax rates for 2024?",
      answer:
        "West Virginia has five brackets: 2.36% on income up to $10,000, 3.15% up to $25,000, 3.54% up to $40,000, 4.72% up to $60,000, and 5.12% on income above $60,000.",
    },
    {
      question: "Is West Virginia reducing its income tax?",
      answer:
        "Yes, West Virginia has been gradually reducing its income tax rates as part of tax reform. The rates for 2024 are lower than previous years, and the state continues to explore further reductions.",
    },
    {
      question: "Does West Virginia have local income taxes?",
      answer:
        "No, West Virginia does not impose local or city income taxes. Your paycheck deductions include federal tax, state income tax, and FICA contributions only.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - West Virginia State Tax (2.36%-5.12%) - Social Security (6.2%) - Medicare (1.45%).",
};
