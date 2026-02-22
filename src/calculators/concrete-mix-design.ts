import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteMixDesignCalculator: CalculatorDefinition = {
  slug: "concrete-mix-design-calculator",
  title: "Concrete Mix Design Calculator",
  description: "Free concrete mix design calculator. Calculate the proportions of cement, sand, gravel, and water for different concrete strengths and mix ratios.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["concrete mix design", "concrete ratio calculator", "cement mix calculator", "concrete proportions", "concrete recipe"],
  variants: [
    {
      id: "by-volume",
      name: "Mix by Volume (Cubic Yards)",
      description: "Calculate material quantities for a given volume of concrete",
      fields: [
        { name: "volume", label: "Concrete Volume (cubic yards)", type: "number", placeholder: "e.g. 2" },
        { name: "mixRatio", label: "Mix Ratio (Cement:Sand:Gravel)", type: "select", options: [
          { label: "1:2:3 - Standard (3000 psi)", value: "1:2:3" },
          { label: "1:1.5:3 - Strong (3500 psi)", value: "1:1.5:3" },
          { label: "1:1:2 - High Strength (4000+ psi)", value: "1:1:2" },
          { label: "1:2:4 - Lean Mix (2500 psi)", value: "1:2:4" },
          { label: "1:3:6 - Footing/Mass (2000 psi)", value: "1:3:6" },
        ], defaultValue: "1:2:3" },
        { name: "waterCement", label: "Water/Cement Ratio", type: "select", options: [
          { label: "0.40 - High strength", value: "0.40" },
          { label: "0.45 - Standard", value: "0.45" },
          { label: "0.50 - General purpose", value: "0.50" },
          { label: "0.55 - More workable", value: "0.55" },
        ], defaultValue: "0.45" },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const mixRatio = inputs.mixRatio as string;
        const wcRatio = parseFloat(inputs.waterCement as string) || 0.45;
        if (!volume) return null;

        const parts = mixRatio.split(":").map(Number);
        const totalParts = parts[0] + parts[1] + parts[2];
        const cubicFeet = volume * 27;

        const cementRatio = parts[0] / totalParts;
        const sandRatio = parts[1] / totalParts;
        const gravelRatio = parts[2] / totalParts;

        const cementCF = cubicFeet * cementRatio * 1.54;
        const sandCF = cubicFeet * sandRatio * 1.54;
        const gravelCF = cubicFeet * gravelRatio * 1.54;

        const cementBags = Math.ceil(cementCF / 1.0);
        const cementLbs = cementBags * 94;
        const sandLbs = sandCF * 100;
        const gravelLbs = gravelCF * 105;
        const waterGallons = (cementLbs * wcRatio) / 8.34;

        return {
          primary: { label: "Cement Needed", value: `${cementBags} bags (94 lb)` },
          details: [
            { label: "Cement weight", value: `${formatNumber(cementLbs, 0)} lbs` },
            { label: "Sand needed", value: `${formatNumber(sandLbs, 0)} lbs (${formatNumber(sandCF, 1)} cu ft)` },
            { label: "Gravel needed", value: `${formatNumber(gravelLbs, 0)} lbs (${formatNumber(gravelCF, 1)} cu ft)` },
            { label: "Water needed", value: `${formatNumber(waterGallons, 1)} gallons` },
            { label: "Mix ratio", value: mixRatio },
            { label: "Water/cement ratio", value: `${wcRatio}` },
            { label: "Total concrete volume", value: `${formatNumber(volume, 2)} cu yd` },
          ],
          note: "Quantities include a bulking factor of 1.54 to account for voids. One bag of Portland cement = 94 lbs = ~1 cu ft. Actual water needed depends on aggregate moisture content.",
        };
      },
    },
    {
      id: "strength-based",
      name: "Mix by Target Strength",
      description: "Get recommended proportions based on target compressive strength",
      fields: [
        { name: "volume", label: "Concrete Volume (cubic yards)", type: "number", placeholder: "e.g. 2" },
        { name: "strength", label: "Target Strength (psi)", type: "select", options: [
          { label: "2,000 psi - Footings, mass concrete", value: "2000" },
          { label: "2,500 psi - Residential footings", value: "2500" },
          { label: "3,000 psi - Standard residential", value: "3000" },
          { label: "3,500 psi - Driveways, slabs", value: "3500" },
          { label: "4,000 psi - Structural, commercial", value: "4000" },
          { label: "5,000 psi - High strength", value: "5000" },
        ], defaultValue: "3000" },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const strength = parseInt(inputs.strength as string) || 3000;
        if (!volume) return null;

        const mixMap: Record<number, { ratio: string; wc: number; cement: number }> = {
          2000: { ratio: "1:3:6", wc: 0.55, cement: 376 },
          2500: { ratio: "1:2:4", wc: 0.50, cement: 470 },
          3000: { ratio: "1:2:3", wc: 0.45, cement: 564 },
          3500: { ratio: "1:1.5:3", wc: 0.43, cement: 611 },
          4000: { ratio: "1:1:2", wc: 0.40, cement: 658 },
          5000: { ratio: "1:1:1.5", wc: 0.35, cement: 752 },
        };

        const mix = mixMap[strength];
        const cementLbs = mix.cement * volume;
        const cementBags = Math.ceil(cementLbs / 94);
        const waterGallons = (cementLbs * mix.wc) / 8.34;

        return {
          primary: { label: "Recommended Mix", value: `${mix.ratio} (${strength} psi)` },
          details: [
            { label: "Cement needed", value: `${cementBags} bags (${formatNumber(cementLbs, 0)} lbs)` },
            { label: "Water/cement ratio", value: `${mix.wc}` },
            { label: "Water needed", value: `${formatNumber(waterGallons, 1)} gallons` },
            { label: "Cement per cubic yard", value: `${mix.cement} lbs/cu yd` },
            { label: "Mix ratio", value: mix.ratio },
            { label: "Volume", value: `${formatNumber(volume, 2)} cu yd` },
          ],
          note: "These are approximate proportions. Actual mix designs should be verified by testing. Higher-strength mixes require less water but more cement. Always use clean, properly graded aggregates.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "aggregate-calculator", "volume-calculator"],
  faq: [
    { question: "What is the standard concrete mix ratio?", answer: "The most common mix ratio is 1:2:3 (1 part cement, 2 parts sand, 3 parts gravel) which yields approximately 3,000 psi concrete. For driveways and structural applications, a stronger mix like 1:1.5:3 or 1:1:2 is recommended." },
    { question: "What does the water/cement ratio affect?", answer: "The water/cement ratio is the most critical factor in concrete strength. Lower ratios produce stronger, more durable concrete but are harder to work with. A ratio of 0.45 is standard for most applications. Never add excess water to make concrete easier to pour as it significantly weakens the final product." },
  ],
  formula: "Cement = Volume \u00D7 Ratio \u00D7 1.54 bulking factor | Water = Cement Weight \u00D7 W/C Ratio",
};
