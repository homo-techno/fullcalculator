import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageCalculator: CalculatorDefinition = {
  slug: "mortgage-calculator",
  title: "Mortgage Calculator",
  description:
    "Free mortgage calculator. Estimate monthly mortgage payments, total interest, and amortization for your home loan. Compare different rates and terms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "mortgage payment",
    "house payment calculator",
    "mortgage interest calculator",
  ],
  variants: [
    {
      id: "monthly",
      name: "Monthly Payment",
      description: "Calculate your monthly mortgage payment",
      fields: [
        {
          name: "principal",
          label: "Home Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "downPayment",
          label: "Down Payment",
          type: "number",
          placeholder: "e.g. 70000",
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
          name: "term",
          label: "Loan Term",
          type: "select",
          options: [
            { label: "30 years", value: "30" },
            { label: "25 years", value: "25" },
            { label: "20 years", value: "20" },
            { label: "15 years", value: "15" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.principal as number;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.rate as number;
        const years = parseInt(inputs.term as string) || 30;
        if (!price || !rate) return null;

        const loan = price - down;
        const monthlyRate = rate / 100 / 12;
        const payments = years * 12;
        const monthly =
          (loan * (monthlyRate * Math.pow(1 + monthlyRate, payments))) /
          (Math.pow(1 + monthlyRate, payments) - 1);
        const totalPaid = monthly * payments;
        const totalInterest = totalPaid - loan;

        return {
          primary: {
            label: "Monthly Payment",
            value: `$${formatNumber(monthly)}`,
          },
          details: [
            { label: "Loan amount", value: `$${formatNumber(loan)}` },
            { label: "Total interest", value: `$${formatNumber(totalInterest)}` },
            { label: "Total paid", value: `$${formatNumber(totalPaid)}` },
            { label: "Down payment", value: `${formatNumber((down / price) * 100)}%` },
          ],
        };
      },
    },
    {
      id: "affordability",
      name: "How Much Can I Afford?",
      description: "Estimate the maximum home price you can afford",
      fields: [
        {
          name: "income",
          label: "Annual Income",
          type: "number",
          placeholder: "e.g. 80000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyDebt",
          label: "Monthly Debts (car, student loans, etc.)",
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
          name: "rate",
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
        const income = inputs.income as number;
        const debt = (inputs.monthlyDebt as number) || 0;
        const down = (inputs.downPayment as number) || 0;
        const rate = inputs.rate as number;
        if (!income || !rate) return null;

        const monthlyIncome = income / 12;
        // 28% rule for housing
        const maxHousing = monthlyIncome * 0.28;
        // 36% rule for total debt
        const maxTotalDebt = monthlyIncome * 0.36;
        const maxPayment = Math.min(maxHousing, maxTotalDebt - debt);

        if (maxPayment <= 0)
          return {
            primary: { label: "Result", value: "Debt too high" },
            note: "Your current monthly debts exceed the recommended 36% debt-to-income ratio.",
          };

        const monthlyRate = rate / 100 / 12;
        const payments = 30 * 12;
        const maxLoan =
          (maxPayment * (Math.pow(1 + monthlyRate, payments) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, payments));
        const maxPrice = maxLoan + down;

        return {
          primary: {
            label: "Max Home Price",
            value: `$${formatNumber(maxPrice)}`,
          },
          details: [
            { label: "Max monthly payment", value: `$${formatNumber(maxPayment)}` },
            { label: "Max loan amount", value: `$${formatNumber(maxLoan)}` },
            { label: "DTI ratio", value: `${formatNumber(((maxPayment + debt) / monthlyIncome) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "percentage-calculator"],
  faq: [
    {
      question: "How is a mortgage payment calculated?",
      answer:
        "Monthly payment = P[r(1+r)^n]/[(1+r)^n-1], where P is the loan principal, r is the monthly interest rate, and n is the total number of payments. For a $280,000 loan at 6.5% for 30 years: r=0.065/12, n=360, payment = $1,770.",
    },
    {
      question: "What is the 28/36 rule?",
      answer:
        "The 28/36 rule is a guideline for affordable housing. No more than 28% of gross monthly income should go to housing costs, and no more than 36% to total debt (housing + car + student loans + credit cards).",
    },
    {
      question: "How much should my down payment be?",
      answer:
        "Traditional advice is 20% to avoid PMI (Private Mortgage Insurance). However, many loans allow 3-10% down. FHA loans require as little as 3.5%. A larger down payment means lower monthly payments and less interest over the life of the loan.",
    },
  ],
  formula: "M = P[r(1+r)^n] / [(1+r)^n - 1]",
};
