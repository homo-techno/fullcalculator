import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainGardenCalculator: CalculatorDefinition = {
  slug: "rain-garden-calc",
  title: "Rain Garden Sizing Calculator",
  description:
    "Free rain garden sizing calculator. Calculate the optimal rain garden size based on roof area, soil type, and local rainfall. Includes plant spacing and soil mix recommendations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rain garden calculator",
    "rain garden size",
    "stormwater garden",
    "bioretention",
    "rain garden design",
    "drainage garden",
    "green infrastructure",
  ],
  variants: [
    {
      id: "garden-size",
      name: "Rain Garden Size Calculator",
      description: "Calculate the required rain garden size for your property",
      fields: [
        {
          name: "roofArea",
          label: "Contributing Roof Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "soilType",
          label: "Native Soil Type",
          type: "select",
          options: [
            { label: "Sandy (drains fast)", value: "sandy" },
            { label: "Loamy (moderate drainage)", value: "loam" },
            { label: "Clay (drains slow)", value: "clay" },
          ],
          defaultValue: "loam",
        },
        {
          name: "rainfall",
          label: "Design Storm Rainfall (inches)",
          type: "select",
          options: [
            { label: "0.5 inches (light)", value: "0.5" },
            { label: "1.0 inch (moderate)", value: "1.0" },
            { label: "1.5 inches (heavy)", value: "1.5" },
            { label: "2.0 inches (very heavy)", value: "2.0" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "gardenDepth",
          label: "Ponding Depth (inches)",
          type: "select",
          options: [
            { label: "3 inches (shallow)", value: "3" },
            { label: "6 inches (standard)", value: "6" },
            { label: "9 inches (deep)", value: "9" },
            { label: "12 inches (max)", value: "12" },
          ],
          defaultValue: "6",
        },
      ],
      calculate: (inputs) => {
        const roofArea = parseFloat(inputs.roofArea as string);
        const soilType = inputs.soilType as string;
        const rainfall = parseFloat(inputs.rainfall as string);
        const pondingDepth = parseFloat(inputs.gardenDepth as string);
        if (isNaN(roofArea) || isNaN(rainfall) || isNaN(pondingDepth)) return null;
        if (roofArea <= 0 || rainfall <= 0 || pondingDepth <= 0) return null;

        // Sizing factor based on soil infiltration rate
        const soilFactors: Record<string, { factor: number; drainTime: number; infiltRate: number }> = {
          "sandy": { factor: 0.15, drainTime: 6, infiltRate: 6.0 },
          "loam": { factor: 0.25, drainTime: 12, infiltRate: 2.0 },
          "clay": { factor: 0.40, drainTime: 24, infiltRate: 0.5 },
        };

        const soil = soilFactors[soilType];
        if (!soil) return null;

        // Volume of water to capture (cubic feet)
        const waterVolume = roofArea * (rainfall / 12); // convert inches to feet

        // Garden area = water volume / ponding depth (in feet)
        const gardenArea = waterVolume / (pondingDepth / 12);

        // Adjusted for soil type
        const adjustedArea = gardenArea * soil.factor * 4;

        // Soil mix volume (12 inches deep engineered soil)
        const soilMixVolume = adjustedArea * 1; // 1 foot deep
        const soilMixCubicYards = soilMixVolume / 27;

        // Plant count (roughly 1 per 2 sq ft for dense planting)
        const plantCount = Math.ceil(adjustedArea / 2);

        return {
          primary: {
            label: "Recommended Garden Area",
            value: formatNumber(adjustedArea, 0),
            suffix: "sq ft",
          },
          details: [
            { label: "Water Volume to Capture", value: formatNumber(waterVolume, 1) + " cu ft (" + formatNumber(waterVolume * 7.48, 0) + " gallons)" },
            { label: "Ponding Depth", value: formatNumber(pondingDepth) + " inches" },
            { label: "Soil Type", value: soilType.charAt(0).toUpperCase() + soilType.slice(1) },
            { label: "Infiltration Rate", value: formatNumber(soil.infiltRate, 1) + " in/hr" },
            { label: "Est. Drain Time", value: formatNumber(soil.drainTime) + " hours" },
            { label: "Engineered Soil Mix", value: formatNumber(soilMixCubicYards, 1) + " cubic yards" },
            { label: "Est. Plant Count", value: formatNumber(plantCount) + " plants" },
          ],
          note: "Rain garden should drain within 24-48 hours. If soil is heavy clay, use an engineered soil mix (60% sand, 20% compost, 20% topsoil).",
        };
      },
    },
    {
      id: "overflow",
      name: "Overflow & Drainage",
      description: "Calculate overflow volume for extreme rain events",
      fields: [
        {
          name: "gardenArea",
          label: "Rain Garden Area (sq ft)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "pondingDepth",
          label: "Max Ponding Depth (inches)",
          type: "number",
          placeholder: "e.g. 6",
          defaultValue: 6,
        },
        {
          name: "stormRainfall",
          label: "Storm Rainfall (inches)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "contributingArea",
          label: "Contributing Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const gardenArea = parseFloat(inputs.gardenArea as string);
        const pondingDepth = parseFloat(inputs.pondingDepth as string);
        const stormRain = parseFloat(inputs.stormRainfall as string);
        const contribArea = parseFloat(inputs.contributingArea as string);
        if ([gardenArea, pondingDepth, stormRain, contribArea].some((v) => isNaN(v) || v <= 0)) return null;

        const waterVolumeCuFt = contribArea * (stormRain / 12);
        const gardenCapacityCuFt = gardenArea * (pondingDepth / 12);
        const overflowCuFt = Math.max(0, waterVolumeCuFt - gardenCapacityCuFt);
        const overflowGallons = overflowCuFt * 7.48;
        const capturePercent = Math.min(100, (gardenCapacityCuFt / waterVolumeCuFt) * 100);

        return {
          primary: {
            label: "Overflow Volume",
            value: formatNumber(overflowGallons, 0),
            suffix: "gallons",
          },
          details: [
            { label: "Total Storm Runoff", value: formatNumber(waterVolumeCuFt * 7.48, 0) + " gallons" },
            { label: "Garden Capacity", value: formatNumber(gardenCapacityCuFt * 7.48, 0) + " gallons" },
            { label: "Capture Rate", value: formatNumber(capturePercent, 1) + "%" },
            { label: "Overflow", value: overflowCuFt > 0 ? formatNumber(overflowGallons, 0) + " gallons" : "None - garden can handle this storm" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rainwater-tank-calc", "square-footage-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How big should my rain garden be?",
      answer:
        "A rain garden should typically be 10-30% of the area draining into it. For a 1,000 sq ft roof, plan for 100-300 sq ft depending on soil type. Sandy soil needs less area (10-15%), clay soil needs more (25-40%).",
    },
    {
      question: "Where should I place a rain garden?",
      answer:
        "Place it at least 10 feet from your house foundation, in a naturally low area, and away from septic systems and utilities. Ensure it gets at least partial sun. The garden should be downhill from the water source (roof downspout or driveway).",
    },
    {
      question: "What plants work best in a rain garden?",
      answer:
        "Use native plants that tolerate both wet and dry conditions. Good choices include switchgrass, black-eyed Susan, cardinal flower, blue flag iris, and native sedges. Avoid invasive species and non-native plants that may not handle periodic flooding.",
    },
  ],
  formula:
    "Garden Area = (Roof Area x Rainfall / 12) / (Ponding Depth / 12) x Soil Factor | Water Volume = Area x Rainfall / 12",
};
