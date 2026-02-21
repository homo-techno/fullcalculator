import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cagrCalculator: CalculatorDefinition = {
  slug: "cagr-calculator",
  title: "CAGR Calculator",
  description: "Free CAGR calculator. Calculate the Compound Annual Growth Rate of an investment from beginning and ending values.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cagr calculator", "compound annual growth rate", "investment growth rate", "annualized return"],
  variants: [
    {
      id: "cagr",
      name: "Calculate CAGR",
      fields: [
        { name: "start", label: "Beginning Value", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "end", label: "Ending Value", type: "number", prefix: "$", placeholder: "e.g. 25000" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const start = inputs.start as number, end = inputs.end as number, years = inputs.years as number;
        if (!start || !end || !years || start <= 0 || years <= 0) return null;
        const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
        const totalReturn = ((end - start) / start) * 100;
        return {
          primary: { label: "CAGR", value: `${formatNumber(cagr, 2)}%` },
          details: [
            { label: "Total return", value: `${formatNumber(totalReturn, 2)}%` },
            { label: "Absolute gain", value: `$${formatNumber(end - start, 2)}` },
            { label: "Growth multiple", value: `${formatNumber(end / start, 3)}x` },
          ],
        };
      },
    },
    {
      id: "futureValue",
      name: "Future Value from CAGR",
      fields: [
        { name: "start", label: "Starting Value", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "rate", label: "CAGR (%)", type: "number", placeholder: "e.g. 8" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const start = inputs.start as number, rate = inputs.rate as number, years = inputs.years as number;
        if (!start || rate === undefined || !years) return null;
        const futureVal = start * Math.pow(1 + rate / 100, years);
        return {
          primary: { label: "Future Value", value: `$${formatNumber(futureVal, 2)}` },
          details: [
            { label: "Total growth", value: `$${formatNumber(futureVal - start, 2)}` },
            { label: "Growth multiple", value: `${formatNumber(futureVal / start, 3)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "investment-calculator", "roi-calculator"],
  faq: [{ question: "What is CAGR?", answer: "CAGR (Compound Annual Growth Rate) is the rate of return that would be required for an investment to grow from its beginning balance to its ending balance, assuming profits were reinvested. Formula: CAGR = (End/Start)^(1/years) - 1." }],
  formula: "CAGR = (Ending Value / Beginning Value)^(1/n) - 1",
};
