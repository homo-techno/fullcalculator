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

export const newHampshirePaycheckCalculator: CalculatorDefinition = {
  slug: "new-hampshire-paycheck",
  title: "New Hampshire Paycheck Calculator",
  description:
    "Calculate your take-home pay in New Hampshire. New Hampshire has no tax on earned income (wages and salaries). The state previously taxed interest and dividends, but that tax was fully phased out in 2025.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "new hampshire paycheck",
    "new hampshire salary",
    "new hampshire take home pay",
    "NH no income tax",
    "new hampshire wages",
    "NH paycheck calculator",
  ],
  variants: [
    {
      slug: "new-hampshire-paycheck",
      title: "New Hampshire Paycheck Calculator",
      description:
        "Calculate your New Hampshire take-home pay with no state tax on earned income.",
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
          "State Tax (NH)": formatNumber(stateTax),
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
    "nevada-paycheck",
    "maine-paycheck",
    "vermont-paycheck",
  ],
  faq: [
    {
      question: "Does New Hampshire tax wages and salaries?",
      answer:
        "No. New Hampshire does not tax earned income such as wages, salaries, or self-employment income. Your paycheck deductions include only federal income tax and FICA.",
    },
    {
      question: "What about the New Hampshire Interest and Dividends Tax?",
      answer:
        "New Hampshire previously had a 5% tax on interest and dividend income, but this tax has been fully phased out as of January 1, 2025. It never applied to wages or salary.",
    },
    {
      question: "How does New Hampshire compare to neighboring Maine and Vermont?",
      answer:
        "New Hampshire has a significant paycheck advantage over Maine (5.8%-7.15%) and Vermont (3.35%-8.75%) since there is no state tax on earned income. Many workers in the region live in NH for this benefit.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Social Security (6.2%) - Medicare (1.45%). New Hampshire has no tax on earned income.",
};
