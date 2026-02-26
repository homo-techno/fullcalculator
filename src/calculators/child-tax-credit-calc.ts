import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childTaxCreditCalculator: CalculatorDefinition = {
  slug: "child-tax-credit-calculator",
  title: "Child Tax Credit Calculator",
  description:
    "Free Child Tax Credit calculator. Estimate your CTC based on number of qualifying children, income, and filing status with phase-out calculations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "child tax credit calculator",
    "ctc calculator",
    "child tax credit 2024",
    "child tax credit phase out",
    "additional child tax credit",
  ],
  variants: [
    {
      id: "standard",
      name: "Child Tax Credit Estimator",
      description:
        "Calculate your Child Tax Credit based on income and number of children",
      fields: [
        {
          name: "numChildren",
          label: "Number of Qualifying Children (under 17)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 20,
        },
        {
          name: "agi",
          label: "Modified Adjusted Gross Income",
          type: "number",
          placeholder: "e.g. 85000",
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
          name: "numOtherDependents",
          label: "Other Dependents (17+ or non-qualifying)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          max: 20,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const numChildren = parseFloat(inputs.numChildren as string);
        const agi = parseFloat(inputs.agi as string);
        const status = inputs.filingStatus as string;
        const numOther = parseFloat(inputs.numOtherDependents as string) || 0;

        if (numChildren < 0 || !agi || agi <= 0) return null;

        const creditPerChild = 2000;
        const creditPerOther = 500;
        const phaseOutThreshold = status === "married" ? 400000 : 200000;
        const phaseOutRate = 0.05;

        const maxCTC = numChildren * creditPerChild;
        const maxODC = numOther * creditPerOther;
        const totalMaxCredit = maxCTC + maxODC;

        const excessIncome = Math.max(0, agi - phaseOutThreshold);
        const phaseOutReduction = Math.ceil(excessIncome / 1000) * 50;

        const actualCredit = Math.max(0, totalMaxCredit - phaseOutReduction);
        const refundablePortion = Math.min(actualCredit, numChildren * 1700);

        return {
          primary: { label: "Total Child Tax Credit", value: `$${formatNumber(actualCredit)}` },
          details: [
            { label: "CTC for qualifying children", value: `$${formatNumber(Math.max(0, maxCTC - Math.min(phaseOutReduction, maxCTC)))}` },
            { label: "Credit for other dependents", value: `$${formatNumber(Math.max(0, actualCredit - Math.max(0, maxCTC - phaseOutReduction)))}` },
            { label: "Phase-out reduction", value: `$${formatNumber(phaseOutReduction)}` },
            { label: "Refundable portion (ACTC)", value: `$${formatNumber(refundablePortion)}` },
            { label: "Phase-out threshold", value: `$${formatNumber(phaseOutThreshold)}` },
          ],
          note: "The Child Tax Credit is $2,000 per qualifying child under 17. Up to $1,700 may be refundable as the Additional Child Tax Credit. Phase-out begins at $200,000 ($400,000 married filing jointly).",
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "earned-income-credit-calculator", "agi-calculator"],
  faq: [
    {
      question: "Who qualifies for the Child Tax Credit?",
      answer:
        "A qualifying child must be under 17 at the end of the tax year, a U.S. citizen or resident, claimed as your dependent, and must have lived with you for more than half the year. The child must also have a valid Social Security number.",
    },
    {
      question: "What is the Child Tax Credit phase-out?",
      answer:
        "The CTC begins to phase out when MAGI exceeds $200,000 (single) or $400,000 (married filing jointly). The credit is reduced by $50 for every $1,000 of income above the threshold.",
    },
    {
      question: "Is the Child Tax Credit refundable?",
      answer:
        "Partially. Up to $1,700 per child is refundable as the Additional Child Tax Credit (ACTC) for 2024, meaning you can receive it even if you owe no tax. You must have earned income above $2,500 to qualify for the refundable portion.",
    },
  ],
  formula:
    "CTC = max(0, (children x $2,000 + other dependents x $500) - phase-out reduction). Phase-out = ceil((MAGI - threshold) / $1,000) x $50",
};
