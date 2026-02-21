import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carInsuranceCalculator: CalculatorDefinition = {
  slug: "car-insurance-calculator",
  title: "Car Insurance Calculator",
  description: "Free car insurance cost estimator. Estimate your auto insurance premium based on age, driving record, vehicle type, and coverage level.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car insurance calculator", "auto insurance estimator", "car insurance cost", "vehicle insurance premium", "insurance quote estimator"],
  variants: [
    {
      id: "estimate",
      name: "Estimate Insurance Cost",
      description: "Estimate annual and monthly car insurance premiums",
      fields: [
        { name: "vehicleValue", label: "Vehicle Value", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "age", label: "Driver Age", type: "number", placeholder: "e.g. 35" },
        { name: "coverage", label: "Coverage Level", type: "select", options: [
          { label: "Liability Only (state minimum)", value: "liability" },
          { label: "Standard (liability + collision)", value: "standard" },
          { label: "Full Coverage (comprehensive)", value: "full" },
        ], defaultValue: "standard" },
        { name: "record", label: "Driving Record", type: "select", options: [
          { label: "Clean (no accidents/tickets)", value: "clean" },
          { label: "Minor (1-2 tickets)", value: "minor" },
          { label: "At-fault accident", value: "accident" },
          { label: "DUI/DWI", value: "dui" },
        ], defaultValue: "clean" },
        { name: "deductible", label: "Deductible", type: "select", options: [
          { label: "$250", value: "250" },
          { label: "$500", value: "500" },
          { label: "$1,000", value: "1000" },
          { label: "$2,000", value: "2000" },
        ], defaultValue: "500" },
      ],
      calculate: (inputs) => {
        const vehicleValue = inputs.vehicleValue as number;
        const age = inputs.age as number;
        const coverage = inputs.coverage as string;
        const record = inputs.record as string;
        const deductible = parseInt(inputs.deductible as string) || 500;
        if (!vehicleValue || !age) return null;

        // Base rate as percentage of vehicle value
        let baseRate = 0.04; // 4% of vehicle value as base
        if (coverage === "liability") baseRate = 0.02;
        else if (coverage === "full") baseRate = 0.055;

        let annualPremium = vehicleValue * baseRate;
        // Minimum floor
        if (annualPremium < 600) annualPremium = 600;

        // Age factor
        if (age < 25) annualPremium *= 1.6;
        else if (age < 30) annualPremium *= 1.15;
        else if (age >= 65) annualPremium *= 1.1;

        // Driving record factor
        const recordFactors: Record<string, number> = { clean: 1.0, minor: 1.2, accident: 1.5, dui: 2.0 };
        annualPremium *= recordFactors[record] || 1.0;

        // Deductible factor
        const deductibleFactors: Record<number, number> = { 250: 1.15, 500: 1.0, 1000: 0.88, 2000: 0.78 };
        annualPremium *= deductibleFactors[deductible] || 1.0;

        const monthlyPremium = annualPremium / 12;
        const semiAnnual = annualPremium / 2;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium)}` },
          details: [
            { label: "Semi-annual premium", value: `$${formatNumber(semiAnnual)}` },
            { label: "Annual premium", value: `$${formatNumber(annualPremium)}` },
            { label: "Coverage type", value: coverage === "liability" ? "Liability Only" : coverage === "full" ? "Full Coverage" : "Standard" },
            { label: "Deductible", value: `$${formatNumber(deductible)}` },
          ],
          note: "This is a rough estimate. Actual premiums vary by location, insurer, credit score, and many other factors.",
        };
      },
    },
  ],
  relatedSlugs: ["car-payment-calculator", "car-loan-calculator", "car-affordability-calculator"],
  faq: [
    { question: "What factors affect car insurance rates?", answer: "Key factors include your age, driving record, credit score, vehicle type, coverage level, deductible, location, annual mileage, and gender. Younger drivers (under 25) and those with accidents or DUIs pay significantly more." },
    { question: "How can I lower my car insurance premium?", answer: "Common ways to reduce premiums include raising your deductible, bundling policies, maintaining a clean driving record, asking about discounts (safe driver, good student, multi-car), and shopping around every 1-2 years for competitive rates." },
    { question: "What is the difference between liability and full coverage?", answer: "Liability insurance covers damage you cause to others. Full coverage adds comprehensive (theft, weather, vandalism) and collision (accident damage to your car) coverage. Full coverage is required if you have a car loan or lease." },
  ],
  formula: "Estimated Premium = Vehicle Value x Base Rate x Age Factor x Record Factor x Deductible Factor",
};
