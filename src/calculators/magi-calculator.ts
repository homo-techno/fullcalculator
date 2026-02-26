import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const magiCalculator: CalculatorDefinition = {
  slug: "magi-calculator",
  title: "Modified Adjusted Gross Income (MAGI) Calculator",
  description:
    "Free MAGI calculator. Calculate your Modified Adjusted Gross Income by adding back foreign income, tax-exempt interest, and other exclusions to your AGI.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "magi calculator",
    "modified adjusted gross income",
    "magi for roth ira",
    "magi for medicare",
    "aca magi",
  ],
  variants: [
    {
      id: "standard",
      name: "MAGI Calculator",
      description:
        "Calculate Modified Adjusted Gross Income from AGI plus add-backs",
      fields: [
        {
          name: "agi",
          label: "Adjusted Gross Income (AGI)",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
        },
        {
          name: "foreignIncome",
          label: "Foreign Earned Income Exclusion",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "taxExemptInterest",
          label: "Tax-Exempt Interest",
          type: "number",
          placeholder: "e.g. 1500",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "foreignHousing",
          label: "Foreign Housing Exclusion",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "studentLoanDeduction",
          label: "Student Loan Interest Deduction",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "iraDeduction",
          label: "IRA Contribution Deduction",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "adoptionExpenses",
          label: "Excluded Adoption Expenses",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const agi = parseFloat(inputs.agi as string);
        if (!agi || agi <= 0) return null;

        const foreignIncome = parseFloat(inputs.foreignIncome as string) || 0;
        const taxExemptInterest = parseFloat(inputs.taxExemptInterest as string) || 0;
        const foreignHousing = parseFloat(inputs.foreignHousing as string) || 0;
        const studentLoan = parseFloat(inputs.studentLoanDeduction as string) || 0;
        const ira = parseFloat(inputs.iraDeduction as string) || 0;
        const adoption = parseFloat(inputs.adoptionExpenses as string) || 0;

        const totalAddBacks =
          foreignIncome + taxExemptInterest + foreignHousing + studentLoan + ira + adoption;
        const magi = agi + totalAddBacks;

        return {
          primary: { label: "Modified AGI (MAGI)", value: `$${formatNumber(magi)}` },
          details: [
            { label: "Starting AGI", value: `$${formatNumber(agi)}` },
            { label: "Total add-backs", value: `$${formatNumber(totalAddBacks)}` },
            { label: "Foreign income add-back", value: `$${formatNumber(foreignIncome)}` },
            { label: "Tax-exempt interest add-back", value: `$${formatNumber(taxExemptInterest)}` },
            { label: "Difference (MAGI - AGI)", value: `$${formatNumber(magi - agi)}` },
          ],
          note: "MAGI is used to determine eligibility for Roth IRA contributions, premium tax credits (ACA), and certain deductions. The exact MAGI definition may vary slightly depending on the tax provision.",
        };
      },
    },
    {
      id: "roth-ira",
      name: "MAGI for Roth IRA Eligibility",
      description:
        "Check your Roth IRA contribution eligibility based on MAGI",
      fields: [
        {
          name: "magi",
          label: "Your MAGI",
          type: "number",
          placeholder: "e.g. 140000",
          prefix: "$",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single / Head of Household", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Married Filing Separately", value: "separate" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const magi = parseFloat(inputs.magi as string);
        const status = inputs.filingStatus as string;
        if (!magi || magi <= 0) return null;

        const maxContribution = 7000;
        let lowerLimit: number;
        let upperLimit: number;

        if (status === "married") {
          lowerLimit = 230000;
          upperLimit = 240000;
        } else if (status === "separate") {
          lowerLimit = 0;
          upperLimit = 10000;
        } else {
          lowerLimit = 146000;
          upperLimit = 161000;
        }

        let allowedContribution: number;
        if (magi <= lowerLimit) {
          allowedContribution = maxContribution;
        } else if (magi >= upperLimit) {
          allowedContribution = 0;
        } else {
          const reduction = ((magi - lowerLimit) / (upperLimit - lowerLimit)) * maxContribution;
          allowedContribution = Math.max(0, Math.round((maxContribution - reduction) / 10) * 10);
        }

        const eligibility =
          allowedContribution === maxContribution
            ? "Full contribution allowed"
            : allowedContribution > 0
              ? "Reduced contribution (phase-out range)"
              : "Not eligible for direct Roth IRA contribution";

        return {
          primary: {
            label: "Roth IRA Contribution Limit",
            value: `$${formatNumber(allowedContribution)}`,
          },
          details: [
            { label: "Your MAGI", value: `$${formatNumber(magi)}` },
            { label: "Eligibility", value: eligibility },
            { label: "Phase-out starts at", value: `$${formatNumber(lowerLimit)}` },
            { label: "Phase-out ends at", value: `$${formatNumber(upperLimit)}` },
          ],
          note: "2024 Roth IRA contribution limit is $7,000 ($8,000 if age 50+). Consider a backdoor Roth IRA if your MAGI exceeds the limit.",
        };
      },
    },
  ],
  relatedSlugs: ["agi-calculator", "tax-calculator", "retirement-calculator"],
  faq: [
    {
      question: "What is the difference between AGI and MAGI?",
      answer:
        "AGI is your gross income minus above-the-line deductions. MAGI adds back certain deductions and exclusions like foreign earned income, tax-exempt interest, and student loan deductions. MAGI is used to determine eligibility for Roth IRA, premium tax credits, and other benefits.",
    },
    {
      question: "Why does MAGI matter for Roth IRA contributions?",
      answer:
        "The IRS uses MAGI to determine if you can contribute to a Roth IRA. For 2024, single filers with MAGI above $161,000 and married filing jointly above $240,000 cannot make direct Roth IRA contributions.",
    },
  ],
  formula: "MAGI = AGI + Foreign Earned Income + Tax-Exempt Interest + Foreign Housing Exclusion + Other Add-Backs",
};
