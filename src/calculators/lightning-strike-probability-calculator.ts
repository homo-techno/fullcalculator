import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightningStrikeProbabilityCalculator: CalculatorDefinition = {
  slug: "lightning-strike-probability-calculator",
  title: "Lightning Strike Probability Calculator",
  description: "Estimate the probability of a lightning strike based on location flash density, elevation, structure height, and exposure time.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lightning probability","lightning strike","thunderstorm risk","lightning safety","flash density"],
  variants: [{
    id: "standard",
    name: "Lightning Strike Probability",
    description: "Estimate the probability of a lightning strike based on location flash density, elevation, structure height, and exposure time.",
    fields: [
      { name: "flashDensity", label: "Local Flash Density (strikes/km²/year)", type: "number", min: 0.1, max: 50, defaultValue: 6 },
      { name: "structureHeight", label: "Structure Height (ft)", type: "number", min: 5, max: 2000, defaultValue: 30 },
      { name: "structureArea", label: "Structure Footprint (sq ft)", type: "number", min: 100, max: 50000, defaultValue: 2000 },
      { name: "exposureHours", label: "Annual Outdoor Exposure (hours)", type: "number", min: 0, max: 8760, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const flashDensity = inputs.flashDensity as number;
    const structureHeight = inputs.structureHeight as number;
    const structureArea = inputs.structureArea as number;
    const exposureHours = inputs.exposureHours as number;
    const heightMeters = structureHeight * 0.3048;
    const areaSqM = structureArea * 0.0929;
    const effectiveArea = areaSqM + 9 * Math.PI * heightMeters * heightMeters;
    const effectiveAreaKm2 = effectiveArea / 1000000;
    const annualStrikeProbStructure = 1 - Math.exp(-flashDensity * effectiveAreaKm2);
    const personalExposureFraction = exposureHours / 8760;
    const personalBodyArea = 0.0000001;
    const personalRisk = flashDensity * personalBodyArea * personalExposureFraction;
    const yearsForFiftyPercent = Math.log(2) / Math.max(annualStrikeProbStructure, 0.0001);
    return {
      primary: { label: "Annual Structure Strike Probability", value: formatNumber(Math.round(annualStrikeProbStructure * 10000) / 100) + "%" },
      details: [
        { label: "Effective Collection Area", value: formatNumber(Math.round(effectiveArea)) + " m²" },
        { label: "Personal Annual Risk", value: "1 in " + formatNumber(Math.round(1 / Math.max(personalRisk, 0.0000001))) },
        { label: "Years for 50% Chance (Structure)", value: formatNumber(Math.round(yearsForFiftyPercent)) + " years" },
        { label: "Local Flash Density", value: formatNumber(flashDensity) + " strikes/km²/year" }
      ]
    };
  },
  }],
  relatedSlugs: ["tornado-safety-distance-calculator","flood-risk-assessment-calculator","lightning-rod-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Effective Area = Structure Area + 9π x Height²; Annual Probability = 1 - e^(-Flash Density x Effective Area in km²); Personal Risk = Flash Density x Body Area x (Exposure Hours / 8760)",
};
