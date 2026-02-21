import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const interestRateCalculator: CalculatorDefinition = {
  slug: "interest-rate-calculator",
  title: "Interest Rate Calculator",
  description: "Free interest rate calculator. Find the interest rate needed to reach a savings goal, or compare APR to APY.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["interest rate calculator", "find interest rate", "APR to APY", "effective interest rate", "nominal rate"],
  variants: [
    {
      id: "findRate",
      name: "Find Required Rate",
      fields: [
        { name: "pv", label: "Present Value", type: "number", prefix: "$", placeholder: "e.g. 10000" },
        { name: "fv", label: "Future Value", type: "number", prefix: "$", placeholder: "e.g. 25000" },
        { name: "years", label: "Years", type: "number", placeholder: "e.g. 10" },
        { name: "compound", label: "Compounding", type: "select", options: [
          { label: "Annually", value: "1" }, { label: "Monthly", value: "12" },
          { label: "Daily", value: "365" }, { label: "Continuously", value: "0" },
        ]},
      ],
      calculate: (inputs) => {
        const pv = inputs.pv as number, fv = inputs.fv as number, years = inputs.years as number;
        const n = parseInt((inputs.compound as string) || "1");
        if (!pv || !fv || !years || fv <= pv) return null;
        let rate: number;
        if (n === 0) {
          rate = Math.log(fv / pv) / years * 100;
        } else {
          rate = (Math.pow(fv / pv, 1 / (n * years)) - 1) * n * 100;
        }
        return {
          primary: { label: "Required Annual Rate", value: `${formatNumber(rate, 4)}%` },
          details: [
            { label: "Present value", value: `$${formatNumber(pv, 2)}` },
            { label: "Future value", value: `$${formatNumber(fv, 2)}` },
            { label: "Total growth", value: `${formatNumber(((fv - pv) / pv) * 100, 2)}%` },
            { label: "Growth multiple", value: `${formatNumber(fv / pv, 3)}×` },
          ],
        };
      },
    },
    {
      id: "aprToApy",
      name: "APR ↔ APY Converter",
      fields: [
        { name: "rate", label: "Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 5" },
        { name: "type", label: "Input Type", type: "select", options: [
          { label: "APR (nominal)", value: "apr" }, { label: "APY (effective)", value: "apy" },
        ]},
        { name: "periods", label: "Compounding Periods/Year", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const rate = inputs.rate as number, type = (inputs.type as string) || "apr";
        const n = (inputs.periods as number) || 12;
        if (!rate) return null;
        let apr: number, apy: number;
        if (type === "apr") {
          apr = rate;
          apy = (Math.pow(1 + rate / 100 / n, n) - 1) * 100;
        } else {
          apy = rate;
          apr = (Math.pow(1 + rate / 100, 1 / n) - 1) * n * 100;
        }
        return {
          primary: { label: type === "apr" ? "APY" : "APR", value: `${formatNumber(type === "apr" ? apy : apr, 4)}%` },
          details: [
            { label: "APR (nominal)", value: `${formatNumber(apr, 4)}%` },
            { label: "APY (effective)", value: `${formatNumber(apy, 4)}%` },
            { label: "Compounding periods", value: `${n}/year` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "savings-goal-calculator", "cagr-calculator"],
  faq: [{ question: "What's the difference between APR and APY?", answer: "APR (Annual Percentage Rate) is the nominal rate without compounding. APY (Annual Percentage Yield) includes compounding. APY is always ≥ APR. Example: 5% APR compounded monthly = 5.116% APY." }],
  formula: "APY = (1 + APR/n)^n - 1 | Rate = ((FV/PV)^(1/nt) - 1) × n",
};
