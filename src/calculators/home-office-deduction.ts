import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeOfficeDeductionCalculator: CalculatorDefinition = {
  slug: "home-office-deduction-calculator",
  title: "Home Office Deduction Calculator",
  description:
    "Free home office deduction calculator. Compare the simplified and regular methods to find your best home office tax deduction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home office deduction",
    "home office tax deduction",
    "work from home deduction",
    "simplified home office",
    "office deduction calculator",
  ],
  variants: [
    {
      id: "home-office",
      name: "Home Office Deduction Comparison",
      description:
        "Compare the simplified method and regular method for home office deduction",
      fields: [
        {
          name: "officeSquareFeet",
          label: "Office Square Footage",
          type: "number",
          placeholder: "e.g. 200",
          min: 1,
        },
        {
          name: "homeSquareFeet",
          label: "Total Home Square Footage",
          type: "number",
          placeholder: "e.g. 2000",
          min: 1,
        },
        {
          name: "rent",
          label: "Annual Rent / Mortgage Interest",
          type: "number",
          placeholder: "e.g. 18000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "utilities",
          label: "Annual Utilities",
          type: "number",
          placeholder: "e.g. 3600",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "insurance",
          label: "Annual Homeowner's / Renter's Insurance",
          type: "number",
          placeholder: "e.g. 1200",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "repairs",
          label: "Annual Repairs & Maintenance",
          type: "number",
          placeholder: "e.g. 500",
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
        const officeSqFt = inputs.officeSquareFeet as number;
        const homeSqFt = inputs.homeSquareFeet as number;
        const rent = (inputs.rent as number) || 0;
        const utilities = (inputs.utilities as number) || 0;
        const insurance = (inputs.insurance as number) || 0;
        const repairs = (inputs.repairs as number) || 0;
        const marginalRate =
          (parseInt(inputs.marginalRate as string) || 22) / 100;

        if (!officeSqFt || !homeSqFt || officeSqFt <= 0 || homeSqFt <= 0)
          return null;

        // Simplified method: $5 per sq ft, max 300 sq ft
        const simplifiedSqFt = Math.min(officeSqFt, 300);
        const simplifiedDeduction = simplifiedSqFt * 5;

        // Regular method: percentage of actual expenses
        const businessPercent = (officeSqFt / homeSqFt) * 100;
        const totalExpenses = rent + utilities + insurance + repairs;
        const regularDeduction = totalExpenses * (businessPercent / 100);

        const bestMethod =
          regularDeduction >= simplifiedDeduction ? "Regular" : "Simplified";
        const bestDeduction = Math.max(regularDeduction, simplifiedDeduction);
        const taxSavings = bestDeduction * marginalRate;

        return {
          primary: {
            label: "Best Deduction",
            value: `$${formatNumber(bestDeduction)}`,
          },
          details: [
            { label: "Recommended method", value: bestMethod },
            {
              label: "Simplified method",
              value: `$${formatNumber(simplifiedDeduction)}`,
            },
            {
              label: "Regular method",
              value: `$${formatNumber(regularDeduction)}`,
            },
            {
              label: "Business use percentage",
              value: `${formatNumber(businessPercent)}%`,
            },
            {
              label: "Estimated tax savings",
              value: `$${formatNumber(taxSavings)}`,
            },
            {
              label: "Total home expenses (annual)",
              value: `$${formatNumber(totalExpenses)}`,
            },
          ],
          note: "Home office deduction is available to self-employed individuals and independent contractors. W-2 employees generally cannot claim this deduction since 2018.",
        };
      },
    },
  ],
  relatedSlugs: [
    "1099-tax-calculator",
    "standard-vs-itemized-calculator",
    "tax-calculator",
  ],
  faq: [
    {
      question: "Who qualifies for the home office deduction?",
      answer:
        "Self-employed individuals and independent contractors who use a dedicated space in their home regularly and exclusively for business. W-2 employees cannot claim this deduction under current tax law (since 2018 TCJA).",
    },
    {
      question:
        "What is the difference between the simplified and regular method?",
      answer:
        "The simplified method gives $5 per square foot up to 300 sq ft ($1,500 max). The regular method calculates actual expenses proportional to your office space. The regular method can yield a larger deduction but requires more record-keeping.",
    },
  ],
  formula:
    "Simplified = $5 x sq ft (max 300); Regular = Total Expenses x (Office sq ft / Home sq ft)",
};
