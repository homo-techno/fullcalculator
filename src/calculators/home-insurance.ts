import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeInsuranceCalculator: CalculatorDefinition = {
  slug: "home-insurance-calculator",
  title: "Home Insurance Calculator",
  description:
    "Free home insurance cost estimator. Estimate annual homeowners insurance premiums based on home value, coverage level, and deductible.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home insurance calculator",
    "homeowners insurance calculator",
    "home insurance cost estimator",
    "house insurance calculator",
    "homeowner insurance estimate",
  ],
  variants: [
    {
      id: "estimate",
      name: "Insurance Premium Estimate",
      description: "Estimate your annual homeowners insurance premium",
      fields: [
        { name: "homeValue", label: "Home Replacement Value", type: "number", placeholder: "e.g. 350000", prefix: "$", min: 0 },
        {
          name: "coverageLevel",
          label: "Coverage Level",
          type: "select",
          options: [
            { label: "Basic (0.25% of value)", value: "0.25" },
            { label: "Standard (0.50% of value)", value: "0.50" },
            { label: "Enhanced (0.75% of value)", value: "0.75" },
            { label: "Premium (1.00% of value)", value: "1.00" },
            { label: "High Risk Area (1.50% of value)", value: "1.50" },
          ],
          defaultValue: "0.50",
        },
        {
          name: "deductible",
          label: "Deductible",
          type: "select",
          options: [
            { label: "$500", value: "500" },
            { label: "$1,000", value: "1000" },
            { label: "$2,000", value: "2000" },
            { label: "$2,500", value: "2500" },
            { label: "$5,000", value: "5000" },
          ],
          defaultValue: "1000",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.homeValue as number;
        const ratePercent = parseFloat(inputs.coverageLevel as string) || 0.50;
        const deductible = parseInt(inputs.deductible as string) || 1000;
        if (!value) return null;

        // Higher deductible = lower premium (roughly 10% savings per deductible level)
        const basePremium = value * (ratePercent / 100);
        const deductibleFactor = deductible <= 500 ? 1.15 : deductible <= 1000 ? 1.0 : deductible <= 2000 ? 0.90 : deductible <= 2500 ? 0.85 : 0.75;
        const annualPremium = basePremium * deductibleFactor;
        const monthlyPremium = annualPremium / 12;

        return {
          primary: { label: "Estimated Annual Premium", value: `$${formatNumber(annualPremium)}` },
          details: [
            { label: "Monthly cost", value: `$${formatNumber(monthlyPremium)}` },
            { label: "Home replacement value", value: `$${formatNumber(value)}` },
            { label: "Deductible", value: `$${formatNumber(deductible)}` },
            { label: "Base rate", value: `${ratePercent}% of home value` },
            { label: "Cost per $1,000 of coverage", value: `$${formatNumber((annualPremium / value) * 1000, 2)}` },
          ],
          note: "This is an estimate. Actual premiums depend on location, construction type, claims history, credit score, and specific policy features.",
        };
      },
    },
    {
      id: "coverage-needed",
      name: "Coverage Amount Needed",
      description: "Determine how much home insurance coverage you need",
      fields: [
        { name: "rebuildCost", label: "Estimated Rebuild Cost", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "personalProperty", label: "Personal Property Value", type: "number", placeholder: "e.g. 75000", prefix: "$", min: 0 },
        { name: "otherStructures", label: "Other Structures (garage, shed, etc.)", type: "number", placeholder: "e.g. 30000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const rebuild = inputs.rebuildCost as number;
        const personal = (inputs.personalProperty as number) || 0;
        const other = (inputs.otherStructures as number) || 0;
        if (!rebuild) return null;

        const dwellingCoverage = rebuild;
        const personalCoverage = personal > 0 ? personal : rebuild * 0.5; // default 50% of dwelling
        const otherCoverage = other > 0 ? other : rebuild * 0.1; // default 10%
        const liabilityCoverage = 300000; // standard
        const totalCoverage = dwellingCoverage + personalCoverage + otherCoverage + liabilityCoverage;

        return {
          primary: { label: "Recommended Total Coverage", value: `$${formatNumber(totalCoverage)}` },
          details: [
            { label: "Dwelling coverage (Coverage A)", value: `$${formatNumber(dwellingCoverage)}` },
            { label: "Personal property (Coverage C)", value: `$${formatNumber(personalCoverage)}` },
            { label: "Other structures (Coverage B)", value: `$${formatNumber(otherCoverage)}` },
            { label: "Liability (Coverage E)", value: `$${formatNumber(liabilityCoverage)}` },
          ],
          note: "Dwelling coverage should equal your home's rebuild cost, NOT its market value. Land value is not included in insurance.",
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "home-value-calculator", "closing-cost-calculator"],
  faq: [
    {
      question: "How much does homeowners insurance cost?",
      answer:
        "The national average is about $1,500-$2,000/year for a $300,000 home. Costs vary significantly by state: $600-$800/year in low-risk areas to $3,000-$5,000+ in hurricane/wildfire-prone areas. Factors include location, home age, credit score, and claims history.",
    },
    {
      question: "What does homeowners insurance cover?",
      answer:
        "Standard policies (HO-3) cover dwelling damage, personal property, liability, additional living expenses, other structures, and medical payments. Floods and earthquakes require separate policies. Standard policies do not cover maintenance issues or normal wear.",
    },
    {
      question: "How can I lower my home insurance premium?",
      answer:
        "Increase your deductible (saves 10-25%), bundle with auto insurance (5-15% discount), improve home security, maintain a good credit score, shop around annually, and ask about discounts for new roofs, smart home devices, or claims-free history.",
    },
  ],
  formula:
    "Estimated Premium = Home Value × Base Rate × Deductible Factor | Monthly = Annual Premium / 12",
};
