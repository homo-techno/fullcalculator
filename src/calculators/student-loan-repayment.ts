import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanRepaymentCalculator: CalculatorDefinition = {
  slug: "student-loan-repayment-calculator",
  title: "Student Loan Repayment Calculator",
  description:
    "Free student loan repayment calculator. Compare repayment plans, see payoff timelines, and find how extra payments reduce your total cost.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "student loan repayment calculator",
    "loan payoff calculator",
    "student loan payoff",
    "extra payment calculator",
    "repayment plan comparison",
  ],
  variants: [
    {
      id: "payoff",
      name: "Loan Payoff Timeline",
      description: "Calculate your payoff date and total cost with optional extra payments",
      fields: [
        { name: "balance", label: "Loan Balance ($)", type: "number", placeholder: "e.g. 35000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "monthlyPayment", label: "Monthly Payment ($)", type: "number", placeholder: "e.g. 400" },
        { name: "extraPayment", label: "Extra Monthly Payment ($)", type: "number", placeholder: "e.g. 100", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const rate = inputs.interestRate as number;
        const payment = inputs.monthlyPayment as number;
        const extra = (inputs.extraPayment as number) || 0;
        if (!balance || !rate || !payment) return null;

        const monthlyRate = (rate / 100) / 12;
        const totalPayment = payment + extra;

        if (totalPayment <= balance * monthlyRate) {
          return {
            primary: { label: "Payoff Timeline", value: "Never" },
            details: [
              { label: "Monthly interest", value: `$${formatNumber(balance * monthlyRate, 2)}` },
              { label: "Your payment", value: `$${formatNumber(totalPayment, 2)}` },
            ],
            note: "Your payment does not cover the monthly interest. Increase your payment to begin paying off the loan.",
          };
        }

        // Standard payoff
        let remainStd = balance;
        let monthsStd = 0;
        let totalInterestStd = 0;
        while (remainStd > 0 && monthsStd < 600) {
          const interest = remainStd * monthlyRate;
          totalInterestStd += interest;
          remainStd = remainStd + interest - payment;
          monthsStd++;
          if (remainStd < 0) remainStd = 0;
        }

        // With extra payments
        let remainExtra = balance;
        let monthsExtra = 0;
        let totalInterestExtra = 0;
        while (remainExtra > 0 && monthsExtra < 600) {
          const interest = remainExtra * monthlyRate;
          totalInterestExtra += interest;
          remainExtra = remainExtra + interest - totalPayment;
          monthsExtra++;
          if (remainExtra < 0) remainExtra = 0;
        }

        const yearsStd = Math.floor(monthsStd / 12);
        const moStd = monthsStd % 12;
        const yearsExtra = Math.floor(monthsExtra / 12);
        const moExtra = monthsExtra % 12;

        return {
          primary: { label: "Payoff Time (with extra)", value: `${yearsExtra}y ${moExtra}m` },
          details: [
            { label: "Standard payoff time", value: `${yearsStd}y ${moStd}m` },
            { label: "Time saved with extra payments", value: `${monthsStd - monthsExtra} months` },
            { label: "Total interest (standard)", value: `$${formatNumber(totalInterestStd, 2)}` },
            { label: "Total interest (with extra)", value: `$${formatNumber(totalInterestExtra, 2)}` },
            { label: "Interest saved", value: `$${formatNumber(totalInterestStd - totalInterestExtra, 2)}` },
            { label: "Total cost (standard)", value: `$${formatNumber(balance + totalInterestStd, 2)}` },
            { label: "Total cost (with extra)", value: `$${formatNumber(balance + totalInterestExtra, 2)}` },
          ],
        };
      },
    },
    {
      id: "planComparison",
      name: "Repayment Plan Comparison",
      description: "Compare Standard (10yr), Extended (25yr), and Graduated repayment plans",
      fields: [
        { name: "balance", label: "Loan Balance ($)", type: "number", placeholder: "e.g. 50000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 6.0" },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const rate = inputs.interestRate as number;
        if (!balance || !rate) return null;

        const monthlyRate = (rate / 100) / 12;

        // Standard: 10 years
        const std10 = 120;
        const pmt10 = balance * (monthlyRate * Math.pow(1 + monthlyRate, std10)) / (Math.pow(1 + monthlyRate, std10) - 1);
        const total10 = pmt10 * std10;

        // Extended: 25 years
        const ext25 = 300;
        const pmt25 = balance * (monthlyRate * Math.pow(1 + monthlyRate, ext25)) / (Math.pow(1 + monthlyRate, ext25) - 1);
        const total25 = pmt25 * ext25;

        // Graduated: starts at 60% of standard, increases every 2 years
        const gradStart = pmt10 * 0.6;
        const gradEnd = pmt10 * 1.5;

        return {
          primary: { label: "Standard Monthly Payment (10yr)", value: `$${formatNumber(pmt10, 2)}` },
          details: [
            { label: "Standard total interest", value: `$${formatNumber(total10 - balance, 2)}` },
            { label: "Extended monthly payment (25yr)", value: `$${formatNumber(pmt25, 2)}` },
            { label: "Extended total interest", value: `$${formatNumber(total25 - balance, 2)}` },
            { label: "Graduated starting payment", value: `$${formatNumber(gradStart, 2)}` },
            { label: "Graduated ending payment", value: `~$${formatNumber(gradEnd, 2)}` },
            { label: "Extra cost of extended plan", value: `$${formatNumber((total25 - balance) - (total10 - balance), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-loan-calculator", "student-loan-interest-calculator", "student-budget-calculator"],
  faq: [
    {
      question: "How much can I save with extra payments?",
      answer:
        "Even an extra $50-100/month can save thousands in interest and shave years off your repayment. On a $30,000 loan at 6%, an extra $100/month saves about $4,500 in interest and pays off 3.5 years early.",
    },
    {
      question: "What is the difference between standard and extended repayment?",
      answer:
        "Standard repayment is 10 years with fixed payments. Extended is 25 years with lower monthly payments but significantly more total interest. Extended plans can cost 2-3x more in interest.",
    },
    {
      question: "What is graduated repayment?",
      answer:
        "Graduated repayment starts with lower payments that increase every two years over a 10-year term. It is designed for borrowers who expect their income to grow over time.",
    },
  ],
  formula: "Monthly Payment = P x [r(1+r)^n] / [(1+r)^n - 1]",
};
