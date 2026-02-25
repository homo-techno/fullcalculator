import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hardMoneyLoanCalculator: CalculatorDefinition = {
  slug: "hard-money-loan-calculator",
  title: "Hard Money Loan Calculator",
  description:
    "Free hard money loan calculator. Estimate monthly interest payments, points, fees, and total cost for asset-based hard money loans used in real estate investing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "hard money loan calculator",
    "hard money lender",
    "private money loan",
    "real estate loan calculator",
    "fix and flip loan",
    "asset based loan",
  ],
  variants: [
    {
      id: "hard-money-cost",
      name: "Hard Money Loan Cost",
      description: "Calculate the total cost of a hard money loan",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 250000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Annual Interest Rate",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "points",
          label: "Origination Points",
          type: "select",
          options: [
            { label: "1 point", value: "1" },
            { label: "2 points", value: "2" },
            { label: "3 points", value: "3" },
            { label: "4 points", value: "4" },
            { label: "5 points", value: "5" },
          ],
          defaultValue: "2",
        },
        {
          name: "term",
          label: "Loan Term",
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
          name: "propertyValue",
          label: "Property Value (ARV)",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const points = parseFloat(inputs.points as string) || 2;
        const months = parseInt(inputs.term as string) || 12;
        const arv = (inputs.propertyValue as number) || 0;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const monthlyInterest = loan * monthlyRate;
        const totalInterest = monthlyInterest * months;
        const pointsCost = loan * (points / 100);
        const totalCost = totalInterest + pointsCost;
        const totalRepayment = loan + totalCost;
        const ltv = arv > 0 ? (loan / arv) * 100 : 0;

        return {
          primary: {
            label: "Monthly Interest Payment",
            value: `$${formatNumber(monthlyInterest)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Origination points cost", value: `$${formatNumber(pointsCost)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total loan cost (interest + points)", value: `$${formatNumber(totalCost)}` },
            { label: "Total repayment", value: `$${formatNumber(totalRepayment)}` },
            { label: "Loan-to-ARV ratio", value: ltv > 0 ? `${formatNumber(ltv)}%` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bridge-loan-calculator", "construction-loan-calculator"],
  faq: [
    {
      question: "What is a hard money loan?",
      answer:
        "A hard money loan is a short-term, asset-based loan from private lenders. Approval is based primarily on the property's value rather than the borrower's creditworthiness. They are commonly used for fix-and-flip projects.",
    },
    {
      question: "What are points on a hard money loan?",
      answer:
        "Points are upfront fees charged as a percentage of the loan amount. Each point equals 1% of the loan. A $250,000 loan with 2 points costs $5,000 in origination fees, paid at closing.",
    },
    {
      question: "What is a typical hard money loan rate?",
      answer:
        "Hard money loans typically charge 10-15% annual interest plus 1-5 origination points. Terms are usually 6-24 months. The high cost reflects the speed, flexibility, and risk these lenders take.",
    },
  ],
  formula:
    "Monthly Interest = Loan x (Rate / 12). Points = Loan x Points%. Total Cost = Total Interest + Points.",
};
