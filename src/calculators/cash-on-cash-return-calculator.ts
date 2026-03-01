import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashOnCashReturnCalculator: CalculatorDefinition = {
  slug: "cash-on-cash-return-calculator",
  title: "Cash on Cash Return Calculator",
  description: "Calculate the cash-on-cash return percentage for a real estate investment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cash on cash return", "CoCR calculator", "real estate return"],
  variants: [{
    id: "standard",
    name: "Cash on Cash Return",
    description: "Calculate the cash-on-cash return percentage for a real estate investment",
    fields: [
      { name: "annualCashflow", label: "Annual Net Cashflow", type: "number", prefix: "$", min: -100000, max: 500000, defaultValue: 12000 },
      { name: "totalCashInvested", label: "Total Cash Invested", type: "number", prefix: "$", min: 1000, max: 5000000, defaultValue: 60000 },
    ],
    calculate: (inputs) => {
      const cashflow = inputs.annualCashflow as number;
      const invested = inputs.totalCashInvested as number;
      if (!invested || invested <= 0) return null;
      const cocr = (cashflow / invested) * 100;
      const monthlyReturn = cashflow / 12;
      const paybackYears = cashflow > 0 ? invested / cashflow : 0;
      return {
        primary: { label: "Cash-on-Cash Return", value: cocr.toFixed(2) + "%" },
        details: [
          { label: "Monthly Cashflow", value: "$" + formatNumber(monthlyReturn) },
          { label: "Payback Period", value: paybackYears > 0 ? paybackYears.toFixed(1) + " years" : "N/A" },
          { label: "Annual Cashflow", value: "$" + formatNumber(cashflow) },
        ],
      };
    },
  }],
  relatedSlugs: ["net-operating-income-calculator", "home-value-estimator"],
  faq: [
    { question: "What is a good cash-on-cash return?", answer: "Most real estate investors consider 8% to 12% a good cash-on-cash return, though this varies by market." },
    { question: "How is cash-on-cash return different from cap rate?", answer: "Cash-on-cash return measures return on actual cash invested while cap rate measures return on the full property value." },
  ],
  formula: "Cash-on-Cash Return = Annual Net Cashflow / Total Cash Invested x 100",
};
