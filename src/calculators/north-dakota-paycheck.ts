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

function calculateNorthDakotaStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 44725, rate: 0.0 },
          { min: 44725, max: 225975, rate: 0.0195 },
          { min: 225975, max: Infinity, rate: 0.025 },
        ]
      : [
          { min: 0, max: 44725, rate: 0.0 },
          { min: 44725, max: 225975, rate: 0.0195 },
          { min: 225975, max: Infinity, rate: 0.025 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const northDakotaPaycheckCalculator: CalculatorDefinition = {
  slug: "north-dakota-paycheck",
  title: "North Dakota Paycheck Calculator",
  description:
    "Calculate your take-home pay in North Dakota. North Dakota has very low state income tax rates with a 0% rate on the first $44,725 and top rate of just 2.5% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "north dakota paycheck",
    "north dakota salary",
    "north dakota take home pay",
    "ND state tax",
    "north dakota income tax",
    "north dakota tax brackets",
  ],
  variants: [
    {
      slug: "north-dakota-paycheck",
      title: "North Dakota Paycheck Calculator",
      description:
        "Calculate your North Dakota take-home pay with very low state income tax rates.",
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

        const stateTaxAnnual = calculateNorthDakotaStateTax(annualGross, filingStatus);
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
          "State Tax (ND)": formatNumber(stateTaxPerPeriod),
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
    "south-dakota-paycheck",
    "montana-paycheck",
    "nebraska-paycheck",
    "wyoming-paycheck",
  ],
  faq: [
    {
      question: "What are North Dakota's state income tax rates for 2024?",
      answer:
        "North Dakota has some of the lowest state income tax rates in the nation. The first $44,725 is taxed at 0%, income from $44,725 to $225,975 at 1.95%, and income above $225,975 at 2.5%.",
    },
    {
      question: "Is North Dakota considering eliminating its income tax?",
      answer:
        "North Dakota has discussed eliminating its state income tax entirely. The state already has very low rates and a large exemption, making the effective tax burden minimal for most residents.",
    },
    {
      question: "Does North Dakota have local income taxes?",
      answer:
        "No, North Dakota does not have local or municipal income taxes. Your paycheck deductions include only federal tax, the low state income tax, and FICA.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - North Dakota State Tax (0%-2.5%) - Social Security (6.2%) - Medicare (1.45%).",
};
