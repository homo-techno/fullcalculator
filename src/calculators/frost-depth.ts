import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frostDepthCalculator: CalculatorDefinition = {
  slug: "frost-depth-calculator",
  title: "Frost Depth Calculator",
  description: "Free frost depth calculator. Estimate frost line depth based on freezing degree days and soil type for foundations, footings, and water lines.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["frost depth calculator", "frost line calculator", "frost penetration depth", "freezing depth calculator", "footing depth calculator"],
  variants: [
    {
      id: "lookup",
      name: "By Region (US)",
      description: "Look up typical frost depth by state/region",
      fields: [
        { name: "region", label: "Region", type: "select", options: [
          { label: "Southern US (FL, LA, TX coast) - 0 in", value: "0" },
          { label: "Mid-South (TN, NC, AR) - 12 in", value: "12" },
          { label: "Central (KY, VA, MO, KS) - 18 in", value: "18" },
          { label: "Mid-Atlantic (PA, NJ, OH, IN) - 32 in", value: "32" },
          { label: "Upper Midwest (WI, MN, MI) - 48 in", value: "48" },
          { label: "Northern Plains (ND, MT, SD) - 58 in", value: "58" },
          { label: "New England (MA, VT, NH, ME) - 48 in", value: "48" },
          { label: "Mountain West (CO, WY, ID) - 42 in", value: "42" },
          { label: "Alaska - 72+ in", value: "72" },
        ] },
        { name: "safetyFactor", label: "Safety Factor", type: "select", options: [
          { label: "None (exact depth)", value: "1.0" },
          { label: "6 inches extra", value: "6" },
          { label: "12 inches extra", value: "12" },
        ], defaultValue: "6" },
      ],
      calculate: (inputs) => {
        const depthStr = inputs.region as string;
        const safetyStr = inputs.safetyFactor as string;
        if (!depthStr) return null;
        const depth = parseFloat(depthStr);
        const safety = parseFloat(safetyStr) || 0;
        const designDepth = safety > 2 ? depth + safety : depth * parseFloat(safetyStr);
        const depthFt = designDepth / 12;
        return {
          primary: { label: "Recommended Footing Depth", value: `${formatNumber(designDepth, 0)} inches (${formatNumber(depthFt, 1)} ft)` },
          details: [
            { label: "Typical frost depth", value: `${depth} inches` },
            { label: "Safety margin", value: safety > 2 ? `${safety} inches` : "None" },
            { label: "Frost depth (cm)", value: `${formatNumber(designDepth * 2.54, 0)} cm` },
          ],
          note: "Always verify frost depth with your local building department. Actual frost depth varies by year and microclimate.",
        };
      },
    },
    {
      id: "modified-berggren",
      name: "Modified Berggren Formula",
      description: "Estimate frost depth from freezing degree days and soil properties",
      fields: [
        { name: "fdd", label: "Freezing Degree Days (°F·days)", type: "number", placeholder: "e.g. 1500" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sand/Gravel (k=1.0, L=1500)", value: "sand" },
          { label: "Silt (k=0.8, L=2000)", value: "silt" },
          { label: "Clay (k=0.7, L=2200)", value: "clay" },
          { label: "Peat/Organic (k=0.3, L=3000)", value: "peat" },
        ], defaultValue: "clay" },
      ],
      calculate: (inputs) => {
        const fdd = inputs.fdd as number;
        const soilType = inputs.soilType as string;
        if (!fdd) return null;
        const soilMap: Record<string, { k: number; L: number }> = {
          sand: { k: 1.0, L: 1500 },
          silt: { k: 0.8, L: 2000 },
          clay: { k: 0.7, L: 2200 },
          peat: { k: 0.3, L: 3000 },
        };
        const soil = soilMap[soilType] || soilMap.clay;
        // Simplified Stefan equation: d = C × sqrt(48 × k × FDD / L)
        // C is correction factor ~1 for simplicity
        const depthFt = Math.sqrt((48 * soil.k * fdd) / soil.L);
        const depthIn = depthFt * 12;
        const depthCm = depthIn * 2.54;
        return {
          primary: { label: "Estimated Frost Depth", value: `${formatNumber(depthIn, 0)} inches (${formatNumber(depthFt, 1)} ft)` },
          details: [
            { label: "Freezing degree days", value: `${formatNumber(fdd, 0)} °F·days` },
            { label: "Soil thermal conductivity", value: `${soil.k} BTU/(hr·ft·°F)` },
            { label: "Soil latent heat", value: `${soil.L} BTU/ft³` },
            { label: "Depth in cm", value: formatNumber(depthCm, 0) },
          ],
          note: "Based on the modified Stefan equation. Actual frost depth depends on soil moisture, snow cover, and vegetation. Add 6-12 inches safety margin for foundations.",
        };
      },
    },
  ],
  relatedSlugs: ["snow-load-calculator", "concrete-calculator", "growing-season-calculator"],
  faq: [
    { question: "What is frost depth and why does it matter?", answer: "Frost depth (frost line) is how deep the ground freezes in winter. Building foundations and footings must extend below the frost line to prevent frost heave, which can crack foundations and shift structures. Water pipes must also be buried below the frost line." },
    { question: "How deep is the frost line in my area?", answer: "Frost depth varies widely: 0 inches in southern Florida, 12-24 inches in the mid-South, 32-48 inches in the Midwest and Northeast, and 60+ inches in northern Minnesota and Alaska. Your local building code specifies the required footing depth." },
    { question: "Does snow cover affect frost depth?", answer: "Yes, snow acts as insulation. A consistent snow cover of 12+ inches can reduce frost penetration by 30-50%. Areas with bare ground during cold spells experience deeper frost penetration than those with snow cover." },
  ],
  formula: "Stefan Equation: d = sqrt(48 × k × FDD / L) where k = thermal conductivity, FDD = freezing degree days, L = latent heat of soil",
};
