import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dependentTaxCreditCalculator: CalculatorDefinition = {
  slug: "dependent-tax-credit-calculator",
  title: "Dependent Tax Credit Calculator",
  description:
    "Free dependent tax credit calculator. Estimate your Child Tax Credit and Other Dependent Credit based on number of dependents and income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "dependent tax credit",
    "child tax credit calculator",
    "CTC calculator",
    "dependent credit",
    "tax credit for children",
  ],
  variants: [
    {
      id: "dependent-credit",
      name: "Child & Dependent Tax Credit Estimator",
      description:
        "Calculate your total child tax credit and other dependent credit",
      fields: [
        {
          name: "childrenUnder17",
          label: "Children Under 17",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 0,
          min: 0,
          max: 20,
        },
        {
          name: "otherDependents",
          label: "Other Dependents (17+)",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 0,
          min: 0,
          max: 20,
        },
        {
          name: "agi",
          label: "Adjusted Gross Income (AGI)",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "$",
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
          name: "taxLiability",
          label: "Federal Tax Liability (before credits)",
          type: "number",
          placeholder: "e.g. 12000",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const childrenUnder17 = (inputs.childrenUnder17 as number) || 0;
        const otherDeps = (inputs.otherDependents as number) || 0;
        const agi = inputs.agi as number;
        const status = inputs.filingStatus as string;
        const taxLiability = (inputs.taxLiability as number) || 0;

        if (!agi || agi <= 0) return null;

        const ctcPerChild = 2000;
        const otherDepCredit = 500;
        const phaseoutStart = status === "married" ? 400000 : 200000;

        const grossCTC = childrenUnder17 * ctcPerChild;
        const grossODC = otherDeps * otherDepCredit;
        const grossTotal = grossCTC + grossODC;

        const excessAGI = Math.max(0, agi - phaseoutStart);
        const phaseoutReduction = Math.ceil(excessAGI / 1000) * 50;
        const adjustedTotal = Math.max(0, grossTotal - phaseoutReduction);

        const nonrefundablePortion = Math.min(adjustedTotal, taxLiability);
        const refundableMax = Math.min(
          Math.max(0, adjustedTotal - taxLiability),
          childrenUnder17 * 1700
        );

        return {
          primary: {
            label: "Total Dependent Credits",
            value: `$${formatNumber(adjustedTotal)}`,
          },
          details: [
            {
              label: "Child Tax Credit (under 17)",
              value: `$${formatNumber(Math.max(0, grossCTC - Math.max(0, phaseoutReduction - grossODC)))}`,
            },
            {
              label: "Other Dependent Credit (17+)",
              value: `$${formatNumber(Math.max(0, Math.min(grossODC, adjustedTotal - Math.max(0, adjustedTotal - grossODC))))}`,
            },
            {
              label: "Phaseout reduction",
              value: `$${formatNumber(phaseoutReduction)}`,
            },
            {
              label: "Non-refundable portion",
              value: `$${formatNumber(nonrefundablePortion)}`,
            },
            {
              label: "Refundable portion (ACTC)",
              value: `$${formatNumber(refundableMax)}`,
            },
            {
              label: "Tax after credits",
              value: `$${formatNumber(Math.max(0, taxLiability - adjustedTotal))}`,
            },
          ],
          note: "The Child Tax Credit is $2,000 per qualifying child under 17. Up to $1,700 may be refundable (Additional Child Tax Credit). The credit phases out above $200,000 AGI ($400,000 married).",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "education-tax-credit-calculator",
    "w4-withholding-calculator",
  ],
  faq: [
    {
      question: "How much is the Child Tax Credit?",
      answer:
        "The Child Tax Credit is $2,000 per qualifying child under age 17. Up to $1,700 of this amount may be refundable as the Additional Child Tax Credit, even if you owe no tax.",
    },
    {
      question: "When does the Child Tax Credit phase out?",
      answer:
        "The credit begins to phase out at $200,000 AGI for single filers and $400,000 for married filing jointly. It reduces by $50 for each $1,000 of income above the threshold.",
    },
  ],
  formula:
    "CTC = ($2,000 x children under 17) + ($500 x other dependents) - phaseout reduction",
};
