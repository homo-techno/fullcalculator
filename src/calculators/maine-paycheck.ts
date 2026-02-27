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

function calculateMaineStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 47025, rate: 0.058 },
          { min: 47025, max: 111500, rate: 0.0675 },
          { min: 111500, max: Infinity, rate: 0.0715 },
        ]
      : [
          { min: 0, max: 24500, rate: 0.058 },
          { min: 24500, max: 58050, rate: 0.0675 },
          { min: 58050, max: Infinity, rate: 0.0715 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const mainePaycheckCalculator: CalculatorDefinition = {
  slug: "maine-paycheck",
  title: "Maine Paycheck Calculator",
  description:
    "Calculate your take-home pay in Maine. Maine has graduated state income tax brackets with rates of 5.8%, 6.75%, and 7.15% for 2024.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "maine paycheck",
    "maine salary",
    "maine take home pay",
    "ME state tax",
    "maine income tax",
    "maine tax brackets",
  ],
  variants: [
    {
      slug: "maine-paycheck",
      title: "Maine Paycheck Calculator",
      description: "Calculate your Maine take-home pay with graduated state income tax brackets.",
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

        const stateTaxAnnual = calculateMaineStateTax(annualGross, filingStatus);
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
          "State Tax (ME)": formatNumber(stateTaxPerPeriod),
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
    "vermont-paycheck",
    "new-hampshire-paycheck",
    "connecticut-paycheck",
    "rhode-island-paycheck",
  ],
  faq: [
    {
      question: "What are Maine's state income tax rates for 2024?",
      answer:
        "Maine has three brackets: 5.8% on income up to $24,500 (single) or $47,025 (married), 6.75% on the next tier, and 7.15% on income above $58,050 (single) or $111,500 (married).",
    },
    {
      question: "Does Maine have local income taxes?",
      answer:
        "No, Maine does not impose local or municipal income taxes. Your paycheck deductions include federal tax, state income tax, and FICA.",
    },
    {
      question: "How does Maine's tax burden compare to New Hampshire?",
      answer:
        "Maine has significantly higher income taxes compared to New Hampshire, which has no tax on earned income. However, Maine offers more state-funded services. Many border residents weigh these differences.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Maine State Tax (5.8%-7.15%) - Social Security (6.2%) - Medicare (1.45%).",
};
