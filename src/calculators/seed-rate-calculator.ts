import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seedRateCalculator: CalculatorDefinition = {
  slug: "seed-rate-calculator",
  title: "Seed Rate Calculator",
  description: "Calculate seeding rate per acre for planting.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["seed rate","planting rate calculator"],
  variants: [{
    id: "standard",
    name: "Seed Rate",
    description: "Calculate seeding rate per acre for planting.",
    fields: [
      { name: "desiredPlants", label: "Desired Plants Per Acre", type: "number", min: 100, max: 500000, defaultValue: 32000 },
      { name: "germRate", label: "Germination Rate (%)", type: "number", min: 10, max: 100, defaultValue: 92 },
      { name: "seedsPerLb", label: "Seeds Per Pound", type: "number", min: 10, max: 500000, defaultValue: 1500 },
      { name: "acres", label: "Total Acres", type: "number", min: 0.1, max: 10000, defaultValue: 40 },
    ],
    calculate: (inputs) => {
      const dp = inputs.desiredPlants as number;
      const gr = inputs.germRate as number;
      const spl = inputs.seedsPerLb as number;
      const ac = inputs.acres as number;
      if (!dp || !gr || !spl || !ac) return null;
      const seedsNeeded = Math.ceil(dp / (gr / 100));
      const lbsPerAcre = Math.round((seedsNeeded / spl) * 100) / 100;
      const totalLbs = Math.round(lbsPerAcre * ac * 100) / 100;
      return {
        primary: { label: "Seed Rate", value: formatNumber(lbsPerAcre) + " lb/acre" },
        details: [
          { label: "Seeds Needed Per Acre", value: formatNumber(seedsNeeded) },
          { label: "Total Seed Needed", value: formatNumber(totalLbs) + " lb" },
          { label: "Adjusted for Germination", value: gr + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a typical corn seeding rate?", answer: "Corn is typically planted at 28000 to 36000 seeds per acre." },
    { question: "Why adjust for germination rate?", answer: "Not all seeds germinate, so you plant extra to reach the desired stand count." },
  ],
  formula: "Seed Rate (lb/acre) = (Desired Plants / Germination%) / Seeds Per Pound",
};
