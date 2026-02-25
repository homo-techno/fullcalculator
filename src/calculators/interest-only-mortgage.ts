import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interestOnlyMortgageCalculator: CalculatorDefinition = {
  slug: "interest-only-mortgage-calculator",
  title: "Interest-Only Mortgage Calculator",
  description:
    "Free interest-only mortgage calculator. Compare interest-only payments with fully amortizing payments and see the impact on total costs when the interest-only period ends.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "interest only mortgage calculator",
    "interest only payment",
    "IO mortgage calculator",
    "interest only loan",
    "interest only home loan",
  ],
  variants: [
    {
      id: "io-payment",
      name: "Interest-Only Payment",
      description: "Calculate interest-only vs fully amortizing payments",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "%",
          min: 0,
          max: 30,
          step: 0.01,
        },
        {
          name: "ioPeriod",
          label: "Interest-Only Period",
          type: "select",
          options: [
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "10",
        },
        {
          name: "totalTerm",
          label: "Total Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "15 years", value: "15" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.rate as number;
        const ioYears = parseInt(inputs.ioPeriod as string) || 10;
        const totalYears = parseInt(inputs.totalTerm as string) || 30;
        if (!loan || !rate) return null;

        const monthlyRate = rate / 100 / 12;
        const ioPayment = loan * monthlyRate;
        const ioMonths = ioYears * 12;
        const totalIOInterest = ioPayment * ioMonths;

        const remainingMonths = (totalYears - ioYears) * 12;
        const amortPayment =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths))) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        const totalAmortPaid = amortPayment * remainingMonths;
        const totalAmortInterest = totalAmortPaid - loan;

        const fullTermPayments = totalYears * 12;
        const fullyAmortized =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, fullTermPayments))) /
          (Math.pow(1 + monthlyRate, fullTermPayments) - 1);
        const totalInterest = totalIOInterest + totalAmortInterest;
        const savings = ioPayment > 0 ? fullyAmortized - ioPayment : 0;

        return {
          primary: {
            label: "Interest-Only Payment",
            value: `$${formatNumber(ioPayment)}`,
          },
          details: [
            { label: "Payment after IO period", value: `$${formatNumber(amortPayment)}` },
            { label: "Fully amortized payment (comparison)", value: `$${formatNumber(fullyAmortized)}` },
            { label: "Monthly savings during IO", value: `$${formatNumber(savings)}` },
            { label: "Total interest (IO + amort)", value: `$${formatNumber(totalInterest)}` },
            { label: "Extra interest vs fully amortized", value: `$${formatNumber(totalInterest - (fullyAmortized * fullTermPayments - loan))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "arm-mortgage-calculator"],
  faq: [
    {
      question: "What is an interest-only mortgage?",
      answer:
        "An interest-only mortgage lets you pay only interest for a set period (typically 5-10 years). After that, you pay principal and interest over the remaining term, resulting in higher payments.",
    },
    {
      question: "Why choose interest-only?",
      answer:
        "Interest-only mortgages offer lower initial payments, freeing cash for investments or other uses. They suit borrowers who expect higher future income or plan to sell before the IO period ends.",
    },
    {
      question: "What are the risks?",
      answer:
        "You build no equity during the IO period, payments jump significantly afterward, and you pay more total interest. If home values decline, you could owe more than the home is worth.",
    },
  ],
  formula: "IO Payment = P x r. After IO: M = P[r(1+r)^n] / [(1+r)^n - 1] for remaining term",
};
