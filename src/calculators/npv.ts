import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const npvCalculator: CalculatorDefinition = {
  slug: "npv-calculator",
  title: "NPV Calculator",
  description:
    "Free NPV (Net Present Value) calculator. Evaluate investment profitability by discounting future cash flows to their present value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["NPV", "net present value", "discount", "cash flow", "investment analysis"],
  variants: [
    {
      id: "standard",
      name: "NPV from Cash Flows",
      fields: [
        { name: "discountRate", label: "Discount Rate (%)", type: "number", placeholder: "e.g. 10" },
        { name: "initialInvestment", label: "Initial Investment ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "cashFlows", label: "Annual Cash Flows (comma-separated)", type: "text" as "number", placeholder: "e.g. 30000, 35000, 40000, 45000, 50000" },
      ],
      calculate: (inputs) => {
        const discountRate = inputs.discountRate as number;
        const initialInvestment = inputs.initialInvestment as number;
        const cashFlowsStr = inputs.cashFlows as string || "";

        if (!discountRate || !initialInvestment) return null;

        const cashFlows = cashFlowsStr
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));

        if (cashFlows.length === 0) return null;

        const r = discountRate / 100;

        // Calculate PV of each cash flow
        const pvCashFlows = cashFlows.map((cf, t) => cf / Math.pow(1 + r, t + 1));
        const totalPV = pvCashFlows.reduce((sum, pv) => sum + pv, 0);
        const npv = totalPV - initialInvestment;
        const totalCashFlows = cashFlows.reduce((sum, cf) => sum + cf, 0);
        const profitabilityIndex = totalPV / initialInvestment;

        return {
          primary: { label: "Net Present Value (NPV)", value: `$${formatNumber(npv, 2)}` },
          details: [
            { label: "Decision", value: npv > 0 ? "Accept (NPV > 0)" : "Reject (NPV < 0)" },
            { label: "Total PV of Cash Flows", value: `$${formatNumber(totalPV, 2)}` },
            { label: "Initial Investment", value: `$${formatNumber(initialInvestment, 2)}` },
            { label: "Total Undiscounted Cash Flows", value: `$${formatNumber(totalCashFlows, 2)}` },
            { label: "Profitability Index", value: formatNumber(profitabilityIndex, 4) },
            { label: "Number of Periods", value: `${cashFlows.length}` },
          ],
        };
      },
    },
    {
      id: "uniform",
      name: "Uniform Cash Flows",
      fields: [
        { name: "discountRate", label: "Discount Rate (%)", type: "number", placeholder: "e.g. 10" },
        { name: "initialInvestment", label: "Initial Investment ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "annualCashFlow", label: "Annual Cash Flow ($)", type: "number", placeholder: "e.g. 30000" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const discountRate = inputs.discountRate as number;
        const initialInvestment = inputs.initialInvestment as number;
        const annualCashFlow = inputs.annualCashFlow as number;
        const years = inputs.years as number;

        if (!discountRate || !initialInvestment || !annualCashFlow || !years) return null;

        const r = discountRate / 100;
        const pvAnnuity = annualCashFlow * ((1 - Math.pow(1 + r, -years)) / r);
        const npv = pvAnnuity - initialInvestment;
        const paybackPeriod = initialInvestment / annualCashFlow;

        return {
          primary: { label: "Net Present Value (NPV)", value: `$${formatNumber(npv, 2)}` },
          details: [
            { label: "Decision", value: npv > 0 ? "Accept (NPV > 0)" : "Reject (NPV < 0)" },
            { label: "PV of Cash Flows", value: `$${formatNumber(pvAnnuity, 2)}` },
            { label: "Total Undiscounted Cash Flows", value: `$${formatNumber(annualCashFlow * years, 2)}` },
            { label: "Simple Payback Period", value: `${formatNumber(paybackPeriod, 1)} years` },
            { label: "Profitability Index", value: formatNumber(pvAnnuity / initialInvestment, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["irr-calculator", "present-value-calculator", "future-value-calculator"],
  faq: [
    { question: "What is NPV?", answer: "NPV (Net Present Value) is the difference between the present value of cash inflows and the present value of cash outflows over a period of time. A positive NPV indicates the investment is expected to be profitable." },
    { question: "What discount rate should I use?", answer: "The discount rate typically represents your cost of capital or required rate of return. Common choices include WACC (Weighted Average Cost of Capital), expected market return, or the risk-free rate plus a risk premium." },
  ],
  formula: "NPV = -Investment + Σ [CFt / (1 + r)^t] for t = 1 to n",
};
