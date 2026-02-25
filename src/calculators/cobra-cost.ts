import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cobraCostCalculator: CalculatorDefinition = {
  slug: "cobra-cost-calculator",
  title: "COBRA Insurance Cost Calculator",
  description:
    "Calculate your COBRA insurance costs after leaving a job. Compare COBRA with marketplace plans and estimate total expenses during your coverage gap.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["COBRA", "continuation coverage", "health insurance gap", "job loss insurance", "COBRA cost"],
  variants: [
    {
      id: "cobraCost",
      name: "COBRA Cost Estimate",
      fields: [
        { name: "employerPremium", label: "Full Monthly Premium (employer + your share) ($)", type: "number", placeholder: "e.g. 1800" },
        { name: "adminFee", label: "Admin Fee (%)", type: "number", placeholder: "e.g. 2" },
        { name: "monthsNeeded", label: "Months of COBRA Needed", type: "number", placeholder: "e.g. 6" },
        { name: "previousEmployeeShare", label: "Your Previous Monthly Share ($)", type: "number", placeholder: "e.g. 400" },
      ],
      calculate: (inputs) => {
        const employerPremium = inputs.employerPremium as number;
        const adminFee = (inputs.adminFee as number) || 2;
        const monthsNeeded = inputs.monthsNeeded as number;
        const previousEmployeeShare = inputs.previousEmployeeShare as number || 0;

        if (!employerPremium || !monthsNeeded) return null;

        const cobraMonthly = employerPremium * (1 + adminFee / 100);
        const totalCobraCost = cobraMonthly * monthsNeeded;
        const monthlyIncrease = cobraMonthly - previousEmployeeShare;
        const totalIncrease = monthlyIncrease * monthsNeeded;
        const percentIncrease = previousEmployeeShare > 0 ? ((cobraMonthly / previousEmployeeShare) - 1) * 100 : 0;

        return {
          primary: { label: "Monthly COBRA Cost", value: `$${formatNumber(cobraMonthly, 2)}` },
          details: [
            { label: "Total COBRA Cost", value: `$${formatNumber(totalCobraCost, 2)}` },
            { label: "Monthly Increase from Employee Rate", value: `$${formatNumber(monthlyIncrease, 2)}` },
            { label: "Total Additional Cost vs Employee Rate", value: `$${formatNumber(totalIncrease, 2)}` },
            { label: "Percent Increase from Employee Rate", value: previousEmployeeShare > 0 ? `${formatNumber(percentIncrease, 1)}%` : "N/A" },
            { label: "Coverage Duration", value: `${monthsNeeded} months` },
          ],
        };
      },
    },
    {
      id: "cobraVsMarketplace",
      name: "COBRA vs Marketplace",
      fields: [
        { name: "cobraMonthly", label: "COBRA Monthly Premium ($)", type: "number", placeholder: "e.g. 1836" },
        { name: "marketplaceMonthly", label: "Marketplace Monthly Premium ($)", type: "number", placeholder: "e.g. 800" },
        { name: "cobraDeductible", label: "COBRA Plan Deductible ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "marketplaceDeductible", label: "Marketplace Plan Deductible ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "expectedMedical", label: "Expected Medical Costs During Gap ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "months", label: "Months of Coverage Needed", type: "number", placeholder: "e.g. 6" },
        { name: "subsidyAmount", label: "Monthly ACA Subsidy (if eligible) ($)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const cobraMonthly = inputs.cobraMonthly as number;
        const marketplaceMonthly = inputs.marketplaceMonthly as number;
        const cobraDeductible = inputs.cobraDeductible as number || 0;
        const marketplaceDeductible = inputs.marketplaceDeductible as number || 0;
        const expectedMedical = inputs.expectedMedical as number || 0;
        const months = inputs.months as number;
        const subsidyAmount = inputs.subsidyAmount as number || 0;

        if (!cobraMonthly || !marketplaceMonthly || !months) return null;

        const cobraTotal = cobraMonthly * months + Math.min(expectedMedical, cobraDeductible);
        const effectiveMarketplace = marketplaceMonthly - subsidyAmount;
        const marketplaceTotal = effectiveMarketplace * months + Math.min(expectedMedical, marketplaceDeductible);
        const savings = cobraTotal - marketplaceTotal;

        return {
          primary: { label: "Better Option", value: savings > 0 ? `Marketplace (saves $${formatNumber(savings, 2)})` : `COBRA (saves $${formatNumber(-savings, 2)})` },
          details: [
            { label: "Total COBRA Cost", value: `$${formatNumber(cobraTotal, 2)}` },
            { label: "Total Marketplace Cost", value: `$${formatNumber(marketplaceTotal, 2)}` },
            { label: "Monthly COBRA Premium", value: `$${formatNumber(cobraMonthly, 2)}` },
            { label: "Monthly Marketplace Premium (after subsidy)", value: `$${formatNumber(effectiveMarketplace, 2)}` },
            { label: "Savings", value: `$${formatNumber(Math.abs(savings), 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["health-insurance-cost-calculator", "health-insurance-subsidy-calculator", "retirement-income-calculator"],
  faq: [
    { question: "What is COBRA insurance?", answer: "COBRA (Consolidated Omnibus Budget Reconciliation Act) allows you to continue your employer-sponsored health insurance after leaving a job. You pay the full premium (employer + employee portion) plus a 2% admin fee." },
    { question: "How long can I keep COBRA coverage?", answer: "COBRA coverage typically lasts up to 18 months after a qualifying event (like job loss). In some cases, such as disability, coverage can extend to 29 months." },
  ],
  formula: "COBRA Monthly = Full Premium × (1 + Admin Fee %); Total = Monthly × Months Needed",
};
