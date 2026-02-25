import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fifteenVsThirtyMortgageCalculator: CalculatorDefinition = {
  slug: "15-vs-30-mortgage-calculator",
  title: "15 vs 30 Year Mortgage Comparison",
  description:
    "Free 15 vs 30 year mortgage comparison calculator. Compare monthly payments, total interest, and overall costs between a 15-year and 30-year mortgage to find the best option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "15 vs 30 mortgage",
    "15 year mortgage calculator",
    "30 year mortgage calculator",
    "mortgage term comparison",
    "short term mortgage",
    "15 year vs 30 year",
  ],
  variants: [
    {
      id: "15-vs-30",
      name: "15 vs 30 Year Comparison",
      description: "Compare a 15-year mortgage with a 30-year mortgage",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate15",
          label: "15-Year Interest Rate",
          type: "number",
          placeholder: "e.g. 5.75",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "rate30",
          label: "30-Year Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate15 = inputs.rate15 as number;
        const rate30 = inputs.rate30 as number;
        if (!loan || !rate15 || !rate30) return null;

        const calcMonthly = (l: number, r: number, y: number) => {
          const mr = r / 100 / 12;
          const n = y * 12;
          return (l * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        };

        const monthly15 = calcMonthly(loan, rate15, 15);
        const monthly30 = calcMonthly(loan, rate30, 30);
        const total15 = monthly15 * 180;
        const total30 = monthly30 * 360;
        const interest15 = total15 - loan;
        const interest30 = total30 - loan;
        const interestSavings = interest30 - interest15;
        const monthlyDiff = monthly15 - monthly30;

        return {
          primary: {
            label: "Interest Savings with 15-Year",
            value: `$${formatNumber(interestSavings)}`,
          },
          details: [
            { label: "15-year monthly payment", value: `$${formatNumber(monthly15)}` },
            { label: "30-year monthly payment", value: `$${formatNumber(monthly30)}` },
            { label: "Monthly payment difference", value: `$${formatNumber(monthlyDiff)}` },
            { label: "15-year total interest", value: `$${formatNumber(interest15)}` },
            { label: "30-year total interest", value: `$${formatNumber(interest30)}` },
            { label: "15-year total cost", value: `$${formatNumber(total15)}` },
            { label: "30-year total cost", value: `$${formatNumber(total30)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "mortgage-comparison-calculator"],
  faq: [
    {
      question: "Why is a 15-year mortgage rate lower than a 30-year?",
      answer:
        "Lenders offer lower rates on 15-year mortgages because they carry less risk. The shorter term means less exposure to market changes and faster equity building, typically saving 0.5-1% compared to 30-year rates.",
    },
    {
      question: "How much do you save with a 15-year mortgage?",
      answer:
        "A 15-year mortgage typically saves you more than half the total interest compared to a 30-year mortgage, even with a lower rate. However, the monthly payment is significantly higher.",
    },
    {
      question: "Which mortgage term should I choose?",
      answer:
        "Choose a 15-year if you can comfortably afford the higher payments and want to save on interest. Choose a 30-year for lower monthly payments and more financial flexibility, or if you plan to invest the difference.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Interest Savings = Total30 - Total15.",
};
