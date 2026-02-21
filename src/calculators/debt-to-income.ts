import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const debtToIncomeCalculator: CalculatorDefinition = {
  slug: "debt-to-income-calculator",
  title: "Debt-to-Income Ratio Calculator",
  description: "Free debt-to-income ratio calculator. Calculate your DTI ratio to see if you qualify for a mortgage or loan.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["debt to income ratio", "dti calculator", "debt ratio calculator", "mortgage qualification", "dti ratio"],
  variants: [
    {
      id: "dti",
      name: "Calculate DTI Ratio",
      fields: [
        { name: "mortgage", label: "Monthly Mortgage / Rent", type: "number", prefix: "$", placeholder: "e.g. 1500" },
        { name: "carPayment", label: "Car Payments", type: "number", prefix: "$", placeholder: "e.g. 400", defaultValue: 0 },
        { name: "studentLoan", label: "Student Loans", type: "number", prefix: "$", placeholder: "e.g. 300", defaultValue: 0 },
        { name: "creditCard", label: "Credit Card Minimums", type: "number", prefix: "$", placeholder: "e.g. 200", defaultValue: 0 },
        { name: "otherDebt", label: "Other Monthly Debts", type: "number", prefix: "$", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "income", label: "Gross Monthly Income", type: "number", prefix: "$", placeholder: "e.g. 6000" },
      ],
      calculate: (inputs) => {
        const mortgage = (inputs.mortgage as number) || 0;
        const car = (inputs.carPayment as number) || 0;
        const student = (inputs.studentLoan as number) || 0;
        const cc = (inputs.creditCard as number) || 0;
        const other = (inputs.otherDebt as number) || 0;
        const income = inputs.income as number;
        if (!income) return null;
        const totalDebt = mortgage + car + student + cc + other;
        const dti = (totalDebt / income) * 100;
        const frontEnd = (mortgage / income) * 100;
        let rating = "Excellent (< 20%)";
        if (dti > 50) rating = "Very High — difficult to get approved";
        else if (dti > 43) rating = "High — exceeds most lending limits";
        else if (dti > 36) rating = "Moderate — may limit options";
        else if (dti > 20) rating = "Good — within lending guidelines";
        return {
          primary: { label: "DTI Ratio", value: `${formatNumber(dti, 1)}%` },
          details: [
            { label: "Rating", value: rating },
            { label: "Front-end ratio (housing)", value: `${formatNumber(frontEnd, 1)}%` },
            { label: "Total monthly debts", value: `$${formatNumber(totalDebt, 2)}` },
            { label: "Gross monthly income", value: `$${formatNumber(income, 2)}` },
            { label: "Max recommended debt at 36%", value: `$${formatNumber(income * 0.36, 2)}/mo` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "loan-calculator", "net-worth-calculator"],
  faq: [{ question: "What is a good debt-to-income ratio?", answer: "Below 20% is excellent. 20-36% is good. 36-43% is acceptable for some lenders. Above 43% generally disqualifies you from most mortgages. The front-end ratio (housing only) should ideally be below 28%." }],
  formula: "DTI = Total Monthly Debts / Gross Monthly Income × 100",
};
