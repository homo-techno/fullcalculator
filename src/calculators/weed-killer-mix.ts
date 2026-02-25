import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weedKillerMixCalculator: CalculatorDefinition = {
  slug: "weed-killer-mix-calculator",
  title: "Weed Killer Mixing Calculator",
  description: "Free weed killer mixing calculator. Calculate the correct herbicide-to-water ratio for your sprayer based on product concentration and coverage area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["weed killer mixing calculator", "herbicide mixing ratio", "spray mix calculator", "weed spray calculator", "herbicide dilution"],
  variants: [
    {
      id: "by-area",
      name: "Mix by Coverage Area",
      description: "Calculate herbicide mix for a specific lawn or garden area",
      fields: [
        { name: "area", label: "Area to Treat (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "productRate", label: "Product Rate", type: "select", options: [
          { label: "1 oz per 1,000 sq ft (light)", value: "1" },
          { label: "1.5 oz per 1,000 sq ft", value: "1.5" },
          { label: "2 oz per 1,000 sq ft (standard)", value: "2" },
          { label: "3 oz per 1,000 sq ft (heavy)", value: "3" },
          { label: "4 oz per 1,000 sq ft", value: "4" },
        ], defaultValue: "2" },
        { name: "sprayVolume", label: "Spray Volume", type: "select", options: [
          { label: "1 gallon per 1,000 sq ft", value: "1" },
          { label: "2 gallons per 1,000 sq ft", value: "2" },
          { label: "3 gallons per 1,000 sq ft", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const productRate = parseFloat(inputs.productRate as string) || 2;
        const sprayVolume = parseFloat(inputs.sprayVolume as string) || 1;
        if (!area) return null;

        const totalProductOz = (area / 1000) * productRate;
        const totalWaterGal = (area / 1000) * sprayVolume;
        const totalWaterOz = totalWaterGal * 128;
        const ozPerGallon = totalProductOz / totalWaterGal;
        const tsp = totalProductOz * 6;

        return {
          primary: { label: "Product Needed", value: `${formatNumber(totalProductOz, 1)} fl oz` },
          details: [
            { label: "Water needed", value: `${formatNumber(totalWaterGal, 1)} gallons` },
            { label: "Mix ratio", value: `${formatNumber(ozPerGallon, 2)} oz per gallon of water` },
            { label: "Product in teaspoons", value: `${formatNumber(tsp, 1)} tsp` },
            { label: "Coverage area", value: `${formatNumber(area)} sq ft` },
          ],
          note: "Always read the product label for exact mixing instructions. Wear protective gear when handling herbicides. Avoid spraying on windy days.",
        };
      },
    },
    {
      id: "by-tank",
      name: "Mix by Tank Size",
      description: "Calculate how much product to add to your sprayer tank",
      fields: [
        { name: "tankSize", label: "Sprayer Tank Size (gallons)", type: "select", options: [
          { label: "1 gallon (hand sprayer)", value: "1" },
          { label: "2 gallons", value: "2" },
          { label: "4 gallons (backpack)", value: "4" },
          { label: "15 gallons (tow-behind)", value: "15" },
          { label: "25 gallons", value: "25" },
        ], defaultValue: "2" },
        { name: "mixRate", label: "Product Mix Rate (oz per gallon)", type: "number", placeholder: "e.g. 2.5", step: 0.5 },
      ],
      calculate: (inputs) => {
        const tankSize = parseFloat(inputs.tankSize as string) || 2;
        const mixRate = inputs.mixRate as number;
        if (!mixRate) return null;

        const productOz = tankSize * mixRate;
        const productTbsp = productOz * 2;
        const productTsp = productOz * 6;
        const coverageAt1Gal = 1000;
        const totalCoverage = tankSize * coverageAt1Gal;

        return {
          primary: { label: "Product to Add", value: `${formatNumber(productOz, 1)} fl oz` },
          details: [
            { label: "In tablespoons", value: `${formatNumber(productTbsp, 1)} tbsp` },
            { label: "In teaspoons", value: `${formatNumber(productTsp, 1)} tsp` },
            { label: "Tank size", value: `${tankSize} gallons` },
            { label: "Approximate coverage", value: `${formatNumber(totalCoverage)} sq ft` },
          ],
          note: "Fill tank halfway with water, add product, then fill the rest. Agitate gently before spraying.",
        };
      },
    },
  ],
  relatedSlugs: ["lawn-overseeding-calculator", "lawn-aeration-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much weed killer per gallon of water?", answer: "It varies by product. Most concentrated herbicides use 1-4 oz per gallon of water. Always follow the label instructions for the specific product you are using." },
    { question: "When is the best time to apply weed killer?", answer: "Apply on calm, dry days when temperatures are 60-85\u00B0F. Avoid spraying when rain is expected within 24 hours. Early morning or late afternoon is ideal to reduce drift and evaporation." },
  ],
  formula: "Product (oz) = (Area / 1000) \u00D7 Product Rate | Water (gal) = (Area / 1000) \u00D7 Spray Volume",
};
