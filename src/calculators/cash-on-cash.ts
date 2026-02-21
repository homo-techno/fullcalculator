import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cashOnCashCalculator: CalculatorDefinition = {
  slug: "cash-on-cash-calculator",
  title: "Cash on Cash Return Calculator",
  description:
    "Free cash on cash return calculator. Measure your actual return on the cash you invested in a rental property, including leverage and expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cash on cash return calculator",
    "cash on cash return",
    "real estate cash on cash",
    "rental property return",
    "CoC return calculator",
  ],
  variants: [
    {
      id: "basic",
      name: "Cash on Cash Return",
      description: "Calculate your cash-on-cash return from annual cash flow and total cash invested",
      fields: [
        { name: "annualCashFlow", label: "Annual Pre-Tax Cash Flow", type: "number", placeholder: "e.g. 6000", prefix: "$" },
        { name: "totalCashInvested", label: "Total Cash Invested", type: "number", placeholder: "e.g. 80000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const cashFlow = inputs.annualCashFlow as number;
        const invested = inputs.totalCashInvested as number;
        if (cashFlow === undefined || !invested) return null;

        const cocReturn = (cashFlow / invested) * 100;

        return {
          primary: { label: "Cash on Cash Return", value: `${formatNumber(cocReturn, 2)}%` },
          details: [
            { label: "Annual cash flow", value: `$${formatNumber(cashFlow)}` },
            { label: "Total cash invested", value: `$${formatNumber(invested)}` },
            { label: "Monthly cash flow", value: `$${formatNumber(cashFlow / 12)}` },
          ],
          note: cocReturn < 0 ? "Negative return means you're losing money on a cash basis. Review your expenses and rental rates." : undefined,
        };
      },
    },
    {
      id: "detailed",
      name: "Detailed CoC Return",
      description: "Calculate cash-on-cash return from property details",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "downPayment", label: "Down Payment", type: "number", placeholder: "e.g. 60000", prefix: "$", min: 0 },
        { name: "closingCosts", label: "Closing Costs", type: "number", placeholder: "e.g. 8000", prefix: "$", min: 0 },
        { name: "rehabCosts", label: "Rehab / Repair Costs", type: "number", placeholder: "e.g. 15000", prefix: "$", min: 0 },
        { name: "monthlyRent", label: "Monthly Rent", type: "number", placeholder: "e.g. 2200", prefix: "$", min: 0 },
        { name: "monthlyExpenses", label: "Monthly Expenses (all incl. mortgage)", type: "number", placeholder: "e.g. 1700", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const down = (inputs.downPayment as number) || 0;
        const closing = (inputs.closingCosts as number) || 0;
        const rehab = (inputs.rehabCosts as number) || 0;
        const rent = inputs.monthlyRent as number;
        const expenses = (inputs.monthlyExpenses as number) || 0;
        if (!price || !rent) return null;

        const totalCash = down + closing + rehab;
        const monthlyCashFlow = rent - expenses;
        const annualCashFlow = monthlyCashFlow * 12;
        const cocReturn = totalCash > 0 ? (annualCashFlow / totalCash) * 100 : 0;

        return {
          primary: { label: "Cash on Cash Return", value: `${formatNumber(cocReturn, 2)}%` },
          details: [
            { label: "Total cash invested", value: `$${formatNumber(totalCash)}` },
            { label: "Monthly cash flow", value: `$${formatNumber(monthlyCashFlow)}` },
            { label: "Annual cash flow", value: `$${formatNumber(annualCashFlow)}` },
            { label: "Down payment", value: `$${formatNumber(down)}` },
            { label: "Closing + rehab", value: `$${formatNumber(closing + rehab)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cap-rate-calculator", "rental-income-calculator", "roi-calculator"],
  faq: [
    {
      question: "What is cash on cash return?",
      answer:
        "Cash on cash (CoC) return measures the annual pre-tax cash flow relative to the total cash you invested. CoC Return = Annual Cash Flow / Total Cash Invested × 100. Unlike cap rate, it accounts for financing.",
    },
    {
      question: "What is a good cash on cash return?",
      answer:
        "Most real estate investors target 8-12% cash-on-cash return. Above 12% is excellent. 5-8% is acceptable in stable markets with strong appreciation potential. Below 5% may not be worth the effort unless you expect significant value appreciation.",
    },
    {
      question: "What counts as 'total cash invested'?",
      answer:
        "Total cash invested includes your down payment, closing costs, inspection and appraisal fees, and any upfront repair or renovation costs. It does NOT include the loan amount since that's not your cash.",
    },
  ],
  formula: "Cash on Cash Return = (Annual Pre-Tax Cash Flow / Total Cash Invested) × 100",
};
