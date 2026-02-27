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

function calculateKansasStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 30000, rate: 0.031 },
          { min: 30000, max: 60000, rate: 0.0525 },
          { min: 60000, max: Infinity, rate: 0.057 },
        ]
      : [
          { min: 0, max: 15000, rate: 0.031 },
          { min: 15000, max: 30000, rate: 0.0525 },
          { min: 30000, max: Infinity, rate: 0.057 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const kansasPaycheckCalculator: CalculatorDefinition = {
  slug: "kansas-paycheck",
  title: "Kansas Paycheck Calculator",
  description:
    "Calculate your take-home pay in Kansas. Kansas has graduated state income tax brackets with rates of 3.1%, 5.25%, and 5.7% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "kansas paycheck",
    "kansas salary",
    "kansas take home pay",
    "KS state tax",
    "kansas income tax",
    "kansas tax brackets",
  ],
  variants: [
    {
      slug: "kansas-paycheck",
      title: "Kansas Paycheck Calculator",
      description: "Calculate your Kansas take-home pay with state income tax brackets.",
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

        const stateTaxAnnual = calculateKansasStateTax(annualGross, filingStatus);
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
          "State Tax (KS)": formatNumber(stateTaxPerPeriod),
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
    "nebraska-paycheck",
    "oklahoma-paycheck",
    "iowa-paycheck",
    "arkansas-paycheck",
  ],
  faq: [
    {
      question: "What are Kansas's state income tax rates for 2024?",
      answer:
        "Kansas has three brackets: 3.1% on income up to $15,000 (single) or $30,000 (married), 5.25% on the next $15,000/$30,000, and 5.7% on income above $30,000 (single) or $60,000 (married).",
    },
    {
      question: "Does Kansas have local income taxes?",
      answer:
        "No, Kansas does not impose local or city income taxes. Your paycheck deductions include only federal tax, state tax, and FICA contributions.",
    },
    {
      question: "Is Kansas FICA the same as other states?",
      answer:
        "Yes. FICA taxes (Social Security at 6.2% and Medicare at 1.45%) are federal and apply equally in all states. The Social Security wage base for 2024 is $168,600.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Kansas State Tax (3.1%-5.7%) - Social Security (6.2%) - Medicare (1.45%).",
};
