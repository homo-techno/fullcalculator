import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const personalLoanCalculator: CalculatorDefinition = {
  slug: "personal-loan-calculator",
  title: "Personal Loan Calculator",
  description:
    "Free personal loan calculator. Estimate monthly payments, total interest, and total cost for an unsecured personal loan with fixed rate and term.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "personal loan calculator",
    "unsecured loan calculator",
    "personal loan payment",
    "loan calculator",
    "fixed rate personal loan",
    "personal finance loan",
  ],
  variants: [
    {
      id: "personal-loan-payment",
      name: "Personal Loan Payment",
      description: "Calculate monthly payments for a personal loan",
      fields: [
        {
          name: "loanAmount",
          label: "Loan Amount",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate (APR)",
          type: "number",
          placeholder: "e.g. 10.5",
          suffix: "%",
          min: 0,
          max: 50,
          step: 0.01,
        },
        {
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "2 years", value: "2" },
            { label: "3 years", value: "3" },
            { label: "4 years", value: "4" },
            { label: "5 years", value: "5" },
            { label: "7 years", value: "7" },
          ],
          defaultValue: "3",
        },
        {
          name: "originationFee",
          label: "Origination Fee",
          type: "select",
          options: [
            { label: "0%", value: "0" },
            { label: "1%", value: "1" },
            { label: "2%", value: "2" },
            { label: "3%", value: "3" },
            { label: "5%", value: "5" },
            { label: "8%", value: "8" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const loan = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const years = parseInt(inputs.term as string) || 3;
        const origPct = parseFloat(inputs.originationFee as string) || 0;
        if (!loan || !rate) return null;

        const origFee = loan * (origPct / 100);
        const netProceeds = loan - origFee;
        const mr = rate / 100 / 12;
        const n = years * 12;
        const monthly =
          (loan * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = monthly * n;
        const totalInterest = totalPaid - loan;
        const totalCost = totalInterest + origFee;
        const effectiveAPR = origPct > 0 ? ((totalCost / netProceeds) / years) * 100 : rate;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Origination fee", value: `$${formatNumber(origFee)}` },
            { label: "Net proceeds received", value: `$${formatNumber(netProceeds)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total cost (interest + fees)", value: `$${formatNumber(totalCost)}` },
            { label: "Total amount repaid", value: `$${formatNumber(totalPaid)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["consolidation-loan-calculator", "credit-card-payoff-calculator"],
  faq: [
    {
      question: "What is a personal loan?",
      answer:
        "A personal loan is an unsecured loan that you repay in fixed monthly installments over a set term. Unlike mortgages or auto loans, personal loans don't require collateral, which is why they often have higher interest rates.",
    },
    {
      question: "What is a good personal loan rate?",
      answer:
        "Personal loan rates typically range from 6% to 36% APR depending on your credit score. Excellent credit (750+) may get rates around 6-10%, while fair credit (580-669) may see rates of 15-25%.",
    },
    {
      question: "What is an origination fee?",
      answer:
        "An origination fee is a one-time charge (typically 1-8% of the loan amount) deducted from your loan proceeds. A $25,000 loan with a 3% origination fee means you receive $24,250 but repay $25,000.",
    },
  ],
  formula:
    "Monthly = L[r(1+r)^n]/[(1+r)^n - 1]. Total Cost = Total Interest + Origination Fee.",
};
