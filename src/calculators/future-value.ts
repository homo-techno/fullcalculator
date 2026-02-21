import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const futureValueCalculator: CalculatorDefinition = {
  slug: "future-value-calculator",
  title: "Future Value Calculator",
  description:
    "Free future value calculator. Calculate how much your investment or savings will grow with compound interest and periodic contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["future value", "FV", "compound interest", "investment growth", "savings"],
  variants: [
    {
      id: "lumpSum",
      name: "Lump Sum",
      fields: [
        { name: "presentValue", label: "Present Value ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "rate", label: "Annual Interest Rate (%)", type: "number", placeholder: "e.g. 7" },
        { name: "periods", label: "Number of Years", type: "number", placeholder: "e.g. 20" },
        { name: "compounding", label: "Compounding per Year (1,4,12,365)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const presentValue = inputs.presentValue as number;
        const rate = inputs.rate as number;
        const periods = inputs.periods as number;
        const compounding = inputs.compounding as number || 1;

        if (!presentValue || !rate || !periods) return null;

        const r = rate / 100;
        const fv = presentValue * Math.pow(1 + r / compounding, compounding * periods);
        const totalInterest = fv - presentValue;

        return {
          primary: { label: "Future Value", value: `$${formatNumber(fv, 2)}` },
          details: [
            { label: "Present Value", value: `$${formatNumber(presentValue, 2)}` },
            { label: "Total Interest Earned", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Growth Multiple", value: `${formatNumber(fv / presentValue, 2)}x` },
            { label: "Effective Annual Rate", value: `${formatNumber((Math.pow(1 + r / compounding, compounding) - 1) * 100, 4)}%` },
          ],
        };
      },
    },
    {
      id: "withPayments",
      name: "With Periodic Payments",
      fields: [
        { name: "presentValue", label: "Initial Investment ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "payment", label: "Monthly Payment ($)", type: "number", placeholder: "e.g. 500" },
        { name: "rate", label: "Annual Interest Rate (%)", type: "number", placeholder: "e.g. 7" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const presentValue = inputs.presentValue as number || 0;
        const payment = inputs.payment as number;
        const rate = inputs.rate as number;
        const years = inputs.years as number;

        if (!payment || !rate || !years) return null;

        const monthlyRate = (rate / 100) / 12;
        const totalMonths = years * 12;

        // FV of lump sum
        const fvLump = presentValue * Math.pow(1 + monthlyRate, totalMonths);

        // FV of annuity (monthly payments)
        const fvAnnuity = payment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

        const totalFV = fvLump + fvAnnuity;
        const totalContributions = presentValue + payment * totalMonths;
        const totalInterest = totalFV - totalContributions;

        return {
          primary: { label: "Future Value", value: `$${formatNumber(totalFV, 2)}` },
          details: [
            { label: "FV of Initial Investment", value: `$${formatNumber(fvLump, 2)}` },
            { label: "FV of Monthly Payments", value: `$${formatNumber(fvAnnuity, 2)}` },
            { label: "Total Contributions", value: `$${formatNumber(totalContributions, 2)}` },
            { label: "Total Interest Earned", value: `$${formatNumber(totalInterest, 2)}` },
            { label: "Interest as % of Total", value: `${formatNumber((totalInterest / totalFV) * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["present-value-calculator", "401k-calculator", "roth-ira-calculator"],
  faq: [
    { question: "What is future value?", answer: "Future value is the value of a current asset at a future date based on an assumed rate of growth. It shows how much an investment made today will be worth in the future." },
    { question: "How does compounding frequency affect future value?", answer: "More frequent compounding (e.g., monthly vs. annually) results in a higher future value because interest earns interest more often. The difference is captured by the effective annual rate." },
  ],
  formula: "FV = PV × (1 + r/n)^(n×t); FV with payments = PMT × [((1 + r)^n - 1) / r]",
};
