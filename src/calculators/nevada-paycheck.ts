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

export const nevadaPaycheckCalculator: CalculatorDefinition = {
  slug: "nevada-paycheck",
  title: "Nevada Paycheck Calculator",
  description:
    "Calculate your take-home pay in Nevada. Nevada has no state income tax, making it one of the most favorable states for workers keeping more of their paycheck.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "nevada paycheck",
    "nevada salary",
    "nevada take home pay",
    "nevada no state tax",
    "las vegas paycheck",
    "NV paycheck calculator",
  ],
  variants: [
    {
      slug: "nevada-paycheck",
      title: "Nevada Paycheck Calculator",
      description: "Calculate your Nevada take-home pay with no state income tax.",
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
          "State Tax (NV)": formatNumber(stateTax),
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
    "alaska-paycheck",
    "wyoming-paycheck",
    "south-dakota-paycheck",
    "new-hampshire-paycheck",
  ],
  faq: [
    {
      question: "Does Nevada have a state income tax?",
      answer:
        "No. Nevada is one of the states with no state income tax. Your paycheck deductions will only include federal income tax and FICA (Social Security and Medicare).",
    },
    {
      question: "How does Nevada fund its government without income tax?",
      answer:
        "Nevada relies heavily on sales tax, gaming taxes, and tourism-related revenue. The state has a sales tax rate that varies by county, typically between 6.85% and 8.375%.",
    },
    {
      question: "Are there any other payroll taxes in Nevada?",
      answer:
        "Nevada does not impose any state-level payroll taxes on employees. However, employers pay a Modified Business Tax on wages. Your only paycheck deductions are federal tax and FICA.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Social Security (6.2%) - Medicare (1.45%). Nevada has no state income tax.",
};
