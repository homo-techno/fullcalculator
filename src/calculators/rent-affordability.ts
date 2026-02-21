import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentAffordabilityCalculator: CalculatorDefinition = {
  slug: "rent-affordability-calculator",
  title: "Rent Affordability Calculator",
  description:
    "Free rent affordability calculator. Find out how much rent you can afford based on the 30% rule and 50/30/20 budget. Calculate your maximum monthly rent payment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "rent affordability calculator",
    "how much rent can I afford",
    "rent calculator",
    "rent budget calculator",
    "affordable rent calculator",
  ],
  variants: [
    {
      id: "rent-afford",
      name: "How Much Rent Can I Afford",
      description: "Calculate your maximum affordable rent using common budgeting rules",
      fields: [
        {
          name: "monthlyGrossIncome",
          label: "Monthly Gross Income",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "monthlyDebts",
          label: "Monthly Debt Payments",
          type: "number",
          placeholder: "e.g. 400",
          prefix: "$",
          min: 0,
        },
        {
          name: "estimatedTaxRate",
          label: "Estimated Tax Rate (for net income)",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "%",
          min: 0,
          max: 50,
          step: 1,
          defaultValue: 25,
        },
      ],
      calculate: (inputs) => {
        const grossMonthly = inputs.monthlyGrossIncome as number;
        const debts = (inputs.monthlyDebts as number) || 0;
        const taxRate = (inputs.estimatedTaxRate as number) || 25;
        if (!grossMonthly) return null;

        const annualGross = grossMonthly * 12;
        const monthlyNet = grossMonthly * (1 - taxRate / 100);

        // 30% Rule: max 30% of gross income on rent
        const maxRent30Pct = grossMonthly * 0.30;

        // 50/30/20 Rule based on net income
        // 50% needs, 30% wants, 20% savings
        const needsBudget = monthlyNet * 0.50;
        const wantsBudget = monthlyNet * 0.30;
        const savingsBudget = monthlyNet * 0.20;

        // Conservative: max rent = 25% of gross
        const conservativeRent = grossMonthly * 0.25;

        // Debt-adjusted: consider existing debts (rent + debts < 50% of gross)
        const maxWithDebt = grossMonthly * 0.50 - debts;

        // Recommended rent (most conservative of the methods)
        const recommended = Math.min(maxRent30Pct, maxWithDebt);

        return {
          primary: {
            label: "Max Rent (30% Rule)",
            value: `$${formatNumber(maxRent30Pct)}`,
          },
          details: [
            { label: "Monthly gross income", value: `$${formatNumber(grossMonthly)}` },
            { label: "Monthly net income (est.)", value: `$${formatNumber(monthlyNet)}` },
            { label: "Annual gross income", value: `$${formatNumber(annualGross)}` },
            { label: "30% rule max rent", value: `$${formatNumber(maxRent30Pct)}` },
            { label: "25% conservative max", value: `$${formatNumber(conservativeRent)}` },
            { label: "Debt-adjusted max rent", value: `$${formatNumber(Math.max(0, maxWithDebt))}` },
            { label: "--- 50/30/20 Budget ---", value: "" },
            { label: "Needs (50%)", value: `$${formatNumber(needsBudget)}` },
            { label: "Wants (30%)", value: `$${formatNumber(wantsBudget)}` },
            { label: "Savings (20%)", value: `$${formatNumber(savingsBudget)}` },
            { label: "Monthly debts", value: `$${formatNumber(debts)}` },
          ],
          note: "The 30% rule suggests spending no more than 30% of gross income on rent. The 50/30/20 rule allocates 50% of net income to needs (including rent), 30% to wants, and 20% to savings. Choose based on your priorities.",
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "rent-vs-buy-calculator", "take-home-pay-calculator"],
  faq: [
    {
      question: "What is the 30% rule for rent?",
      answer:
        "The 30% rule states that you should spend no more than 30% of your gross monthly income on rent. For example, if you earn $5,000/month gross, your max rent should be $1,500. Many landlords use this guideline when approving rental applications.",
    },
    {
      question: "How much of my income should go to rent?",
      answer:
        "Most financial advisors recommend 25-30% of gross income for rent. In high-cost areas, people may spend 40-50%, though this leaves less for savings and other expenses. The 50/30/20 rule suggests rent as part of the 50% needs allocation of net income.",
    },
    {
      question: "What is the 50/30/20 budget rule?",
      answer:
        "The 50/30/20 rule divides after-tax income into: 50% for needs (rent, utilities, food, insurance, minimum debt payments), 30% for wants (dining out, entertainment, hobbies), and 20% for savings and extra debt payments.",
    },
  ],
  formula:
    "30% Rule: Max Rent = Gross Monthly Income × 30%. 50/30/20 Rule: Needs = Net Income × 50%, Wants = Net Income × 30%, Savings = Net Income × 20%.",
};
