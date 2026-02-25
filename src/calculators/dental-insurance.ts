import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dentalInsuranceCalculator: CalculatorDefinition = {
  slug: "dental-insurance-savings-calculator",
  title: "Dental Insurance Savings Calculator",
  description:
    "Compare the cost of dental insurance vs paying out of pocket. Calculate whether dental insurance saves you money based on your expected dental care needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dental insurance", "dental savings", "dental costs", "insurance comparison", "out of pocket dental"],
  variants: [
    {
      id: "savingsAnalysis",
      name: "Savings Analysis",
      fields: [
        { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", placeholder: "e.g. 40" },
        { name: "annualDeductible", label: "Annual Deductible ($)", type: "number", placeholder: "e.g. 50" },
        { name: "annualMaximum", label: "Annual Maximum Benefit ($)", type: "number", placeholder: "e.g. 1500" },
        { name: "preventiveCoverage", label: "Preventive Coverage (%)", type: "number", placeholder: "e.g. 100" },
        { name: "basicCoverage", label: "Basic Procedure Coverage (%)", type: "number", placeholder: "e.g. 80" },
        { name: "majorCoverage", label: "Major Procedure Coverage (%)", type: "number", placeholder: "e.g. 50" },
        { name: "expectedPreventive", label: "Expected Annual Preventive Costs ($)", type: "number", placeholder: "e.g. 400" },
        { name: "expectedBasic", label: "Expected Annual Basic Procedure Costs ($)", type: "number", placeholder: "e.g. 300" },
        { name: "expectedMajor", label: "Expected Annual Major Procedure Costs ($)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const monthlyPremium = inputs.monthlyPremium as number;
        const annualDeductible = inputs.annualDeductible as number;
        const annualMaximum = inputs.annualMaximum as number;
        const preventiveCoverage = (inputs.preventiveCoverage as number) / 100;
        const basicCoverage = (inputs.basicCoverage as number) / 100;
        const majorCoverage = (inputs.majorCoverage as number) / 100;
        const expectedPreventive = inputs.expectedPreventive as number || 0;
        const expectedBasic = inputs.expectedBasic as number || 0;
        const expectedMajor = inputs.expectedMajor as number || 0;

        if (!monthlyPremium || !annualMaximum) return null;

        const annualPremium = monthlyPremium * 12;
        const totalExpected = expectedPreventive + expectedBasic + expectedMajor;

        const preventiveSavings = expectedPreventive * preventiveCoverage;
        const deductibleRemaining = Math.max(annualDeductible - 0, 0);
        const basicSavings = Math.max(expectedBasic * basicCoverage - deductibleRemaining, 0);
        const majorSavings = expectedMajor * majorCoverage;

        const totalSavings = Math.min(preventiveSavings + basicSavings + majorSavings, annualMaximum);
        const netSavings = totalSavings - annualPremium;
        const outOfPocketWithInsurance = annualPremium + (totalExpected - totalSavings);
        const outOfPocketWithout = totalExpected;

        return {
          primary: { label: "Net Annual Savings with Insurance", value: `$${formatNumber(netSavings, 2)}` },
          details: [
            { label: "Annual Premium Cost", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Insurance Pays (estimated)", value: `$${formatNumber(totalSavings, 2)}` },
            { label: "Total Cost WITH Insurance", value: `$${formatNumber(outOfPocketWithInsurance, 2)}` },
            { label: "Total Cost WITHOUT Insurance", value: `$${formatNumber(outOfPocketWithout, 2)}` },
            { label: "Recommendation", value: netSavings > 0 ? "Insurance saves money" : "Paying out of pocket is cheaper" },
          ],
        };
      },
    },
    {
      id: "breakEven",
      name: "Break-Even Analysis",
      fields: [
        { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", placeholder: "e.g. 40" },
        { name: "annualDeductible", label: "Annual Deductible ($)", type: "number", placeholder: "e.g. 50" },
        { name: "averageCoverage", label: "Average Coverage Rate (%)", type: "number", placeholder: "e.g. 70" },
      ],
      calculate: (inputs) => {
        const monthlyPremium = inputs.monthlyPremium as number;
        const annualDeductible = inputs.annualDeductible as number || 0;
        const averageCoverage = (inputs.averageCoverage as number) / 100;

        if (!monthlyPremium || !averageCoverage) return null;

        const annualPremium = monthlyPremium * 12;
        const breakEvenSpending = (annualPremium + annualDeductible) / averageCoverage;

        return {
          primary: { label: "Break-Even Dental Spending", value: `$${formatNumber(breakEvenSpending, 2)}` },
          details: [
            { label: "Annual Premium", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Annual Deductible", value: `$${formatNumber(annualDeductible, 2)}` },
            { label: "Total Annual Insurance Cost", value: `$${formatNumber(annualPremium + annualDeductible, 2)}` },
            { label: "Average Coverage Rate", value: `${formatNumber(averageCoverage * 100, 0)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["vision-insurance-savings-calculator", "health-insurance-cost-calculator", "cobra-cost-calculator"],
  faq: [
    { question: "Is dental insurance worth it?", answer: "Dental insurance is generally worth it if you expect to need more than basic preventive care. If you only need cleanings and checkups, paying out of pocket may be cheaper. If you anticipate fillings, crowns, or other procedures, insurance often saves money." },
    { question: "What does dental insurance typically cover?", answer: "Most dental plans cover preventive care (cleanings, X-rays) at 100%, basic procedures (fillings, extractions) at 80%, and major procedures (crowns, bridges) at 50%, after a deductible." },
  ],
  formula: "Net Savings = Insurance Payout − Annual Premium; Break-Even = (Premium + Deductible) / Coverage Rate",
};
