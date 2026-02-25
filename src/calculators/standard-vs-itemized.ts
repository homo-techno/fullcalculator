import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const standardVsItemizedCalculator: CalculatorDefinition = {
  slug: "standard-vs-itemized-calculator",
  title: "Standard vs Itemized Deduction Calculator",
  description:
    "Free standard vs itemized deduction comparison. Determine whether you should take the standard deduction or itemize your deductions to save more on taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "standard vs itemized",
    "itemized deduction calculator",
    "standard deduction",
    "should I itemize",
    "deduction comparison",
  ],
  variants: [
    {
      id: "comparison",
      name: "Standard vs Itemized Comparison",
      description:
        "Compare standard deduction to your total itemized deductions",
      fields: [
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
            { label: "Married Filing Separately", value: "mfs" },
          ],
          defaultValue: "single",
        },
        {
          name: "age65",
          label: "Age 65 or Older?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes (one spouse if MFJ)", value: "one" },
            { label: "Yes (both spouses if MFJ)", value: "both" },
          ],
          defaultValue: "no",
        },
        {
          name: "mortgageInterest",
          label: "Mortgage Interest",
          type: "number",
          placeholder: "e.g. 12000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "saltDeduction",
          label: "State & Local Taxes (SALT, max $10,000)",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "charitableDonations",
          label: "Charitable Donations",
          type: "number",
          placeholder: "e.g. 3000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "medicalExpenses",
          label: "Deductible Medical Expenses (above 7.5% AGI)",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "otherItemized",
          label: "Other Itemized Deductions",
          type: "number",
          placeholder: "e.g. 0",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "marginalRate",
          label: "Marginal Tax Rate",
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
      ],
      calculate: (inputs) => {
        const status = inputs.filingStatus as string;
        const age65 = inputs.age65 as string;
        const mortgage = (inputs.mortgageInterest as number) || 0;
        const salt = Math.min((inputs.saltDeduction as number) || 0, 10000);
        const charitable = (inputs.charitableDonations as number) || 0;
        const medical = (inputs.medicalExpenses as number) || 0;
        const other = (inputs.otherItemized as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;

        const baseStandard: Record<string, number> = {
          single: 15000,
          married: 30000,
          hoh: 22500,
          mfs: 15000,
        };

        let standardDeduction = baseStandard[status] || 15000;

        if (age65 === "one") {
          standardDeduction += status === "married" || status === "mfs" ? 1550 : 1950;
        } else if (age65 === "both") {
          standardDeduction += 3100;
        }

        const totalItemized =
          mortgage + salt + charitable + medical + other;
        const bestDeduction = Math.max(standardDeduction, totalItemized);
        const recommendation =
          totalItemized > standardDeduction ? "Itemize" : "Standard Deduction";
        const savings =
          Math.abs(totalItemized - standardDeduction) * marginalRate;

        return {
          primary: {
            label: "Recommendation",
            value: recommendation,
          },
          details: [
            {
              label: "Standard deduction",
              value: `$${formatNumber(standardDeduction)}`,
            },
            {
              label: "Total itemized deductions",
              value: `$${formatNumber(totalItemized)}`,
            },
            {
              label: "Best deduction amount",
              value: `$${formatNumber(bestDeduction)}`,
            },
            {
              label: "Difference",
              value: `$${formatNumber(Math.abs(totalItemized - standardDeduction))}`,
            },
            {
              label: "Tax savings from better choice",
              value: `$${formatNumber(savings)}`,
            },
            {
              label: "SALT (capped at $10,000)",
              value: `$${formatNumber(salt)}`,
            },
          ],
          note:
            totalItemized > standardDeduction
              ? "Your itemized deductions exceed the standard deduction. You should itemize to save more on taxes."
              : "The standard deduction is higher. You should take the standard deduction unless you have a specific reason to itemize.",
        };
      },
    },
  ],
  relatedSlugs: [
    "tax-calculator",
    "charitable-deduction-calculator",
    "medical-expense-deduction-calculator",
  ],
  faq: [
    {
      question: "What is the standard deduction for 2024?",
      answer:
        "For 2024, the standard deduction is $15,000 for single filers, $30,000 for married filing jointly, $22,500 for head of household, and $15,000 for married filing separately. Additional amounts apply for those 65 or older.",
    },
    {
      question: "When should I itemize instead of taking the standard deduction?",
      answer:
        "Itemize when your total itemized deductions (mortgage interest, SALT up to $10,000, charitable donations, medical expenses above 7.5% AGI, etc.) exceed the standard deduction.",
    },
  ],
  formula:
    "Compare: Standard Deduction vs. (Mortgage Interest + SALT + Charity + Medical + Other)",
};
