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

function calculateConnecticutStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 20000, rate: 0.02 },
          { min: 20000, max: 100000, rate: 0.045 },
          { min: 100000, max: 200000, rate: 0.055 },
          { min: 200000, max: 400000, rate: 0.06 },
          { min: 400000, max: 800000, rate: 0.065 },
          { min: 800000, max: Infinity, rate: 0.069 },
        ]
      : [
          { min: 0, max: 10000, rate: 0.02 },
          { min: 10000, max: 50000, rate: 0.045 },
          { min: 50000, max: 100000, rate: 0.055 },
          { min: 100000, max: 200000, rate: 0.06 },
          { min: 200000, max: 500000, rate: 0.065 },
          { min: 500000, max: Infinity, rate: 0.069 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const connecticutPaycheckCalculator: CalculatorDefinition = {
  slug: "connecticut-paycheck",
  title: "Connecticut Paycheck Calculator",
  description:
    "Calculate your take-home pay in Connecticut. Connecticut has graduated state income tax rates from 2% to 6.9%, plus a mandatory Paid Family and Medical Leave (PFMLA) contribution.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "connecticut paycheck",
    "connecticut salary",
    "connecticut take home pay",
    "CT state tax",
    "CT PFMLA",
    "connecticut income tax",
  ],
  variants: [
    {
      slug: "connecticut-paycheck",
      title: "Connecticut Paycheck Calculator",
      description:
        "Calculate your Connecticut take-home pay including state income tax and PFMLA.",
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

        const stateTaxAnnual = calculateConnecticutStateTax(annualGross, filingStatus);
        const stateTaxPerPeriod = stateTaxAnnual / payFrequency;

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const pfmlaRate = 0.005;
        const pfmla = grossPay * pfmlaRate;

        const totalDeductions = federalTaxPerPeriod + stateTaxPerPeriod + ficaTotal + pfmla;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (CT)": formatNumber(stateTaxPerPeriod),
          "Social Security (6.2%)": formatNumber(ssTax),
          "Medicare (1.45%)": formatNumber(medicareTax),
          "Total FICA": formatNumber(ficaTotal),
          "CT PFMLA (0.5%)": formatNumber(pfmla),
          "Total Deductions": formatNumber(totalDeductions),
          "Net Take-Home Pay": formatNumber(netPay),
          "Effective Tax Rate": formatNumber((totalDeductions / grossPay) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "rhode-island-paycheck",
    "vermont-paycheck",
    "maine-paycheck",
    "new-hampshire-paycheck",
  ],
  faq: [
    {
      question: "What is the Connecticut PFMLA deduction?",
      answer:
        "Connecticut's Paid Family and Medical Leave Act (PFMLA) requires employees to contribute 0.5% of their wages. This funds the state's paid leave program for qualifying family and medical events.",
    },
    {
      question: "What are Connecticut's state income tax rates for 2024?",
      answer:
        "Connecticut uses graduated brackets. For single filers, rates range from 2% on the first $10,000 to 6.9% on income over $500,000. Married filing jointly brackets have higher thresholds.",
    },
    {
      question: "Are there any local income taxes in Connecticut?",
      answer:
        "No, Connecticut does not have local or municipal income taxes. However, the state PFMLA contribution is an additional payroll deduction beyond regular state income tax.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - CT State Tax (2%-6.9%) - Social Security (6.2%) - Medicare (1.45%) - CT PFMLA (0.5%).",
};
