import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function calculateFederalTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  let brackets: { min: number; max: number; rate: number }[];

  if (filingStatus === "married") {
    brackets = [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ];
  } else {
    brackets = [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ];
  }

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const alaskaPaycheckCalculator: CalculatorDefinition = {
  slug: "alaska-paycheck",
  title: "Alaska Paycheck Calculator",
  description:
    "Calculate your take-home pay in Alaska. Alaska has no state income tax, making it one of the most tax-friendly states for workers. Residents may also receive the Permanent Fund Dividend (PFD).",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "alaska paycheck",
    "alaska salary",
    "alaska take home pay",
    "alaska no state tax",
    "alaska PFD",
    "alaska wages",
  ],
  variants: [
    {
      slug: "alaska-paycheck",
      title: "Alaska Paycheck Calculator",
      description: "Calculate your Alaska take-home pay with no state income tax.",
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

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const stateTax = 0;

        const totalDeductions = federalTaxPerPeriod + ficaTotal + stateTax;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (AK)": formatNumber(stateTax),
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
    "nevada-paycheck",
    "wyoming-paycheck",
    "south-dakota-paycheck",
    "new-hampshire-paycheck",
  ],
  faq: [
    {
      question: "Does Alaska have a state income tax?",
      answer:
        "No. Alaska is one of the few states with no state income tax. Your paycheck deductions will only include federal income tax and FICA (Social Security and Medicare).",
    },
    {
      question: "What is the Alaska Permanent Fund Dividend (PFD)?",
      answer:
        "The PFD is an annual payment to Alaska residents from investment earnings of the state's oil wealth. The amount varies each year. While it is not a paycheck deduction, it is taxable as income on your federal return.",
    },
    {
      question: "What federal tax brackets apply to Alaska residents in 2024?",
      answer:
        "Alaska residents use the same federal brackets as all U.S. taxpayers. For single filers in 2024, rates range from 10% (up to $11,600) to 37% (over $609,350). Married filing jointly brackets are roughly double.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Social Security (6.2%) - Medicare (1.45%). Alaska has no state income tax.",
};
