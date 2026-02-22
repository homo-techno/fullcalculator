import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dividendDiscountCalculator: CalculatorDefinition = {
  slug: "dividend-discount-calculator",
  title: "Dividend Discount Model Calculator",
  description: "Free dividend discount model (DDM) calculator. Estimate the intrinsic value of a stock based on expected future dividends.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dividend discount model", "DDM", "gordon growth model", "stock valuation", "intrinsic value", "dividend growth"],
  variants: [
    {
      id: "gordonGrowth",
      name: "Gordon Growth Model",
      description: "Single-stage constant growth DDM",
      fields: [
        { name: "dividend", label: "Annual Dividend per Share", type: "number", prefix: "$", placeholder: "e.g. 2.50" },
        { name: "growthRate", label: "Dividend Growth Rate (%)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "requiredReturn", label: "Required Rate of Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const D = inputs.dividend as number;
        const g = (inputs.growthRate as number) / 100;
        const r = (inputs.requiredReturn as number) / 100;
        if (!D || !r || r <= g) return null;
        const D1 = D * (1 + g);
        const intrinsicValue = D1 / (r - g);
        return {
          primary: { label: "Intrinsic Value", value: `$${formatNumber(intrinsicValue, 2)}` },
          details: [
            { label: "Next year's dividend (D1)", value: `$${formatNumber(D1, 2)}` },
            { label: "Dividend yield at fair value", value: `${formatNumber((D1 / intrinsicValue) * 100, 2)}%` },
            { label: "Growth rate", value: `${formatNumber(g * 100, 2)}%` },
          ],
        };
      },
    },
    {
      id: "twoStage",
      name: "Two-Stage DDM",
      description: "High growth followed by stable growth",
      fields: [
        { name: "dividend", label: "Current Annual Dividend", type: "number", prefix: "$", placeholder: "e.g. 2.00" },
        { name: "highGrowth", label: "High Growth Rate (%)", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "highGrowthYears", label: "High Growth Period (years)", type: "number", placeholder: "e.g. 5" },
        { name: "stableGrowth", label: "Stable Growth Rate (%)", type: "number", placeholder: "e.g. 4", suffix: "%" },
        { name: "requiredReturn", label: "Required Rate of Return (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const D0 = inputs.dividend as number;
        const g1 = (inputs.highGrowth as number) / 100;
        const n = inputs.highGrowthYears as number;
        const g2 = (inputs.stableGrowth as number) / 100;
        const r = (inputs.requiredReturn as number) / 100;
        if (!D0 || !n || r <= g2) return null;
        let pvHighGrowth = 0;
        let Dn = D0;
        for (let i = 1; i <= n; i++) {
          Dn = Dn * (1 + g1);
          pvHighGrowth += Dn / Math.pow(1 + r, i);
        }
        const terminalDiv = Dn * (1 + g2);
        const terminalValue = terminalDiv / (r - g2);
        const pvTerminal = terminalValue / Math.pow(1 + r, n);
        const intrinsicValue = pvHighGrowth + pvTerminal;
        return {
          primary: { label: "Intrinsic Value", value: `$${formatNumber(intrinsicValue, 2)}` },
          details: [
            { label: "PV of high-growth dividends", value: `$${formatNumber(pvHighGrowth, 2)}` },
            { label: "Terminal value", value: `$${formatNumber(terminalValue, 2)}` },
            { label: "PV of terminal value", value: `$${formatNumber(pvTerminal, 2)}` },
            { label: "Dividend at end of high growth", value: `$${formatNumber(Dn, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["intrinsic-value-calculator", "dividend-calculator", "pe-ratio-calculator"],
  faq: [
    { question: "What is the dividend discount model?", answer: "The dividend discount model (DDM) values a stock as the present value of all its expected future dividends. The Gordon Growth Model is the simplest form, assuming dividends grow at a constant rate forever." },
    { question: "When does the Gordon Growth Model fail?", answer: "The model requires that the required return exceeds the growth rate (r > g). If g >= r, the model produces infinite or negative values. It also assumes constant perpetual growth, which may not be realistic for high-growth companies." },
    { question: "What is a two-stage DDM?", answer: "A two-stage DDM accounts for companies with an initial high-growth phase followed by a stable, lower growth rate. This is more realistic for companies expected to mature over time." },
  ],
  formula: "Gordon Growth: P = D1 / (r - g) | D1 = D0 * (1 + g) | Two-stage: P = sum(Dt/(1+r)^t) + Pn/(1+r)^n",
};
