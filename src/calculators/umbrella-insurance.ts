import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const umbrellaInsuranceCalculator: CalculatorDefinition = {
  slug: "umbrella-insurance-calculator",
  title: "Umbrella Insurance Calculator",
  description: "Free umbrella insurance calculator. Estimate umbrella liability insurance costs and determine how much coverage you need based on your net worth and risk factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["umbrella insurance calculator", "umbrella insurance cost", "umbrella policy calculator", "excess liability insurance", "personal umbrella insurance"],
  variants: [
    {
      id: "umbrella-coverage",
      name: "Umbrella Insurance Estimator",
      description: "Estimate umbrella insurance premium and coverage needs based on your assets and risk profile",
      fields: [
        { name: "netWorth", label: "Total Net Worth (assets - debts)", type: "number", placeholder: "e.g. 500000", prefix: "$" },
        { name: "futureEarnings", label: "Estimated Future Earnings (10 years)", type: "number", placeholder: "e.g. 800000", prefix: "$", defaultValue: 0 },
        { name: "coverageAmount", label: "Desired Coverage", type: "select", options: [
          { label: "$1,000,000", value: "1000000" },
          { label: "$2,000,000", value: "2000000" },
          { label: "$3,000,000", value: "3000000" },
          { label: "$5,000,000", value: "5000000" },
          { label: "$10,000,000", value: "10000000" },
        ], defaultValue: "1000000" },
        { name: "numCars", label: "Vehicles Insured", type: "select", options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4+", value: "4" },
        ], defaultValue: "2" },
        { name: "numProperties", label: "Properties Owned / Rented", type: "select", options: [
          { label: "1 (primary residence)", value: "1" },
          { label: "2 (with rental/vacation)", value: "2" },
          { label: "3+", value: "3" },
        ], defaultValue: "1" },
        { name: "riskFactors", label: "Additional Risk Factors", type: "select", options: [
          { label: "None", value: "none" },
          { label: "Pool or trampoline", value: "pool" },
          { label: "Dog (any breed)", value: "dog" },
          { label: "Teen driver", value: "teen" },
          { label: "Multiple risk factors", value: "multiple" },
        ], defaultValue: "none" },
      ],
      calculate: (inputs) => {
        const netWorth = inputs.netWorth as number;
        const futureEarnings = (inputs.futureEarnings as number) || 0;
        const coverageAmount = parseInt(inputs.coverageAmount as string);
        const numCars = parseInt(inputs.numCars as string);
        const numProperties = parseInt(inputs.numProperties as string);
        const riskFactors = inputs.riskFactors as string;

        if (!netWorth) return null;

        // Base premium for $1M umbrella
        let basePremium = 200;

        // Coverage amount pricing (each additional $1M)
        const millionsOfCoverage = coverageAmount / 1000000;
        let coveragePremium = basePremium;
        if (millionsOfCoverage > 1) {
          coveragePremium += (millionsOfCoverage - 1) * 100;
        }

        // Vehicle factor
        const carFactor = 1 + (numCars - 1) * 0.1;

        // Property factor
        const propertyFactor = 1 + (numProperties - 1) * 0.15;

        // Risk factor
        const riskMultipliers: Record<string, number> = {
          none: 1.0, pool: 1.15, dog: 1.2, teen: 1.3, multiple: 1.5,
        };
        const riskFactor = riskMultipliers[riskFactors] || 1.0;

        const annualPremium = coveragePremium * carFactor * propertyFactor * riskFactor;
        const monthlyPremium = annualPremium / 12;

        // Coverage recommendation
        const recommendedCoverage = Math.ceil((netWorth + futureEarnings) / 1000000) * 1000000;
        const costPerMillionPerYear = annualPremium / millionsOfCoverage;

        return {
          primary: { label: "Estimated Annual Premium", value: `$${formatNumber(annualPremium)}` },
          details: [
            { label: "Monthly cost", value: `$${formatNumber(monthlyPremium)}` },
            { label: "Coverage amount", value: `$${formatNumber(coverageAmount)}` },
            { label: "Cost per $1M per year", value: `$${formatNumber(costPerMillionPerYear)}` },
            { label: "Recommended coverage", value: `$${formatNumber(recommendedCoverage)}` },
            { label: "Net worth", value: `$${formatNumber(netWorth)}` },
            { label: "Assets at risk (worth + earnings)", value: `$${formatNumber(netWorth + futureEarnings)}` },
            { label: "Risk level", value: riskFactors === "none" ? "Standard" : "Elevated" },
          ],
          note: "Umbrella insurance is typically one of the best insurance values, providing $1 million in extra liability coverage for about $200-$400/year. Most insurers require you to carry minimum auto (250/500/100) and home ($300K+) liability limits first.",
        };
      },
    },
  ],
  relatedSlugs: ["auto-insurance-estimate-calculator", "renters-insurance-calculator", "life-insurance-need-calculator"],
  faq: [
    { question: "What does umbrella insurance cover?", answer: "Umbrella insurance provides extra liability coverage beyond your auto and homeowner's policy limits. It covers bodily injury, property damage, certain lawsuits, and personal liability situations like defamation. It kicks in after your underlying policy limits are exhausted." },
    { question: "How much umbrella insurance do I need?", answer: "A common guideline is to carry umbrella coverage equal to your net worth plus estimated future earnings that could be garnished in a lawsuit. At minimum, most financial advisors recommend $1 million. Those with significant assets should consider $2-5 million or more." },
    { question: "Is umbrella insurance worth it?", answer: "Yes, for most homeowners and car owners. At $150-$400/year for $1 million in coverage, it's one of the most cost-effective insurance products. A single serious car accident or lawsuit can easily exceed standard policy limits of $300,000-$500,000." },
  ],
  formula: "Annual Premium = Base ($200 for $1M) + Additional Millions × $100/each, adjusted by vehicle count, property count, and risk factors. Recommended coverage = Net Worth + Future Earnings.",
};
