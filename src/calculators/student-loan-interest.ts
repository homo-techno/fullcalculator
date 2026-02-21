import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentLoanInterestCalculator: CalculatorDefinition = {
  slug: "student-loan-interest-calculator",
  title: "Student Loan Interest Calculator",
  description:
    "Free student loan interest calculator. See how much interest accrues daily, monthly, and over the life of your loan. Understand capitalization and in-school interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "student loan interest calculator",
    "loan interest calculator",
    "interest accrual calculator",
    "student loan daily interest",
    "in school interest calculator",
  ],
  variants: [
    {
      id: "accrual",
      name: "Interest Accrual",
      description: "See how much interest accrues on your student loans daily, monthly, and yearly",
      fields: [
        { name: "principal", label: "Loan Balance ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "loanTerm", label: "Repayment Term (years)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const principal = inputs.principal as number;
        const rate = inputs.interestRate as number;
        const term = inputs.loanTerm as number;
        if (!principal || !rate || !term) return null;

        const dailyRate = rate / 100 / 365;
        const monthlyRate = rate / 100 / 12;
        const dailyInterest = principal * dailyRate;
        const monthlyInterest = principal * monthlyRate;
        const yearlyInterest = principal * (rate / 100);

        // Monthly payment
        const totalMonths = term * 12;
        const pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalPaid = pmt * totalMonths;
        const totalInterest = totalPaid - principal;
        const interestPercent = (totalInterest / principal) * 100;

        return {
          primary: { label: "Total Interest Over Loan Life", value: `$${formatNumber(totalInterest, 2)}` },
          details: [
            { label: "Daily interest accrual", value: `$${formatNumber(dailyInterest, 2)}` },
            { label: "Monthly interest (at start)", value: `$${formatNumber(monthlyInterest, 2)}` },
            { label: "First year interest", value: `$${formatNumber(yearlyInterest, 2)}` },
            { label: "Monthly payment", value: `$${formatNumber(pmt, 2)}` },
            { label: "Total amount repaid", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Interest as % of principal", value: `${formatNumber(interestPercent, 1)}%` },
          ],
        };
      },
    },
    {
      id: "inSchool",
      name: "In-School Interest Capitalization",
      description: "Calculate how much interest accrues while you are in school (grace/deferment)",
      fields: [
        { name: "principal", label: "Loan Amount ($)", type: "number", placeholder: "e.g. 20000" },
        { name: "interestRate", label: "Interest Rate (%)", type: "number", placeholder: "e.g. 5.5" },
        { name: "yearsInSchool", label: "Years in School / Deferment", type: "number", placeholder: "e.g. 4", min: 0.5, max: 8 },
        { name: "gracePeriod", label: "Grace Period (months)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const principal = inputs.principal as number;
        const rate = inputs.interestRate as number;
        const yearsInSchool = inputs.yearsInSchool as number;
        const grace = (inputs.gracePeriod as number) || 6;
        if (!principal || !rate || !yearsInSchool) return null;

        const totalDefermentMonths = yearsInSchool * 12 + grace;
        const monthlyRate = rate / 100 / 12;

        // Unsubsidized: interest accrues and capitalizes
        const capitalizedBalance = principal * Math.pow(1 + monthlyRate, totalDefermentMonths);
        const accruedInterest = capitalizedBalance - principal;

        // Subsidized: government pays interest during school
        const subsidizedBalance = principal * Math.pow(1 + monthlyRate, grace); // only grace period
        const subsidizedInterest = subsidizedBalance - principal;

        // Compare 10-year repayment on both
        const repayMonths = 120;
        const pmtUnsub = capitalizedBalance * (monthlyRate * Math.pow(1 + monthlyRate, repayMonths)) /
          (Math.pow(1 + monthlyRate, repayMonths) - 1);
        const pmtSub = subsidizedBalance * (monthlyRate * Math.pow(1 + monthlyRate, repayMonths)) /
          (Math.pow(1 + monthlyRate, repayMonths) - 1);

        return {
          primary: { label: "Capitalized Balance (Unsubsidized)", value: `$${formatNumber(capitalizedBalance, 2)}` },
          details: [
            { label: "Original loan amount", value: `$${formatNumber(principal, 2)}` },
            { label: "Interest accrued (unsubsidized)", value: `$${formatNumber(accruedInterest, 2)}` },
            { label: "Deferment + grace period", value: `${formatNumber(totalDefermentMonths, 0)} months` },
            { label: "Monthly payment (unsubsidized)", value: `$${formatNumber(pmtUnsub, 2)}` },
            { label: "If subsidized, balance after grace", value: `$${formatNumber(subsidizedBalance, 2)}` },
            { label: "Monthly payment (subsidized)", value: `$${formatNumber(pmtSub, 2)}` },
            { label: "Monthly savings if subsidized", value: `$${formatNumber(pmtUnsub - pmtSub, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-loan-calculator", "student-loan-repayment-calculator", "scholarship-calculator"],
  faq: [
    {
      question: "How is student loan interest calculated?",
      answer:
        "Student loan interest accrues daily using simple interest: Daily Interest = Principal x (Interest Rate / 365). On a $30,000 loan at 5.5%, daily interest is $30,000 x 0.055/365 = $4.52 per day.",
    },
    {
      question: "What is interest capitalization?",
      answer:
        "Capitalization is when accrued interest is added to your principal balance. This happens when you enter repayment after deferment, forbearance, or your grace period ends. It means you then pay interest on a larger balance.",
    },
    {
      question: "What is the difference between subsidized and unsubsidized loans?",
      answer:
        "Subsidized loans: the government pays interest while you are in school and during grace periods. Unsubsidized loans: interest accrues from the day the loan is disbursed. This difference can add thousands to your balance by graduation.",
    },
  ],
  formula: "Daily Interest = Principal x (Annual Rate / 365) | Capitalized Balance = Principal x (1 + Monthly Rate)^months",
};
