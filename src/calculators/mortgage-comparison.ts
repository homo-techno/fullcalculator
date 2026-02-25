import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageComparisonCalculator: CalculatorDefinition = {
  slug: "mortgage-comparison-calculator",
  title: "Mortgage Comparison Calculator",
  description:
    "Free mortgage comparison calculator. Compare two mortgage options side-by-side to find the best loan terms, monthly payments, and total costs for your situation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mortgage comparison calculator",
    "compare mortgages",
    "loan comparison",
    "mortgage rate comparison",
    "compare home loans",
    "best mortgage deal",
  ],
  variants: [
    {
      id: "compare-two-mortgages",
      name: "Compare Two Mortgages",
      description: "Compare two mortgage options side by side",
      fields: [
        {
          name: "loanAmount1",
          label: "Loan Amount (Option A)",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate1",
          label: "Interest Rate (Option A)",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term1",
          label: "Loan Term (Option A)",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "30",
        },
        {
          name: "loanAmount2",
          label: "Loan Amount (Option B)",
          type: "number",
          placeholder: "e.g. 380000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate2",
          label: "Interest Rate (Option B)",
          type: "number",
          placeholder: "e.g. 6.0",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term2",
          label: "Loan Term (Option B)",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const loan1 = inputs.loanAmount1 as number;
        const rate1 = inputs.rate1 as number;
        const years1 = parseInt(inputs.term1 as string) || 30;
        const loan2 = inputs.loanAmount2 as number;
        const rate2 = inputs.rate2 as number;
        const years2 = parseInt(inputs.term2 as string) || 30;
        if (!loan1 || !rate1 || !loan2 || !rate2) return null;

        const calcMonthly = (l: number, r: number, y: number) => {
          const mr = r / 100 / 12;
          const n = y * 12;
          return (l * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        };

        const monthly1 = calcMonthly(loan1, rate1, years1);
        const monthly2 = calcMonthly(loan2, rate2, years2);
        const total1 = monthly1 * years1 * 12;
        const total2 = monthly2 * years2 * 12;
        const interest1 = total1 - loan1;
        const interest2 = total2 - loan2;
        const monthlySavings = Math.abs(monthly1 - monthly2);
        const totalSavings = Math.abs(total1 - total2);
        const cheaper = total1 < total2 ? "Option A" : "Option B";

        return {
          primary: {
            label: "Monthly Payment Difference",
            value: `$${formatNumber(monthlySavings)}`,
          },
          details: [
            { label: "Option A monthly payment", value: `$${formatNumber(monthly1)}` },
            { label: "Option B monthly payment", value: `$${formatNumber(monthly2)}` },
            { label: "Option A total interest", value: `$${formatNumber(interest1)}` },
            { label: "Option B total interest", value: `$${formatNumber(interest2)}` },
            { label: "Option A total cost", value: `$${formatNumber(total1)}` },
            { label: "Option B total cost", value: `$${formatNumber(total2)}` },
            { label: "Total savings with cheaper option", value: `$${formatNumber(totalSavings)}` },
            { label: "Better overall deal", value: cheaper },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "arm-mortgage-calculator"],
  faq: [
    {
      question: "How do I compare mortgages?",
      answer:
        "Compare mortgages by looking at the monthly payment, total interest paid, and total cost over the life of the loan. A lower rate doesn't always mean a better deal if the loan amount or term differs.",
    },
    {
      question: "Should I choose the lowest monthly payment?",
      answer:
        "Not necessarily. A longer term gives lower monthly payments but costs more in total interest. Balance affordability with total cost. A 15-year mortgage costs much less overall than a 30-year.",
    },
    {
      question: "What other factors should I compare?",
      answer:
        "Beyond rate and term, consider closing costs, points, PMI requirements, prepayment penalties, and whether the rate is fixed or adjustable.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Compare total cost = Monthly x n for each option.",
};
