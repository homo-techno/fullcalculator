import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const constructionLoanCalculator: CalculatorDefinition = {
  slug: "construction-loan-calculator",
  title: "Construction Loan Calculator",
  description:
    "Free construction loan calculator. Estimate interest-only payments during construction and permanent financing costs after completion.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "construction loan calculator",
    "building loan calculator",
    "construction mortgage",
    "construction to permanent loan",
    "new home construction cost",
  ],
  variants: [
    {
      id: "construction-cost",
      name: "Construction Loan Cost",
      description: "Estimate costs during construction and after",
      fields: [
        {
          name: "totalCost",
          label: "Total Construction Cost",
          type: "number",
          placeholder: "e.g. 500000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 100000",
          prefix: "$",
          min: 0,
        },
        {
          name: "constructionRate",
          label: "Construction Loan Rate",
          type: "number",
          placeholder: "e.g. 8.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "constructionPeriod",
          label: "Construction Period",
          type: "select",
          options: [
            { label: "6 months", value: "6" },
            { label: "9 months", value: "9" },
            { label: "12 months", value: "12" },
            { label: "18 months", value: "18" },
            { label: "24 months", value: "24" },
          ],
          defaultValue: "12",
        },
        {
          name: "permanentRate",
          label: "Permanent Loan Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "permanentTerm",
          label: "Permanent Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const total = inputs.totalCost as number;
        const down = (inputs.downPayment as number) || 0;
        const cRate = inputs.constructionRate as number;
        const cMonths = parseInt(inputs.constructionPeriod as string) || 12;
        const pRate = inputs.permanentRate as number;
        const pYears = parseInt(inputs.permanentTerm as string) || 30;
        if (!total || !cRate || !pRate) return null;

        const loan = total - down;
        const avgDraw = loan * 0.6;
        const monthlyConstructionInterest = avgDraw * (cRate / 100 / 12);
        const totalConstructionInterest = monthlyConstructionInterest * cMonths;

        const pMonthlyRate = pRate / 100 / 12;
        const pPayments = pYears * 12;
        const permanentMonthly =
          (loan * (pMonthlyRate * Math.pow(1 + pMonthlyRate, pPayments))) /
          (Math.pow(1 + pMonthlyRate, pPayments) - 1);
        const totalPermanentInterest = permanentMonthly * pPayments - loan;
        const totalCost = totalConstructionInterest + totalPermanentInterest + loan;

        return {
          primary: {
            label: "Avg Monthly Construction Interest",
            value: `$${formatNumber(monthlyConstructionInterest)}`,
          },
          details: [
            { label: "Permanent monthly payment", value: `$${formatNumber(permanentMonthly)}` },
            { label: "Total construction interest", value: `$${formatNumber(totalConstructionInterest)}` },
            { label: "Total permanent interest", value: `$${formatNumber(totalPermanentInterest)}` },
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Total project cost", value: `$${formatNumber(totalCost)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "land-loan-calculator"],
  faq: [
    {
      question: "How do construction loans work?",
      answer:
        "Construction loans are short-term loans that fund building a home. You pay interest-only on funds drawn during construction. Once complete, the loan converts to a permanent mortgage or you refinance.",
    },
    {
      question: "What is average draw in construction loans?",
      answer:
        "Funds are disbursed in stages as construction progresses. On average, about 60% of the loan is outstanding during construction, so interest costs are estimated on that average balance.",
    },
    {
      question: "What down payment is needed?",
      answer:
        "Construction loans typically require 20-25% down payment. Some lenders may require more depending on the project scope and borrower qualifications.",
    },
  ],
  formula: "Construction: Interest-only on average draw. Permanent: M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
