import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const w4WithholdingCalculator: CalculatorDefinition = {
  slug: "w4-withholding-calculator",
  title: "W-4 Withholding Calculator",
  description:
    "Free W-4 withholding calculator. Estimate your federal income tax withholding based on your W-4 form selections, filing status, and pay frequency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "w4 calculator",
    "withholding calculator",
    "federal withholding",
    "w-4 form calculator",
    "tax withholding estimator",
  ],
  variants: [
    {
      id: "w4-estimate",
      name: "W-4 Withholding Estimator",
      description:
        "Estimate federal income tax withholding per paycheck based on W-4 inputs",
      fields: [
        {
          name: "grossPay",
          label: "Gross Pay Per Period",
          type: "number",
          placeholder: "e.g. 3000",
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
            { label: "Single or Married Filing Separately", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "extraWithholding",
          label: "Extra Withholding (Step 4c)",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "dependentCredits",
          label: "Total Dependent Credits (Step 3)",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherIncome",
          label: "Other Income (Step 4a, annual)",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "deductions",
          label: "Deductions Beyond Standard (Step 4b, annual)",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const grossPay = inputs.grossPay as number;
        const freq = parseInt(inputs.payFrequency as string) || 26;
        const status = inputs.filingStatus as string;
        const extra = (inputs.extraWithholding as number) || 0;
        const depCredits = (inputs.dependentCredits as number) || 0;
        const otherIncome = (inputs.otherIncome as number) || 0;
        const deductionsExtra = (inputs.deductions as number) || 0;

        if (!grossPay || grossPay <= 0) return null;

        const annualGross = grossPay * freq + otherIncome;
        const standardDeduction =
          status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
        const adjustedAnnual = Math.max(
          0,
          annualGross - standardDeduction - deductionsExtra
        );

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
            : status === "hoh"
              ? [
                  { limit: 16550, rate: 0.1 },
                  { limit: 63100, rate: 0.12 },
                  { limit: 100500, rate: 0.22 },
                  { limit: 191950, rate: 0.24 },
                  { limit: 243700, rate: 0.32 },
                  { limit: 609350, rate: 0.35 },
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

        let annualTax = 0;
        let remaining = adjustedAnnual;
        let prevLimit = 0;
        for (const bracket of brackets) {
          const taxable = Math.min(remaining, bracket.limit - prevLimit);
          if (taxable <= 0) break;
          annualTax += taxable * bracket.rate;
          remaining -= taxable;
          prevLimit = bracket.limit;
        }

        const annualTaxAfterCredits = Math.max(0, annualTax - depCredits);
        const withholdingPerPeriod = annualTaxAfterCredits / freq + extra;

        return {
          primary: {
            label: "Federal Withholding Per Paycheck",
            value: `$${formatNumber(withholdingPerPeriod)}`,
          },
          details: [
            {
              label: "Annual estimated tax",
              value: `$${formatNumber(annualTaxAfterCredits)}`,
            },
            {
              label: "Annual gross income",
              value: `$${formatNumber(annualGross)}`,
            },
            {
              label: "Standard deduction",
              value: `$${formatNumber(standardDeduction)}`,
            },
            {
              label: "Adjusted taxable income",
              value: `$${formatNumber(adjustedAnnual)}`,
            },
            {
              label: "Dependent credit reduction",
              value: `$${formatNumber(depCredits)}`,
            },
            {
              label: "Extra withholding per period",
              value: `$${formatNumber(extra)}`,
            },
          ],
          note: "This is an estimate based on 2024 federal brackets. Actual withholding depends on your employer's payroll system and any additional state withholding.",
        };
      },
    },
  ],
  relatedSlugs: [
    "paycheck-calculator",
    "tax-calculator",
    "payroll-withholding-calculator",
  ],
  faq: [
    {
      question: "What is a W-4 form?",
      answer:
        "The W-4 (Employee's Withholding Certificate) tells your employer how much federal income tax to withhold from your paycheck. You fill it out when starting a new job or when your financial situation changes.",
    },
    {
      question: "How do I reduce my tax withholding?",
      answer:
        "You can reduce withholding by claiming dependents in Step 3, claiming additional deductions in Step 4(b), or by adjusting your filing status. Be careful not to under-withhold, as you may owe penalties at tax time.",
    },
  ],
  formula:
    "Withholding = (Annual Tax on Adjusted Income - Dependent Credits) / Pay Periods + Extra Withholding",
};
