import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicalLoanCalculator: CalculatorDefinition = {
  slug: "medical-loan-calculator",
  title: "Medical Loan Calculator",
  description:
    "Free medical loan calculator. Estimate monthly payments and total cost for financing medical procedures, dental work, cosmetic surgery, or other healthcare expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "medical loan calculator",
    "medical financing calculator",
    "healthcare loan",
    "dental loan calculator",
    "surgery financing",
    "medical payment plan",
  ],
  variants: [
    {
      id: "medical-loan-payment",
      name: "Medical Loan Payment",
      description: "Calculate monthly payments for medical financing",
      fields: [
        {
          name: "procedureCost",
          label: "Total Medical Cost",
          type: "number",
          placeholder: "e.g. 15000",
          prefix: "$",
          min: 0,
        },
        {
          name: "insuranceCoverage",
          label: "Insurance Coverage / Deposit",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate (APR)",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "term",
          label: "Repayment Term",
          type: "select",
          options: [
            { label: "6 months", value: "0.5" },
            { label: "12 months", value: "1" },
            { label: "24 months", value: "2" },
            { label: "36 months", value: "3" },
            { label: "48 months", value: "4" },
            { label: "60 months", value: "5" },
          ],
          defaultValue: "2",
        },
        {
          name: "promoRate",
          label: "Promotional 0% APR Period",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "6 months", value: "6" },
            { label: "12 months", value: "12" },
            { label: "18 months", value: "18" },
            { label: "24 months", value: "24" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const cost = inputs.procedureCost as number;
        const insurance = (inputs.insuranceCoverage as number) || 0;
        const rate = inputs.interestRate as number;
        const years = parseFloat(inputs.term as string) || 2;
        const promoMonths = parseInt(inputs.promoRate as string) || 0;
        if (!cost || !rate) return null;

        const loanAmount = cost - insurance;
        if (loanAmount <= 0) return null;

        const totalMonths = Math.round(years * 12);
        const mr = rate / 100 / 12;

        let totalInterest = 0;
        let monthly: number;

        if (promoMonths >= totalMonths) {
          // Entire loan is within promo period
          monthly = loanAmount / totalMonths;
          totalInterest = 0;
        } else if (promoMonths > 0) {
          // Partial promo: interest-free payments, then regular
          const promoPayment = loanAmount / totalMonths;
          const remainingBalance = loanAmount - promoPayment * promoMonths;
          const remainingMonths = totalMonths - promoMonths;
          const regularPayment =
            (remainingBalance * (mr * Math.pow(1 + mr, remainingMonths))) /
            (Math.pow(1 + mr, remainingMonths) - 1);
          totalInterest = regularPayment * remainingMonths - remainingBalance;
          monthly = regularPayment; // show the post-promo payment
        } else {
          monthly =
            (loanAmount * (mr * Math.pow(1 + mr, totalMonths))) /
            (Math.pow(1 + mr, totalMonths) - 1);
          totalInterest = monthly * totalMonths - loanAmount;
        }

        const totalPaid = loanAmount + totalInterest;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Total medical cost", value: `$${formatNumber(cost)}` },
            { label: "Insurance / deposit", value: `$${formatNumber(insurance)}` },
            { label: "Amount financed", value: `$${formatNumber(loanAmount)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total amount repaid", value: `$${formatNumber(totalPaid)}` },
            { label: "Promotional period", value: promoMonths > 0 ? `${promoMonths} months at 0%` : "None" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["personal-loan-calculator", "credit-card-payoff-calculator"],
  faq: [
    {
      question: "What are medical financing options?",
      answer:
        "Common options include medical credit cards (like CareCredit), personal loans, hospital payment plans, and healthcare-specific loans. Many offer promotional 0% APR periods ranging from 6 to 24 months.",
    },
    {
      question: "What happens if the promo period ends?",
      answer:
        "If you don't pay off the balance before the promotional 0% APR period ends, you may be charged deferred interest on the entire original balance from the purchase date, often at rates of 25-29%.",
    },
    {
      question: "Can I negotiate medical bills before financing?",
      answer:
        "Yes. Many providers offer discounts for upfront cash payment (10-30% off), payment plans at 0% interest, or will negotiate the bill. Always ask before taking out a loan.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1] where L = Medical Cost - Insurance Coverage. Adjusted for promotional periods.",
};
