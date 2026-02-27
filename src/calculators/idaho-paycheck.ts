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

export const idahoPaycheckCalculator: CalculatorDefinition = {
  slug: "idaho-paycheck",
  title: "Idaho Paycheck Calculator",
  description:
    "Calculate your take-home pay in Idaho. Idaho has a flat state income tax rate of 5.8% for 2024, simplifying paycheck calculations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "idaho paycheck",
    "idaho salary",
    "idaho take home pay",
    "ID state tax",
    "idaho income tax",
    "idaho flat tax",
  ],
  variants: [
    {
      slug: "idaho-paycheck",
      title: "Idaho Paycheck Calculator",
      description: "Calculate your Idaho take-home pay with flat 5.8% state income tax.",
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

        const idahoFlatRate = 0.058;
        const stateTaxAnnual = annualGross * idahoFlatRate;
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
          "State Tax (ID - 5.8%)": formatNumber(stateTaxPerPeriod),
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
    "utah-paycheck",
    "montana-paycheck",
    "wyoming-paycheck",
    "nevada-paycheck",
  ],
  faq: [
    {
      question: "What is Idaho's state income tax rate for 2024?",
      answer:
        "Idaho has a flat state income tax rate of 5.8% for 2024. This applies to all taxable income regardless of how much you earn.",
    },
    {
      question: "Does Idaho have any local income taxes?",
      answer:
        "No, Idaho does not impose local or city income taxes. Your paycheck deductions include federal tax, the flat 5.8% state tax, and FICA contributions.",
    },
    {
      question: "When did Idaho switch to a flat tax?",
      answer:
        "Idaho moved to a flat income tax rate starting in 2023, replacing its previous graduated bracket system. The flat rate simplifies withholding calculations.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Idaho State Tax (5.8% flat) - Social Security (6.2%) - Medicare (1.45%).",
};
