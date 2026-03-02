import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const floodRiskAssessmentCalculator: CalculatorDefinition = {
  slug: "flood-risk-assessment-calculator",
  title: "Flood Risk Assessment Calculator",
  description: "Evaluate flood risk for a property based on elevation, proximity to water, rainfall intensity, and soil drainage characteristics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flood risk","flood assessment","flood zone","flooding probability","flood insurance"],
  variants: [{
    id: "standard",
    name: "Flood Risk Assessment",
    description: "Evaluate flood risk for a property based on elevation, proximity to water, rainfall intensity, and soil drainage characteristics.",
    fields: [
      { name: "elevationFt", label: "Elevation Above Floodplain (ft)", type: "number", min: 0, max: 100, defaultValue: 8 },
      { name: "distanceToWater", label: "Distance to Nearest Water Body (ft)", type: "number", min: 0, max: 10000, defaultValue: 500 },
      { name: "rainfallIntensity", label: "Max 24hr Rainfall (inches)", type: "number", min: 1, max: 30, defaultValue: 5 },
      { name: "soilDrainage", label: "Soil Drainage", type: "select", options: [{ value: "1", label: "Well-Drained (Sandy)" }, { value: "2", label: "Moderate (Loam)" }, { value: "3", label: "Poor (Clay)" }, { value: "4", label: "Very Poor (Hardpan)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const elevationFt = inputs.elevationFt as number;
    const distanceToWater = inputs.distanceToWater as number;
    const rainfallIntensity = inputs.rainfallIntensity as number;
    const soilDrainage = inputs.soilDrainage as number;
    const elevScore = Math.max(0, 100 - elevationFt * 5);
    const distScore = Math.max(0, 100 - distanceToWater * 0.02);
    const rainScore = rainfallIntensity * 8;
    const drainMultiplier = [0.5, 0.75, 1.2, 1.5][soilDrainage - 1];
    const riskScore = (elevScore * 0.35 + distScore * 0.25 + rainScore * 0.25) * drainMultiplier;
    const clampedScore = Math.min(Math.max(riskScore, 0), 100);
    let riskLevel = "Low";
    let zone = "Zone X";
    if (clampedScore >= 75) { riskLevel = "Very High"; zone = "Zone A (Special Flood Hazard)"; }
    else if (clampedScore >= 55) { riskLevel = "High"; zone = "Zone AE"; }
    else if (clampedScore >= 35) { riskLevel = "Moderate"; zone = "Zone B/X (shaded)"; }
    const annualProbability = clampedScore / 100 * 0.26;
    const insuranceEstimate = clampedScore >= 55 ? 2500 : clampedScore >= 35 ? 1200 : 500;
    return {
      primary: { label: "Flood Risk Level", value: riskLevel + " (" + formatNumber(Math.round(clampedScore)) + "/100)" },
      details: [
        { label: "Estimated FEMA Zone", value: zone },
        { label: "Annual Flood Probability", value: formatNumber(Math.round(annualProbability * 1000) / 10) + "%" },
        { label: "Elevation Risk Score", value: formatNumber(Math.round(elevScore)) + "/100" },
        { label: "Estimated Annual Insurance", value: "$" + formatNumber(insuranceEstimate) }
      ]
    };
  },
  }],
  relatedSlugs: ["rainfall-collection-calculator","drought-severity-index-calculator","hurricane-preparedness-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Risk Score = (Elevation Score x 0.35 + Distance Score x 0.25 + Rain Score x 0.25) x Drainage Multiplier
Elevation Score = max(0, 100 - Elevation x 5)",
};
