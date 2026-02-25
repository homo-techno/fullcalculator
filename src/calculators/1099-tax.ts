import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const freelancerTaxCalculator: CalculatorDefinition = {
  slug: "1099-tax-calculator",
  title: "1099 Tax Calculator",
  description:
    "Free 1099 tax calculator for freelancers and self-employed. Estimate your self-employment tax, federal income tax, and quarterly payments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "1099 tax calculator",
    "freelancer tax calculator",
    "self employment tax",
    "independent contractor tax",
    "quarterly tax calculator",
  ],
  variants: [
    {
      id: "1099-estimate",
      name: "1099 Self-Employment Tax Estimator",
      description:
        "Estimate total tax liability for 1099 / freelance income",
      fields: [
        {
          name: "grossIncome",
          label: "Gross 1099 Income",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
        },
        {
          name: "businessExpenses",
          label: "Business Expenses",
          type: "number",
          placeholder: "e.g. 15000",
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
          name: "otherIncome",
          label: "Other W-2 / Income",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "stateTaxRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const gross = inputs.grossIncome as number;
        const expenses = (inputs.businessExpenses as number) || 0;
        const status = inputs.filingStatus as string;
        const otherIncome = (inputs.otherIncome as number) || 0;
        const stateRate = (inputs.stateTaxRate as number) || 0;

        if (!gross || gross <= 0) return null;

        const netSelfEmployment = gross - expenses;
        const seTaxableIncome = netSelfEmployment * 0.9235;
        const socialSecurity = Math.min(seTaxableIncome, 168600) * 0.124;
        const medicare = seTaxableIncome * 0.029;
        const additionalMedicare =
          seTaxableIncome > 200000
            ? (seTaxableIncome - 200000) * 0.009
            : 0;
        const selfEmploymentTax =
          socialSecurity + medicare + additionalMedicare;

        const seDeduction = selfEmploymentTax / 2;
        const standardDeduction =
          status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;
        const totalIncome = netSelfEmployment + otherIncome;
        const taxableIncome = Math.max(
          0,
          totalIncome - standardDeduction - seDeduction
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

        const stateTax = totalIncome * (stateRate / 100);
        const totalTax = selfEmploymentTax + federalTax + stateTax;
        const quarterlyPayment = totalTax / 4;
        const effectiveRate = (totalTax / gross) * 100;

        return {
          primary: {
            label: "Total Estimated Tax",
            value: `$${formatNumber(totalTax)}`,
          },
          details: [
            {
              label: "Self-employment tax (SS + Medicare)",
              value: `$${formatNumber(selfEmploymentTax)}`,
            },
            {
              label: "Federal income tax",
              value: `$${formatNumber(federalTax)}`,
            },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            {
              label: "Quarterly estimated payment",
              value: `$${formatNumber(quarterlyPayment)}`,
            },
            {
              label: "Effective tax rate",
              value: `${formatNumber(effectiveRate)}%`,
            },
            {
              label: "Net after-tax income",
              value: `$${formatNumber(gross - totalTax)}`,
            },
          ],
          note: "This estimate includes self-employment tax (15.3%), federal income tax, and state tax. QBI deduction and other credits are not included.",
        };
      },
    },
  ],
  relatedSlugs: [
    "quarterly-tax-calculator",
    "tax-calculator",
    "paycheck-calculator",
  ],
  faq: [
    {
      question: "How much tax does a 1099 worker pay?",
      answer:
        "1099 workers pay self-employment tax of 15.3% (12.4% Social Security + 2.9% Medicare) on net earnings, plus federal and state income tax. The total effective rate is typically 25-40% depending on income.",
    },
    {
      question: "What is the self-employment tax deduction?",
      answer:
        "You can deduct 50% of your self-employment tax from your adjusted gross income. This reduces your income tax but not your SE tax itself.",
    },
  ],
  formula:
    "Total Tax = SE Tax (15.3% of 92.35% of net income) + Federal Income Tax + State Tax",
};
