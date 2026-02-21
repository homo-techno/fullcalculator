import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const extraMortgagePaymentCalculator: CalculatorDefinition = {
  slug: "extra-mortgage-payment-calculator",
  title: "Extra Mortgage Payment Calculator",
  description:
    "Free extra mortgage payment calculator. See how extra monthly payments reduce your loan term and total interest. Calculate exactly how much sooner you can pay off your mortgage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "extra mortgage payment calculator",
    "additional mortgage payment",
    "mortgage payoff calculator",
    "extra payment calculator",
    "pay off mortgage early",
  ],
  variants: [
    {
      id: "extra",
      name: "Extra Monthly Payment",
      description: "See the impact of making extra monthly payments on your mortgage",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "25 years", value: "25" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
        {
          name: "extraPayment",
          label: "Extra Monthly Payment",
          type: "number",
          placeholder: "e.g. 300",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 30;
        const extra = (inputs.extraPayment as number) || 0;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const numPayments = years * 12;

        // Standard monthly payment
        const monthlyPayment =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Standard schedule totals
        const totalStandard = monthlyPayment * numPayments;
        const totalInterestStandard = totalStandard - loan;

        // Simulate with extra payment
        let balance = loan;
        let totalInterestExtra = 0;
        let monthsWithExtra = 0;

        while (balance > 0 && monthsWithExtra < numPayments * 2) {
          const interestCharge = balance * monthlyRate;
          totalInterestExtra += interestCharge;
          const totalPayment = Math.min(monthlyPayment + extra, balance + interestCharge);
          const principalPaid = totalPayment - interestCharge;
          balance -= principalPaid;
          monthsWithExtra++;
          if (balance < 0.01) balance = 0;
        }

        const interestSaved = totalInterestStandard - totalInterestExtra;
        const monthsSaved = numPayments - monthsWithExtra;
        const yearsSaved = Math.floor(monthsSaved / 12);
        const remMonths = monthsSaved % 12;
        const newYears = Math.floor(monthsWithExtra / 12);
        const newRemMonths = monthsWithExtra % 12;

        return {
          primary: {
            label: "Total Interest Saved",
            value: `$${formatNumber(interestSaved)}`,
          },
          details: [
            { label: "Standard monthly payment", value: `$${formatNumber(monthlyPayment)}` },
            { label: "Payment with extra", value: `$${formatNumber(monthlyPayment + extra)}` },
            { label: "Original payoff", value: `${years} years` },
            { label: "New payoff time", value: `${newYears} yr ${newRemMonths} mo` },
            { label: "Time saved", value: `${yearsSaved} yr ${remMonths} mo` },
            { label: "Original total interest", value: `$${formatNumber(totalInterestStandard)}` },
            { label: "New total interest", value: `$${formatNumber(totalInterestExtra)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "biweekly-mortgage-calculator", "amortization-calculator"],
  faq: [
    {
      question: "How much does an extra $100/month save on a mortgage?",
      answer:
        "On a $300,000 30-year mortgage at 6.5%, an extra $100/month saves roughly $55,000 in interest and pays off the loan about 4 years early. The higher your rate, the more impactful extra payments become.",
    },
    {
      question: "Should I make extra mortgage payments or invest?",
      answer:
        "If your mortgage rate is below expected investment returns (historically ~7-10% for stocks), investing may yield more. However, paying off the mortgage provides a guaranteed return equal to your interest rate and reduces financial risk. Consider your risk tolerance and tax situation.",
    },
    {
      question: "Do extra payments go to principal?",
      answer:
        "Yes, when you make extra payments, the additional amount goes directly toward the principal balance (make sure to specify this with your lender). This reduces the balance on which future interest is calculated, creating a compounding savings effect.",
    },
  ],
  formula:
    "Interest Saved = Total Interest (standard) - Total Interest (with extra payments). Each extra payment reduces principal, so less interest accrues each month.",
};
