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

function calculateMontanaStateTax(annualIncome: number): number {
  let tax = 0;
  const brackets = [
    { min: 0, max: 20500, rate: 0.047 },
    { min: 20500, max: Infinity, rate: 0.059 },
  ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const montanaPaycheckCalculator: CalculatorDefinition = {
  slug: "montana-paycheck",
  title: "Montana Paycheck Calculator",
  description:
    "Calculate your take-home pay in Montana. Montana has graduated state income tax rates of 4.7% and 5.9% for 2024. Montana has no sales tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "montana paycheck",
    "montana salary",
    "montana take home pay",
    "MT state tax",
    "montana income tax",
    "montana no sales tax",
  ],
  variants: [
    {
      slug: "montana-paycheck",
      title: "Montana Paycheck Calculator",
      description:
        "Calculate your Montana take-home pay with graduated state income tax and no sales tax.",
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

        const stateTaxAnnual = calculateMontanaStateTax(annualGross);
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
          "State Tax (MT)": formatNumber(stateTaxPerPeriod),
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
    "idaho-paycheck",
    "wyoming-paycheck",
    "north-dakota-paycheck",
    "oregon-paycheck",
  ],
  faq: [
    {
      question: "What are Montana's state income tax rates for 2024?",
      answer:
        "Montana has two brackets for 2024: 4.7% on income up to $20,500 and 5.9% on income above $20,500. Montana recently simplified from seven brackets to two.",
    },
    {
      question: "Does Montana have a sales tax?",
      answer:
        "No. Montana is one of five states with no general sales tax. While this does not affect your paycheck directly, it reduces your overall cost of living and effective tax burden.",
    },
    {
      question: "Are there any local taxes in Montana?",
      answer:
        "Montana does not have local income taxes. Some resort areas may have local resort taxes on goods and services, but these do not affect paycheck withholding.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Montana State Tax (4.7%-5.9%) - Social Security (6.2%) - Medicare (1.45%).",
};
