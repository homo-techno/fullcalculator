import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quarterlyTaxCalculator: CalculatorDefinition = {
  slug: "quarterly-tax-calculator",
  title: "Quarterly Estimated Tax Calculator",
  description:
    "Free quarterly estimated tax calculator. Calculate your quarterly estimated tax payments to avoid IRS underpayment penalties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "quarterly tax calculator",
    "estimated tax payments",
    "1040-ES calculator",
    "quarterly tax due",
    "estimated tax penalty",
  ],
  variants: [
    {
      id: "quarterly-estimate",
      name: "Quarterly Estimated Tax Payment",
      description:
        "Calculate quarterly estimated tax payments based on expected income",
      fields: [
        {
          name: "expectedIncome",
          label: "Expected Annual Income",
          type: "number",
          placeholder: "e.g. 120000",
          prefix: "$",
        },
        {
          name: "withheld",
          label: "Total Tax Already Withheld (YTD)",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 0,
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
          name: "selfEmployed",
          label: "Self-Employed?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          defaultValue: "no",
        },
        {
          name: "priorYearTax",
          label: "Prior Year Tax Liability",
          type: "number",
          placeholder: "e.g. 20000",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const income = inputs.expectedIncome as number;
        const withheld = (inputs.withheld as number) || 0;
        const status = inputs.filingStatus as string;
        const selfEmployed = inputs.selfEmployed === "yes";
        const priorYearTax = (inputs.priorYearTax as number) || 0;

        if (!income || income <= 0) return null;

        let seTax = 0;
        let seDeduction = 0;
        if (selfEmployed) {
          const seTaxable = income * 0.9235;
          const ss = Math.min(seTaxable, 168600) * 0.124;
          const med = seTaxable * 0.029;
          seTax = ss + med;
          seDeduction = seTax / 2;
        }

        const standardDeduction =
          status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
        const taxableIncome = Math.max(
          0,
          income - standardDeduction - seDeduction
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
            : [
                { limit: 11600, rate: 0.1 },
                { limit: 47150, rate: 0.12 },
                { limit: 100525, rate: 0.22 },
                { limit: 191950, rate: 0.24 },
                { limit: 243725, rate: 0.32 },
                { limit: 609350, rate: 0.35 },
                { limit: Infinity, rate: 0.37 },
              ];

        let federalTax = 0;
        let remaining = taxableIncome;
        let prevLimit = 0;
        for (const bracket of brackets) {
          const taxable = Math.min(remaining, bracket.limit - prevLimit);
          if (taxable <= 0) break;
          federalTax += taxable * bracket.rate;
          remaining -= taxable;
          prevLimit = bracket.limit;
        }

        const totalTax = federalTax + seTax;
        const remainingTax = Math.max(0, totalTax - withheld);

        const safeHarbor = Math.min(totalTax * 0.9, priorYearTax > 0 ? priorYearTax : totalTax);
        const requiredPayments = Math.max(0, safeHarbor - withheld);
        const quarterlyPayment = requiredPayments / 4;
        const evenQuarterly = remainingTax / 4;

        return {
          primary: {
            label: "Quarterly Payment Due",
            value: `$${formatNumber(evenQuarterly)}`,
          },
          details: [
            {
              label: "Total estimated annual tax",
              value: `$${formatNumber(totalTax)}`,
            },
            {
              label: "Federal income tax",
              value: `$${formatNumber(federalTax)}`,
            },
            {
              label: "Self-employment tax",
              value: `$${formatNumber(seTax)}`,
            },
            {
              label: "Already withheld",
              value: `$${formatNumber(withheld)}`,
            },
            {
              label: "Remaining tax owed",
              value: `$${formatNumber(remainingTax)}`,
            },
            {
              label: "Safe harbor quarterly minimum",
              value: `$${formatNumber(quarterlyPayment)}`,
            },
          ],
          note: "Quarterly payments are due April 15, June 15, September 15, and January 15 of the following year. Pay at least the safe harbor amount to avoid underpayment penalties.",
        };
      },
    },
  ],
  relatedSlugs: [
    "1099-tax-calculator",
    "tax-calculator",
    "paycheck-calculator",
  ],
  faq: [
    {
      question: "Who needs to make quarterly estimated tax payments?",
      answer:
        "You must make quarterly payments if you expect to owe at least $1,000 in tax after subtracting withholding and credits. This commonly applies to freelancers, self-employed individuals, and those with significant investment income.",
    },
    {
      question: "What is the safe harbor rule for estimated taxes?",
      answer:
        "You can avoid underpayment penalties by paying at least 90% of your current year tax liability or 100% of your prior year liability (110% if AGI exceeds $150,000), whichever is smaller.",
    },
  ],
  formula:
    "Quarterly Payment = (Total Estimated Tax - Withholding) / 4",
};
