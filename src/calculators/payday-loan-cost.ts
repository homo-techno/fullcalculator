import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paydayLoanCostCalculator: CalculatorDefinition = {
  slug: "payday-loan-cost-calculator",
  title: "Payday Loan Cost Calculator",
  description:
    "Free payday loan cost calculator. See the true cost and effective APR of payday loans to understand how expensive short-term borrowing really is before committing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "payday loan calculator",
    "payday loan cost",
    "payday loan apr",
    "cash advance calculator",
    "short term loan cost",
    "payday loan fees",
  ],
  variants: [
    {
      id: "payday-cost",
      name: "Payday Loan True Cost",
      description: "Calculate the true cost and effective APR of a payday loan",
      fields: [
        {
          name: "borrowAmount",
          label: "Amount Borrowed",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "feePer100",
          label: "Fee per $100 Borrowed",
          type: "select",
          options: [
            { label: "$10 per $100", value: "10" },
            { label: "$15 per $100", value: "15" },
            { label: "$20 per $100", value: "20" },
            { label: "$25 per $100", value: "25" },
            { label: "$30 per $100", value: "30" },
          ],
          defaultValue: "15",
        },
        {
          name: "loanTerm",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "7 days", value: "7" },
            { label: "14 days", value: "14" },
            { label: "21 days", value: "21" },
            { label: "30 days", value: "30" },
          ],
          defaultValue: "14",
        },
        {
          name: "rollovers",
          label: "Number of Rollovers",
          type: "select",
          options: [
            { label: "0 (pay on time)", value: "0" },
            { label: "1 rollover", value: "1" },
            { label: "2 rollovers", value: "2" },
            { label: "3 rollovers", value: "3" },
            { label: "4 rollovers", value: "4" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.borrowAmount as number;
        const feePer100 = parseFloat(inputs.feePer100 as string) || 15;
        const termDays = parseInt(inputs.loanTerm as string) || 14;
        const rollovers = parseInt(inputs.rollovers as string) || 0;
        if (!amount) return null;

        const feeRate = feePer100 / 100;
        const singleFee = amount * feeRate;
        const totalFees = singleFee * (1 + rollovers);
        const totalRepayment = amount + totalFees;
        const totalDays = termDays * (1 + rollovers);
        const effectiveAPR = (totalFees / amount) * (365 / totalDays) * 100;
        const costPerDollar = totalFees / amount;

        return {
          primary: {
            label: "Effective APR",
            value: `${formatNumber(effectiveAPR)}%`,
          },
          details: [
            { label: "Amount borrowed", value: `$${formatNumber(amount)}` },
            { label: "Fee per loan period", value: `$${formatNumber(singleFee)}` },
            { label: "Total fees (incl. rollovers)", value: `$${formatNumber(totalFees)}` },
            { label: "Total repayment amount", value: `$${formatNumber(totalRepayment)}` },
            { label: "Total loan duration", value: `${totalDays} days` },
            { label: "Cost per dollar borrowed", value: `$${formatNumber(costPerDollar)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "credit-card-payoff-calculator"],
  faq: [
    {
      question: "What is the typical APR of a payday loan?",
      answer:
        "Payday loans typically have effective APRs of 300-700% or higher. A common fee of $15 per $100 borrowed for a 14-day term equals an APR of approximately 391%. Rollovers increase this significantly.",
    },
    {
      question: "What is a payday loan rollover?",
      answer:
        "A rollover occurs when you can't repay your payday loan on time and extend it by paying another fee. Each rollover adds a new fee equal to the original, making the loan increasingly expensive.",
    },
    {
      question: "What are alternatives to payday loans?",
      answer:
        "Alternatives include personal loans, credit union payday alternative loans (PALs), payment plans with creditors, paycheck advances from employers, community assistance programs, and credit card cash advances.",
    },
  ],
  formula:
    "Fee = Amount x (Fee per $100 / 100). Effective APR = (Total Fees / Amount) x (365 / Total Days) x 100.",
};
