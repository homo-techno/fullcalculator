import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostBinSizeCalculator: CalculatorDefinition = {
  slug: "compost-bin-size-calculator",
  title: "Compost Bin Size Calculator",
  description: "Free compost bin size calculator. Determine the ideal compost bin dimensions based on your household size, garden area, and composting goals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["compost bin size calculator", "compost bin dimensions", "how big compost bin", "composting calculator", "compost volume calculator"],
  variants: [
    {
      id: "by-household",
      name: "Bin Size by Household",
      description: "Calculate compost bin size based on household waste and garden size",
      fields: [
        { name: "people", label: "Number of People", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "gardenSize", label: "Garden Size", type: "select", options: [
          { label: "Small (under 200 sq ft)", value: "small" },
          { label: "Medium (200-500 sq ft)", value: "medium" },
          { label: "Large (500-1000 sq ft)", value: "large" },
          { label: "Very large (1000+ sq ft)", value: "xlarge" },
        ], defaultValue: "medium" },
        { name: "yardWaste", label: "Yard Waste Level", type: "select", options: [
          { label: "Minimal (no lawn, few leaves)", value: "0.5" },
          { label: "Moderate (small lawn, some leaves)", value: "1.0" },
          { label: "Heavy (large lawn, many leaves)", value: "2.0" },
        ], defaultValue: "1.0" },
        { name: "binType", label: "Bin Type", type: "select", options: [
          { label: "Single bin (basic composting)", value: "1" },
          { label: "Two-bin system (active + curing)", value: "2" },
          { label: "Three-bin system (recommended)", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const people = (inputs.people as number) || 4;
        const gardenSize = inputs.gardenSize as string;
        const yardMod = parseFloat(inputs.yardWaste as string) || 1.0;
        const bins = parseInt(inputs.binType as string) || 1;

        const gardenMod: Record<string, number> = { small: 0.5, medium: 1.0, large: 1.5, xlarge: 2.0 };
        const gMod = gardenMod[gardenSize] || 1.0;

        const weeklyKitchenGal = people * 1.5;
        const weeklyYardGal = 5 * yardMod * gMod;
        const weeklyTotalGal = weeklyKitchenGal + weeklyYardGal;
        const monthlyGal = weeklyTotalGal * 4.3;
        const monthlyCuFt = monthlyGal / 7.48;

        const minBinCuFt = 27;
        const recommendedCuFt = Math.max(minBinCuFt, monthlyCuFt * 3);
        const sideLength = Math.ceil(Math.pow(recommendedCuFt, 1 / 3) * 12) / 12;
        const sideLengthIn = Math.round(sideLength * 12);

        return {
          primary: { label: "Recommended Bin Size", value: `${formatNumber(sideLength, 1)} \u00D7 ${formatNumber(sideLength, 1)} \u00D7 ${formatNumber(sideLength, 1)} ft` },
          details: [
            { label: "Bin volume", value: `${formatNumber(recommendedCuFt, 1)} cu ft` },
            { label: "Dimensions", value: `${sideLengthIn}\" \u00D7 ${sideLengthIn}\" \u00D7 ${sideLengthIn}\"` },
            { label: "Number of bins", value: `${bins}` },
            { label: "Weekly kitchen waste", value: `${formatNumber(weeklyKitchenGal, 1)} gallons` },
            { label: "Weekly yard waste", value: `${formatNumber(weeklyYardGal, 1)} gallons` },
            { label: "Total weekly input", value: `${formatNumber(weeklyTotalGal, 1)} gallons` },
          ],
          note: bins > 1
            ? `A ${bins}-bin system lets you have compost at different stages. Minimum recommended bin size is 3\u00D73\u00D73 ft (27 cu ft) for effective heat generation.`
            : "Minimum recommended size is 3\u00D73\u00D73 ft (27 cu ft). Smaller bins do not generate enough heat for efficient composting.",
        };
      },
    },
    {
      id: "custom-bin",
      name: "Custom Bin Dimensions",
      description: "Calculate volume and capacity for custom bin dimensions",
      fields: [
        { name: "binLength", label: "Bin Length (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "binWidth", label: "Bin Width (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "binHeight", label: "Bin Height (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "shape", label: "Bin Shape", type: "select", options: [
          { label: "Rectangular / Square", value: "rect" },
          { label: "Circular / Tumbler", value: "circle" },
        ], defaultValue: "rect" },
      ],
      calculate: (inputs) => {
        const length = inputs.binLength as number;
        const width = inputs.binWidth as number;
        const height = inputs.binHeight as number;
        const shape = inputs.shape as string;
        if (!length || !height) return null;

        let volumeCuFt: number;
        if (shape === "circle") {
          const radius = length / 2;
          volumeCuFt = Math.PI * radius * radius * height;
        } else {
          if (!width) return null;
          volumeCuFt = length * width * height;
        }

        const volumeGallons = volumeCuFt * 7.48;
        const compostYield = volumeCuFt * 0.5;
        const adequate = volumeCuFt >= 27;

        return {
          primary: { label: "Bin Volume", value: `${formatNumber(volumeCuFt, 1)} cu ft` },
          details: [
            { label: "Volume (gallons)", value: formatNumber(volumeGallons, 1) },
            { label: "Expected finished compost", value: `${formatNumber(compostYield, 1)} cu ft (50% reduction)` },
            { label: "Adequate for hot composting?", value: adequate ? "Yes (27+ cu ft)" : "No - too small for hot composting" },
            { label: "Compost time (hot)", value: adequate ? "4-8 weeks" : "Cold composting: 6-12 months" },
          ],
          note: adequate
            ? "This bin is large enough for hot composting (130-160\u00B0F). Turn the pile weekly and maintain moisture like a wrung-out sponge."
            : "Bins under 27 cu ft (3\u00D73\u00D73) cannot maintain enough heat for hot composting. They will still produce compost through cold composting, which takes longer.",
        };
      },
    },
  ],
  relatedSlugs: ["soil-volume-calculator", "vegetable-garden-size-calculator", "gravel-calculator"],
  faq: [
    { question: "How big should a compost bin be?", answer: "Minimum 3\u00D73\u00D73 feet (27 cu ft) for hot composting. A family of 4 with a medium garden typically needs 27-40 cu ft. Larger gardens benefit from a three-bin system." },
    { question: "How long does composting take?", answer: "Hot composting (regular turning, proper moisture): 4-8 weeks. Cold composting (passive): 6-12 months. Tumbler composting: 3-6 weeks. Speed depends on material ratio, moisture, and aeration." },
  ],
  formula: "Volume = L \u00D7 W \u00D7 H | Minimum 27 cu ft for hot composting | Finished compost \u2248 50% of input volume",
};
