import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studentBudgetCalculator: CalculatorDefinition = {
  slug: "student-budget-calculator",
  title: "Student Budget Calculator",
  description:
    "Free student budget calculator. Plan your monthly college budget including tuition, rent, food, and discretionary spending.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "student budget calculator",
    "college budget planner",
    "student expense calculator",
    "student monthly budget",
    "college cost of living calculator",
  ],
  variants: [
    {
      id: "monthly",
      name: "Monthly Student Budget",
      description: "Calculate your monthly income vs expenses as a student",
      fields: [
        { name: "income", label: "Monthly Income ($)", type: "number", placeholder: "e.g. jobs, aid, support: 1500" },
        { name: "rent", label: "Rent / Housing ($)", type: "number", placeholder: "e.g. 600" },
        { name: "food", label: "Food / Groceries ($)", type: "number", placeholder: "e.g. 300" },
        { name: "transportation", label: "Transportation ($)", type: "number", placeholder: "e.g. 100" },
        { name: "utilities", label: "Utilities / Phone ($)", type: "number", placeholder: "e.g. 100" },
        { name: "supplies", label: "School Supplies / Books ($)", type: "number", placeholder: "e.g. 50" },
        { name: "personal", label: "Personal / Entertainment ($)", type: "number", placeholder: "e.g. 150" },
        { name: "other", label: "Other Expenses ($)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const income = inputs.income as number;
        if (!income) return null;

        const rent = (inputs.rent as number) || 0;
        const food = (inputs.food as number) || 0;
        const transport = (inputs.transportation as number) || 0;
        const utilities = (inputs.utilities as number) || 0;
        const supplies = (inputs.supplies as number) || 0;
        const personal = (inputs.personal as number) || 0;
        const other = (inputs.other as number) || 0;

        const totalExpenses = rent + food + transport + utilities + supplies + personal + other;
        const remaining = income - totalExpenses;
        const savingsRate = income > 0 ? (remaining / income) * 100 : 0;

        let note: string | undefined;
        if (remaining < 0) note = "Your expenses exceed your income. Consider reducing spending or finding additional income sources.";
        else if (remaining < income * 0.1) note = "You have very little cushion. Try to build an emergency fund of at least one month's expenses.";

        return {
          primary: { label: "Monthly Remaining", value: `$${formatNumber(remaining, 2)}` },
          details: [
            { label: "Monthly income", value: `$${formatNumber(income, 2)}` },
            { label: "Total expenses", value: `$${formatNumber(totalExpenses, 2)}` },
            { label: "Savings rate", value: `${formatNumber(savingsRate, 1)}%` },
            { label: "Housing % of income", value: `${formatNumber((rent / income) * 100, 1)}%` },
            { label: "Food % of income", value: `${formatNumber((food / income) * 100, 1)}%` },
            { label: "Semester remaining (4.5 months)", value: `$${formatNumber(remaining * 4.5, 2)}` },
          ],
          note,
        };
      },
    },
    {
      id: "semester",
      name: "Semester Budget Planner",
      description: "Plan your budget for an entire semester",
      fields: [
        { name: "semesterAid", label: "Financial Aid / Scholarships (semester, $)", type: "number", placeholder: "e.g. 8000" },
        { name: "familySupport", label: "Family Support (semester, $)", type: "number", placeholder: "e.g. 3000" },
        { name: "workIncome", label: "Work Income (semester, $)", type: "number", placeholder: "e.g. 4000" },
        { name: "tuition", label: "Tuition & Fees (semester, $)", type: "number", placeholder: "e.g. 6000" },
        { name: "housing", label: "Housing (semester, $)", type: "number", placeholder: "e.g. 4500" },
        { name: "mealPlan", label: "Meal Plan / Food (semester, $)", type: "number", placeholder: "e.g. 2500" },
        { name: "books", label: "Books & Supplies (semester, $)", type: "number", placeholder: "e.g. 500" },
        { name: "otherExpenses", label: "Other Expenses (semester, $)", type: "number", placeholder: "e.g. 1500" },
      ],
      calculate: (inputs) => {
        const aid = (inputs.semesterAid as number) || 0;
        const family = (inputs.familySupport as number) || 0;
        const work = (inputs.workIncome as number) || 0;
        const totalIncome = aid + family + work;

        const tuition = (inputs.tuition as number) || 0;
        const housing = (inputs.housing as number) || 0;
        const meal = (inputs.mealPlan as number) || 0;
        const books = (inputs.books as number) || 0;
        const otherExp = (inputs.otherExpenses as number) || 0;
        const totalExpenses = tuition + housing + meal + books + otherExp;

        if (totalIncome === 0 && totalExpenses === 0) return null;

        const balance = totalIncome - totalExpenses;
        const monthlyBudget = balance / 4.5; // approximate months in a semester

        return {
          primary: { label: "Semester Balance", value: `$${formatNumber(balance, 2)}` },
          details: [
            { label: "Total semester income", value: `$${formatNumber(totalIncome, 2)}` },
            { label: "Total semester expenses", value: `$${formatNumber(totalExpenses, 2)}` },
            { label: "Monthly discretionary budget", value: `$${formatNumber(monthlyBudget, 2)}` },
            { label: "Weekly discretionary budget", value: `$${formatNumber(monthlyBudget / 4.33, 2)}` },
            { label: "Tuition as % of budget", value: `${formatNumber(totalIncome > 0 ? (tuition / totalIncome) * 100 : 0, 1)}%` },
            { label: "Annual estimate (2 semesters)", value: `$${formatNumber(balance * 2, 2)}` },
          ],
          note: balance < 0 ? "Your semester expenses exceed your income. Consider applying for more financial aid or finding additional income." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "student-loan-calculator", "tuition-cost-calculator"],
  faq: [
    {
      question: "How much should a college student budget per month?",
      answer:
        "The average college student spends $1,000-$2,500/month depending on location. A typical breakdown: housing 30-40%, food 15-20%, transportation 5-10%, personal 10-15%, and savings 10%+.",
    },
    {
      question: "How much should I spend on rent as a student?",
      answer:
        "Financial experts recommend spending no more than 30% of your gross income on housing. For students, this can be challenging in expensive areas. Consider roommates, on-campus options, or living further from campus to reduce costs.",
    },
    {
      question: "How can students save money?",
      answer:
        "Key tips: use student discounts everywhere, buy or rent used textbooks, cook at home, use public transportation, take advantage of campus amenities (gym, library, events), and track every expense with a budget app.",
    },
  ],
  formula: "Monthly Remaining = Income - (Rent + Food + Transportation + Utilities + Supplies + Personal + Other)",
};
