import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miniSplitSizingCalculator: CalculatorDefinition = {
  slug: "mini-split-sizing-calculator",
  title: "Mini Split Sizing Calculator",
  description: "Calculate the correct mini split heat pump size for a room based on square footage, insulation, sun exposure, and climate to ensure efficient heating and cooling.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mini split sizing","ductless AC sizing","mini split BTU calculator","ductless heat pump size"],
  variants: [{
    id: "standard",
    name: "Mini Split Sizing",
    description: "Calculate the correct mini split heat pump size for a room based on square footage, insulation, sun exposure, and climate to ensure efficient heating and cooling.",
    fields: [
      { name: "roomSqFt", label: "Room Size (sq ft)", type: "number", min: 50, max: 3000, defaultValue: 400 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 16, defaultValue: 8 },
      { name: "sunExposure", label: "Sun Exposure", type: "select", options: [{ value: "1", label: "Mostly Shaded" }, { value: "2", label: "Average" }, { value: "3", label: "Lots of Sun" }], defaultValue: "2" },
      { name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Poor" }, { value: "2", label: "Average" }, { value: "3", label: "Good" }, { value: "4", label: "Excellent" }], defaultValue: "2" },
      { name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Mild" }, { value: "2", label: "Moderate" }, { value: "3", label: "Hot Summers / Cold Winters" }, { value: "4", label: "Extreme" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const sqft = inputs.roomSqFt as number;
    const ceiling = inputs.ceilingHeight as number;
    const sun = parseInt(inputs.sunExposure as string);
    const insulation = parseInt(inputs.insulation as string);
    const climate = parseInt(inputs.climate as string);
    const baseBtu = sqft * 25;
    const ceilingFactor = ceiling / 8;
    const sunFactor = { 1: 0.9, 2: 1.0, 3: 1.15 };
    const insFactor = { 1: 1.3, 2: 1.0, 3: 0.85, 4: 0.75 };
    const climFactor = { 1: 0.85, 2: 1.0, 3: 1.2, 4: 1.4 };
    const adjustedBtu = baseBtu * ceilingFactor * (sunFactor[sun] || 1.0) * (insFactor[insulation] || 1.0) * (climFactor[climate] || 1.0);
    const standardSizes = [6000, 9000, 12000, 15000, 18000, 24000, 30000, 36000];
    let unitSize = 9000;
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= adjustedBtu) { unitSize = standardSizes[i]; break; }
      if (i === standardSizes.length - 1) unitSize = standardSizes[i];
    }
    const tons = unitSize / 12000;
    const seer = 20;
    const annualCool = (unitSize / seer) * 1000 / 1000 * 0.12 * 8 * 120;
    return {
      primary: { label: "Recommended Unit Size", value: formatNumber(unitSize) + " BTU" },
      details: [
        { label: "Calculated Requirement", value: formatNumber(Math.round(adjustedBtu)) + " BTU" },
        { label: "Unit Tonnage", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        { label: "Est. Annual Cooling Cost", value: "$" + formatNumber(Math.round(annualCool)) },
        { label: "Ceiling Factor", value: formatNumber(Math.round(ceilingFactor * 100) / 100) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["btu-heating-calculator","refrigerant-charge-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base BTU = Square Footage x 25; Adjusted BTU = Base x Ceiling Factor x Sun Factor x Insulation Factor x Climate Factor; Unit Size = Next standard size above Adjusted BTU; Standard sizes: 6K, 9K, 12K, 15K, 18K, 24K, 30K, 36K BTU",
};
