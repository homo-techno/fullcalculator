import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const biweeklyMortgageCalculator: CalculatorDefinition = {
  slug: "biweekly-mortgage-calculator",
  title: "Biweekly Mortgage Calculator",
  description:
    "Free biweekly mortgage calculator. Compare biweekly vs monthly mortgage payments. See how much interest you save and how many years sooner you pay off your loan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "biweekly mortgage calculator",
    "biweekly payment calculator",
    "biweekly vs monthly mortgage",
    "accelerated mortgage payment",
    "biweekly mortgage payoff",
  ],
  variants: [
    {
      id: "compare",
      name: "Biweekly vs Monthly",
      description: "Compare biweekly and monthly mortgage payment schedules",
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
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 30;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const numPayments = years * 12;

        // Standard monthly payment
        const monthlyPayment =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
          (Math.pow(1 + monthlyRate, numPayments) - 1);
        const totalMonthly = monthlyPayment * numPayments;
        const totalInterestMonthly = totalMonthly - loan;

        // Biweekly: half the monthly payment every 2 weeks (26 payments/year = 13 monthly equivalents)
        const biweeklyPayment = monthlyPayment / 2;

        // Simulate biweekly payoff
        let balance = loan;
        let biweeklyTotalInterest = 0;
        let biweeklyPayments = 0;
        const biweeklyRate = rate / 100 / 26; // biweekly rate

        while (balance > 0 && biweeklyPayments < numPayments * 3) {
          const interestCharge = balance * biweeklyRate;
          biweeklyTotalInterest += interestCharge;
          const principalPaid = Math.min(biweeklyPayment - interestCharge, balance);
          balance -= principalPaid;
          biweeklyPayments++;
          if (balance < 0.01) balance = 0;
        }

        const biweeklyMonths = Math.round((biweeklyPayments / 26) * 12);
        const biweeklyYears = Math.floor(biweeklyMonths / 12);
        const biweeklyRemMonths = biweeklyMonths % 12;
        const monthsSaved = numPayments - biweeklyMonths;
        const yearsSaved = Math.floor(monthsSaved / 12);
        const remMonthsSaved = monthsSaved % 12;
        const interestSaved = totalInterestMonthly - biweeklyTotalInterest;

        return {
          primary: {
            label: "Interest Saved with Biweekly",
            value: `$${formatNumber(interestSaved)}`,
          },
          details: [
            { label: "Monthly payment", value: `$${formatNumber(monthlyPayment)}` },
            { label: "Biweekly payment", value: `$${formatNumber(biweeklyPayment)}` },
            { label: "Monthly total interest", value: `$${formatNumber(totalInterestMonthly)}` },
            { label: "Biweekly total interest", value: `$${formatNumber(biweeklyTotalInterest)}` },
            { label: "Monthly payoff", value: `${years} years` },
            { label: "Biweekly payoff", value: `${biweeklyYears} yr ${biweeklyRemMonths} mo` },
            { label: "Time saved", value: `${yearsSaved} yr ${remMonthsSaved} mo` },
          ],
          note: "Biweekly payments result in 26 half-payments per year, equivalent to 13 full monthly payments instead of 12.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "extra-mortgage-payment-calculator", "amortization-calculator"],
  faq: [
    {
      question: "How does a biweekly mortgage work?",
      answer:
        "With biweekly payments, you pay half your monthly mortgage every two weeks. Since there are 52 weeks in a year, you make 26 half-payments (equivalent to 13 full monthly payments). That extra payment goes directly to principal, reducing your loan term and total interest.",
    },
    {
      question: "How much can I save with biweekly payments?",
      answer:
        "On a $300,000 30-year mortgage at 6.5%, biweekly payments can save approximately $70,000+ in interest and pay off your loan about 4-5 years early. The exact savings depend on your loan amount, rate, and term.",
    },
    {
      question: "Do all lenders offer biweekly payment plans?",
      answer:
        "Not all lenders formally offer biweekly plans. Some charge setup fees. You can achieve the same result by making one extra monthly payment per year or adding 1/12 of your monthly payment to each monthly check.",
    },
  ],
  formula:
    "Biweekly Payment = Monthly Payment / 2. 26 biweekly payments/year = 13 monthly payments. Interest saved = Total Monthly Interest - Total Biweekly Interest.",
};
