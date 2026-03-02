import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deforestationImpactCalculator: CalculatorDefinition = {
  slug: "deforestation-impact-calculator",
  title: "Deforestation Impact Calculator",
  description: "Estimate the environmental impact of deforestation including lost carbon sequestration, biodiversity loss, and water cycle disruption.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["deforestation","forest loss","carbon sequestration loss","biodiversity impact","tree loss calculator"],
  variants: [{
    id: "standard",
    name: "Deforestation Impact",
    description: "Estimate the environmental impact of deforestation including lost carbon sequestration, biodiversity loss, and water cycle disruption.",
    fields: [
      { name: "hectares", label: "Area Deforested (hectares)", type: "number", min: 1, max: 100000, defaultValue: 100 },
      { name: "forestType", label: "Forest Type", type: "select", options: [{ value: "1", label: "Tropical Rainforest" }, { value: "2", label: "Temperate Forest" }, { value: "3", label: "Boreal Forest" }, { value: "4", label: "Mangrove" }], defaultValue: "1" },
      { name: "yearsLost", label: "Forest Age (years)", type: "number", min: 10, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const hectares = inputs.hectares as number;
    const forestType = inputs.forestType as number;
    const yearsLost = inputs.yearsLost as number;
    const carbonPerHectare = [180, 120, 90, 220][forestType - 1];
    const speciesPerHectare = [400, 150, 60, 300][forestType - 1];
    const waterRetentionLiters = [8000000, 5000000, 4000000, 12000000][forestType - 1];
    const carbonReleased = hectares * carbonPerHectare;
    const speciesAffected = Math.round(hectares * speciesPerHectare * 0.01);
    const waterLoss = hectares * waterRetentionLiters;
    const waterLossMillionLiters = waterLoss / 1000000;
    const treesLost = hectares * 400;
    const yearsToRecover = yearsLost * 1.5;
    return {
      primary: { label: "Carbon Released", value: formatNumber(Math.round(carbonReleased)) + " metric tons CO2" },
      details: [
        { label: "Trees Destroyed", value: formatNumber(treesLost) },
        { label: "Species Potentially Affected", value: formatNumber(speciesAffected) },
        { label: "Water Retention Lost", value: formatNumber(Math.round(waterLossMillionLiters)) + " million liters" },
        { label: "Estimated Recovery Time", value: formatNumber(Math.round(yearsToRecover)) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["carbon-footprint-offset-calculator","tree-carbon-calculator","soil-erosion-rate-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Carbon Released = Hectares x Carbon per Hectare
Species Affected = Hectares x Species Density x 0.01
Recovery Time = Forest Age x 1.5",
};
