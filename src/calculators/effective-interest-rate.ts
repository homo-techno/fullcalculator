import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const effectiveInterestRateCalculator: CalculatorDefinition = {
  slug: "effective-interest-rate",
  title: "Effective Interest Rate Calculator",
  description: "Free online effective interest rate calculator. Convert between APR and APY, and calculate the true cost of borrowing with different compounding frequencies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["effective interest rate", "APR to APY", "APY to APR", "nominal rate", "effective rate", "compounding", "true interest rate"],
  variants: [
    {
      id: "apr-to-apy",
      name: "APR to APY (Effective Rate)",
      fields: [
        {
          name: "nominalRate",
          label: "Nominal Interest Rate / APR (%)",
          type: "number",
          placeholder: "e.g. 5.5",
          min: 0,
        },
        {
          name: "compoundingFrequency",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily (365)", value: "365" },
            { label: "Weekly (52)", value: "52" },
            { label: "Bi-Weekly (26)", value: "26" },
            { label: "Monthly (12)", value: "12" },
            { label: "Quarterly (4)", value: "4" },
            { label: "Semi-Annually (2)", value: "2" },
            { label: "Annually (1)", value: "1" },
          ],
        },
        {
          name: "principal",
          label: "Principal Amount ($, optional)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nominal = parseFloat(inputs.nominalRate as string) || 0;
        const n = parseFloat(inputs.compoundingFrequency as string) || 12;
        const principal = parseFloat(inputs.principal as string) || 10000;

        const r = nominal / 100;
        const effectiveRate = Math.pow(1 + r / n, n) - 1;
        const effectivePercent = effectiveRate * 100;

        const simpleInterest = principal * r;
        const compoundInterest = principal * effectiveRate;
        const difference = compoundInterest - simpleInterest;

        const periodicRate = r / n;

        return {
          primary: { label: "Effective Annual Rate (APY)", value: formatNumber(effectivePercent, 4) + "%" },
          details: [
            { label: "Nominal Rate (APR)", value: formatNumber(nominal, 2) + "%" },
            { label: "Compounding Periods / Year", value: formatNumber(n, 0) },
            { label: "Periodic Rate", value: formatNumber(periodicRate * 100, 4) + "%" },
            { label: "Simple Interest (1 yr)", value: "$" + formatNumber(simpleInterest) },
            { label: "Compound Interest (1 yr)", value: "$" + formatNumber(compoundInterest) },
            { label: "Additional from Compounding", value: "$" + formatNumber(difference) },
          ],
        };
      },
    },
    {
      id: "apy-to-apr",
      name: "APY to APR (Nominal Rate)",
      fields: [
        {
          name: "effectiveRate",
          label: "Effective Annual Rate / APY (%)",
          type: "number",
          placeholder: "e.g. 5.65",
          min: 0,
        },
        {
          name: "compoundingFrequency",
          label: "Compounding Frequency",
          type: "select",
          options: [
            { label: "Daily (365)", value: "365" },
            { label: "Weekly (52)", value: "52" },
            { label: "Monthly (12)", value: "12" },
            { label: "Quarterly (4)", value: "4" },
            { label: "Semi-Annually (2)", value: "2" },
            { label: "Annually (1)", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const effectiveRate = parseFloat(inputs.effectiveRate as string) || 0;
        const n = parseFloat(inputs.compoundingFrequency as string) || 12;

        const eff = effectiveRate / 100;
        const nominalRate = n * (Math.pow(1 + eff, 1 / n) - 1);
        const nominalPercent = nominalRate * 100;
        const periodicRate = nominalRate / n;

        return {
          primary: { label: "Nominal Rate (APR)", value: formatNumber(nominalPercent, 4) + "%" },
          details: [
            { label: "Effective Rate (APY)", value: formatNumber(effectiveRate, 4) + "%" },
            { label: "Compounding Periods / Year", value: formatNumber(n, 0) },
            { label: "Periodic Rate", value: formatNumber(periodicRate * 100, 4) + "%" },
            { label: "Difference (APY - APR)", value: formatNumber(effectiveRate - nominalPercent, 4) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["apy-calculator", "continuous-compound", "cd-calculator"],
  faq: [
    {
      question: "What is the difference between APR and APY?",
      answer: "APR (Annual Percentage Rate) is the stated nominal rate without considering compounding. APY (Annual Percentage Yield) is the effective rate that accounts for compounding. APY is always higher than or equal to APR. Lenders typically advertise APR (lower number), while savings accounts advertise APY (higher number).",
    },
    {
      question: "How does compounding frequency affect the effective rate?",
      answer: "More frequent compounding increases the effective rate. Daily compounding yields more than monthly, which yields more than quarterly, and so on. The difference is more significant at higher interest rates.",
    },
    {
      question: "Why is the effective rate important?",
      answer: "The effective rate tells you the true cost of borrowing or the true return on savings. Two loans with the same APR but different compounding frequencies will have different actual costs. Always compare effective rates for accurate comparisons.",
    },
  ],
  formula: "APY = (1 + APR/n)^n - 1\nAPR = n x [(1 + APY)^(1/n) - 1]\nwhere n = compounding periods per year",
};
