import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgagePayoffCalculator: CalculatorDefinition = {
  slug: "mortgage-payoff-calculator",
  title: "Mortgage Payoff Calculator",
  description: "Calculate your mortgage payoff timeline and total interest paid.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mortgage payoff", "payoff calculator", "mortgage payoff date"],
  variants: [{
    id: "standard",
    name: "Mortgage Payoff",
    description: "Calculate your mortgage payoff timeline and total interest paid",
    fields: [
      { name: "balance", label: "Current Balance", type: "number", prefix: "$", min: 1000, max: 2000000, defaultValue: 200000 },
      { name: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.1, max: 15, step: 0.01, defaultValue: 6.0 },
      { name: "payment", label: "Monthly Payment", type: "number", prefix: "$", min: 100, max: 20000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
      const bal = inputs.balance as number;
      const r = (inputs.rate as number) / 100 / 12;
      const pmt = inputs.payment as number;
      if (!bal || bal <= 0 || !r || !pmt || pmt <= bal * r) return null;
      let remaining = bal;
      let months = 0;
      let totalInterest = 0;
      while (remaining > 0 && months < 600) {
        const interest = remaining * r;
        totalInterest += interest;
        remaining -= (pmt - interest);
        months++;
      }
      const totalPaid = pmt * months;
      return {
        primary: { label: "Payoff Time", value: Math.floor(months / 12) + " yrs " + (months % 12) + " mo" },
        details: [
          { label: "Total Payments", value: "$" + formatNumber(totalPaid) },
          { label: "Total Interest", value: "$" + formatNumber(totalInterest) },
          { label: "Interest to Principal Ratio", value: (totalInterest / bal * 100).toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["mortgage-extra-payments-calculator", "mortgage-refinance-break-even-calculator"],
  faq: [
    { question: "How do I pay off my mortgage faster?", answer: "Make extra payments toward principal, switch to biweekly payments, or refinance to a shorter term." },
    { question: "What happens when I pay off my mortgage?", answer: "Your lender releases the lien and you receive full ownership. You will still owe property taxes and insurance." },
  ],
  formula: "Months = iterative amortization until balance reaches zero",
};
