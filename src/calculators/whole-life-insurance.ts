import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wholeLifeInsuranceCalculator: CalculatorDefinition = {
  slug: "whole-life-insurance-calculator",
  title: "Whole Life Insurance Calculator",
  description:
    "Estimate whole life insurance premiums, cash value growth, and compare with term life insurance. Understand the investment component of permanent life insurance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["whole life insurance", "permanent life insurance", "cash value", "death benefit", "insurance premium"],
  variants: [
    {
      id: "cashValueGrowth",
      name: "Cash Value Growth",
      fields: [
        { name: "deathBenefit", label: "Death Benefit ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "annualPremium", label: "Annual Premium ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "currentAge", label: "Current Age", type: "number", placeholder: "e.g. 35" },
        { name: "cashValueRate", label: "Cash Value Growth Rate (%)", type: "number", placeholder: "e.g. 4" },
        { name: "yearsToProject", label: "Years to Project", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const deathBenefit = inputs.deathBenefit as number;
        const annualPremium = inputs.annualPremium as number;
        const currentAge = inputs.currentAge as number;
        const cashValueRate = (inputs.cashValueRate as number) / 100;
        const yearsToProject = inputs.yearsToProject as number;

        if (!deathBenefit || !annualPremium || !currentAge || !cashValueRate || !yearsToProject) return null;

        const insuranceCostRatio = 0.6;
        const cashValuePortion = annualPremium * (1 - insuranceCostRatio);
        let cashValue = 0;

        for (let i = 0; i < yearsToProject; i++) {
          const portion = i < 3 ? cashValuePortion * (0.3 + i * 0.23) : cashValuePortion;
          cashValue = (cashValue + portion) * (1 + cashValueRate);
        }

        const totalPremiums = annualPremium * yearsToProject;
        const netCost = totalPremiums - cashValue;
        const effectiveAnnualCost = netCost / yearsToProject;

        return {
          primary: { label: "Projected Cash Value", value: `$${formatNumber(cashValue, 2)}` },
          details: [
            { label: "Death Benefit", value: `$${formatNumber(deathBenefit, 0)}` },
            { label: "Total Premiums Paid", value: `$${formatNumber(totalPremiums, 2)}` },
            { label: "Net Insurance Cost", value: `$${formatNumber(netCost, 2)}` },
            { label: "Effective Annual Cost", value: `$${formatNumber(effectiveAnnualCost, 2)}` },
            { label: "Cash Value as % of Premiums", value: `${formatNumber((cashValue / totalPremiums) * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "termVsWhole",
      name: "Term vs Whole Comparison",
      fields: [
        { name: "wholeLifePremium", label: "Whole Life Annual Premium ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "termPremium", label: "Term Life Annual Premium ($)", type: "number", placeholder: "e.g. 600" },
        { name: "investmentReturn", label: "Investment Return Rate (%)", type: "number", placeholder: "e.g. 7" },
        { name: "years", label: "Comparison Period (years)", type: "number", placeholder: "e.g. 30" },
        { name: "cashValueRate", label: "Whole Life Cash Value Rate (%)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const wholeLifePremium = inputs.wholeLifePremium as number;
        const termPremium = inputs.termPremium as number;
        const investmentReturn = (inputs.investmentReturn as number) / 100;
        const years = inputs.years as number;
        const cashValueRate = (inputs.cashValueRate as number) / 100;

        if (!wholeLifePremium || !termPremium || !investmentReturn || !years || !cashValueRate) return null;

        const difference = wholeLifePremium - termPremium;
        let investedDifference = 0;
        let cashValue = 0;
        const cashValuePortion = wholeLifePremium * 0.4;

        for (let i = 0; i < years; i++) {
          investedDifference = (investedDifference + difference) * (1 + investmentReturn);
          const portion = i < 3 ? cashValuePortion * (0.3 + i * 0.23) : cashValuePortion;
          cashValue = (cashValue + portion) * (1 + cashValueRate);
        }

        const buyTermInvestDifference = investedDifference;
        const advantage = buyTermInvestDifference - cashValue;

        return {
          primary: { label: "Buy Term & Invest Difference Value", value: `$${formatNumber(buyTermInvestDifference, 2)}` },
          details: [
            { label: "Whole Life Cash Value", value: `$${formatNumber(cashValue, 2)}` },
            { label: "BTID Advantage", value: `$${formatNumber(advantage, 2)}` },
            { label: "Annual Premium Difference", value: `$${formatNumber(difference, 2)}` },
            { label: "Total Whole Life Premiums", value: `$${formatNumber(wholeLifePremium * years, 0)}` },
            { label: "Total Term Premiums", value: `$${formatNumber(termPremium * years, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["term-life-insurance-calculator", "life-insurance-need-calculator", "annuity-calculator"],
  faq: [
    { question: "What is whole life insurance?", answer: "Whole life insurance is a type of permanent life insurance that provides coverage for your entire lifetime and includes a cash value component that grows over time. Premiums are typically fixed and higher than term life insurance." },
    { question: "Is whole life insurance a good investment?", answer: "Whole life insurance is primarily an insurance product, not an investment. The cash value grows tax-deferred but at modest rates. Many financial advisors recommend 'buy term and invest the difference' for most people." },
  ],
  formula: "Cash Value = Σ (Cash Value Portion × Growth Factor) × (1 + rate) per year",
};
