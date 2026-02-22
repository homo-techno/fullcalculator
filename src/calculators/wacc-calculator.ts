import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waccCalculator: CalculatorDefinition = {
  slug: "wacc-calculator",
  title: "WACC Calculator",
  description: "Free WACC (Weighted Average Cost of Capital) calculator. Calculate a company's blended cost of capital from debt and equity.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wacc", "weighted average cost of capital", "cost of capital", "discount rate", "corporate finance"],
  variants: [
    {
      id: "basic",
      name: "WACC",
      description: "Calculate weighted average cost of capital",
      fields: [
        { name: "equityValue", label: "Market Value of Equity", type: "number", prefix: "$", placeholder: "e.g. 5000000" },
        { name: "debtValue", label: "Market Value of Debt", type: "number", prefix: "$", placeholder: "e.g. 2000000" },
        { name: "costOfEquity", label: "Cost of Equity (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "costOfDebt", label: "Cost of Debt (%)", type: "number", placeholder: "e.g. 6", suffix: "%" },
        { name: "taxRate", label: "Corporate Tax Rate (%)", type: "number", placeholder: "e.g. 21", suffix: "%" },
      ],
      calculate: (inputs) => {
        const E = inputs.equityValue as number;
        const D = inputs.debtValue as number;
        const re = (inputs.costOfEquity as number) / 100;
        const rd = (inputs.costOfDebt as number) / 100;
        const tc = (inputs.taxRate as number) / 100;
        if (!E || !D || !re || !rd) return null;
        const V = E + D;
        const wacc = (E / V) * re + (D / V) * rd * (1 - tc);
        const equityWeight = E / V;
        const debtWeight = D / V;
        return {
          primary: { label: "WACC", value: `${formatNumber(wacc * 100, 2)}%` },
          details: [
            { label: "Equity weight", value: `${formatNumber(equityWeight * 100, 2)}%` },
            { label: "Debt weight", value: `${formatNumber(debtWeight * 100, 2)}%` },
            { label: "After-tax cost of debt", value: `${formatNumber(rd * (1 - tc) * 100, 2)}%` },
            { label: "Total capital", value: `$${formatNumber(V)}` },
          ],
        };
      },
    },
    {
      id: "withPreferred",
      name: "WACC with Preferred Stock",
      description: "Include preferred stock in WACC calculation",
      fields: [
        { name: "equityValue", label: "Market Value of Equity", type: "number", prefix: "$", placeholder: "e.g. 5000000" },
        { name: "debtValue", label: "Market Value of Debt", type: "number", prefix: "$", placeholder: "e.g. 2000000" },
        { name: "preferredValue", label: "Market Value of Preferred Stock", type: "number", prefix: "$", placeholder: "e.g. 500000" },
        { name: "costOfEquity", label: "Cost of Equity (%)", type: "number", placeholder: "e.g. 12", suffix: "%" },
        { name: "costOfDebt", label: "Cost of Debt (%)", type: "number", placeholder: "e.g. 6", suffix: "%" },
        { name: "costOfPreferred", label: "Cost of Preferred (%)", type: "number", placeholder: "e.g. 8", suffix: "%" },
        { name: "taxRate", label: "Corporate Tax Rate (%)", type: "number", placeholder: "e.g. 21", suffix: "%" },
      ],
      calculate: (inputs) => {
        const E = inputs.equityValue as number;
        const D = inputs.debtValue as number;
        const P = inputs.preferredValue as number;
        const re = (inputs.costOfEquity as number) / 100;
        const rd = (inputs.costOfDebt as number) / 100;
        const rp = (inputs.costOfPreferred as number) / 100;
        const tc = (inputs.taxRate as number) / 100;
        if (!E || !D || !re || !rd || !rp) return null;
        const V = E + D + (P || 0);
        const wacc = (E / V) * re + (D / V) * rd * (1 - tc) + ((P || 0) / V) * rp;
        return {
          primary: { label: "WACC", value: `${formatNumber(wacc * 100, 2)}%` },
          details: [
            { label: "Equity weight", value: `${formatNumber((E / V) * 100, 2)}%` },
            { label: "Debt weight", value: `${formatNumber((D / V) * 100, 2)}%` },
            { label: "Preferred weight", value: `${formatNumber(((P || 0) / V) * 100, 2)}%` },
            { label: "Total capital", value: `$${formatNumber(V)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["capm-calculator", "cost-of-equity-calculator", "debt-to-equity-calculator"],
  faq: [
    { question: "What is WACC?", answer: "WACC (Weighted Average Cost of Capital) represents the average rate a company pays to finance its assets. It blends the cost of equity and the after-tax cost of debt, weighted by their proportions in the capital structure." },
    { question: "Why is WACC important?", answer: "WACC is used as a discount rate in DCF (Discounted Cash Flow) analysis. Projects must earn returns above the WACC to create shareholder value. It represents the minimum acceptable return for investors." },
    { question: "Why do we use after-tax cost of debt?", answer: "Interest on debt is tax-deductible, so the effective cost of debt is reduced by the tax shield. After-tax cost of debt = pre-tax cost of debt x (1 - tax rate)." },
  ],
  formula: "WACC = (E/V) * Re + (D/V) * Rd * (1 - Tc)",
};
