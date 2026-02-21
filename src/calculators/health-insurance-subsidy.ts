import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const healthInsuranceSubsidyCalculator: CalculatorDefinition = {
  slug: "health-insurance-subsidy-calculator",
  title: "Health Insurance Subsidy Calculator",
  description: "Free ACA health insurance subsidy calculator. Estimate your premium tax credit for Marketplace health insurance based on income and household size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["health insurance subsidy calculator", "ACA subsidy calculator", "premium tax credit calculator", "marketplace subsidy", "Obamacare subsidy calculator"],
  variants: [
    {
      id: "aca-subsidy",
      name: "ACA Premium Tax Credit Estimator",
      description: "Estimate your Affordable Care Act premium tax credit based on income and family size",
      fields: [
        { name: "annualIncome", label: "Estimated Annual Household Income", type: "number", placeholder: "e.g. 50000", prefix: "$" },
        { name: "householdSize", label: "Household Size", type: "select", options: [
          { label: "1 Person", value: "1" },
          { label: "2 People", value: "2" },
          { label: "3 People", value: "3" },
          { label: "4 People", value: "4" },
          { label: "5 People", value: "5" },
          { label: "6 People", value: "6" },
        ], defaultValue: "1" },
        { name: "benchmarkPremium", label: "Second-Lowest Silver Plan (monthly)", type: "number", placeholder: "e.g. 450", prefix: "$" },
        { name: "age", label: "Primary Applicant Age", type: "number", placeholder: "e.g. 40", min: 18, max: 64 },
      ],
      calculate: (inputs) => {
        const annualIncome = inputs.annualIncome as number;
        const householdSize = parseInt(inputs.householdSize as string) || 1;
        const benchmarkPremium = inputs.benchmarkPremium as number;
        const age = inputs.age as number;

        if (!annualIncome || !benchmarkPremium) return null;

        // 2024 Federal Poverty Level guidelines
        const fplBase = 15060;
        const fplPerPerson = 5380;
        const fpl = fplBase + (householdSize - 1) * fplPerPerson;
        const fplPercent = (annualIncome / fpl) * 100;

        // Expected contribution percentages (2024 enhanced ACA subsidies)
        let expectedContributionPercent: number;
        if (fplPercent <= 150) expectedContributionPercent = 0;
        else if (fplPercent <= 200) expectedContributionPercent = 0 + (fplPercent - 150) / 50 * 2;
        else if (fplPercent <= 250) expectedContributionPercent = 2 + (fplPercent - 200) / 50 * 2;
        else if (fplPercent <= 300) expectedContributionPercent = 4 + (fplPercent - 250) / 50 * 2;
        else if (fplPercent <= 400) expectedContributionPercent = 6 + (fplPercent - 300) / 100 * 2.5;
        else expectedContributionPercent = 8.5;

        const monthlyExpectedContribution = (annualIncome * (expectedContributionPercent / 100)) / 12;
        const monthlySubsidy = Math.max(0, benchmarkPremium - monthlyExpectedContribution);
        const annualSubsidy = monthlySubsidy * 12;
        const estimatedMonthlyPremium = benchmarkPremium - monthlySubsidy;

        const eligibleForCSR = fplPercent <= 250;

        return {
          primary: { label: "Estimated Monthly Subsidy", value: `$${formatNumber(monthlySubsidy)}` },
          details: [
            { label: "Federal Poverty Level", value: `$${formatNumber(fpl)} (${householdSize}-person household)` },
            { label: "Income as % of FPL", value: `${formatNumber(fplPercent)}%` },
            { label: "Expected contribution rate", value: `${formatNumber(expectedContributionPercent)}%` },
            { label: "Your expected monthly payment", value: `$${formatNumber(monthlyExpectedContribution)}` },
            { label: "Estimated monthly premium after subsidy", value: `$${formatNumber(estimatedMonthlyPremium)}` },
            { label: "Annual subsidy value", value: `$${formatNumber(annualSubsidy)}` },
            { label: "Cost-sharing reductions eligible", value: eligibleForCSR ? "Yes (choose Silver plan)" : "No" },
          ],
          note: "This is an estimate based on the enhanced ACA subsidies. Actual subsidy amounts depend on available plans in your area, exact income, and household composition. Visit healthcare.gov for precise quotes.",
        };
      },
    },
  ],
  relatedSlugs: ["medicare-premium-calculator", "tax-calculator", "life-insurance-need-calculator"],
  faq: [
    { question: "Who qualifies for ACA subsidies?", answer: "You may qualify if your income is above 100% of FPL (or above 138% in Medicaid expansion states) with no upper limit under the enhanced subsidies (through 2025). You must not have access to affordable employer coverage or government programs like Medicare/Medicaid." },
    { question: "What is the premium tax credit?", answer: "The premium tax credit (PTC) is a subsidy that lowers your monthly health insurance premium when you buy coverage through the ACA Marketplace. It's based on the difference between the second-lowest Silver plan premium and your expected contribution based on income." },
    { question: "Do I have to pay back the subsidy?", answer: "If your actual income differs from your estimate, you may owe money back or receive a refund at tax time. If your income was higher than estimated, you may need to repay some or all of the excess subsidy when you file your tax return." },
  ],
  formula: "Monthly Subsidy = Second-Lowest Silver Plan Premium - (Annual Income × Expected Contribution Rate / 12). Contribution rate ranges from 0% (at 150% FPL) to 8.5% (at 400%+ FPL).",
};
