import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const floodInsuranceCalculator: CalculatorDefinition = {
  slug: "flood-insurance-calculator",
  title: "Flood Insurance Calculator",
  description: "Free flood insurance calculator. Estimate NFIP and private flood insurance premiums based on flood zone, property value, and elevation. Standard homeowner policies do not cover floods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["flood insurance calculator", "flood insurance cost", "NFIP calculator", "flood zone insurance", "flood insurance premium"],
  variants: [
    {
      id: "flood-insurance",
      name: "Flood Insurance Premium Estimator",
      description: "Estimate flood insurance costs based on flood zone and property characteristics",
      fields: [
        { name: "floodZone", label: "Flood Zone", type: "select", options: [
          { label: "Zone A (High Risk - 100yr floodplain)", value: "A" },
          { label: "Zone AE (High Risk - with BFE)", value: "AE" },
          { label: "Zone V/VE (Coastal High Risk)", value: "V" },
          { label: "Zone B/X500 (Moderate Risk)", value: "B" },
          { label: "Zone C/X (Low Risk)", value: "C" },
        ], defaultValue: "B" },
        { name: "buildingCoverage", label: "Building Coverage Amount", type: "number", placeholder: "e.g. 250000", prefix: "$" },
        { name: "contentsCoverage", label: "Contents Coverage Amount", type: "number", placeholder: "e.g. 100000", prefix: "$", defaultValue: 100000 },
        { name: "buildingType", label: "Building Type", type: "select", options: [
          { label: "Single-family home", value: "single" },
          { label: "Condo unit", value: "condo" },
          { label: "Multi-family (2-4 units)", value: "multi" },
          { label: "Manufactured/mobile home", value: "mobile" },
        ], defaultValue: "single" },
        { name: "deductible", label: "Preferred Deductible", type: "select", options: [
          { label: "$1,000", value: "1000" },
          { label: "$2,000", value: "2000" },
          { label: "$5,000", value: "5000" },
          { label: "$10,000", value: "10000" },
        ], defaultValue: "2000" },
      ],
      calculate: (inputs) => {
        const floodZone = inputs.floodZone as string;
        const buildingCoverage = inputs.buildingCoverage as number;
        const contentsCoverage = (inputs.contentsCoverage as number) || 0;
        const buildingType = inputs.buildingType as string;
        const deductible = parseInt(inputs.deductible as string) || 2000;

        if (!buildingCoverage) return null;

        // Base rates per $100 of coverage (annual)
        const zoneRates: Record<string, { building: number; contents: number }> = {
          "A": { building: 0.80, contents: 1.10 },
          "AE": { building: 0.65, contents: 0.90 },
          "V": { building: 1.20, contents: 1.50 },
          "B": { building: 0.25, contents: 0.35 },
          "C": { building: 0.15, contents: 0.20 },
        };

        const rates = zoneRates[floodZone] || zoneRates["B"];

        // Building type factor
        const buildingFactors: Record<string, number> = {
          single: 1.0, condo: 0.85, multi: 1.2, mobile: 1.5,
        };
        const buildingFactor = buildingFactors[buildingType] || 1.0;

        // Deductible discount
        const deductibleFactors: Record<number, number> = {
          1000: 1.1, 2000: 1.0, 5000: 0.85, 10000: 0.7,
        };
        const deductibleFactor = deductibleFactors[deductible] || 1.0;

        const buildingPremium = (buildingCoverage / 100) * rates.building * buildingFactor * deductibleFactor;
        const contentsPremium = (contentsCoverage / 100) * rates.contents * buildingFactor * deductibleFactor;
        const iccPremium = 75; // Increased Cost of Compliance premium
        const federalPolicyFee = 50;
        const hfiaaSercharge = buildingType === "single" ? 25 : 250;

        const totalAnnual = buildingPremium + contentsPremium + iccPremium + federalPolicyFee + hfiaaSercharge;
        const monthlyPremium = totalAnnual / 12;

        return {
          primary: { label: "Estimated Annual Premium", value: `$${formatNumber(totalAnnual)}` },
          details: [
            { label: "Monthly estimate", value: `$${formatNumber(monthlyPremium)}` },
            { label: "Building coverage premium", value: `$${formatNumber(buildingPremium)}` },
            { label: "Contents coverage premium", value: `$${formatNumber(contentsPremium)}` },
            { label: "Flood zone", value: floodZone },
            { label: "Deductible", value: `$${formatNumber(deductible)}` },
            { label: "ICC premium", value: `$${formatNumber(iccPremium)}` },
            { label: "Federal policy fee + HFIAA", value: `$${formatNumber(federalPolicyFee + hfiaaSercharge)}` },
          ],
          note: "Flood insurance premiums are moving to FEMA's Risk Rating 2.0 methodology, which considers individual property characteristics. Actual premiums may differ significantly. Contact your insurance agent or NFIP for a precise quote.",
        };
      },
    },
  ],
  relatedSlugs: ["renters-insurance-calculator", "auto-insurance-estimate-calculator", "umbrella-insurance-calculator"],
  faq: [
    { question: "Do I need flood insurance?", answer: "If you have a federally-backed mortgage in a high-risk flood zone (A or V zones), flood insurance is required. Even in moderate/low risk areas, it's recommended - about 25% of flood claims come from outside high-risk zones. Standard homeowner's insurance does not cover floods." },
    { question: "How much does flood insurance cost?", answer: "The national average NFIP premium is about $800-$900/year, but it varies dramatically. High-risk zones can cost $2,000-$5,000+ annually, while preferred risk policies in low-risk zones can cost as little as $300-$500/year." },
    { question: "What does flood insurance cover?", answer: "NFIP covers up to $250,000 for building coverage and $100,000 for contents in residential properties. It covers structural damage, electrical/plumbing systems, appliances, and personal belongings. It does not cover living expenses, currency, cars, or outdoor property." },
  ],
  formula: "Annual Premium = (Building Coverage / 100 × Zone Rate × Building Factor × Deductible Factor) + (Contents Coverage / 100 × Contents Rate × Factors) + ICC Premium + Fees.",
};
