import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const healthInsuranceCostCalculator: CalculatorDefinition = {
  slug: "health-insurance-cost-calculator",
  title: "Health Insurance Cost Calculator",
  description:
    "Compare health insurance plan costs including premiums, deductibles, copays, and out-of-pocket maximums. Find the most cost-effective plan for your healthcare needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["health insurance cost", "plan comparison", "deductible", "copay", "out of pocket maximum"],
  variants: [
    {
      id: "totalCostEstimate",
      name: "Total Cost Estimate",
      fields: [
        { name: "monthlyPremium", label: "Monthly Premium ($)", type: "number", placeholder: "e.g. 450" },
        { name: "deductible", label: "Annual Deductible ($)", type: "number", placeholder: "e.g. 2000" },
        { name: "coinsurance", label: "Coinsurance You Pay (%)", type: "number", placeholder: "e.g. 20" },
        { name: "outOfPocketMax", label: "Out-of-Pocket Maximum ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "expectedMedicalCosts", label: "Expected Annual Medical Costs ($)", type: "number", placeholder: "e.g. 5000" },
        { name: "prescriptionCosts", label: "Expected Annual Prescription Costs ($)", type: "number", placeholder: "e.g. 1200" },
      ],
      calculate: (inputs) => {
        const monthlyPremium = inputs.monthlyPremium as number;
        const deductible = inputs.deductible as number;
        const coinsurance = (inputs.coinsurance as number) / 100;
        const outOfPocketMax = inputs.outOfPocketMax as number;
        const expectedMedicalCosts = inputs.expectedMedicalCosts as number || 0;
        const prescriptionCosts = inputs.prescriptionCosts as number || 0;

        if (!monthlyPremium || !deductible || !outOfPocketMax) return null;

        const annualPremium = monthlyPremium * 12;
        const totalExpectedCare = expectedMedicalCosts + prescriptionCosts;
        const deductiblePortion = Math.min(totalExpectedCare, deductible);
        const afterDeductible = Math.max(totalExpectedCare - deductible, 0);
        const coinsurancePortion = afterDeductible * coinsurance;
        const outOfPocketCosts = Math.min(deductiblePortion + coinsurancePortion, outOfPocketMax);
        const totalAnnualCost = annualPremium + outOfPocketCosts;
        const insurancePays = Math.max(totalExpectedCare - outOfPocketCosts, 0);

        return {
          primary: { label: "Total Annual Cost", value: `$${formatNumber(totalAnnualCost, 2)}` },
          details: [
            { label: "Annual Premiums", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Out-of-Pocket Costs", value: `$${formatNumber(outOfPocketCosts, 2)}` },
            { label: "Insurance Pays", value: `$${formatNumber(insurancePays, 2)}` },
            { label: "Deductible Portion", value: `$${formatNumber(deductiblePortion, 2)}` },
            { label: "Coinsurance Portion", value: `$${formatNumber(Math.min(coinsurancePortion, outOfPocketMax - deductiblePortion), 2)}` },
            { label: "Effective Coverage Rate", value: totalExpectedCare > 0 ? `${formatNumber((insurancePays / totalExpectedCare) * 100, 1)}%` : "N/A" },
          ],
        };
      },
    },
    {
      id: "planComparison",
      name: "Plan Comparison (Low vs High Deductible)",
      fields: [
        { name: "lowPremium", label: "Low Deductible Plan Monthly Premium ($)", type: "number", placeholder: "e.g. 600" },
        { name: "lowDeductible", label: "Low Deductible Plan Deductible ($)", type: "number", placeholder: "e.g. 500" },
        { name: "lowOopMax", label: "Low Deductible Plan OOP Max ($)", type: "number", placeholder: "e.g. 4000" },
        { name: "highPremium", label: "High Deductible Plan Monthly Premium ($)", type: "number", placeholder: "e.g. 350" },
        { name: "highDeductible", label: "High Deductible Plan Deductible ($)", type: "number", placeholder: "e.g. 3000" },
        { name: "highOopMax", label: "High Deductible Plan OOP Max ($)", type: "number", placeholder: "e.g. 7000" },
        { name: "expectedCosts", label: "Expected Annual Medical Costs ($)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const lowPremium = inputs.lowPremium as number;
        const lowDeductible = inputs.lowDeductible as number;
        const lowOopMax = inputs.lowOopMax as number;
        const highPremium = inputs.highPremium as number;
        const highDeductible = inputs.highDeductible as number;
        const highOopMax = inputs.highOopMax as number;
        const expectedCosts = inputs.expectedCosts as number;

        if (!lowPremium || !highPremium || !expectedCosts) return null;

        const calcCost = (premium: number, deductible: number, oopMax: number) => {
          const annualPremium = premium * 12;
          const deductiblePaid = Math.min(expectedCosts, deductible);
          const afterDed = Math.max(expectedCosts - deductible, 0);
          const coinsurance = afterDed * 0.2;
          const oop = Math.min(deductiblePaid + coinsurance, oopMax);
          return annualPremium + oop;
        };

        const lowTotal = calcCost(lowPremium, lowDeductible, lowOopMax);
        const highTotal = calcCost(highPremium, highDeductible, highOopMax);
        const premiumSavings = (lowPremium - highPremium) * 12;
        const betterPlan = lowTotal < highTotal ? "Low Deductible" : "High Deductible";

        return {
          primary: { label: "Better Plan", value: `${betterPlan} (saves $${formatNumber(Math.abs(lowTotal - highTotal), 2)})` },
          details: [
            { label: "Low Deductible Plan Total Cost", value: `$${formatNumber(lowTotal, 2)}` },
            { label: "High Deductible Plan Total Cost", value: `$${formatNumber(highTotal, 2)}` },
            { label: "Annual Premium Savings (HDHP)", value: `$${formatNumber(premiumSavings, 2)}` },
            { label: "Low Deductible Plan Annual Premiums", value: `$${formatNumber(lowPremium * 12, 2)}` },
            { label: "High Deductible Plan Annual Premiums", value: `$${formatNumber(highPremium * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["health-insurance-subsidy-calculator", "cobra-cost-calculator", "dental-insurance-savings-calculator"],
  faq: [
    { question: "How do I choose between a low and high deductible plan?", answer: "If you expect significant medical expenses, a low deductible plan may save money despite higher premiums. If you're generally healthy, a high deductible health plan (HDHP) with an HSA can save on premiums and provide tax advantages." },
    { question: "What counts toward my out-of-pocket maximum?", answer: "Deductibles, copays, and coinsurance typically count toward your out-of-pocket maximum. Premiums and out-of-network charges usually do not count." },
  ],
  formula: "Total Cost = Annual Premiums + min(Deductible Paid + Coinsurance, Out-of-Pocket Max)",
};
