import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const farmInsuranceCostCalculator: CalculatorDefinition = {
  slug: "farm-insurance-cost-calculator",
  title: "Farm Insurance Cost Calculator",
  description: "Estimate annual farm insurance premiums including crop insurance, liability, property, and equipment coverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["farm insurance cost","crop insurance calculator","agricultural insurance estimator"],
  variants: [{
    id: "standard",
    name: "Farm Insurance Cost",
    description: "Estimate annual farm insurance premiums including crop insurance, liability, property, and equipment coverage.",
    fields: [
      { name: "cropAcres", label: "Insured Crop Acres", type: "number", min: 0, max: 50000, defaultValue: 500 },
      { name: "expectedRevenue", label: "Expected Revenue Per Acre ($)", type: "number", min: 50, max: 3000, defaultValue: 600 },
      { name: "coverageLevel", label: "Coverage Level (%)", type: "number", min: 50, max: 85, defaultValue: 75 },
      { name: "propertyValue", label: "Farm Property Value ($)", type: "number", min: 0, max: 50000000, defaultValue: 500000 },
      { name: "equipmentValue", label: "Equipment Value ($)", type: "number", min: 0, max: 10000000, defaultValue: 200000 },
    ],
    calculate: (inputs) => {
      const ca = inputs.cropAcres as number;
      const er = inputs.expectedRevenue as number;
      const cl = inputs.coverageLevel as number;
      const pv = inputs.propertyValue as number;
      const ev = inputs.equipmentValue as number;
      if (!ca || !er || !cl) return null;
      var cropInsuranceRate = 0.065;
      var insuredValue = ca * er * (cl / 100);
      var cropPremium = Math.round(insuredValue * cropInsuranceRate);
      var subsidy = Math.round(cropPremium * 0.55);
      var farmerCropPremium = cropPremium - subsidy;
      var propertyPremium = Math.round(pv * 0.005);
      var equipmentPremium = Math.round(ev * 0.015);
      var liabilityPremium = 750;
      var totalPremium = farmerCropPremium + propertyPremium + equipmentPremium + liabilityPremium;
      return {
        primary: { label: "Total Annual Premium", value: "$" + formatNumber(totalPremium) },
        details: [
          { label: "Crop Insurance (farmer share)", value: "$" + formatNumber(farmerCropPremium) },
          { label: "Federal Subsidy", value: "$" + formatNumber(subsidy) },
          { label: "Property Insurance", value: "$" + formatNumber(propertyPremium) },
          { label: "Equipment Insurance", value: "$" + formatNumber(equipmentPremium) },
          { label: "Liability Insurance", value: "$" + formatNumber(liabilityPremium) },
        ],
      };
  },
  }],
  relatedSlugs: ["farm-profit-margin-calculator","crop-yield-calculator"],
  faq: [
    { question: "How much does crop insurance cost per acre?", answer: "Crop insurance premiums typically range from $5 to $40 per acre after federal subsidies, depending on crop type, coverage level, and county risk rating. Higher coverage levels cost more." },
    { question: "Does the government subsidize crop insurance?", answer: "Yes. The federal government subsidizes 38 to 67 percent of crop insurance premiums depending on the coverage level. A 75% coverage level receives approximately 55% premium subsidy." },
  ],
  formula: "Crop Premium = Acres x Revenue/Acre x Coverage% x Rate
Farmer Share = Crop Premium x (1 - Subsidy%)
Total = Crop + Property + Equipment + Liability",
};
