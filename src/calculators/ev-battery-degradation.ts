import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evBatteryDegradationCalculator: CalculatorDefinition = {
  slug: "ev-battery-degradation-calculator",
  title: "EV Battery Degradation Calculator",
  description:
    "Estimate your electric vehicle's battery health and range loss over time. Calculates expected capacity based on age, mileage, climate, and charging habits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "ev battery degradation",
    "ev battery health",
    "ev range loss",
    "battery capacity",
    "ev battery life",
    "battery cycle life",
  ],
  variants: [
    {
      id: "standard",
      name: "Battery Health Estimator",
      description: "Estimate battery capacity based on usage and conditions",
      fields: [
        { name: "originalRange", label: "Original Rated Range (miles)", type: "number", placeholder: "e.g. 310" },
        { name: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", placeholder: "e.g. 75" },
        { name: "ageYears", label: "Vehicle Age (years)", type: "number", placeholder: "e.g. 3" },
        { name: "totalMiles", label: "Total Miles Driven", type: "number", placeholder: "e.g. 36000" },
        {
          name: "climate",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Temperate (mild)", value: "1.0" },
            { label: "Hot (AZ, TX, FL)", value: "1.3" },
            { label: "Cold (MN, WI, ME)", value: "1.1" },
            { label: "Extreme (desert/arctic)", value: "1.5" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "chargingHabit",
          label: "Primary Charging Method",
          type: "select",
          options: [
            { label: "Home L2 (mostly 20-80%)", value: "1.0" },
            { label: "Home L2 (charge to 100%)", value: "1.2" },
            { label: "Frequent DC Fast Charging", value: "1.4" },
            { label: "Mixed (home + occasional DC)", value: "1.1" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "batteryChemistry",
          label: "Battery Chemistry",
          type: "select",
          options: [
            { label: "NMC (most common)", value: "nmc" },
            { label: "LFP (Tesla SR, others)", value: "lfp" },
            { label: "NCA (Tesla LR/Perf)", value: "nca" },
          ],
          defaultValue: "nmc",
        },
      ],
      calculate: (inputs) => {
        const originalRange = parseFloat(inputs.originalRange as string);
        const batteryCapacity = parseFloat(inputs.batteryCapacity as string);
        const ageYears = parseFloat(inputs.ageYears as string);
        const totalMiles = parseFloat(inputs.totalMiles as string);
        const climateFactor = parseFloat(inputs.climate as string);
        const chargingFactor = parseFloat(inputs.chargingHabit as string);
        const chemistry = inputs.batteryChemistry as string;

        if (!originalRange || !batteryCapacity || !ageYears || !totalMiles) return null;

        const milesPerKwh = originalRange / batteryCapacity;
        const fullCycles = totalMiles / (originalRange * 0.8);

        const baseDegPerCycle: Record<string, number> = { nmc: 0.02, lfp: 0.015, nca: 0.018 };
        const calendarDegPerYear: Record<string, number> = { nmc: 1.5, lfp: 1.0, nca: 1.3 };

        const cycleDeg = fullCycles * (baseDegPerCycle[chemistry] || 0.02) * chargingFactor;
        const calendarDeg = ageYears * (calendarDegPerYear[chemistry] || 1.5) * climateFactor;
        const totalDegPercent = Math.min(cycleDeg + calendarDeg, 40);

        const remainingCapacity = 100 - totalDegPercent;
        const currentCapacityKwh = batteryCapacity * (remainingCapacity / 100);
        const currentRange = originalRange * (remainingCapacity / 100);
        const rangeLoss = originalRange - currentRange;

        const yearsTo80 = totalDegPercent < 20
          ? ageYears * (20 / totalDegPercent)
          : ageYears;
        const yearsTo70 = totalDegPercent < 30
          ? ageYears * (30 / totalDegPercent)
          : ageYears;

        return {
          primary: {
            label: "Estimated Battery Health",
            value: `${formatNumber(remainingCapacity, 1)}%`,
          },
          details: [
            { label: "Current Estimated Range", value: `${formatNumber(currentRange, 0)} miles` },
            { label: "Range Lost", value: `${formatNumber(rangeLoss, 0)} miles` },
            { label: "Current Capacity", value: `${formatNumber(currentCapacityKwh, 1)} kWh` },
            { label: "Estimated Full Cycles", value: formatNumber(fullCycles, 0) },
            { label: "Cycle Degradation", value: `${formatNumber(cycleDeg, 1)}%` },
            { label: "Calendar Degradation", value: `${formatNumber(calendarDeg, 1)}%` },
            { label: "Est. Years to 80% Health", value: formatNumber(yearsTo80, 1) },
            { label: "Est. Years to 70% Health", value: formatNumber(yearsTo70, 1) },
          ],
          note: remainingCapacity > 80
            ? "Battery is in good health. Most manufacturers warrant 70-80% capacity for 8 years/100k miles."
            : "Battery has significant degradation. Check warranty coverage for potential replacement.",
        };
      },
    },
    {
      id: "projection",
      name: "Future Range Projection",
      description: "Project battery health at a future date",
      fields: [
        { name: "originalRange", label: "Original Range (miles)", type: "number", placeholder: "e.g. 310" },
        { name: "currentHealth", label: "Current Battery Health (%)", type: "number", placeholder: "e.g. 95" },
        { name: "currentAge", label: "Current Age (years)", type: "number", placeholder: "e.g. 2" },
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "projectionYears", label: "Project Forward (years)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const originalRange = parseFloat(inputs.originalRange as string);
        const currentHealth = parseFloat(inputs.currentHealth as string);
        const currentAge = parseFloat(inputs.currentAge as string);
        const annualMiles = parseFloat(inputs.annualMiles as string);
        const projectionYears = parseFloat(inputs.projectionYears as string);

        if (!originalRange || !currentHealth || !currentAge || !annualMiles || !projectionYears) return null;

        const degradedSoFar = 100 - currentHealth;
        const annualDeg = degradedSoFar / currentAge;
        const futureHealth = Math.max(60, currentHealth - annualDeg * projectionYears);
        const futureRange = originalRange * (futureHealth / 100);
        const futureAge = currentAge + projectionYears;

        return {
          primary: { label: `Projected Health at Year ${futureAge}`, value: `${formatNumber(futureHealth, 1)}%` },
          details: [
            { label: "Projected Range", value: `${formatNumber(futureRange, 0)} miles` },
            { label: "Annual Degradation Rate", value: `${formatNumber(annualDeg, 2)}%/year` },
            { label: "Projected Range Loss", value: `${formatNumber(originalRange - futureRange, 0)} miles` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-vs-gas-total-cost-calculator", "ev-road-trip-planner-calculator", "ev-lease-vs-buy-calculator"],
  faq: [
    {
      question: "How fast do EV batteries degrade?",
      answer:
        "Most modern EV batteries lose about 2-3% capacity per year under normal conditions. After 8 years, a typical EV retains 85-90% of its original range. Factors like extreme heat, frequent DC fast charging, and regularly charging to 100% can accelerate degradation.",
    },
    {
      question: "What is the warranty on EV batteries?",
      answer:
        "Federal regulations require a minimum 8-year/100,000-mile warranty on EV batteries. Most manufacturers guarantee at least 70% capacity retention within that period. Some brands like Hyundai offer 10-year/100,000-mile coverage.",
    },
    {
      question: "Does fast charging damage EV batteries?",
      answer:
        "Occasional DC fast charging has minimal impact, but frequent reliance on it (especially in hot weather) can accelerate degradation by 10-20%. Modern EVs have thermal management systems that help, but home Level 2 charging is gentler on the battery.",
    },
  ],
  formula:
    "Total Degradation = (Full Cycles × Base Rate × Charging Factor) + (Age × Calendar Rate × Climate Factor); Remaining Health = 100% − Total Degradation; Current Range = Original Range × (Health / 100)",
};
