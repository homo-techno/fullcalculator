import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hsaTaxSavingsCalculator: CalculatorDefinition = {
  slug: "hsa-tax-savings-calculator",
  title: "HSA Tax Savings Calculator",
  description:
    "Free HSA tax savings calculator. Calculate the triple tax advantage of a Health Savings Account including income tax, FICA, and investment growth savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "HSA tax savings",
    "health savings account",
    "HSA calculator",
    "HSA triple tax benefit",
    "HSA contribution limit",
  ],
  variants: [
    {
      id: "hsa-savings",
      name: "HSA Tax Savings Estimator",
      description:
        "Calculate the tax savings from contributing to a Health Savings Account",
      fields: [
        {
          name: "annualContribution",
          label: "Annual HSA Contribution",
          type: "number",
          placeholder: "e.g. 4150",
          prefix: "$",
        },
        {
          name: "coverageType",
          label: "Coverage Type",
          type: "select",
          options: [
            { label: "Self-only (max $4,150)", value: "self" },
            { label: "Family (max $8,300)", value: "family" },
          ],
          defaultValue: "self",
        },
        {
          name: "age55",
          label: "Age 55 or Older?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes (+$1,000 catch-up)", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "marginalRate",
          label: "Federal Marginal Tax Rate",
          type: "select",
          options: [
            { label: "10%", value: "10" },
            { label: "12%", value: "12" },
            { label: "22%", value: "22" },
            { label: "24%", value: "24" },
            { label: "32%", value: "32" },
            { label: "35%", value: "35" },
            { label: "37%", value: "37" },
          ],
          defaultValue: "22",
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
          name: "yearsToInvest",
          label: "Years to Invest & Grow",
          type: "number",
          placeholder: "e.g. 20",
          defaultValue: 20,
          min: 1,
          max: 50,
        },
        {
          name: "expectedReturn",
          label: "Expected Annual Return",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "%",
          defaultValue: 7,
        },
      ],
      calculate: (inputs) => {
        const contribution = inputs.annualContribution as number;
        const coverageType = inputs.coverageType as string;
        const age55 = inputs.age55 === "yes";
        const fedRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;
        const stateRate = (inputs.stateTaxRate as number) || 0;
        const years = (inputs.yearsToInvest as number) || 20;
        const returnRate = ((inputs.expectedReturn as number) || 7) / 100;

        if (!contribution || contribution <= 0) return null;

        const maxContribution =
          (coverageType === "family" ? 8300 : 4150) + (age55 ? 1000 : 0);
        const actualContribution = Math.min(contribution, maxContribution);

        const ficaRate = 0.0765;
        const totalStateRate = stateRate / 100;

        // Annual tax savings
        const fedSavings = actualContribution * fedRate;
        const stateSavings = actualContribution * totalStateRate;
        const ficaSavings = actualContribution * ficaRate;
        const annualTaxSavings = fedSavings + stateSavings + ficaSavings;

        // Future value of invested HSA
        const futureValue =
          actualContribution *
          ((Math.pow(1 + returnRate, years) - 1) / returnRate) *
          (1 + returnRate);

        const totalContributions = actualContribution * years;
        const totalGrowth = futureValue - totalContributions;
        const taxOnGrowthAvoided = totalGrowth * (fedRate + totalStateRate);
        const totalTaxSavingsOverTime =
          annualTaxSavings * years + taxOnGrowthAvoided;

        return {
          primary: {
            label: "Annual Tax Savings",
            value: `$${formatNumber(annualTaxSavings)}`,
          },
          details: [
            {
              label: "Federal income tax savings",
              value: `$${formatNumber(fedSavings)}`,
            },
            {
              label: "State income tax savings",
              value: `$${formatNumber(stateSavings)}`,
            },
            {
              label: "FICA tax savings (7.65%)",
              value: `$${formatNumber(ficaSavings)}`,
            },
            {
              label: "Contribution (capped at limit)",
              value: `$${formatNumber(actualContribution)} of $${formatNumber(maxContribution)} max`,
            },
            {
              label: `HSA value in ${years} years`,
              value: `$${formatNumber(futureValue)}`,
            },
            {
              label: `Total tax savings over ${years} years`,
              value: `$${formatNumber(totalTaxSavingsOverTime)}`,
            },
          ],
          note: "HSAs offer a triple tax advantage: (1) tax-deductible contributions, (2) tax-free investment growth, and (3) tax-free withdrawals for qualified medical expenses. After age 65, non-medical withdrawals are taxed as ordinary income (like a traditional IRA).",
        };
      },
    },
  ],
  relatedSlugs: [
    "fsa-savings-calculator",
    "medical-expense-deduction-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "What is the triple tax advantage of an HSA?",
      answer:
        "HSAs provide three tax benefits: (1) contributions are tax-deductible (reducing income, FICA, and state tax), (2) investment growth is tax-free, and (3) withdrawals for qualified medical expenses are tax-free. This makes HSAs one of the most tax-advantaged accounts available.",
    },
    {
      question: "What are the HSA contribution limits?",
      answer:
        "For 2024, the HSA contribution limit is $4,150 for self-only coverage and $8,300 for family coverage. If you are 55 or older, you can contribute an additional $1,000 catch-up contribution.",
    },
  ],
  formula:
    "Annual Savings = Contribution x (Federal Rate + State Rate + FICA 7.65%)",
};
