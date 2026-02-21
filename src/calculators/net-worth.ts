import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netWorthCalculator: CalculatorDefinition = {
  slug: "net-worth-calculator",
  title: "Net Worth Calculator",
  description: "Free net worth calculator. Add up your assets and liabilities to find your total net worth and track your financial health.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["net worth calculator", "total net worth", "assets minus liabilities", "financial health calculator", "wealth calculator"],
  variants: [
    {
      id: "calculate",
      name: "Calculate Net Worth",
      fields: [
        { name: "cash", label: "Cash & Savings", type: "number", placeholder: "e.g. 25000", prefix: "$" },
        { name: "investments", label: "Investments (stocks, 401k)", type: "number", placeholder: "e.g. 80000", prefix: "$" },
        { name: "realEstate", label: "Real Estate Value", type: "number", placeholder: "e.g. 350000", prefix: "$" },
        { name: "otherAssets", label: "Other Assets (car, etc.)", type: "number", placeholder: "e.g. 20000", prefix: "$" },
        { name: "mortgage", label: "Mortgage Balance", type: "number", placeholder: "e.g. 250000", prefix: "$" },
        { name: "loans", label: "Student/Car/Other Loans", type: "number", placeholder: "e.g. 15000", prefix: "$" },
        { name: "creditCards", label: "Credit Card Debt", type: "number", placeholder: "e.g. 3000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const cash = (inputs.cash as number) || 0;
        const inv = (inputs.investments as number) || 0;
        const re = (inputs.realEstate as number) || 0;
        const other = (inputs.otherAssets as number) || 0;
        const mort = (inputs.mortgage as number) || 0;
        const loans = (inputs.loans as number) || 0;
        const cc = (inputs.creditCards as number) || 0;
        const totalAssets = cash + inv + re + other;
        const totalLiabilities = mort + loans + cc;
        const netWorth = totalAssets - totalLiabilities;
        if (totalAssets === 0 && totalLiabilities === 0) return null;
        return {
          primary: { label: "Net Worth", value: `$${formatNumber(netWorth)}` },
          details: [
            { label: "Total assets", value: `$${formatNumber(totalAssets)}` },
            { label: "Total liabilities", value: `$${formatNumber(totalLiabilities)}` },
            { label: "Debt-to-asset ratio", value: totalAssets > 0 ? `${formatNumber((totalLiabilities / totalAssets) * 100)}%` : "N/A" },
          ],
          note: netWorth < 0 ? "Negative net worth means your debts exceed your assets. Focus on paying down high-interest debt and building savings." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["retirement-calculator", "savings-goal-calculator", "compound-interest-calculator"],
  faq: [
    { question: "What is net worth?", answer: "Net worth = Total Assets - Total Liabilities. Assets include cash, investments, property, and valuables. Liabilities include mortgages, loans, and credit card debt." },
    { question: "What is a good net worth by age?", answer: "A common benchmark: net worth = (Age × Annual Income) / 10. At 30 earning $60k, aim for $180k. The median US net worth by age is: under 35: $39k, 35-44: $182k, 45-54: $313k, 55-64: $588k." },
  ],
  formula: "Net Worth = Total Assets - Total Liabilities",
};
