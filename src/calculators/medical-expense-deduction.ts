import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicalExpenseDeductionCalculator: CalculatorDefinition = {
  slug: "medical-expense-deduction-calculator",
  title: "Medical Expense Deduction Calculator",
  description:
    "Free medical expense deduction calculator. Determine how much of your medical expenses exceed the 7.5% AGI threshold and your potential tax savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "medical expense deduction",
    "medical tax deduction",
    "healthcare deduction",
    "medical expenses AGI",
    "health expense tax",
  ],
  variants: [
    {
      id: "medical-deduction",
      name: "Medical Expense Deduction Estimator",
      description:
        "Calculate your deductible medical expenses above the 7.5% AGI floor",
      fields: [
        {
          name: "totalMedical",
          label: "Total Medical Expenses",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
        },
        {
          name: "agi",
          label: "Adjusted Gross Income (AGI)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
        },
        {
          name: "insurancePremiums",
          label: "Health Insurance Premiums Paid",
          type: "number",
          placeholder: "e.g. 6000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "dentalVision",
          label: "Dental & Vision Expenses",
          type: "number",
          placeholder: "e.g. 2000",
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
        const totalMedical = (inputs.totalMedical as number) || 0;
        const agi = inputs.agi as number;
        const premiums = (inputs.insurancePremiums as number) || 0;
        const dentalVision = (inputs.dentalVision as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;

        if (!agi || agi <= 0) return null;

        const combinedExpenses = totalMedical + premiums + dentalVision;
        const agiThreshold = agi * 0.075;
        const deductibleAmount = Math.max(0, combinedExpenses - agiThreshold);
        const taxSavings = deductibleAmount * marginalRate;

        return {
          primary: {
            label: "Deductible Medical Expenses",
            value: `$${formatNumber(deductibleAmount)}`,
          },
          details: [
            {
              label: "Total medical expenses",
              value: `$${formatNumber(combinedExpenses)}`,
            },
            {
              label: "7.5% AGI threshold",
              value: `$${formatNumber(agiThreshold)}`,
            },
            {
              label: "Amount exceeding threshold",
              value: `$${formatNumber(deductibleAmount)}`,
            },
            {
              label: "Estimated tax savings",
              value: `$${formatNumber(taxSavings)}`,
            },
            {
              label: "Effective cost of medical expenses",
              value: `$${formatNumber(combinedExpenses - taxSavings)}`,
            },
            {
              label: "Expenses needed to reach threshold",
              value:
                combinedExpenses >= agiThreshold
                  ? "Already exceeded"
                  : `$${formatNumber(agiThreshold - combinedExpenses)}`,
            },
          ],
          note: "Medical expenses are an itemized deduction. Only expenses exceeding 7.5% of AGI are deductible. You must itemize to claim this deduction.",
        };
      },
    },
  ],
  relatedSlugs: [
    "standard-vs-itemized-calculator",
    "hsa-tax-savings-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "What medical expenses are tax deductible?",
      answer:
        "Deductible medical expenses include doctor visits, hospital stays, prescription medications, health insurance premiums (if not pre-tax), dental and vision care, medical equipment, and travel for medical care.",
    },
    {
      question: "What is the 7.5% AGI threshold for medical expenses?",
      answer:
        "You can only deduct the portion of medical expenses that exceeds 7.5% of your AGI. For example, with $80,000 AGI, only medical expenses above $6,000 are deductible.",
    },
  ],
  formula:
    "Deduction = Total Medical Expenses - (7.5% x AGI); must be positive and must itemize",
};
