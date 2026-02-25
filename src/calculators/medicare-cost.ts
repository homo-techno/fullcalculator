import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicareCostCalculator: CalculatorDefinition = {
  slug: "medicare-cost-calculator",
  title: "Medicare Cost Calculator",
  description:
    "Estimate your total Medicare costs including Part A, Part B, Part D, and Medigap premiums. Plan for Medicare expenses in retirement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["Medicare", "Medicare cost", "Part B premium", "Part D", "Medigap", "Medicare Advantage"],
  variants: [
    {
      id: "annualCost",
      name: "Annual Cost Estimate",
      fields: [
        { name: "partBPremium", label: "Monthly Part B Premium ($)", type: "number", placeholder: "e.g. 174.70" },
        { name: "partDPremium", label: "Monthly Part D Premium ($)", type: "number", placeholder: "e.g. 35" },
        { name: "medigapPremium", label: "Monthly Medigap/Supplement Premium ($)", type: "number", placeholder: "e.g. 150" },
        { name: "annualIncome", label: "Modified Adjusted Gross Income ($)", type: "number", placeholder: "e.g. 100000" },
        { name: "expectedMedical", label: "Expected Annual Medical Expenses ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "expectedPrescriptions", label: "Expected Annual Prescription Costs ($)", type: "number", placeholder: "e.g. 1500" },
      ],
      calculate: (inputs) => {
        const partBPremium = inputs.partBPremium as number || 174.70;
        const partDPremium = inputs.partDPremium as number || 0;
        const medigapPremium = inputs.medigapPremium as number || 0;
        const annualIncome = inputs.annualIncome as number || 0;
        const expectedMedical = inputs.expectedMedical as number || 0;
        const expectedPrescriptions = inputs.expectedPrescriptions as number || 0;

        let irmaa = 0;
        if (annualIncome > 500000) irmaa = 395.60;
        else if (annualIncome > 320000) irmaa = 329.70;
        else if (annualIncome > 194000) irmaa = 263.70;
        else if (annualIncome > 123000) irmaa = 197.80;
        else if (annualIncome > 103000) irmaa = 69.90;

        const totalMonthlyPremiums = partBPremium + irmaa + partDPremium + medigapPremium;
        const annualPremiums = totalMonthlyPremiums * 12;
        const partBDeductible = 240;
        const partBCoinsurance = Math.max(expectedMedical - partBDeductible, 0) * 0.2;
        const estimatedOOP = partBDeductible + partBCoinsurance + expectedPrescriptions * 0.25;
        const totalAnnualCost = annualPremiums + estimatedOOP;

        return {
          primary: { label: "Estimated Total Annual Medicare Cost", value: `$${formatNumber(totalAnnualCost, 2)}` },
          details: [
            { label: "Monthly Premiums (all parts)", value: `$${formatNumber(totalMonthlyPremiums, 2)}` },
            { label: "Annual Premium Total", value: `$${formatNumber(annualPremiums, 2)}` },
            { label: "IRMAA Surcharge (monthly)", value: `$${formatNumber(irmaa, 2)}` },
            { label: "Estimated Out-of-Pocket Costs", value: `$${formatNumber(estimatedOOP, 2)}` },
            { label: "Monthly Cost (all-in)", value: `$${formatNumber(totalAnnualCost / 12, 2)}` },
          ],
        };
      },
    },
    {
      id: "lifetimeCost",
      name: "Lifetime Medicare Cost",
      fields: [
        { name: "currentAge", label: "Current Age (65+)", type: "number", placeholder: "e.g. 65" },
        { name: "lifeExpectancy", label: "Life Expectancy", type: "number", placeholder: "e.g. 85" },
        { name: "currentMonthlyCost", label: "Current Total Monthly Medicare Cost ($)", type: "number", placeholder: "e.g. 500" },
        { name: "inflationRate", label: "Healthcare Inflation Rate (%)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const lifeExpectancy = inputs.lifeExpectancy as number;
        const currentMonthlyCost = inputs.currentMonthlyCost as number;
        const inflationRate = (inputs.inflationRate as number) / 100;

        if (!currentAge || !lifeExpectancy || !currentMonthlyCost) return null;

        const years = lifeExpectancy - currentAge;
        let totalCost = 0;
        let yearlyBreakdown: number[] = [];

        for (let i = 0; i < years; i++) {
          const yearCost = currentMonthlyCost * 12 * Math.pow(1 + inflationRate, i);
          totalCost += yearCost;
          yearlyBreakdown.push(yearCost);
        }

        const averageAnnual = totalCost / years;
        const finalYearCost = yearlyBreakdown[yearlyBreakdown.length - 1] || 0;

        return {
          primary: { label: "Estimated Lifetime Medicare Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Years of Medicare", value: `${years}` },
            { label: "First Year Cost", value: `$${formatNumber(currentMonthlyCost * 12, 2)}` },
            { label: "Final Year Cost", value: `$${formatNumber(finalYearCost, 2)}` },
            { label: "Average Annual Cost", value: `$${formatNumber(averageAnnual, 2)}` },
            { label: "Monthly Cost Today", value: `$${formatNumber(currentMonthlyCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["health-insurance-cost-calculator", "retirement-income-calculator", "social-security-benefit-calculator"],
  faq: [
    { question: "What is the IRMAA surcharge?", answer: "IRMAA (Income-Related Monthly Adjustment Amount) is an additional premium charged for Medicare Part B and Part D if your modified adjusted gross income exceeds certain thresholds. It's based on your tax return from two years prior." },
    { question: "What are the different parts of Medicare?", answer: "Part A covers hospital insurance (usually premium-free), Part B covers medical insurance ($174.70/month standard in 2024), Part C is Medicare Advantage (private plans), and Part D covers prescription drugs." },
  ],
  formula: "Total Annual Cost = (Part B + IRMAA + Part D + Medigap) × 12 + Out-of-Pocket Expenses",
};
