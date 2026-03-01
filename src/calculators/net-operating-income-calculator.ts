import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netOperatingIncomeCalculator: CalculatorDefinition = {
  slug: "net-operating-income-calculator",
  title: "Net Operating Income Calculator",
  description: "Calculate net operating income for a rental investment property.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["net operating income", "NOI calculator", "rental property NOI"],
  variants: [{
    id: "standard",
    name: "Net Operating Income",
    description: "Calculate net operating income for a rental investment property",
    fields: [
      { name: "grossRent", label: "Monthly Gross Rent", type: "number", prefix: "$", min: 100, max: 100000, defaultValue: 3000 },
      { name: "vacancyRate", label: "Vacancy Rate", type: "number", suffix: "%", min: 0, max: 50, defaultValue: 5 },
      { name: "expenses", label: "Monthly Operating Expenses", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 800 },
    ],
    calculate: (inputs) => {
      const rent = inputs.grossRent as number;
      const vacancy = (inputs.vacancyRate as number) / 100;
      const expenses = inputs.expenses as number;
      if (!rent || rent <= 0) return null;
      const annualGross = rent * 12;
      const vacancyLoss = annualGross * vacancy;
      const effectiveGross = annualGross - vacancyLoss;
      const annualExpenses = expenses * 12;
      const noi = effectiveGross - annualExpenses;
      const expenseRatio = (annualExpenses / effectiveGross) * 100;
      return {
        primary: { label: "Annual NOI", value: "$" + formatNumber(noi) },
        details: [
          { label: "Annual Gross Rent", value: "$" + formatNumber(annualGross) },
          { label: "Vacancy Loss", value: "$" + formatNumber(vacancyLoss) },
          { label: "Annual Expenses", value: "$" + formatNumber(annualExpenses) },
          { label: "Expense Ratio", value: expenseRatio.toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["cash-on-cash-return-calculator", "home-value-estimator"],
  faq: [
    { question: "What is net operating income?", answer: "NOI is the annual income from a property after subtracting vacancy losses and operating expenses, but before mortgage payments." },
    { question: "What is a good NOI for rental property?", answer: "A good NOI depends on the purchase price. Most investors target a cap rate (NOI divided by price) of 5% to 10%." },
  ],
  formula: "NOI = (Gross Rent x 12) x (1 - Vacancy Rate) - Annual Operating Expenses",
};
