import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carInsuranceEstimateCalculator: CalculatorDefinition = {
  slug: "car-insurance-estimate-calculator",
  title: "Car Insurance Cost Estimator",
  description:
    "Free online car insurance cost estimator. Get a rough estimate of annual and monthly car insurance premiums based on your profile and vehicle.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "car insurance calculator",
    "auto insurance estimator",
    "insurance cost calculator",
    "car insurance estimate",
    "vehicle insurance cost",
  ],
  variants: [
    {
      id: "estimate",
      name: "Estimate Insurance Cost",
      description: "Estimate your car insurance premium based on key factors",
      fields: [
        {
          name: "age",
          label: "Driver Age",
          type: "select",
          options: [
            { label: "16-19", value: "teen" },
            { label: "20-25", value: "young" },
            { label: "26-35", value: "prime_young" },
            { label: "36-55", value: "prime" },
            { label: "56-65", value: "senior" },
            { label: "65+", value: "elderly" },
          ],
          defaultValue: "prime",
        },
        { name: "vehicleValue", label: "Vehicle Value", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        {
          name: "coverage",
          label: "Coverage Level",
          type: "select",
          options: [
            { label: "Minimum / Liability Only", value: "minimum" },
            { label: "Standard", value: "standard" },
            { label: "Full Coverage", value: "full" },
          ],
          defaultValue: "standard",
        },
        {
          name: "record",
          label: "Driving Record",
          type: "select",
          options: [
            { label: "Clean (no incidents)", value: "clean" },
            { label: "1 minor violation", value: "minor" },
            { label: "At-fault accident", value: "accident" },
            { label: "DUI/DWI", value: "dui" },
          ],
          defaultValue: "clean",
        },
        {
          name: "creditTier",
          label: "Credit Score Range",
          type: "select",
          options: [
            { label: "Excellent (750+)", value: "excellent" },
            { label: "Good (700-749)", value: "good" },
            { label: "Fair (650-699)", value: "fair" },
            { label: "Poor (below 650)", value: "poor" },
          ],
          defaultValue: "good",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as string;
        const vehicleValue = parseFloat(inputs.vehicleValue as string) || 0;
        const coverage = inputs.coverage as string;
        const record = inputs.record as string;
        const credit = inputs.creditTier as string;
        if (!vehicleValue) return null;

        // Base annual premium
        let basePremium = 1200;

        // Age factor
        const ageFactor: Record<string, number> = {
          teen: 2.2, young: 1.5, prime_young: 1.0, prime: 0.9, senior: 0.95, elderly: 1.1,
        };
        basePremium *= ageFactor[age] || 1.0;

        // Coverage factor
        const coverageFactor: Record<string, number> = {
          minimum: 0.5, standard: 1.0, full: 1.6,
        };
        basePremium *= coverageFactor[coverage] || 1.0;

        // Vehicle value component (comprehensive/collision)
        if (coverage !== "minimum") {
          basePremium += vehicleValue * 0.03;
        }

        // Driving record factor
        const recordFactor: Record<string, number> = {
          clean: 1.0, minor: 1.2, accident: 1.5, dui: 2.0,
        };
        basePremium *= recordFactor[record] || 1.0;

        // Credit factor
        const creditFactor: Record<string, number> = {
          excellent: 0.85, good: 1.0, fair: 1.2, poor: 1.5,
        };
        basePremium *= creditFactor[credit] || 1.0;

        const annual = basePremium;
        const monthly = annual / 12;
        const semiAnnual = annual / 2;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthly)}` },
          details: [
            { label: "Estimated annual premium", value: `$${formatNumber(annual)}` },
            { label: "Semi-annual premium", value: `$${formatNumber(semiAnnual)}` },
            { label: "Vehicle value", value: `$${formatNumber(vehicleValue)}` },
          ],
          note: "This is a rough estimate. Actual premiums vary by insurer, state, ZIP code, and many additional factors.",
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "car-lease-calculator", "car-affordability-monthly-calculator"],
  faq: [
    {
      question: "What factors affect car insurance rates the most?",
      answer:
        "The biggest factors are age, driving record, coverage level, vehicle value, location (ZIP code), credit score, and annual mileage. Young drivers and those with accidents or DUIs pay significantly more.",
    },
    {
      question: "How can I lower my car insurance premium?",
      answer:
        "You can lower premiums by maintaining a clean driving record, raising your deductible, bundling policies, taking defensive driving courses, and shopping around for quotes from multiple insurers.",
    },
  ],
  formula: "Estimated Premium = Base x Age Factor x Coverage Factor x Record Factor x Credit Factor + Vehicle Value Component",
};
