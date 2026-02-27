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

function calculateOregonStateTax(annualIncome: number, filingStatus: string): number {
  let tax = 0;
  const brackets =
    filingStatus === "married"
      ? [
          { min: 0, max: 7300, rate: 0.0475 },
          { min: 7300, max: 18400, rate: 0.0675 },
          { min: 18400, max: 250000, rate: 0.0875 },
          { min: 250000, max: Infinity, rate: 0.099 },
        ]
      : [
          { min: 0, max: 4050, rate: 0.0475 },
          { min: 4050, max: 10200, rate: 0.0675 },
          { min: 10200, max: 125000, rate: 0.0875 },
          { min: 125000, max: Infinity, rate: 0.099 },
        ];

  for (const bracket of brackets) {
    if (annualIncome <= bracket.min) break;
    const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

export const oregonPaycheckCalculator: CalculatorDefinition = {
  slug: "oregon-paycheck",
  title: "Oregon Paycheck Calculator",
  description:
    "Calculate your take-home pay in Oregon. Oregon has high state income tax rates (4.75% to 9.9%), a statewide transit tax, and no sales tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "oregon paycheck",
    "oregon salary",
    "oregon take home pay",
    "OR state tax",
    "oregon income tax",
    "oregon transit tax",
    "oregon no sales tax",
  ],
  variants: [
    {
      slug: "oregon-paycheck",
      title: "Oregon Paycheck Calculator",
      description:
        "Calculate your Oregon take-home pay with state income tax, transit tax, and no sales tax.",
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

        const stateTaxAnnual = calculateOregonStateTax(annualGross, filingStatus);
        const stateTaxPerPeriod = stateTaxAnnual / payFrequency;

        const ssRate = 0.062;
        const medicareRate = 0.0145;
        const ssTax = grossPay * ssRate;
        const medicareTax = grossPay * medicareRate;
        const ficaTotal = ssTax + medicareTax;

        const statewideTransitTaxRate = 0.001;
        const transitTax = grossPay * statewideTransitTaxRate;

        const totalDeductions = federalTaxPerPeriod + stateTaxPerPeriod + ficaTotal + transitTax;
        const netPay = grossPay - totalDeductions;

        return {
          "Gross Pay (Per Period)": formatNumber(grossPay),
          "Federal Tax": formatNumber(federalTaxPerPeriod),
          "State Tax (OR)": formatNumber(stateTaxPerPeriod),
          "Social Security (6.2%)": formatNumber(ssTax),
          "Medicare (1.45%)": formatNumber(medicareTax),
          "Total FICA": formatNumber(ficaTotal),
          "OR Statewide Transit Tax (0.1%)": formatNumber(transitTax),
          "Total Deductions": formatNumber(totalDeductions),
          "Net Take-Home Pay": formatNumber(netPay),
          "Effective Tax Rate": formatNumber((totalDeductions / grossPay) * 100) + "%",
        };
      },
    },
  ],
  relatedSlugs: [
    "hawaii-paycheck",
    "montana-paycheck",
    "idaho-paycheck",
    "nevada-paycheck",
  ],
  faq: [
    {
      question: "What are Oregon's state income tax rates for 2024?",
      answer:
        "Oregon has four brackets: 4.75%, 6.75%, 8.75%, and a top rate of 9.9% on income above $125,000 (single) or $250,000 (married). Oregon is one of the highest income tax states.",
    },
    {
      question: "What is Oregon's Statewide Transit Tax?",
      answer:
        "Oregon imposes a 0.1% (one-tenth of one percent) statewide transit tax on wages. This is a flat rate applied to all wages with no cap, and is withheld from every paycheck.",
    },
    {
      question: "Does Oregon have a sales tax?",
      answer:
        "No. Oregon is one of five states with no general sales tax. While your paycheck deductions are higher due to state income tax, the lack of sales tax offsets some of that burden in day-to-day spending.",
    },
  ],
  formula:
    "Net Pay = Gross Pay - Federal Tax - Oregon State Tax (4.75%-9.9%) - Social Security (6.2%) - Medicare (1.45%) - OR Transit Tax (0.1%).",
};
