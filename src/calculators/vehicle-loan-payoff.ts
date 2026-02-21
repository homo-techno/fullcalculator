import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vehicleLoanPayoffCalculator: CalculatorDefinition = {
  slug: "vehicle-loan-payoff-calculator",
  title: "Vehicle Loan Payoff Calculator",
  description: "Free early vehicle loan payoff calculator. See how extra payments can help you pay off your car loan faster and save on interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vehicle loan payoff", "car loan payoff calculator", "early payoff calculator", "extra payment calculator", "auto loan payoff"],
  variants: [
    {
      id: "extra",
      name: "Extra Payment Savings",
      description: "See how extra payments reduce your loan term and interest",
      fields: [
        { name: "balance", label: "Current Loan Balance", type: "number", placeholder: "e.g. 22000", prefix: "$" },
        { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", suffix: "%" },
        { name: "monthlyPayment", label: "Current Monthly Payment", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "extraMonthly", label: "Extra Monthly Payment", type: "number", placeholder: "e.g. 100", prefix: "$" },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = inputs.rate as number;
        const payment = inputs.monthlyPayment as number;
        const extra = (inputs.extraMonthly as number) || 0;
        if (!balance || !apr || !payment) return null;

        const r = apr / 100 / 12;

        // Calculate months without extra payment
        let remainingNormal = balance;
        let monthsNormal = 0;
        let totalInterestNormal = 0;
        while (remainingNormal > 0 && monthsNormal < 360) {
          const interest = remainingNormal * r;
          totalInterestNormal += interest;
          remainingNormal -= (payment - interest);
          monthsNormal++;
        }

        // Calculate months with extra payment
        let remainingExtra = balance;
        let monthsExtra = 0;
        let totalInterestExtra = 0;
        const newPayment = payment + extra;
        while (remainingExtra > 0 && monthsExtra < 360) {
          const interest = remainingExtra * r;
          totalInterestExtra += interest;
          const principalPaid = Math.min(remainingExtra, newPayment - interest);
          remainingExtra -= principalPaid;
          monthsExtra++;
        }

        const monthsSaved = monthsNormal - monthsExtra;
        const interestSaved = totalInterestNormal - totalInterestExtra;
        const yearsNormal = Math.floor(monthsNormal / 12);
        const moNormal = monthsNormal % 12;
        const yearsExtra = Math.floor(monthsExtra / 12);
        const moExtra = monthsExtra % 12;

        return {
          primary: { label: "Interest Saved", value: `$${formatNumber(interestSaved)}` },
          details: [
            { label: "Current payoff time", value: `${yearsNormal} yr ${moNormal} mo (${monthsNormal} months)` },
            { label: "New payoff time", value: `${yearsExtra} yr ${moExtra} mo (${monthsExtra} months)` },
            { label: "Months saved", value: `${monthsSaved} months` },
            { label: "Total interest (current)", value: `$${formatNumber(totalInterestNormal)}` },
            { label: "Total interest (with extra)", value: `$${formatNumber(totalInterestExtra)}` },
          ],
        };
      },
    },
    {
      id: "targetdate",
      name: "Pay Off by Target Date",
      description: "Calculate the payment needed to pay off by a specific date",
      fields: [
        { name: "balance", label: "Current Loan Balance", type: "number", placeholder: "e.g. 22000", prefix: "$" },
        { name: "rate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5", suffix: "%" },
        { name: "targetMonths", label: "Target Payoff Time", type: "select", options: [
          { label: "6 months", value: "6" },
          { label: "12 months (1 year)", value: "12" },
          { label: "18 months", value: "18" },
          { label: "24 months (2 years)", value: "24" },
          { label: "36 months (3 years)", value: "36" },
        ], defaultValue: "24" },
      ],
      calculate: (inputs) => {
        const balance = inputs.balance as number;
        const apr = inputs.rate as number;
        const months = parseInt(inputs.targetMonths as string) || 24;
        if (!balance || !apr) return null;

        const r = apr / 100 / 12;
        const requiredPayment = balance * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        const totalPaid = requiredPayment * months;
        const totalInterest = totalPaid - balance;

        return {
          primary: { label: "Required Monthly Payment", value: `$${formatNumber(requiredPayment)}` },
          details: [
            { label: "Current balance", value: `$${formatNumber(balance)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Payoff in", value: `${months} months` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-payment-calculator", "debt-payoff-calculator"],
  faq: [
    { question: "Is it worth paying off a car loan early?", answer: "Usually yes, if your interest rate is above 4-5% and there is no prepayment penalty. You save on interest and free up monthly cash flow. However, if your rate is very low (0-2%), you might earn more by investing the extra money instead." },
    { question: "Do car loans have prepayment penalties?", answer: "Most modern car loans do not have prepayment penalties, but some lenders (especially subprime) may charge one. Check your loan agreement for terms like 'prepayment penalty' or 'early payoff fee.' Federal law requires disclosure of any prepayment penalty." },
    { question: "Should I pay extra toward principal or make lump sum payments?", answer: "Both methods save interest. Consistent extra monthly payments are easier to budget. Lump sum payments (e.g., tax refund, bonus) create immediate impact. Always specify that extra payments should be applied to principal, not future payments." },
  ],
  formula: "Months to Pay Off = -ln(1 - rB/P) / ln(1+r); Interest Saved = Total Interest (standard) - Total Interest (with extra payments)",
};
