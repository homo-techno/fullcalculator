import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenYieldCalculator: CalculatorDefinition = {
  slug: "garden-yield-calculator",
  title: "Garden Yield Calculator",
  description: "Free garden yield estimator. Calculate expected harvest amounts by crop type, garden size, and growing conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden yield calculator", "harvest estimator", "garden production calculator", "vegetable yield", "how much will my garden produce"],
  variants: [
    {
      id: "by-crop",
      name: "By Crop Type",
      description: "Estimate yield for a specific vegetable crop",
      fields: [
        { name: "crop", label: "Crop", type: "select", options: [
          { label: "Tomatoes", value: "tomatoes" },
          { label: "Peppers", value: "peppers" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Green Beans", value: "beans" },
          { label: "Cucumbers", value: "cucumbers" },
          { label: "Zucchini/Squash", value: "zucchini" },
          { label: "Carrots", value: "carrots" },
          { label: "Potatoes", value: "potatoes" },
          { label: "Corn", value: "corn" },
          { label: "Peas", value: "peas" },
          { label: "Onions", value: "onions" },
          { label: "Broccoli", value: "broccoli" },
        ] },
        { name: "numPlants", label: "Number of Plants", type: "number", placeholder: "e.g. 10" },
        { name: "conditions", label: "Growing Conditions", type: "select", options: [
          { label: "Ideal (full sun, good soil, regular water)", value: "ideal" },
          { label: "Average", value: "average" },
          { label: "Below Average (partial shade, poor soil)", value: "poor" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const crop = inputs.crop as string;
        const numPlants = inputs.numPlants as number;
        const conditions = inputs.conditions as string;
        if (!crop || !numPlants) return null;
        // Yield per plant in lbs (average conditions)
        const yieldData: Record<string, { lbsPerPlant: number; spacing: number; season: string }> = {
          tomatoes: { lbsPerPlant: 10, spacing: 24, season: "75-85 days" },
          peppers: { lbsPerPlant: 4, spacing: 18, season: "60-90 days" },
          lettuce: { lbsPerPlant: 0.75, spacing: 8, season: "30-60 days" },
          beans: { lbsPerPlant: 0.5, spacing: 4, season: "50-65 days" },
          cucumbers: { lbsPerPlant: 5, spacing: 12, season: "50-70 days" },
          zucchini: { lbsPerPlant: 8, spacing: 36, season: "45-65 days" },
          carrots: { lbsPerPlant: 0.25, spacing: 3, season: "70-80 days" },
          potatoes: { lbsPerPlant: 3, spacing: 12, season: "80-120 days" },
          corn: { lbsPerPlant: 0.75, spacing: 12, season: "60-100 days" },
          peas: { lbsPerPlant: 0.3, spacing: 3, season: "55-70 days" },
          onions: { lbsPerPlant: 0.5, spacing: 4, season: "90-120 days" },
          broccoli: { lbsPerPlant: 1.5, spacing: 18, season: "60-80 days" },
        };
        const data = yieldData[crop] || yieldData.tomatoes;
        const conditionFactor: Record<string, number> = { ideal: 1.3, average: 1.0, poor: 0.6 };
        const factor = conditionFactor[conditions] || 1.0;
        const yieldPerPlant = data.lbsPerPlant * factor;
        const totalYield = yieldPerPlant * numPlants;
        const totalKg = totalYield * 0.4536;
        const sqFtNeeded = numPlants * (data.spacing / 12) * (data.spacing / 12);
        return {
          primary: { label: "Estimated Total Yield", value: `${formatNumber(totalYield, 1)} lbs` },
          details: [
            { label: "Yield per plant", value: `${formatNumber(yieldPerPlant, 1)} lbs` },
            { label: "Total kg", value: formatNumber(totalKg, 1) },
            { label: "Days to harvest", value: data.season },
            { label: "Space needed", value: `${formatNumber(sqFtNeeded, 0)} sq ft` },
            { label: "Condition adjustment", value: `${conditions} (×${factor})` },
          ],
          note: "Yields vary significantly based on variety, climate, soil quality, and care. These are typical estimates for home gardens.",
        };
      },
    },
    {
      id: "by-area",
      name: "By Garden Area",
      description: "Estimate total garden production by area",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "gardenType", label: "Garden Type", type: "select", options: [
          { label: "Mixed Vegetables", value: "mixed" },
          { label: "Intensive/Raised Bed", value: "intensive" },
          { label: "Traditional Row Garden", value: "traditional" },
          { label: "Container Garden", value: "container" },
        ], defaultValue: "mixed" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const gardenType = inputs.gardenType as string;
        if (!area) return null;
        // lbs per sq ft per season
        const yieldRate: Record<string, number> = { mixed: 0.6, intensive: 1.0, traditional: 0.4, container: 0.3 };
        const rate = yieldRate[gardenType] || 0.6;
        const totalLbs = area * rate;
        const totalKg = totalLbs * 0.4536;
        const servings = totalLbs * 4; // ~4 servings per lb of produce
        const dollarValue = totalLbs * 2.5; // ~$2.50/lb average retail value
        return {
          primary: { label: "Estimated Season Yield", value: `${formatNumber(totalLbs, 0)} lbs` },
          details: [
            { label: "Kilograms", value: formatNumber(totalKg, 0) },
            { label: "Yield rate", value: `${rate} lbs/sq ft` },
            { label: "Approximate servings", value: formatNumber(servings, 0) },
            { label: "Estimated retail value", value: `$${formatNumber(dollarValue, 0)}` },
            { label: "Feeds (people for season)", value: formatNumber(totalLbs / 150, 1) },
          ],
          note: "A 200 sq ft intensive garden can produce 100-200 lbs of vegetables per season, worth $250-500 in groceries.",
        };
      },
    },
  ],
  relatedSlugs: ["plant-spacing-calculator", "raised-garden-bed-calculator", "growing-season-calculator"],
  faq: [
    { question: "How much food can a garden produce?", answer: "An intensive 200 sq ft garden can produce 100-200 lbs of vegetables per season. A 4×8 raised bed typically yields 50-80 lbs. The average American eats about 415 lbs of vegetables per year, so a 600-800 sq ft garden could supply most of one person's needs." },
    { question: "Which vegetables produce the most per plant?", answer: "Highest-yielding vegetables per plant: zucchini (6-10 lbs), tomatoes (8-15 lbs), cucumbers (3-5 lbs), and peppers (3-5 lbs). By space efficiency, lettuce, radishes, and beans offer the best yield per square foot." },
    { question: "How big of a garden do I need to feed my family?", answer: "As a rough guide: 100-200 sq ft per person for a supplement garden, 400-600 sq ft per person for significant self-sufficiency, and 800+ sq ft per person for near-complete vegetable self-sufficiency." },
  ],
  formula: "Yield = Number of Plants × Yield per Plant (lbs) × Condition Factor | Area Method: Yield = Area (sq ft) × Rate (lbs/sq ft)",
};
