import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicalDebtCalculator: CalculatorDefinition = {
  slug: "medical-debt-calculator",
  title: "Medical Debt Calculator",
  description: "Plan medical debt repayment by calculating monthly payments, total interest, and payoff timeline.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medical debt repayment", "medical bill calculator", "medical debt payoff"],
  variants: [{
    id: "standard",
    name: "Medical Debt",
    description: "Plan medical debt repayment by calculating monthly payments, total interest, and payoff timeline",
    fields: [
      { name: "totalDebt", label: "Total Medical Debt", type: "number", prefix: "$", min: 100, max: 1000000, step: 100, defaultValue: 15000 },
      { name: "interestRate", label: "Interest Rate (if financed)", type: "number", suffix: "%", min: 0, max: 30, step: 0.5, defaultValue: 8 },
      { name: "monthlyPayment", label: "Monthly Payment Amount", type: "number", prefix: "$", min: 25, max: 50000, step: 25, defaultValue: 300 },
    ],
    calculate: (inputs) => {
      const debt = inputs.totalDebt as number;
      const rate = (inputs.interestRate as number) / 100 / 12;
      const payment = inputs.monthlyPayment as number;
      if (!debt || !payment || debt <= 0 || payment <= 0) return null;
      let balance = debt;
      let totalPaid = 0;
      let totalInterest = 0;
      let months = 0;
      const maxMonths = 600;
      while (balance > 0 && months < maxMonths) {
        const interest = balance * rate;
        totalInterest += interest;
        balance = balance + interest - payment;
        totalPaid += payment;
        months++;
        if (payment <= balance * rate) {
          return {
            primary: { label: "Payment Too Low", value: "Debt will not be paid off" },
            details: [
              { label: "Monthly Interest Charge", value: "$" + formatNumber(Math.round(debt * rate * 100) / 100) },
              { label: "Minimum Payment Needed", value: "$" + formatNumber(Math.round(debt * rate * 1.1 * 100) / 100) },
              { label: "Total Debt", value: "$" + formatNumber(debt) },
            ],
          };
        }
      }
      if (balance < 0) { totalPaid += balance; }
      const years = Math.floor(months / 12);
      const remainMonths = months % 12;
      const timeline = years > 0 ? years + " years " + remainMonths + " months" : months + " months";
      return {
        primary: { label: "Payoff Timeline", value: timeline },
        details: [
          { label: "Total Amount Paid", value: "$" + formatNumber(Math.round(totalPaid)) },
          { label: "Total Interest Paid", value: "$" + formatNumber(Math.round(totalInterest)) },
          { label: "Interest as Percent of Debt", value: formatNumber(Math.round(totalInterest / debt * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["nursing-home-cost-calculator", "disability-benefits-calculator"],
  faq: [
    { question: "Can you negotiate medical debt?", answer: "Yes, medical debt is often negotiable. Many hospitals offer financial assistance programs, and providers may accept 20 to 50 percent less than the billed amount for lump-sum payments or hardship cases." },
    { question: "Does medical debt affect your credit score?", answer: "Medical debt under $500 no longer appears on credit reports. Larger debts may appear after a one-year waiting period, giving you time to resolve billing disputes or set up payment plans." },
  ],
  formula: "Payoff calculated by iterating: New Balance = (Old Balance + Monthly Interest) - Monthly Payment",
};
