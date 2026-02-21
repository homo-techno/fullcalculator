import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtSnowballCalculator: CalculatorDefinition = {
  slug: "debt-snowball-calculator",
  title: "Debt Snowball Calculator",
  description:
    "Free debt snowball calculator. Compare debt snowball payoff strategies vs minimum payments and see how much time and interest you can save.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt snowball", "debt payoff", "debt free", "debt repayment", "snowball method"],
  variants: [
    {
      id: "snowball",
      name: "Debt Snowball Payoff",
      fields: [
        { name: "totalDebt", label: "Total Debt ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "monthlyPayment", label: "Monthly Payment ($)", type: "number", placeholder: "e.g. 1000" },
        { name: "avgInterestRate", label: "Average Interest Rate (%)", type: "number", placeholder: "e.g. 18" },
      ],
      calculate: (inputs) => {
        const totalDebt = inputs.totalDebt as number;
        const monthlyPayment = inputs.monthlyPayment as number;
        const avgInterestRate = inputs.avgInterestRate as number;

        if (!totalDebt || !monthlyPayment || !avgInterestRate) return null;

        const monthlyRate = (avgInterestRate / 100) / 12;

        // Minimum payment scenario (paying only minimum ~2% of balance or $25)
        let minBalance = totalDebt;
        let minMonths = 0;
        let minTotalInterest = 0;
        const maxMinMonths = 600; // cap at 50 years

        while (minBalance > 0 && minMonths < maxMinMonths) {
          const interest = minBalance * monthlyRate;
          const minPay = Math.max(minBalance * 0.02, 25);
          const actualPay = Math.min(minPay, minBalance + interest);
          minTotalInterest += interest;
          minBalance = minBalance + interest - actualPay;
          minMonths++;
          if (minBalance < 0.01) break;
        }

        // Aggressive payment scenario (snowball)
        let snowBalance = totalDebt;
        let snowMonths = 0;
        let snowTotalInterest = 0;

        while (snowBalance > 0) {
          const interest = snowBalance * monthlyRate;
          const payment = Math.min(monthlyPayment, snowBalance + interest);
          snowTotalInterest += interest;
          snowBalance = snowBalance + interest - payment;
          snowMonths++;
          if (snowBalance < 0.01) break;
          if (snowMonths > maxMinMonths) break;
        }

        const monthsSaved = minMonths - snowMonths;
        const interestSaved = minTotalInterest - snowTotalInterest;
        const totalPaidSnowball = totalDebt + snowTotalInterest;

        return {
          primary: { label: "Snowball Payoff Time", value: `${snowMonths} months (${formatNumber(snowMonths / 12, 1)} years)` },
          details: [
            { label: "Minimum Payment Payoff", value: `${minMonths} months (${formatNumber(minMonths / 12, 1)} years)` },
            { label: "Time Saved", value: `${monthsSaved} months (${formatNumber(monthsSaved / 12, 1)} years)` },
            { label: "Snowball Total Interest", value: `$${formatNumber(snowTotalInterest, 2)}` },
            { label: "Minimum Payment Total Interest", value: `$${formatNumber(minTotalInterest, 2)}` },
            { label: "Interest Saved", value: `$${formatNumber(interestSaved, 2)}` },
            { label: "Total Cost (Snowball)", value: `$${formatNumber(totalPaidSnowball, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-loan-calculator", "budget-calculator", "business-loan-calculator"],
  faq: [
    { question: "What is the debt snowball method?", answer: "The debt snowball method focuses on paying off the smallest debts first while making minimum payments on larger debts. As each small debt is paid off, that payment amount is added to the next smallest debt, creating a snowball effect." },
    { question: "Debt snowball vs debt avalanche?", answer: "The snowball method pays smallest balances first for psychological wins. The avalanche method pays highest interest rates first, saving more money mathematically. Both are effective strategies." },
  ],
  formula: "Each month: Interest = Balance × Monthly Rate; New Balance = Balance + Interest - Payment. Repeat until paid off.",
};
