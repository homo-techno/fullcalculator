import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fsaSavingsCalculator: CalculatorDefinition = {
  slug: "fsa-savings-calculator",
  title: "FSA Tax Savings Calculator",
  description:
    "Free FSA tax savings calculator. Estimate your tax savings from a Flexible Spending Account for healthcare or dependent care expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FSA tax savings",
    "flexible spending account",
    "FSA calculator",
    "healthcare FSA",
    "dependent care FSA",
  ],
  variants: [
    {
      id: "fsa-savings",
      name: "FSA Tax Savings Estimator",
      description:
        "Calculate tax savings from Healthcare FSA and/or Dependent Care FSA",
      fields: [
        {
          name: "fsaType",
          label: "FSA Type",
          type: "select",
          options: [
            { label: "Healthcare FSA", value: "healthcare" },
            { label: "Dependent Care FSA", value: "dependent" },
            { label: "Both", value: "both" },
          ],
          defaultValue: "healthcare",
        },
        {
          name: "healthcareFSA",
          label: "Healthcare FSA Contribution",
          type: "number",
          placeholder: "e.g. 3200",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "dependentCareFSA",
          label: "Dependent Care FSA Contribution",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          defaultValue: 0,
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
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "mfs" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const fsaType = inputs.fsaType as string;
        const healthFSA = (inputs.healthcareFSA as number) || 0;
        const depFSA = (inputs.dependentCareFSA as number) || 0;
        const fedRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;
        const stateRate = ((inputs.stateTaxRate as number) || 0) / 100;
        const status = inputs.filingStatus as string;

        const healthcareMax = 3200;
        const dependentMax = status === "mfs" ? 2500 : 5000;

        let healthContrib = 0;
        let depContrib = 0;

        if (fsaType === "healthcare" || fsaType === "both") {
          healthContrib = Math.min(healthFSA, healthcareMax);
        }
        if (fsaType === "dependent" || fsaType === "both") {
          depContrib = Math.min(depFSA, dependentMax);
        }

        const totalContribution = healthContrib + depContrib;

        if (totalContribution <= 0) return null;

        const ficaRate = 0.0765;
        const fedSavings = totalContribution * fedRate;
        const stateSavings = totalContribution * stateRate;
        const ficaSavings = totalContribution * ficaRate;
        const totalSavings = fedSavings + stateSavings + ficaSavings;

        const effectiveCost = totalContribution - totalSavings;
        const discountPercent = (totalSavings / totalContribution) * 100;

        return {
          primary: {
            label: "Total Tax Savings",
            value: `$${formatNumber(totalSavings)}`,
          },
          details: [
            {
              label: "Healthcare FSA contribution",
              value: `$${formatNumber(healthContrib)} (max $${formatNumber(healthcareMax)})`,
            },
            {
              label: "Dependent Care FSA contribution",
              value: `$${formatNumber(depContrib)} (max $${formatNumber(dependentMax)})`,
            },
            {
              label: "Federal tax savings",
              value: `$${formatNumber(fedSavings)}`,
            },
            {
              label: "State tax savings",
              value: `$${formatNumber(stateSavings)}`,
            },
            {
              label: "FICA savings (7.65%)",
              value: `$${formatNumber(ficaSavings)}`,
            },
            {
              label: "Effective cost of expenses",
              value: `$${formatNumber(effectiveCost)} (${formatNumber(discountPercent)}% discount)`,
            },
          ],
          note: "FSA contributions reduce your taxable income and FICA taxes. Healthcare FSA funds generally must be used by year-end (some plans allow a $640 rollover or 2.5-month grace period). Dependent Care FSA has a use-it-or-lose-it rule with no rollover.",
        };
      },
    },
  ],
  relatedSlugs: [
    "hsa-tax-savings-calculator",
    "medical-expense-deduction-calculator",
    "dependent-tax-credit-calculator",
  ],
  faq: [
    {
      question: "What is the difference between an FSA and an HSA?",
      answer:
        "An FSA (Flexible Spending Account) is use-it-or-lose-it and does not require a high-deductible health plan. An HSA (Health Savings Account) requires an HDHP but funds roll over indefinitely and can be invested. HSAs have a triple tax advantage; FSAs only save on contributions.",
    },
    {
      question: "What are the FSA contribution limits?",
      answer:
        "For 2024, the Healthcare FSA limit is $3,200 per year. The Dependent Care FSA limit is $5,000 per household ($2,500 if married filing separately). Some plans allow a $640 rollover for Healthcare FSA unused funds.",
    },
  ],
  formula:
    "Tax Savings = FSA Contribution x (Federal Rate + State Rate + FICA 7.65%)",
};
