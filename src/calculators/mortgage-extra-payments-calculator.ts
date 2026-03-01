import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageExtraPaymentsCalculator: CalculatorDefinition = {
  slug: "mortgage-extra-payments-calculator",
  title: "Mortgage Extra Payments Calculator",
  description: "See how extra monthly payments reduce your mortgage term and total interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mortgage extra payments", "extra payment calculator", "pay off mortgage early"],
  variants: [{
    id: "standard",
    name: "Mortgage Extra Payments",
    description: "See how extra monthly payments reduce your mortgage term and total interest",
    fields: [
      { name: "balance", label: "Remaining Balance", type: "number", prefix: "$", min: 10000, max: 2000000, defaultValue: 250000 },
      { name: "rate", label: "Interest Rate", type: "number", suffix: "%", min: 0.1, max: 15, step: 0.01, defaultValue: 6.0 },
      { name: "remainingTerm", label: "Remaining Term", type: "number", suffix: "years", min: 1, max: 30, defaultValue: 25 },
      { name: "extraMonthly", label: "Extra Monthly Payment", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const bal = inputs.balance as number;
      const r = (inputs.rate as number) / 100 / 12;
      const termMo = (inputs.remainingTerm as number) * 12;
      const extra = inputs.extraMonthly as number;
      if (!bal || bal <= 0 || !r || !termMo) return null;
      const basePmt = bal * r / (1 - Math.pow(1 + r, -termMo));
      let balNormal = bal;
      let balExtra = bal;
      let totalNormal = 0;
      let totalExtra = 0;
      let moExtra = 0;
      for (let i = 0; i < termMo; i++) {
        if (balNormal > 0) { const int = balNormal * r; balNormal -= (basePmt - int); totalNormal += basePmt; }
        if (balExtra > 0) { const int = balExtra * r; balExtra -= (basePmt + extra - int); totalExtra += basePmt + extra; moExtra = i + 1; }
      }
      const monthsSaved = termMo - moExtra;
      const interestSaved = totalNormal - totalExtra;
      return {
        primary: { label: "Time Saved", value: Math.floor(monthsSaved / 12) + " yrs " + (monthsSaved % 12) + " mo" },
        details: [
          { label: "Base Payment", value: "$" + formatNumber(basePmt) },
          { label: "New Payment", value: "$" + formatNumber(basePmt + extra) },
          { label: "Interest Saved", value: "$" + formatNumber(Math.max(0, interestSaved)) },
          { label: "New Payoff Time", value: Math.floor(moExtra / 12) + " yrs " + (moExtra % 12) + " mo" },
        ],
      };
    },
  }],
  relatedSlugs: ["mortgage-payoff-calculator", "biweekly-mortgage-payment-calculator"],
  faq: [
    { question: "How much do extra mortgage payments save?", answer: "Even $100 extra per month can save thousands in interest and shorten your loan by several years." },
    { question: "Should I make extra payments or invest?", answer: "If your mortgage rate is higher than your expected investment return after taxes, extra payments may be better." },
  ],
  formula: "New Payoff = Amortize(Balance, Rate, Base Payment + Extra)",
};
