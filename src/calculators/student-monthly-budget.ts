import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentMonthlyBudgetCalculator: CalculatorDefinition = {
  slug: "student-monthly-budget-calculator",
  title: "Student Budget Calculator",
  description:
    "Free student monthly budget calculator. Plan your monthly income and expenses as a college student including rent, food, and tuition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "student monthly budget",
    "college budget calculator",
    "student expenses",
    "student financial planning",
    "monthly budget planner student",
  ],
  variants: [
    {
      id: "monthly",
      name: "Monthly Budget",
      description: "Calculate your monthly student budget balance",
      fields: [
        { name: "income", label: "Monthly Income (job, allowance, aid) ($)", type: "number", placeholder: "e.g. 1500", min: 0 },
        { name: "rent", label: "Rent / Housing ($)", type: "number", placeholder: "e.g. 600", min: 0 },
        { name: "food", label: "Food & Groceries ($)", type: "number", placeholder: "e.g. 300", min: 0 },
        { name: "transportation", label: "Transportation ($)", type: "number", placeholder: "e.g. 100", min: 0 },
        { name: "phone", label: "Phone & Internet ($)", type: "number", placeholder: "e.g. 80", min: 0 },
        { name: "entertainment", label: "Entertainment & Social ($)", type: "number", placeholder: "e.g. 100", min: 0 },
        { name: "supplies", label: "School Supplies ($)", type: "number", placeholder: "e.g. 50", min: 0 },
        { name: "other", label: "Other Expenses ($)", type: "number", placeholder: "e.g. 50", min: 0 },
      ],
      calculate: (inputs) => {
        const income = (inputs.income as number) || 0;
        const rent = (inputs.rent as number) || 0;
        const food = (inputs.food as number) || 0;
        const transport = (inputs.transportation as number) || 0;
        const phone = (inputs.phone as number) || 0;
        const entertainment = (inputs.entertainment as number) || 0;
        const supplies = (inputs.supplies as number) || 0;
        const other = (inputs.other as number) || 0;

        const totalExpenses = rent + food + transport + phone + entertainment + supplies + other;
        const balance = income - totalExpenses;
        const savingsRate = income > 0 ? (balance / income) * 100 : 0;

        let status: string;
        if (balance > income * 0.2) status = "Great - saving 20%+";
        else if (balance > 0) status = "Positive - but consider saving more";
        else if (balance === 0) status = "Breaking even - no savings";
        else status = "Deficit - spending exceeds income";

        return {
          primary: { label: "Monthly Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Budget status", value: status },
            { label: "Total expenses", value: `$${formatNumber(totalExpenses, 2)}` },
            { label: "Savings rate", value: `${formatNumber(savingsRate, 1)}%` },
            { label: "Largest expense", value: `Housing: $${formatNumber(rent, 2)}` },
          ],
        };
      },
    },
    {
      id: "semester",
      name: "Semester Budget",
      description: "Plan your total budget for the entire semester",
      fields: [
        { name: "semesterMonths", label: "Semester Length (months)", type: "number", placeholder: "e.g. 4", min: 1, max: 6, defaultValue: 4 },
        { name: "monthlyIncome", label: "Monthly Income ($)", type: "number", placeholder: "e.g. 1500", min: 0 },
        { name: "semesterAid", label: "One-Time Financial Aid ($)", type: "number", placeholder: "e.g. 5000", min: 0 },
        { name: "monthlyExpenses", label: "Monthly Expenses ($)", type: "number", placeholder: "e.g. 1200", min: 0 },
        { name: "tuitionDue", label: "Tuition Due This Semester ($)", type: "number", placeholder: "e.g. 8000", min: 0 },
      ],
      calculate: (inputs) => {
        const months = (inputs.semesterMonths as number) || 4;
        const monthlyInc = (inputs.monthlyIncome as number) || 0;
        const aid = (inputs.semesterAid as number) || 0;
        const monthlyExp = (inputs.monthlyExpenses as number) || 0;
        const tuition = (inputs.tuitionDue as number) || 0;

        const totalIncome = monthlyInc * months + aid;
        const totalExpenses = monthlyExp * months + tuition;
        const balance = totalIncome - totalExpenses;

        return {
          primary: { label: "Semester Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total semester income", value: `$${formatNumber(totalIncome, 2)}` },
            { label: "Total semester expenses", value: `$${formatNumber(totalExpenses, 2)}` },
            { label: "Living expenses", value: `$${formatNumber(monthlyExp * months, 2)}` },
            { label: "Tuition portion", value: `$${formatNumber(tuition, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-budget-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "How much should a college student budget per month?",
      answer:
        "The average college student spends $1,000-$2,500 per month depending on location. Housing is typically the largest expense at 30-40% of the budget, followed by food at 15-25%.",
    },
    {
      question: "How much should students save each month?",
      answer:
        "Financial experts recommend saving at least 10-20% of income. Even saving $50-$100 per month builds an emergency fund and good financial habits.",
    },
  ],
  formula: "Monthly Balance = Income - (Rent + Food + Transport + Phone + Entertainment + Supplies + Other)",
};
