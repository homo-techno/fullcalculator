import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const payrollWithholdingCalculator: CalculatorDefinition = {
  slug: "payroll-withholding-calculator",
  title: "Payroll Withholding Calculator",
  description:
    "Free payroll withholding calculator. Calculate federal income tax, Social Security, Medicare, and state tax withholding for each paycheck.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "payroll withholding",
    "payroll tax calculator",
    "withholding calculator",
    "employee tax withholding",
    "payroll deductions",
  ],
  variants: [
    {
      id: "payroll-withholding",
      name: "Employee Payroll Withholding",
      description:
        "Calculate all payroll withholdings from a single paycheck",
      fields: [
        {
          name: "grossPay",
          label: "Gross Pay Per Period",
          type: "number",
          placeholder: "e.g. 3500",
          prefix: "$",
        },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Weekly (52/year)", value: "52" },
            { label: "Bi-weekly (26/year)", value: "26" },
            { label: "Semi-monthly (24/year)", value: "24" },
            { label: "Monthly (12/year)", value: "12" },
          ],
          defaultValue: "26",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
        {
          name: "preTax401k",
          label: "Pre-Tax 401(k) Per Period",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "preTaxHealth",
          label: "Pre-Tax Health Insurance Per Period",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const grossPay = inputs.grossPay as number;
        const freq = parseInt(inputs.payFrequency as string) || 26;
        const status = inputs.filingStatus as string;
        const stateRate = (inputs.stateTaxRate as number) || 0;
        const preTax401k = (inputs.preTax401k as number) || 0;
        const preTaxHealth = (inputs.preTaxHealth as number) || 0;

        if (!grossPay || grossPay <= 0) return null;

        const preTaxDeductions = preTax401k + preTaxHealth;
        const taxableGross = grossPay - preTaxDeductions;
        const annualTaxable = taxableGross * freq;

        const standardDeduction =
          status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
        const annualAfterStd = Math.max(0, annualTaxable - standardDeduction);

        const brackets =
          status === "married"
            ? [
                { limit: 23200, rate: 0.1 },
                { limit: 94300, rate: 0.12 },
                { limit: 201050, rate: 0.22 },
                { limit: 383900, rate: 0.24 },
                { limit: 487450, rate: 0.32 },
                { limit: 731200, rate: 0.35 },
                { limit: Infinity, rate: 0.37 },
              ]
            : [
                { limit: 11600, rate: 0.1 },
                { limit: 47150, rate: 0.12 },
                { limit: 100525, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243725, rate: 0.32 },
                { limit: 609350, rate: 0.35 },
                { limit: Infinity, rate: 0.37 },
              ];

        let annualFedTax = 0;
        let remaining = annualAfterStd;
        let prevLimit = 0;
        for (const bracket of brackets) {
          const taxable = Math.min(remaining, bracket.limit - prevLimit);
          if (taxable <= 0) break;
          annualFedTax += taxable * bracket.rate;
          remaining -= taxable;
          prevLimit = bracket.limit;
        }

        const fedWithholding = annualFedTax / freq;
        const ssWithholding = Math.min(grossPay, 168600 / freq) * 0.062;
        const medicareWithholding = grossPay * 0.0145;
        const stateWithholding = taxableGross * (stateRate / 100);
        const totalWithholding =
          fedWithholding +
          ssWithholding +
          medicareWithholding +
          stateWithholding;
        const netPay = grossPay - totalWithholding - preTaxDeductions;

        return {
          primary: {
            label: "Net Pay (Take-Home)",
            value: `$${formatNumber(netPay)}`,
          },
          details: [
            {
              label: "Gross pay",
              value: `$${formatNumber(grossPay)}`,
            },
            {
              label: "Federal withholding",
              value: `$${formatNumber(fedWithholding)}`,
            },
            {
              label: "Social Security (6.2%)",
              value: `$${formatNumber(ssWithholding)}`,
            },
            {
              label: "Medicare (1.45%)",
              value: `$${formatNumber(medicareWithholding)}`,
            },
            {
              label: "State withholding",
              value: `$${formatNumber(stateWithholding)}`,
            },
            {
              label: "Pre-tax deductions",
              value: `$${formatNumber(preTaxDeductions)}`,
            },
            {
              label: "Total withholding",
              value: `$${formatNumber(totalWithholding)}`,
            },
          ],
          note: "Pre-tax deductions (401k, health insurance) reduce your taxable income for federal and state taxes, but Social Security and Medicare are calculated on gross pay.",
        };
      },
    },
  ],
  relatedSlugs: [
    "paycheck-calculator",
    "w4-withholding-calculator",
    "employer-payroll-cost-calculator",
  ],
  faq: [
    {
      question: "What payroll taxes are withheld from my paycheck?",
      answer:
        "Federal income tax, Social Security tax (6.2%), Medicare tax (1.45%), and state/local income taxes are withheld. You may also have pre-tax deductions for 401(k), health insurance, and other benefits.",
    },
    {
      question: "Do pre-tax deductions reduce all payroll taxes?",
      answer:
        "Pre-tax deductions like 401(k) and health insurance reduce your federal and state income tax withholding, but Social Security and Medicare taxes are typically calculated on your full gross pay.",
    },
  ],
  formula:
    "Net Pay = Gross - Federal Tax - SS (6.2%) - Medicare (1.45%) - State Tax - Pre-Tax Deductions",
};
