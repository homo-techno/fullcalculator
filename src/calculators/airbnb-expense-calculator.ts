import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbExpenseCalculator: CalculatorDefinition = {
  slug: "airbnb-expense-calculator",
  title: "Airbnb Expense Calculator",
  description: "Break down the monthly expenses of operating a short-term rental property on Airbnb or similar platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Airbnb expenses", "short term rental costs", "vacation rental expenses"],
  variants: [{
    id: "standard",
    name: "Airbnb Expense",
    description: "Break down the monthly expenses of operating a short-term rental property on Airbnb or similar platforms",
    fields: [
      { name: "monthlyRevenue", label: "Monthly Revenue", type: "number", suffix: "$", min: 500, max: 30000, defaultValue: 4000 },
      { name: "mortgage", label: "Monthly Mortgage", type: "number", suffix: "$", min: 0, max: 10000, defaultValue: 1500 },
      { name: "managementPct", label: "Management Fee", type: "number", suffix: "%", min: 0, max: 40, defaultValue: 20 },
      { name: "nightsPerMonth", label: "Occupied Nights per Month", type: "number", suffix: "nights", min: 1, max: 30, defaultValue: 22 },
    ],
    calculate: (inputs) => {
      const revenue = inputs.monthlyRevenue as number;
      const mortgage = inputs.mortgage as number;
      const mgmtPct = inputs.managementPct as number;
      const nights = inputs.nightsPerMonth as number;
      if (!revenue) return null;
      const platformFee = revenue * 0.03;
      const management = revenue * (mgmtPct / 100);
      const cleaning = nights > 0 ? Math.ceil(nights / 3) * 75 : 0;
      const utilities = 250;
      const supplies = 150;
      const insurance = 200;
      const maintenance = revenue * 0.05;
      const totalExpenses = mortgage + platformFee + management + cleaning + utilities + supplies + insurance + maintenance;
      const netIncome = revenue - totalExpenses;
      return {
        primary: { label: "Monthly Net Income", value: "$" + formatNumber(netIncome) },
        details: [
          { label: "Monthly Revenue", value: "$" + formatNumber(revenue) },
          { label: "Mortgage", value: "$" + formatNumber(mortgage) },
          { label: "Platform Fees (3%)", value: "$" + formatNumber(platformFee) },
          { label: "Management Fee", value: "$" + formatNumber(management) },
          { label: "Cleaning", value: "$" + formatNumber(cleaning) },
          { label: "Utilities", value: "$" + formatNumber(utilities) },
          { label: "Supplies and Maintenance", value: "$" + formatNumber(supplies + maintenance) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
        ],
      };
    },
  }],
  relatedSlugs: ["rental-yield-calculator", "flip-profit-calculator"],
  faq: [
    { question: "What are the typical expenses for an Airbnb?", answer: "Typical Airbnb expenses include mortgage, cleaning fees, platform fees (3%), management fees (15-25%), utilities, insurance, supplies, and maintenance. Total expenses usually consume 40 to 70 percent of revenue." },
    { question: "Is Airbnb profitable after expenses?", answer: "Airbnb properties can be profitable with net margins of 20 to 40 percent in favorable markets. Occupancy rate and nightly rate are the key factors for profitability." },
  ],
  formula: "Net Income = Revenue - Mortgage - Platform Fees - Management - Cleaning - Utilities - Supplies - Insurance - Maintenance",
};
