import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homesteadGardenSizeCalculator: CalculatorDefinition = {
  slug: "homestead-garden-size-calculator",
  title: "Homestead Garden Size Calculator",
  description:
    "Free homestead garden acreage calculator. Estimate how much garden space you need to feed your family based on household size, diet, and growing season.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "homestead garden calculator",
    "garden size to feed family",
    "how much garden space",
    "homestead planning",
    "self-sufficient garden",
  ],
  variants: [
    {
      id: "family-garden",
      name: "Family Garden Size",
      description: "Calculate garden area needed to feed your family",
      fields: [
        {
          name: "familySize",
          label: "Family Size (people)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 20,
        },
        {
          name: "selfSufficiency",
          label: "Self-Sufficiency Goal",
          type: "select",
          options: [
            { label: "Supplement (25% of produce)", value: "25" },
            { label: "Half (50% of produce)", value: "50" },
            { label: "Most (75% of produce)", value: "75" },
            { label: "Full (100% year-round)", value: "100" },
          ],
          defaultValue: "50",
        },
        {
          name: "growingSeason",
          label: "Growing Season",
          type: "select",
          options: [
            { label: "Short (3-4 months)", value: "short" },
            { label: "Medium (5-6 months)", value: "medium" },
            { label: "Long (7-9 months)", value: "long" },
            { label: "Year-Round (10-12 months)", value: "yearround" },
          ],
          defaultValue: "medium",
        },
        {
          name: "preservation",
          label: "Food Preservation",
          type: "select",
          options: [
            { label: "None (fresh eating only)", value: "none" },
            { label: "Some (canning/freezing basics)", value: "some" },
            { label: "Extensive (root cellar, canning, drying)", value: "extensive" },
          ],
          defaultValue: "some",
        },
      ],
      calculate: (inputs) => {
        const family = parseFloat(inputs.familySize as string);
        const sufficiency = parseFloat(inputs.selfSufficiency as string);
        const season = inputs.growingSeason as string;
        const preservation = inputs.preservation as string;
        if (!family || !sufficiency) return null;

        // Base: ~200 sq ft per person for basic fresh vegetables
        // Full self-sufficiency requires ~4000 sq ft per person
        const baseSqFt = 4000 * (sufficiency / 100);

        // Season adjustment (short seasons need more intensive planting or preservation)
        const seasonMultiplier: Record<string, number> = {
          short: 1.3,
          medium: 1.0,
          long: 0.85,
          yearround: 0.7,
        };
        const seasonFactor = seasonMultiplier[season] || 1.0;

        // Preservation reduces needed growing area in long run
        const preservationFactor: Record<string, number> = {
          none: 1.2,
          some: 1.0,
          extensive: 0.85,
        };
        const preserveFactor = preservationFactor[preservation] || 1.0;

        const totalSqFt = baseSqFt * family * seasonFactor * preserveFactor;
        const acres = totalSqFt / 43560;
        const sqMeters = totalSqFt * 0.0929;

        // Breakdown estimates
        const vegGardenPct = 0.6;
        const fruitPct = 0.15;
        const grainLegumePct = 0.15;
        const herbPathPct = 0.1;

        return {
          primary: {
            label: "Recommended Garden Area",
            value: totalSqFt > 43560 ? formatNumber(acres, 2) + " acres" : formatNumber(totalSqFt, 0) + " sq ft",
          },
          details: [
            { label: "Total Square Feet", value: formatNumber(totalSqFt, 0) },
            { label: "Total Acres", value: formatNumber(acres, 2) },
            { label: "Total Square Meters", value: formatNumber(sqMeters, 0) },
            { label: "Per Person", value: formatNumber(totalSqFt / family, 0) + " sq ft" },
            { label: "Vegetable Garden (~60%)", value: formatNumber(totalSqFt * vegGardenPct, 0) + " sq ft" },
            { label: "Fruit Trees/Berries (~15%)", value: formatNumber(totalSqFt * fruitPct, 0) + " sq ft" },
            { label: "Grains/Legumes (~15%)", value: formatNumber(totalSqFt * grainLegumePct, 0) + " sq ft" },
            { label: "Herbs/Paths (~10%)", value: formatNumber(totalSqFt * herbPathPct, 0) + " sq ft" },
          ],
          note: "These are estimates. Intensive methods (raised beds, succession planting) can reduce space by 20-40%. Start smaller and expand as you learn.",
        };
      },
    },
    {
      id: "crop-planning",
      name: "Crop Yield Estimator",
      description: "Estimate yield per row foot for common crops",
      fields: [
        {
          name: "crop",
          label: "Crop",
          type: "select",
          options: [
            { label: "Tomatoes", value: "tomato" },
            { label: "Potatoes", value: "potato" },
            { label: "Green Beans", value: "beans" },
            { label: "Lettuce/Greens", value: "lettuce" },
            { label: "Squash/Zucchini", value: "squash" },
            { label: "Corn", value: "corn" },
            { label: "Carrots", value: "carrot" },
            { label: "Peppers", value: "pepper" },
          ],
          defaultValue: "tomato",
        },
        {
          name: "rowFeet",
          label: "Row Feet Planted",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const crop = inputs.crop as string;
        const rowFeet = parseFloat(inputs.rowFeet as string);
        if (!rowFeet) return null;

        // Yield in lbs per row foot and spacing
        const cropData: Record<string, { yieldPerFt: number; spacing: number; rowWidth: number; daysToHarvest: number }> = {
          tomato: { yieldPerFt: 1.5, spacing: 24, rowWidth: 36, daysToHarvest: 75 },
          potato: { yieldPerFt: 1.0, spacing: 12, rowWidth: 36, daysToHarvest: 90 },
          beans: { yieldPerFt: 0.5, spacing: 4, rowWidth: 24, daysToHarvest: 55 },
          lettuce: { yieldPerFt: 0.3, spacing: 8, rowWidth: 18, daysToHarvest: 45 },
          squash: { yieldPerFt: 2.0, spacing: 36, rowWidth: 60, daysToHarvest: 55 },
          corn: { yieldPerFt: 0.4, spacing: 10, rowWidth: 36, daysToHarvest: 75 },
          carrot: { yieldPerFt: 0.5, spacing: 3, rowWidth: 18, daysToHarvest: 70 },
          pepper: { yieldPerFt: 0.8, spacing: 18, rowWidth: 30, daysToHarvest: 70 },
        };

        const data = cropData[crop] || cropData.tomato;
        const totalYield = data.yieldPerFt * rowFeet;
        const numPlants = Math.floor((rowFeet * 12) / data.spacing);
        const sqFtUsed = rowFeet * (data.rowWidth / 12);

        return {
          primary: {
            label: "Estimated Yield",
            value: formatNumber(totalYield, 1) + " lbs",
          },
          details: [
            { label: "Yield Per Row Foot", value: formatNumber(data.yieldPerFt, 1) + " lbs" },
            { label: "Number of Plants", value: formatNumber(numPlants, 0) },
            { label: "Plant Spacing", value: formatNumber(data.spacing, 0) + " inches" },
            { label: "Bed Area Used", value: formatNumber(sqFtUsed, 0) + " sq ft" },
            { label: "Days to Harvest", value: formatNumber(data.daysToHarvest, 0) },
            { label: "Yield (kg)", value: formatNumber(totalYield * 0.4536, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "area-converter", "calorie-calculator"],
  faq: [
    {
      question: "How much land do I need to feed a family of 4?",
      answer:
        "For 100% self-sufficiency, a family of 4 needs approximately 1/3 to 1/2 acre (14,000-22,000 sq ft) of intensively gardened land. For supplementing 50% of your produce, about 4,000-8,000 sq ft is adequate. These numbers assume good soil, average growing season, and efficient gardening practices.",
    },
    {
      question: "How much food can you grow in 1000 square feet?",
      answer:
        "An intensive garden of 1,000 sq ft can produce 300-700 lbs of vegetables per year with succession planting. This is enough to supplement fresh vegetables for 1-2 people during the growing season. Using raised beds and vertical growing can maximize yields per square foot.",
    },
  ],
  formula:
    "Garden Area = (4000 sq ft × Self-Sufficiency %) × Family Size × Season Factor × Preservation Factor",
};
