import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parentPlusLoanCalculator: CalculatorDefinition = {
  slug: "parent-plus-loan-calculator",
  title: "Parent PLUS Loan Calculator",
  description:
    "Free Parent PLUS loan calculator. Estimate monthly payments, total interest, and repayment options for federal Parent PLUS loans taken to pay for a child's education.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "parent plus loan calculator",
    "parent plus loan payment",
    "parent plus repayment",
    "federal parent loan",
    "plus loan calculator",
    "parent college loan",
  ],
  variants: [
    {
      id: "parent-plus-payment",
      name: "Parent PLUS Payment",
      description: "Calculate payments for a Parent PLUS loan",
      fields: [
        {
          name: "loanAmount",
          label: "Total Loan Amount",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
          min: 0,
        },
        {
          name: "interestRate",
          label: "Interest Rate",
          type: "number",
          placeholder: "e.g. 8.05",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.01,
        },
        {
          name: "originationFee",
          label: "Origination Fee",
          type: "select",
          options: [
            { label: "4.228% (current)", value: "4.228" },
            { label: "4.0%", value: "4" },
            { label: "3.0%", value: "3" },
          ],
          defaultValue: "4.228",
        },
        {
          name: "repaymentPlan",
          label: "Repayment Plan",
          type: "select",
          options: [
            { label: "Standard (10 years)", value: "10" },
            { label: "Extended (25 years)", value: "25" },
            { label: "Graduated (10 years)", value: "10g" },
          ],
          defaultValue: "10",
        },
        {
          name: "annualIncome",
          label: "Annual Income (for IDR estimate)",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const loanAmt = inputs.loanAmount as number;
        const rate = inputs.interestRate as number;
        const origPct = parseFloat(inputs.originationFee as string) || 4.228;
        const plan = inputs.repaymentPlan as string;
        const income = (inputs.annualIncome as number) || 0;
        if (!loanAmt || !rate) return null;

        const origFee = loanAmt * (origPct / 100);
        const totalBorrowed = loanAmt + origFee;

        const mr = rate / 100 / 12;
        const isGraduated = plan === "10g";
        const years = isGraduated ? 10 : parseInt(plan) || 10;
        const n = years * 12;

        const standardMonthly =
          (totalBorrowed * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
        const totalPaid = standardMonthly * n;
        const totalInterest = totalPaid - totalBorrowed;

        // ICR estimate for Parent PLUS (must consolidate first)
        let icrMonthly = 0;
        if (income > 0) {
          const povertyLevel = 15060;
          const discretionary = Math.max(0, income - povertyLevel * 1.5);
          icrMonthly = (discretionary * 0.20) / 12;
        }

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(standardMonthly)}`,
          },
          details: [
            { label: "Loan amount requested", value: `$${formatNumber(loanAmt)}` },
            { label: "Origination fee", value: `$${formatNumber(origFee)}` },
            { label: "Total amount borrowed", value: `$${formatNumber(totalBorrowed)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total repayment", value: `$${formatNumber(totalPaid)}` },
            { label: "ICR payment estimate (if consolidated)", value: income > 0 ? `$${formatNumber(icrMonthly)}` : "Enter income above" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["private-student-loan-calculator", "income-driven-repayment-calculator"],
  faq: [
    {
      question: "What is a Parent PLUS loan?",
      answer:
        "A Parent PLUS loan is a federal loan that parents of dependent undergraduate students can borrow to help pay for college. The loan amount can cover the full cost of attendance minus other financial aid received.",
    },
    {
      question: "Can Parent PLUS loans be forgiven?",
      answer:
        "Parent PLUS loans can qualify for forgiveness through ICR (Income Contingent Repayment) after consolidation into a Direct Consolidation Loan. They can also qualify for PSLF if the parent works in public service. They cannot use SAVE, IBR, or PAYE.",
    },
    {
      question: "What is the Parent PLUS loan interest rate?",
      answer:
        "Parent PLUS loan rates are set annually by Congress. They are typically higher than rates for undergraduate student loans. The rate is fixed for the life of the loan once disbursed.",
    },
  ],
  formula:
    "Monthly = (L + Origination)[r(1+r)^n]/[(1+r)^n - 1]. ICR = 20% of discretionary income / 12.",
};
