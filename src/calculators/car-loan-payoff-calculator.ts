import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carLoanPayoffCalculator: CalculatorDefinition = {
  slug: "car-loan-payoff-calculator",
  title: "Car Loan Payoff Calculator",
  description: "See how extra payments reduce your car loan payoff time",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car loan payoff","auto loan extra payment","car loan early payoff"],
  variants: [{
    id: "standard",
    name: "Car Loan Payoff",
    description: "See how extra payments reduce your car loan payoff time",
    fields: [
      { name: "loanBalance", label: "Remaining Loan Balance ($)", type: "number", defaultValue: 20000, min: 0, step: 1000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: 5.0, min: 0, max: 20, step: 0.1 },
      { name: "monthlyPayment", label: "Current Monthly Payment ($)", type: "number", defaultValue: 400, min: 0, step: 25 },
      { name: "extraPayment", label: "Extra Monthly Payment ($)", type: "number", defaultValue: 100, min: 0, step: 25 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const balance = inputs.loanBalance as number || 20000;
      const rate = (inputs.interestRate as number || 5) / 100 / 12;
      const payment = inputs.monthlyPayment as number || 400;
      const extra = inputs.extraPayment as number || 100;
      let bal1 = balance, months1 = 0, interest1 = 0;
      while (bal1 > 0 && months1 < 360) {
        const int1 = bal1 * rate;
        interest1 += int1;
        bal1 = bal1 + int1 - payment;
        months1++;
        if (bal1 <= 0) break;
      }
      let bal2 = balance, months2 = 0, interest2 = 0;
      while (bal2 > 0 && months2 < 360) {
        const int2 = bal2 * rate;
        interest2 += int2;
        bal2 = bal2 + int2 - payment - extra;
        months2++;
        if (bal2 <= 0) break;
      }
      const monthsSaved = months1 - months2;
      const interestSaved = interest1 - interest2;
      return {
        primary: { label: "Time Saved", value: monthsSaved + " months" },
        details: [
          { label: "Original Payoff", value: months1 + " months" },
          { label: "New Payoff", value: months2 + " months" },
          { label: "Interest Saved", value: "$" + formatNumber(Math.round(interestSaved)) },
          { label: "Total Interest (original)", value: "$" + formatNumber(Math.round(interest1)) }
        ]
      };
    },
  }],
  relatedSlugs: ["car-lease-vs-buy-calculator"],
  faq: [
    { question: "How much can extra payments save?", answer: "Even $50-100 extra per month can save hundreds in interest and pay off your loan months earlier." },
    { question: "Are there penalties for early payoff?", answer: "Most auto loans do not have prepayment penalties, but check your loan agreement to be sure." },
  ],
  formula: "Compare payoff schedules with and without extra monthly payments",
};
