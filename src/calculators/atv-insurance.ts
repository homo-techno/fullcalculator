import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atvInsuranceCalculator: CalculatorDefinition = {
  slug: "atv-insurance-calculator",
  title: "ATV Insurance Calculator",
  description: "Free ATV insurance cost calculator. Estimate insurance premiums for your all-terrain vehicle based on value, usage, and coverage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["atv insurance calculator", "ATV insurance cost", "four wheeler insurance", "off-road vehicle insurance", "ATV premium estimate"],
  variants: [
    {
      id: "estimate",
      name: "Insurance Estimate",
      description: "Estimate ATV insurance premiums",
      fields: [
        { name: "atvValue", label: "ATV Value", type: "number", placeholder: "e.g. 8000", prefix: "$" },
        { name: "atvType", label: "ATV Type", type: "select", options: [
          { label: "Utility ATV", value: "utility" },
          { label: "Sport ATV", value: "sport" },
          { label: "Side-by-Side (UTV)", value: "utv" },
          { label: "Youth ATV", value: "youth" },
        ], defaultValue: "utility" },
        { name: "usage", label: "Primary Use", type: "select", options: [
          { label: "Recreational only", value: "rec" },
          { label: "Farm/ranch work", value: "farm" },
          { label: "Racing/competition", value: "race" },
        ], defaultValue: "rec" },
        { name: "coverage", label: "Coverage Level", type: "select", options: [
          { label: "Liability only", value: "liability" },
          { label: "Standard coverage", value: "standard" },
          { label: "Full coverage", value: "full" },
        ], defaultValue: "standard" },
        { name: "riderAge", label: "Primary Rider Age", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const value = (inputs.atvValue as number) || 8000;
        const atvType = inputs.atvType as string;
        const usage = inputs.usage as string;
        const coverage = inputs.coverage as string;
        const age = (inputs.riderAge as number) || 30;

        let baseRate = value * 0.025;

        const typeMultiplier: Record<string, number> = { utility: 0.85, sport: 1.3, utv: 1.1, youth: 0.7 };
        baseRate *= typeMultiplier[atvType] || 1;

        const usageMultiplier: Record<string, number> = { rec: 1.0, farm: 0.85, race: 1.8 };
        baseRate *= usageMultiplier[usage] || 1;

        const coverageMultiplier: Record<string, number> = { liability: 0.5, standard: 1.0, full: 1.5 };
        baseRate *= coverageMultiplier[coverage] || 1;

        if (age < 25) baseRate *= 1.35;
        else if (age < 30) baseRate *= 1.1;
        else if (age > 50) baseRate *= 0.9;

        const annual = Math.round(baseRate);
        const monthly = annual / 12;

        return {
          primary: { label: "Estimated Annual Premium", value: `$${formatNumber(annual)}` },
          details: [
            { label: "Monthly premium", value: `$${formatNumber(monthly)}` },
            { label: "Daily cost", value: `$${formatNumber(annual / 365)}` },
            { label: "Premium per $1K value", value: `$${formatNumber((annual / value) * 1000)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Coverage Comparison",
      description: "Compare different ATV coverage levels",
      fields: [
        { name: "atvValue", label: "ATV Value", type: "number", placeholder: "e.g. 8000", prefix: "$" },
        { name: "liabilityPremium", label: "Liability-Only Quote", type: "number", placeholder: "e.g. 100", prefix: "$", suffix: "/yr" },
        { name: "fullPremium", label: "Full Coverage Quote", type: "number", placeholder: "e.g. 350", prefix: "$", suffix: "/yr" },
        { name: "deductible", label: "Full Coverage Deductible", type: "number", placeholder: "e.g. 500", prefix: "$" },
      ],
      calculate: (inputs) => {
        const value = inputs.atvValue as number;
        const liability = inputs.liabilityPremium as number;
        const full = inputs.fullPremium as number;
        const deductible = inputs.deductible as number;
        if (!value || !liability || !full || !deductible) return null;

        const premiumDiff = full - liability;
        const maxBenefit = value - deductible;
        const yearsToBreakEven = premiumDiff > 0 ? maxBenefit / premiumDiff : 0;

        return {
          primary: { label: "Annual Premium Difference", value: `$${formatNumber(premiumDiff)}` },
          details: [
            { label: "Liability only", value: `$${formatNumber(liability)}/yr` },
            { label: "Full coverage", value: `$${formatNumber(full)}/yr` },
            { label: "Max claim benefit", value: `$${formatNumber(maxBenefit)}` },
            { label: "Break-even (no claims)", value: `${formatNumber(yearsToBreakEven, 1)} years` },
            { label: "Monthly difference", value: `$${formatNumber(premiumDiff / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["motorcycle-insurance-calculator", "car-total-cost-calculator"],
  faq: [
    { question: "How much is ATV insurance?", answer: "ATV insurance typically costs $100-$500 per year depending on coverage level, ATV type, and rider profile. Liability-only coverage can be as low as $75/year, while full coverage with theft protection costs $300-$600+." },
    { question: "Is ATV insurance required?", answer: "Requirements vary by state. Some states require liability insurance for ATVs used on public land or roads. Even where not required, insurance is recommended to protect against liability, theft, and damage." },
  ],
  formula: "Premium ≈ ATV Value × Base Rate × Type Factor × Usage Factor × Coverage Factor × Age Factor",
};
