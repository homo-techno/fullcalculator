import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const titleInsuranceCalculator: CalculatorDefinition = {
  slug: "title-insurance-calculator",
  title: "Title Insurance Calculator",
  description:
    "Free title insurance calculator. Estimate owner's and lender's title insurance premiums based on property value and state rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "title insurance calculator",
    "title insurance cost",
    "owner's title insurance",
    "lender's title insurance",
    "title insurance premium",
  ],
  variants: [
    {
      id: "premium-estimate",
      name: "Premium Estimate",
      description: "Estimate title insurance premiums for a property",
      fields: [
        {
          name: "propertyValue",
          label: "Property Purchase Price",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 320000",
          prefix: "$",
          min: 0,
        },
        {
          name: "ratePerThousand",
          label: "Rate Per $1,000",
          type: "number",
          placeholder: "e.g. 5.75",
          prefix: "$",
          min: 0,
          max: 20,
          step: 0.01,
          defaultValue: 5.75,
        },
        {
          name: "policyType",
          label: "Policy Type",
          type: "select",
          options: [
            { label: "Owner's policy only", value: "owner" },
            { label: "Lender's policy only", value: "lender" },
            { label: "Both (simultaneous issue)", value: "both" },
          ],
          defaultValue: "both",
        },
      ],
      calculate: (inputs) => {
        const propertyValue = inputs.propertyValue as number;
        const loanAmount = (inputs.loanAmount as number) || 0;
        const ratePerK = (inputs.ratePerThousand as number) || 5.75;
        const policyType = inputs.policyType as string;
        if (!propertyValue) return null;

        const ownerPremium = (propertyValue / 1000) * ratePerK;
        const lenderPremium = loanAmount > 0 ? (loanAmount / 1000) * ratePerK * 0.6 : 0;
        const simultaneousDiscount = policyType === "both" ? lenderPremium * 0.3 : 0;

        let totalPremium = 0;
        if (policyType === "owner") totalPremium = ownerPremium;
        else if (policyType === "lender") totalPremium = lenderPremium;
        else totalPremium = ownerPremium + lenderPremium - simultaneousDiscount;

        const titleSearch = 250;
        const totalCost = totalPremium + titleSearch;

        return {
          primary: {
            label: "Total Title Insurance Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Owner's policy premium", value: `$${formatNumber(ownerPremium)}` },
            { label: "Lender's policy premium", value: `$${formatNumber(lenderPremium)}` },
            { label: "Simultaneous issue discount", value: `-$${formatNumber(simultaneousDiscount)}` },
            { label: "Title search fee (est.)", value: `$${formatNumber(titleSearch)}` },
            { label: "Cost per $100K of value", value: `$${formatNumber((totalPremium / propertyValue) * 100000)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "escrow-calculator", "transfer-tax-calculator"],
  faq: [
    {
      question: "What is title insurance?",
      answer:
        "Title insurance protects property buyers and mortgage lenders from financial loss due to defects in a property's title. This includes unknown liens, encumbrances, forgeries, or errors in public records. It is a one-time premium paid at closing.",
    },
    {
      question: "Do I need both owner's and lender's title insurance?",
      answer:
        "The lender's policy is typically required by your mortgage company. The owner's policy is optional but highly recommended, as it protects your equity investment. When purchased simultaneously, there is usually a significant discount on the second policy.",
    },
    {
      question: "How much does title insurance cost?",
      answer:
        "Title insurance premiums vary by state and property value, typically ranging from $500-$3,500 for a standard home purchase. Rates are usually $3.50-$7.00 per $1,000 of property value. Some states have regulated rates while others allow competition.",
    },
  ],
  formula: "Premium = (Property Value / 1,000) x Rate Per Thousand",
};
