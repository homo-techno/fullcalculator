import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentersInsuranceCalculator: CalculatorDefinition = {
  slug: "renters-insurance-calculator",
  title: "Renters Insurance Calculator",
  description: "Free renters insurance calculator. Estimate your renters insurance premium based on coverage needs, location, deductible, and personal property value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["renters insurance calculator", "renters insurance cost", "rental insurance estimator", "tenant insurance calculator", "apartment insurance cost"],
  variants: [
    {
      id: "renters-insurance",
      name: "Renters Insurance Estimator",
      description: "Estimate renters insurance premiums based on coverage amount and personal factors",
      fields: [
        { name: "personalProperty", label: "Personal Property Value", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "liability", label: "Liability Coverage", type: "select", options: [
          { label: "$100,000 (standard)", value: "100000" },
          { label: "$300,000", value: "300000" },
          { label: "$500,000", value: "500000" },
        ], defaultValue: "100000" },
        { name: "deductible", label: "Deductible", type: "select", options: [
          { label: "$250", value: "250" },
          { label: "$500 (most common)", value: "500" },
          { label: "$1,000", value: "1000" },
          { label: "$2,500", value: "2500" },
        ], defaultValue: "500" },
        { name: "location", label: "Location Type", type: "select", options: [
          { label: "Low-cost area (rural/suburban)", value: "low" },
          { label: "Average area (mid-size city)", value: "average" },
          { label: "High-cost area (major metro)", value: "high" },
          { label: "Very high-cost area (NYC, SF)", value: "very-high" },
        ], defaultValue: "average" },
        { name: "claimsHistory", label: "Claims History (past 5 years)", type: "select", options: [
          { label: "No claims", value: "none" },
          { label: "1 claim", value: "one" },
          { label: "2+ claims", value: "multiple" },
        ], defaultValue: "none" },
      ],
      calculate: (inputs) => {
        const personalProperty = inputs.personalProperty as number;
        const liability = parseInt(inputs.liability as string);
        const deductible = parseInt(inputs.deductible as string);
        const location = inputs.location as string;
        const claimsHistory = inputs.claimsHistory as string;

        if (!personalProperty) return null;

        // Base rate per $1,000 of personal property coverage
        let baseRate = 4.50;

        // Location factor
        const locationFactors: Record<string, number> = {
          low: 0.75, average: 1.0, high: 1.35, "very-high": 1.7,
        };
        const locationFactor = locationFactors[location] || 1.0;

        // Deductible factor
        const deductibleFactors: Record<number, number> = {
          250: 1.15, 500: 1.0, 1000: 0.85, 2500: 0.7,
        };
        const deductibleFactor = deductibleFactors[deductible] || 1.0;

        // Claims history
        const claimsFactors: Record<string, number> = { none: 1.0, one: 1.2, multiple: 1.5 };
        const claimsFactor = claimsFactors[claimsHistory] || 1.0;

        // Liability surcharge
        const liabilityExtra: Record<number, number> = { 100000: 0, 300000: 24, 500000: 48 };
        const liabilityAddon = liabilityExtra[liability] || 0;

        const propertyPremium = (personalProperty / 1000) * baseRate * locationFactor * deductibleFactor * claimsFactor;
        const totalAnnual = propertyPremium + liabilityAddon;
        const monthlyPremium = totalAnnual / 12;
        const dailyCost = totalAnnual / 365;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium)}` },
          details: [
            { label: "Annual premium", value: `$${formatNumber(totalAnnual)}` },
            { label: "Personal property coverage", value: `$${formatNumber(personalProperty)}` },
            { label: "Liability coverage", value: `$${formatNumber(liability)}` },
            { label: "Deductible", value: `$${formatNumber(deductible)}` },
            { label: "Daily cost", value: `$${formatNumber(dailyCost, 2)}` },
            { label: "Property premium", value: `$${formatNumber(propertyPremium)}/year` },
            { label: "Liability add-on", value: `$${formatNumber(liabilityAddon)}/year` },
          ],
          note: "The national average renters insurance premium is about $15-$20/month. Actual costs depend on your insurer, credit score, building type, security features, and specific location. Bundling with auto insurance often provides a 5-15% discount.",
        };
      },
    },
  ],
  relatedSlugs: ["auto-insurance-estimate-calculator", "umbrella-insurance-calculator", "flood-insurance-calculator"],
  faq: [
    { question: "What does renters insurance cover?", answer: "Renters insurance typically covers: personal property (belongings damaged by fire, theft, vandalism, etc.), liability (if someone is injured in your rental), additional living expenses (if your rental becomes uninhabitable), and medical payments to guests. It does NOT cover the building structure (that's your landlord's policy)." },
    { question: "How much renters insurance do I need?", answer: "Inventory your belongings to determine the right personal property coverage amount. Most people underestimate - the average person owns $20,000-$30,000 in personal property. Consider replacement cost coverage (pays to replace items at current prices) rather than actual cash value (depreciates items)." },
    { question: "Is renters insurance required?", answer: "It's not required by law, but many landlords require it as a lease condition. Even if not required, it's highly recommended given the low cost ($15-$30/month) and significant protection provided. About 55% of renters in the US carry renters insurance." },
  ],
  formula: "Annual Premium = (Personal Property / 1,000 × Base Rate × Location Factor × Deductible Factor × Claims Factor) + Liability Add-on. National average: ~$180-$240/year.",
};
