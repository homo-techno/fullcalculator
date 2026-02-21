import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ltvCalculator: CalculatorDefinition = {
  slug: "ltv-calculator",
  title: "Loan to Value (LTV) Calculator",
  description:
    "Free LTV calculator. Calculate your loan-to-value ratio, understand PMI requirements, and see how your equity affects mortgage terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "LTV calculator",
    "loan to value ratio",
    "LTV ratio calculator",
    "loan to value calculator",
    "mortgage LTV",
  ],
  variants: [
    {
      id: "calculate-ltv",
      name: "Calculate LTV",
      description: "Find your loan-to-value ratio",
      fields: [
        { name: "loanAmount", label: "Loan Amount", type: "number", placeholder: "e.g. 280000", prefix: "$", min: 0 },
        { name: "propertyValue", label: "Property Value / Appraised Value", type: "number", placeholder: "e.g. 350000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const value = inputs.propertyValue as number;
        if (!loan || !value) return null;

        const ltv = (loan / value) * 100;
        const equity = value - loan;
        const equityPercent = (equity / value) * 100;
        const needsPMI = ltv > 80;

        return {
          primary: { label: "LTV Ratio", value: `${formatNumber(ltv, 2)}%` },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Property value", value: `$${formatNumber(value)}` },
            { label: "Equity", value: `$${formatNumber(equity)}` },
            { label: "Equity percentage", value: `${formatNumber(equityPercent, 2)}%` },
            { label: "PMI required?", value: needsPMI ? "Yes (LTV > 80%)" : "No (LTV ≤ 80%)" },
          ],
          note: needsPMI ? "PMI is typically required when LTV exceeds 80%. You can request PMI removal once LTV reaches 80% or it auto-cancels at 78%." : undefined,
        };
      },
    },
    {
      id: "combined-ltv",
      name: "Combined LTV (CLTV)",
      description: "Calculate combined LTV with multiple loans (e.g., mortgage + HELOC)",
      fields: [
        { name: "firstMortgage", label: "First Mortgage Balance", type: "number", placeholder: "e.g. 250000", prefix: "$", min: 0 },
        { name: "secondLoan", label: "Second Loan / HELOC Balance", type: "number", placeholder: "e.g. 40000", prefix: "$", min: 0 },
        { name: "propertyValue", label: "Property Value", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const first = (inputs.firstMortgage as number) || 0;
        const second = (inputs.secondLoan as number) || 0;
        const value = inputs.propertyValue as number;
        if (!value || (!first && !second)) return null;

        const totalDebt = first + second;
        const cltv = (totalDebt / value) * 100;
        const firstLTV = (first / value) * 100;
        const equity = value - totalDebt;

        return {
          primary: { label: "Combined LTV (CLTV)", value: `${formatNumber(cltv, 2)}%` },
          details: [
            { label: "First mortgage LTV", value: `${formatNumber(firstLTV, 2)}%` },
            { label: "Total debt", value: `$${formatNumber(totalDebt)}` },
            { label: "Remaining equity", value: `$${formatNumber(equity)}` },
            { label: "Equity percentage", value: `${formatNumber((equity / value) * 100, 2)}%` },
          ],
          note: cltv > 90 ? "A CLTV above 90% limits refinancing options and may require additional insurance." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-equity-calculator", "heloc-calculator"],
  faq: [
    {
      question: "What is LTV ratio?",
      answer:
        "Loan-to-Value (LTV) ratio is the percentage of the property value that is financed by a loan. LTV = Loan Amount / Property Value × 100. Lower LTV means more equity and typically better loan terms.",
    },
    {
      question: "Why does LTV matter?",
      answer:
        "LTV affects your mortgage rate, PMI requirement, and loan approval. LTV above 80% usually requires PMI. Lower LTV (more equity) generally qualifies you for lower rates. LTV above 95% is hard to get approved.",
    },
    {
      question: "What is CLTV?",
      answer:
        "Combined LTV (CLTV) includes all loans secured by the property. CLTV = (First Mortgage + Second Loan + HELOC) / Property Value × 100. Lenders use CLTV when you have multiple liens on your home.",
    },
  ],
  formula: "LTV = (Loan Amount / Property Value) × 100 | CLTV = (All Loans / Property Value) × 100",
};
