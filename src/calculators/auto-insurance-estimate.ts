import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const autoInsuranceEstimateCalculator: CalculatorDefinition = {
  slug: "auto-insurance-estimate-calculator",
  title: "Auto Insurance Estimate Calculator",
  description: "Free auto insurance premium estimator. Estimate your car insurance costs based on age, driving record, vehicle type, coverage level, and location.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["auto insurance calculator", "car insurance estimator", "auto insurance cost", "car insurance premium calculator", "vehicle insurance estimate"],
  variants: [
    {
      id: "auto-insurance",
      name: "Auto Insurance Premium Estimator",
      description: "Estimate monthly auto insurance costs based on driver and vehicle factors",
      fields: [
        { name: "age", label: "Driver Age", type: "number", placeholder: "e.g. 30", min: 16, max: 90 },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "drivingRecord", label: "Driving Record", type: "select", options: [
          { label: "Clean (no incidents)", value: "clean" },
          { label: "Minor violation (1 ticket)", value: "minor" },
          { label: "Major violation (accident/DUI)", value: "major" },
        ], defaultValue: "clean" },
        { name: "vehicleType", label: "Vehicle Type", type: "select", options: [
          { label: "Economy sedan", value: "economy" },
          { label: "Mid-size sedan", value: "midsize" },
          { label: "SUV / Crossover", value: "suv" },
          { label: "Truck / Pickup", value: "truck" },
          { label: "Sports car / Luxury", value: "sports" },
          { label: "Electric vehicle", value: "electric" },
        ], defaultValue: "midsize" },
        { name: "coverage", label: "Coverage Level", type: "select", options: [
          { label: "Minimum (state required only)", value: "minimum" },
          { label: "Basic (50/100/50)", value: "basic" },
          { label: "Standard (100/300/100)", value: "standard" },
          { label: "Full Coverage (with comp/collision)", value: "full" },
        ], defaultValue: "standard" },
        { name: "creditScore", label: "Credit Score Range", type: "select", options: [
          { label: "Excellent (750+)", value: "excellent" },
          { label: "Good (700-749)", value: "good" },
          { label: "Fair (650-699)", value: "fair" },
          { label: "Poor (below 650)", value: "poor" },
        ], defaultValue: "good" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000", defaultValue: 12000 },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        const drivingRecord = inputs.drivingRecord as string;
        const vehicleType = inputs.vehicleType as string;
        const coverage = inputs.coverage as string;
        const creditScore = inputs.creditScore as string;
        const annualMiles = (inputs.annualMiles as number) || 12000;

        if (!age) return null;

        // Base annual premium
        let basePremium = 1500;

        // Age factor
        let ageFactor: number;
        if (age < 20) ageFactor = 2.0;
        else if (age < 25) ageFactor = 1.5;
        else if (age < 30) ageFactor = 1.15;
        else if (age < 65) ageFactor = 1.0;
        else if (age < 75) ageFactor = 1.1;
        else ageFactor = 1.3;

        // Gender factor (under 25 primarily)
        const genderFactor = gender === "male" && age < 25 ? 1.15 : 1.0;

        // Driving record
        const recordFactors: Record<string, number> = { clean: 1.0, minor: 1.25, major: 1.75 };
        const recordFactor = recordFactors[drivingRecord] || 1.0;

        // Vehicle type
        const vehicleFactors: Record<string, number> = {
          economy: 0.85, midsize: 1.0, suv: 1.1, truck: 1.05, sports: 1.4, electric: 1.15,
        };
        const vehicleFactor = vehicleFactors[vehicleType] || 1.0;

        // Coverage level
        const coverageFactors: Record<string, number> = { minimum: 0.6, basic: 0.8, standard: 1.0, full: 1.35 };
        const coverageFactor = coverageFactors[coverage] || 1.0;

        // Credit score
        const creditFactors: Record<string, number> = { excellent: 0.8, good: 0.95, fair: 1.15, poor: 1.45 };
        const creditFactor = creditFactors[creditScore] || 1.0;

        // Mileage factor
        const mileageFactor = annualMiles > 15000 ? 1.1 : annualMiles < 7500 ? 0.9 : 1.0;

        const annualPremium = basePremium * ageFactor * genderFactor * recordFactor * vehicleFactor * coverageFactor * creditFactor * mileageFactor;
        const monthlyPremium = annualPremium / 12;
        const semiAnnualPremium = annualPremium / 2;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium)}` },
          details: [
            { label: "Annual premium", value: `$${formatNumber(annualPremium)}` },
            { label: "Semi-annual payment", value: `$${formatNumber(semiAnnualPremium)}` },
            { label: "Daily cost", value: `$${formatNumber(annualPremium / 365, 2)}` },
            { label: "Age factor", value: `${formatNumber(ageFactor, 2)}x` },
            { label: "Vehicle factor", value: `${formatNumber(vehicleFactor, 2)}x` },
            { label: "Credit factor", value: `${formatNumber(creditFactor, 2)}x` },
            { label: "Driving record", value: drivingRecord === "clean" ? "Clean - no surcharge" : `${formatNumber((recordFactor - 1) * 100)}% surcharge` },
          ],
          note: "This is a rough estimate based on national averages. Actual premiums vary significantly by state, insurer, specific vehicle model, and many other factors. Compare quotes from multiple insurers for accurate pricing.",
        };
      },
    },
  ],
  relatedSlugs: ["life-insurance-need-calculator", "renters-insurance-calculator", "umbrella-insurance-calculator"],
  faq: [
    { question: "What is the average car insurance cost?", answer: "The national average is approximately $1,500-$2,000/year for full coverage or $500-$700/year for minimum coverage. However, costs vary dramatically by state, age, and driving history. Young male drivers under 25 often pay 2x or more the average rate." },
    { question: "How can I lower my auto insurance premium?", answer: "Bundle home/auto policies, maintain a clean driving record, improve your credit score, increase deductibles, ask about discounts (safe driver, low mileage, good student, defensive driving course), and compare quotes from 3-5 insurers annually." },
    { question: "What coverage do I need?", answer: "At minimum, you need state-required liability coverage. Experts recommend 100/300/100 liability limits. If your car is financed, comprehensive and collision are usually required by the lender. Uninsured motorist coverage is strongly recommended." },
  ],
  formula: "Estimated Premium = Base Rate × Age Factor × Gender Factor × Driving Record Factor × Vehicle Factor × Coverage Factor × Credit Factor × Mileage Factor. National average base: ~$1,500/year.",
};
