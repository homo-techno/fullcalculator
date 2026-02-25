import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const motorcycleInsuranceCalculator: CalculatorDefinition = {
  slug: "motorcycle-insurance-calculator",
  title: "Motorcycle Insurance Calculator",
  description: "Free motorcycle insurance cost calculator. Estimate your motorcycle insurance premiums based on bike type, coverage, and rider profile.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["motorcycle insurance calculator", "bike insurance cost", "motorcycle insurance estimate", "motorcycle premium calculator", "motorbike insurance"],
  variants: [
    {
      id: "estimate",
      name: "Insurance Estimate",
      description: "Estimate motorcycle insurance premiums",
      fields: [
        { name: "bikeValue", label: "Motorcycle Value", type: "number", placeholder: "e.g. 12000", prefix: "$" },
        { name: "bikeType", label: "Motorcycle Type", type: "select", options: [
          { label: "Cruiser", value: "cruiser" },
          { label: "Sport bike", value: "sport" },
          { label: "Touring", value: "touring" },
          { label: "Standard/Naked", value: "standard" },
          { label: "Dual sport/Adventure", value: "adventure" },
        ], defaultValue: "cruiser" },
        { name: "riderAge", label: "Rider Age", type: "number", placeholder: "e.g. 35" },
        { name: "experience", label: "Riding Experience", type: "select", options: [
          { label: "Less than 2 years", value: "new" },
          { label: "2-5 years", value: "mid" },
          { label: "5+ years", value: "exp" },
        ], defaultValue: "mid" },
        { name: "coverage", label: "Coverage Level", type: "select", options: [
          { label: "Liability only", value: "liability" },
          { label: "Standard (liability + collision)", value: "standard" },
          { label: "Full coverage", value: "full" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const value = (inputs.bikeValue as number) || 10000;
        const bikeType = inputs.bikeType as string;
        const age = (inputs.riderAge as number) || 30;
        const experience = inputs.experience as string;
        const coverage = inputs.coverage as string;

        let baseRate = value * 0.03;

        const typeMultiplier: Record<string, number> = { cruiser: 0.9, sport: 1.5, touring: 1.0, standard: 0.85, adventure: 0.95 };
        baseRate *= typeMultiplier[bikeType] || 1;

        if (age < 25) baseRate *= 1.4;
        else if (age < 30) baseRate *= 1.15;
        else if (age > 50) baseRate *= 0.9;

        if (experience === "new") baseRate *= 1.3;
        else if (experience === "exp") baseRate *= 0.85;

        const coverageMultiplier: Record<string, number> = { liability: 0.6, standard: 1.0, full: 1.4 };
        baseRate *= coverageMultiplier[coverage] || 1;

        const annual = Math.round(baseRate);
        const monthly = annual / 12;

        return {
          primary: { label: "Estimated Annual Premium", value: `$${formatNumber(annual)}` },
          details: [
            { label: "Monthly premium", value: `$${formatNumber(monthly)}` },
            { label: "Daily cost", value: `$${formatNumber(annual / 365)}` },
            { label: "Cost per $1K of value", value: `$${formatNumber((annual / value) * 1000)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Coverage Levels",
      description: "Compare insurance costs across coverage levels",
      fields: [
        { name: "bikeValue", label: "Motorcycle Value", type: "number", placeholder: "e.g. 12000", prefix: "$" },
        { name: "basePremium", label: "Current Annual Premium", type: "number", placeholder: "e.g. 600", prefix: "$" },
        { name: "deductible", label: "Current Deductible", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "newDeductible", label: "New Deductible", type: "number", placeholder: "e.g. 1000", prefix: "$" },
      ],
      calculate: (inputs) => {
        const value = inputs.bikeValue as number;
        const premium = inputs.basePremium as number;
        const currentDed = inputs.deductible as number;
        const newDed = inputs.newDeductible as number;
        if (!value || !premium || !currentDed || !newDed) return null;

        const savingsPercent = ((newDed - currentDed) / currentDed) * 0.15;
        const newPremium = premium * (1 - savingsPercent);
        const annualSavings = premium - newPremium;
        const yearsToRecoup = annualSavings > 0 ? (newDed - currentDed) / annualSavings : 0;

        return {
          primary: { label: "Estimated New Premium", value: `$${formatNumber(newPremium)}/yr` },
          details: [
            { label: "Annual savings", value: `$${formatNumber(annualSavings)}` },
            { label: "Additional risk (deductible diff)", value: `$${formatNumber(newDed - currentDed)}` },
            { label: "Years to recoup higher deductible", value: annualSavings > 0 ? `${formatNumber(yearsToRecoup, 1)} years` : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much is motorcycle insurance?", answer: "Motorcycle insurance averages $500-$1,500 per year for standard coverage. Sport bikes cost more ($1,000-$3,000+) while cruisers are typically cheaper ($300-$800). Young riders and new riders pay significantly more." },
    { question: "What affects motorcycle insurance rates?", answer: "Key factors include bike type (sport bikes cost most), engine size, rider age, experience, driving record, location, coverage level, and annual mileage. Completing a safety course can reduce premiums 5-15%." },
  ],
  formula: "Premium ≈ Bike Value × Base Rate × Type Factor × Age Factor × Experience Factor × Coverage Factor",
};
