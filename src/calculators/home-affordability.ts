import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeAffordabilityCalculator: CalculatorDefinition = {
  slug: "home-affordability-calculator",
  title: "Home Affordability Calculator",
  description:
    "Free home affordability calculator. Find out how much house you can afford based on your income, debts, down payment, and interest rate using the 28/36 DTI rule.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home affordability calculator",
    "how much house can I afford",
    "mortgage affordability",
    "house affordability calculator",
    "home buying calculator",
  ],
  variants: [
    {
      id: "affordability",
      name: "How Much House Can I Afford",
      description: "Calculate the maximum home price you can afford using the 28% front-end DTI rule",
      fields: [
        {
          name: "annualIncome",
          label: "Annual Gross Income",
          type: "number",
          placeholder: "e.g. 85000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyDebts",
          label: "Monthly Debt Payments",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 50000",
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
      ],
      calculate: (inputs) => {
        const annualIncome = inputs.annualIncome as number;
        const monthlyDebts = (inputs.monthlyDebts as number) || 0;
        const downPayment = (inputs.downPayment as number) || 0;
        const interestRate = inputs.interestRate as number;
        if (!annualIncome || !interestRate) return null;

        const monthlyIncome = annualIncome / 12;

        // 28% front-end DTI rule (housing costs only)
        const maxHousingPayment = monthlyIncome * 0.28;

        // 36% back-end DTI rule (all debts)
        const maxTotalDebt = monthlyIncome * 0.36;
        const maxPaymentBackEnd = maxTotalDebt - monthlyDebts;

        // Use the more conservative of the two
        const maxMonthlyPayment = Math.min(maxHousingPayment, maxPaymentBackEnd);

        if (maxMonthlyPayment <= 0) {
          return {
            primary: { label: "Result", value: "Debts Too High" },
            note: "Your current monthly debts exceed the recommended 36% back-end debt-to-income ratio. Consider paying down debts before buying.",
          };
        }

        // Calculate max loan amount using mortgage formula (30-year term)
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = 30 * 12;
        const maxLoan =
          (maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

        const maxHomePrice = maxLoan + downPayment;

        const frontEndDTI = (maxMonthlyPayment / monthlyIncome) * 100;
        const backEndDTI = ((maxMonthlyPayment + monthlyDebts) / monthlyIncome) * 100;

        return {
          primary: {
            label: "Max Home Price",
            value: `$${formatNumber(maxHomePrice)}`,
          },
          details: [
            { label: "Max monthly payment", value: `$${formatNumber(maxMonthlyPayment)}` },
            { label: "Max loan amount", value: `$${formatNumber(maxLoan)}` },
            { label: "Down payment", value: `$${formatNumber(downPayment)}` },
            { label: "Front-end DTI", value: `${formatNumber(frontEndDTI, 1)}%` },
            { label: "Back-end DTI", value: `${formatNumber(backEndDTI, 1)}%` },
            { label: "Monthly gross income", value: `$${formatNumber(monthlyIncome)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "down-payment-calculator", "debt-to-income-calculator"],
  faq: [
    {
      question: "What is the 28% rule for home affordability?",
      answer:
        "The 28% rule states that your monthly housing costs (mortgage, taxes, insurance) should not exceed 28% of your gross monthly income. This is the front-end DTI ratio. Combined with the 36% back-end rule (total debts), it helps determine a comfortable home price.",
    },
    {
      question: "How much house can I afford on a $100,000 salary?",
      answer:
        "Using the 28% rule with a $100K salary, your max monthly housing payment is about $2,333. At a 6.5% rate with 20% down on a 30-year loan, you could afford roughly $450,000-$470,000 depending on debts, taxes, and insurance.",
    },
    {
      question: "What factors affect how much home I can afford?",
      answer:
        "Key factors include gross income, existing debt payments, down payment amount, interest rate, property taxes, homeowners insurance, PMI (if less than 20% down), and HOA fees. Credit score also indirectly affects affordability through interest rates.",
    },
  ],
  formula:
    "Max Monthly Payment = Monthly Income × 28% (front-end DTI). Max Loan = Payment × [(1+r)^n - 1] / [r × (1+r)^n]. Max Home Price = Max Loan + Down Payment.",
};
