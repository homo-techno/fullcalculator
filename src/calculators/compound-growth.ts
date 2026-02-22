import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compoundGrowthCalculator: CalculatorDefinition = {
  slug: "compound-growth-calculator",
  title: "Compound Annual Growth Rate Calculator",
  description: "Free CAGR calculator. Calculate compound annual growth rate to measure investment performance and business growth over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["compound growth", "CAGR", "compound annual growth rate", "growth rate calculator", "investment growth"],
  variants: [
    {
      id: "basic",
      name: "CAGR from Values",
      description: "Calculate CAGR from beginning and ending values",
      fields: [
        { name: "beginningValue", label: "Beginning Value", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "endingValue", label: "Ending Value", type: "number", prefix: "$", placeholder: "e.g. 25000" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const bv = inputs.beginningValue as number;
        const ev = inputs.endingValue as number;
        const years = inputs.years as number;
        if (!bv || !ev || !years) return null;
        const cagr = (Math.pow(ev / bv, 1 / years) - 1) * 100;
        const totalReturn = ((ev - bv) / bv) * 100;
        const multiplier = ev / bv;
        return {
          primary: { label: "CAGR", value: `${formatNumber(cagr, 2)}%` },
          details: [
            { label: "Total return", value: `${formatNumber(totalReturn, 2)}%` },
            { label: "Total multiplier", value: `${formatNumber(multiplier, 2)}x` },
            { label: "Dollar gain", value: `$${formatNumber(ev - bv, 2)}` },
            { label: "Time period", value: `${formatNumber(years, 1)} years` },
          ],
        };
      },
    },
    {
      id: "futureValue",
      name: "Future Value from CAGR",
      description: "Project future value using a given CAGR",
      fields: [
        { name: "presentValue", label: "Present Value", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "cagr", label: "CAGR (%)", type: "number", placeholder: "e.g. 10", suffix: "%" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const pv = inputs.presentValue as number;
        const cagr = (inputs.cagr as number) / 100;
        const years = inputs.years as number;
        if (!pv || !cagr || !years) return null;
        const fv = pv * Math.pow(1 + cagr, years);
        const totalGain = fv - pv;
        return {
          primary: { label: "Future Value", value: `$${formatNumber(fv, 2)}` },
          details: [
            { label: "Total gain", value: `$${formatNumber(totalGain, 2)}` },
            { label: "Multiplier", value: `${formatNumber(fv / pv, 2)}x` },
            { label: "Doubling time", value: `${formatNumber(Math.log(2) / Math.log(1 + cagr), 1)} years` },
          ],
        };
      },
    },
    {
      id: "requiredCagr",
      name: "Required CAGR",
      description: "Calculate the CAGR needed to reach a target",
      fields: [
        { name: "currentValue", label: "Current Value", type: "number", prefix: "$", placeholder: "e.g. 50000" },
        { name: "targetValue", label: "Target Value", type: "number", prefix: "$", placeholder: "e.g. 100000" },
        { name: "years", label: "Years to Reach Target", type: "number", placeholder: "e.g. 7" },
      ],
      calculate: (inputs) => {
        const cv = inputs.currentValue as number;
        const tv = inputs.targetValue as number;
        const years = inputs.years as number;
        if (!cv || !tv || !years) return null;
        const requiredCagr = (Math.pow(tv / cv, 1 / years) - 1) * 100;
        return {
          primary: { label: "Required CAGR", value: `${formatNumber(requiredCagr, 2)}%` },
          details: [
            { label: "Current value", value: `$${formatNumber(cv, 2)}` },
            { label: "Target value", value: `$${formatNumber(tv, 2)}` },
            { label: "Growth needed", value: `${formatNumber(((tv - cv) / cv) * 100, 2)}%` },
            { label: "Time frame", value: `${years} years` },
            { label: "Feasibility", value: requiredCagr <= 10 ? "Conservative" : requiredCagr <= 20 ? "Moderate" : "Aggressive" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator", "portfolio-return-calculator"],
  faq: [
    { question: "What is CAGR?", answer: "Compound Annual Growth Rate (CAGR) is the rate of return that would be required for an investment to grow from its beginning value to its ending value, assuming profits are reinvested. It smooths out volatility to show a constant annual growth rate." },
    { question: "How is CAGR different from average annual return?", answer: "CAGR accounts for compounding, while simple average return does not. For example, if an investment goes up 50% one year and down 50% the next, the simple average is 0%, but CAGR shows a loss of about 13.4%." },
    { question: "What is a good CAGR?", answer: "The S&P 500 has historically delivered about 10% CAGR before inflation (7% after inflation). A CAGR above 15% is excellent, 10-15% is strong, and 5-10% is moderate for long-term investments." },
  ],
  formula: "CAGR = (Ending Value / Beginning Value)^(1/years) - 1",
};
