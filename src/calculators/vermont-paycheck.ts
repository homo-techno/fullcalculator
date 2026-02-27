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

function calculateVermontStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 77450, rate: 0.0335 },
          { min: 77450, max: 187150, rate: 0.066 },
          { min: 187150, max: 259500, rate: 0.076 },
          { min: 259500, max: Infinity, rate: 0.0875 },
        ]
      : [
          { min: 0, max: 45400, rate: 0.0335 },
          { min: 45400, max: 110450, rate: 0.066 },
          { min: 110450, max: 229550, rate: 0.076 },
          { min: 229550, max: Infinity, rate: 0.0875 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const vermontPaycheckCalculator: CalculatorDefinition = {
  slug: "vermont-paycheck",
  title: "Vermont Paycheck Calculator",
  description:
    "Calculate your take-home pay in Vermont. Vermont has graduated state income tax brackets with rates from 3.35% to 8.75% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "vermont paycheck",
    "vermont salary",
    "vermont take home pay",
    "VT state tax",
    "vermont income tax",
    "vermont tax brackets",
  ],
  variants: [
    {
      slug: "vermont-paycheck",
      title: "Vermont Paycheck Calculator",
      description:
        "Calculate your Vermont take-home pay with graduated state income tax brackets.",
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

        const stateTaxAnnual = calculateVermontStateTax(annualGross, filingStatus);
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
          "State Tax (VT)": formatNumber(stateTaxPerPeriod),
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
    "new-hampshire-paycheck",
    "maine-paycheck",
    "connecticut-paycheck",
    "rhode-island-paycheck",
  ],
  faq: [
    {
      question: "What are Vermont's state income tax rates for 2024?",
      answer:
        "Vermont has four brackets: 3.35% on income up to $45,400 (single) or $77,450 (married), 6.6% on the next tier, 7.6% on the next, and a top rate of 8.75% on income above $229,550 (single) or $259,500 (married).",
    },
    {
      question: "How does Vermont's tax compare to neighboring New Hampshire?",
      answer:
        "Vermont has among the highest state income tax rates in the nation (up to 8.75%), while New Hampshire has no tax on earned income. This difference is a major consideration for workers near the state border.",
    },
    {
      question: "Does Vermont have local income taxes?",
      answer:
        "No, Vermont does not have local or municipal income taxes. Your paycheck deductions include federal tax, state income tax, and FICA contributions.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Vermont State Tax (3.35%-8.75%) - Social Security (6.2%) - Medicare (1.45%).",
};
