import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const charitableDeductionCalculator: CalculatorDefinition = {
  slug: "charitable-deduction-calculator",
  title: "Charitable Donation Deduction Calculator",
  description:
    "Free charitable donation deduction calculator. Estimate your tax savings from charitable contributions and check AGI limits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "charitable deduction calculator",
    "donation tax deduction",
    "charitable contribution",
    "tax deduction donations",
    "giving tax benefit",
  ],
  variants: [
    {
      id: "charitable",
      name: "Charitable Donation Tax Savings",
      description:
        "Calculate tax savings from charitable donations",
      fields: [
        {
          name: "cashDonations",
          label: "Cash Donations",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "propertyDonations",
          label: "Property / Non-Cash Donations",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "agi",
          label: "Adjusted Gross Income",
          type: "number",
          placeholder: "e.g. 100000",
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
        {
          name: "itemizing",
          label: "Are You Itemizing?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No (Standard Deduction)", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const cash = (inputs.cashDonations as number) || 0;
        const property = (inputs.propertyDonations as number) || 0;
        const agi = inputs.agi as number;
        const status = inputs.filingStatus as string;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;
        const itemizing = inputs.itemizing === "yes";

        if (!agi || agi <= 0) return null;

        const totalDonations = cash + property;
        const cashLimit = agi * 0.6;
        const propertyLimit = agi * 0.3;

        const allowedCash = Math.min(cash, cashLimit);
        const allowedProperty = Math.min(property, propertyLimit);
        const totalAllowed = Math.min(allowedCash + allowedProperty, agi * 0.6);

        const carryover = totalDonations - totalAllowed;
        const taxSavings = itemizing ? totalAllowed * marginalRate : 0;

        const standardDeduction =
          status === "married" ? 30000 : status === "hoh" ? 22500 : 15000;

        return {
          primary: {
            label: "Tax Savings from Donations",
            value: `$${formatNumber(taxSavings)}`,
          },
          details: [
            {
              label: "Total donations",
              value: `$${formatNumber(totalDonations)}`,
            },
            {
              label: "Deductible amount",
              value: `$${formatNumber(totalAllowed)}`,
            },
            {
              label: "Cash donation AGI limit (60%)",
              value: `$${formatNumber(cashLimit)}`,
            },
            {
              label: "Property donation AGI limit (30%)",
              value: `$${formatNumber(propertyLimit)}`,
            },
            {
              label: "Carryover to next year",
              value: `$${formatNumber(Math.max(0, carryover))}`,
            },
            {
              label: "Standard deduction comparison",
              value: `$${formatNumber(standardDeduction)}`,
            },
          ],
          note: itemizing
            ? "Tax savings are based on itemizing deductions. Excess donations can be carried forward for up to 5 years."
            : "You selected standard deduction. Charitable donations only provide a tax benefit if you itemize. Consider bunching donations into one year to exceed the standard deduction.",
        };
      },
    },
  ],
  relatedSlugs: [
    "standard-vs-itemized-calculator",
    "tax-calculator",
    "medical-expense-deduction-calculator",
  ],
  faq: [
    {
      question: "How much can I deduct for charitable donations?",
      answer:
        "Cash donations to public charities are deductible up to 60% of your AGI. Non-cash property donations are limited to 30% of AGI. Excess can be carried forward for up to 5 years.",
    },
    {
      question: "Do I need to itemize to deduct charitable donations?",
      answer:
        "Yes, charitable donations are an itemized deduction. You only benefit if your total itemized deductions exceed the standard deduction ($15,000 single, $30,000 married in 2024).",
    },
  ],
  formula:
    "Tax Savings = Deductible Donations x Marginal Tax Rate (must itemize)",
};
