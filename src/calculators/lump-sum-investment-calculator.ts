import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lumpSumInvestmentCalculator: CalculatorDefinition = {
  slug: "lump-sum-investment-calculator",
  title: "Lump Sum Investment Calculator",
  description: "Calculate the future value of a one-time lump sum investment over a specified period with compounding.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["lump sum investment", "one time investment returns", "lump sum calculator"],
  variants: [{
    id: "standard",
    name: "Lump Sum Investment",
    description: "Calculate the future value of a one-time lump sum investment over a specified period with compounding",
    fields: [
      { name: "principal", label: "Investment Amount", type: "number", prefix: "Rs.", min: 1000, max: 100000000, step: 1000, defaultValue: 500000 },
      { name: "years", label: "Investment Period", type: "number", suffix: "years", min: 1, max: 40, defaultValue: 10 },
      { name: "expectedReturn", label: "Expected Annual Return", type: "number", suffix: "%", min: 1, max: 30, step: 0.5, defaultValue: 12 },
      { name: "compounding", label: "Compounding Frequency", type: "select", options: [{value:"1",label:"Annually"},{value:"4",label:"Quarterly"},{value:"12",label:"Monthly"}], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const principal = inputs.principal as number;
      const years = inputs.years as number;
      const rate = inputs.expectedReturn as number;
      const freq = parseInt(inputs.compounding as string) || 1;
      if (!principal || !years || !rate || principal <= 0) return null;
      const futureValue = principal * Math.pow(1 + rate / 100 / freq, freq * years);
      const totalGains = futureValue - principal;
      const multiplier = futureValue / principal;
      return {
        primary: { label: "Future Value", value: "Rs. " + formatNumber(Math.round(futureValue)) },
        details: [
          { label: "Total Gains", value: "Rs. " + formatNumber(Math.round(totalGains)) },
          { label: "Investment Multiplier", value: formatNumber(Math.round(multiplier * 100) / 100) + "x" },
          { label: "Effective Annual Rate", value: formatNumber(Math.round((Math.pow(1 + rate / 100 / freq, freq) - 1) * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sip-step-up-calculator", "mutual-fund-returns-calculator-india"],
  faq: [
    { question: "Is lump sum better than SIP?", answer: "Lump sum investing can outperform SIP in a consistently rising market because the entire amount benefits from compounding from day one. However, SIP reduces timing risk through rupee cost averaging." },
    { question: "How does compounding frequency affect returns?", answer: "More frequent compounding produces slightly higher returns. Monthly compounding yields more than annual compounding for the same nominal rate, though the difference is modest for typical return rates." },
  ],
  formula: "Future Value = Principal x (1 + Rate / Frequency) ^ (Frequency x Years)",
};
