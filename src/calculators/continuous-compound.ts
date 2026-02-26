import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const continuousCompoundCalculator: CalculatorDefinition = {
  slug: "continuous-compound",
  title: "Continuous Compound Interest Calculator",
  description: "Free online continuous compound interest calculator. Calculate investment growth using continuous compounding with the exponential formula (Pe^rt).",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["continuous compounding", "compound interest", "exponential growth", "Pert formula", "continuous interest", "e^rt", "compounding"],
  variants: [
    {
      id: "future-value",
      name: "Calculate Future Value",
      fields: [
        {
          name: "principal",
          label: "Principal Amount ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "years",
          label: "Time Period (years)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const principal = parseFloat(inputs.principal as string) || 0;
        const rate = parseFloat(inputs.rate as string) || 0;
        const years = parseFloat(inputs.years as string) || 0;

        const r = rate / 100;
        const futureValue = principal * Math.exp(r * years);
        const interestEarned = futureValue - principal;
        const effectiveRate = (Math.exp(r) - 1) * 100;

        // Compare with discrete compounding
        const monthlyCompound = principal * Math.pow(1 + r / 12, 12 * years);
        const dailyCompound = principal * Math.pow(1 + r / 365, 365 * years);
        const continuousBenefit = futureValue - dailyCompound;

        const doublingTime = r > 0 ? Math.log(2) / r : 0;

        return {
          primary: { label: "Future Value (Continuous)", value: "$" + formatNumber(futureValue) },
          details: [
            { label: "Principal", value: "$" + formatNumber(principal) },
            { label: "Interest Earned", value: "$" + formatNumber(interestEarned) },
            { label: "Effective Annual Rate", value: formatNumber(effectiveRate, 4) + "%" },
            { label: "Monthly Compounding Result", value: "$" + formatNumber(monthlyCompound) },
            { label: "Daily Compounding Result", value: "$" + formatNumber(dailyCompound) },
            { label: "Continuous vs Daily Benefit", value: "$" + formatNumber(continuousBenefit) },
            { label: "Doubling Time", value: formatNumber(doublingTime, 2) + " years" },
          ],
        };
      },
    },
    {
      id: "solve-rate",
      name: "Solve for Required Rate",
      fields: [
        {
          name: "principal",
          label: "Current Amount ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "futureValue",
          label: "Desired Future Value ($)",
          type: "number",
          placeholder: "e.g. 20000",
          min: 0,
        },
        {
          name: "years",
          label: "Time Period (years)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.1,
        },
      ],
      calculate: (inputs) => {
        const principal = parseFloat(inputs.principal as string) || 0;
        const futureValue = parseFloat(inputs.futureValue as string) || 0;
        const years = parseFloat(inputs.years as string) || 1;

        const requiredRate = principal > 0 && years > 0
          ? (Math.log(futureValue / principal) / years) * 100
          : 0;

        const growthMultiple = principal > 0 ? futureValue / principal : 0;
        const totalReturn = futureValue - principal;
        const totalReturnPercent = principal > 0 ? (totalReturn / principal) * 100 : 0;

        return {
          primary: { label: "Required Annual Rate", value: formatNumber(requiredRate, 4) + "%" },
          details: [
            { label: "Current Amount", value: "$" + formatNumber(principal) },
            { label: "Target Future Value", value: "$" + formatNumber(futureValue) },
            { label: "Time Period", value: formatNumber(years, 1) + " years" },
            { label: "Growth Multiple", value: formatNumber(growthMultiple, 2) + "x" },
            { label: "Total Return Needed", value: "$" + formatNumber(totalReturn) },
            { label: "Total Return %", value: formatNumber(totalReturnPercent, 1) + "%" },
          ],
        };
      },
    },
    {
      id: "solve-time",
      name: "Solve for Time",
      fields: [
        {
          name: "principal",
          label: "Current Amount ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "futureValue",
          label: "Target Amount ($)",
          type: "number",
          placeholder: "e.g. 25000",
          min: 0,
        },
        {
          name: "rate",
          label: "Annual Interest Rate (%)",
          type: "number",
          placeholder: "e.g. 7",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const principal = parseFloat(inputs.principal as string) || 0;
        const futureValue = parseFloat(inputs.futureValue as string) || 0;
        const rate = parseFloat(inputs.rate as string) || 0;

        const r = rate / 100;
        const requiredYears = principal > 0 && r > 0
          ? Math.log(futureValue / principal) / r
          : 0;

        const requiredMonths = requiredYears * 12;
        const growthMultiple = principal > 0 ? futureValue / principal : 0;

        return {
          primary: { label: "Time Required", value: formatNumber(requiredYears, 2) + " years" },
          details: [
            { label: "Current Amount", value: "$" + formatNumber(principal) },
            { label: "Target Amount", value: "$" + formatNumber(futureValue) },
            { label: "Annual Rate", value: formatNumber(rate, 2) + "%" },
            { label: "Time in Months", value: formatNumber(requiredMonths, 1) },
            { label: "Growth Multiple", value: formatNumber(growthMultiple, 2) + "x" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["effective-interest-rate", "apy-calculator", "cd-calculator"],
  faq: [
    {
      question: "What is continuous compounding?",
      answer: "Continuous compounding is the mathematical limit of compounding frequency, where interest is compounded infinitely often. It uses the formula A = Pe^(rt), where e is Euler's number (approximately 2.71828). It produces slightly more than daily compounding.",
    },
    {
      question: "Is continuous compounding used in practice?",
      answer: "While no real financial product compounds truly continuously, the concept is used in options pricing (Black-Scholes model), theoretical finance, and as an approximation for very frequent compounding. Some banks compound daily, which is very close to continuous.",
    },
    {
      question: "What is the Rule of 72?",
      answer: "The Rule of 72 is a quick estimation: divide 72 by the interest rate to find the approximate years to double your money. For continuous compounding, use the Rule of 69.3 (ln(2) x 100 / rate) for a more accurate estimate.",
    },
  ],
  formula: "Future Value = P x e^(rt)\nRequired Rate = ln(FV/P) / t\nTime = ln(FV/P) / r\nwhere e = 2.71828...",
};
