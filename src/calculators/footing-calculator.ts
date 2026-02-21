import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const footingCalculator: CalculatorDefinition = {
  slug: "footing-calculator",
  title: "Footing Calculator",
  description: "Free footing calculator. Calculate footing size, concrete volume, and rebar for continuous and spread footings based on load and soil conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["footing calculator", "footing size calculator", "concrete footing", "footer calculator", "foundation footing calculator"],
  variants: [
    {
      id: "continuous-footing",
      name: "Continuous Footing (Wall Footing)",
      description: "Calculate concrete for continuous strip footings under walls",
      fields: [
        { name: "length", label: "Total Footing Length (feet)", type: "number", placeholder: "e.g. 140" },
        { name: "width", label: "Footing Width (inches)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "depth", label: "Footing Depth (inches)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "soilType", label: "Soil Bearing Capacity", type: "select", options: [
          { label: "Soft Clay (1,500 PSF)", value: "1500" },
          { label: "Sandy Clay (2,000 PSF)", value: "2000" },
          { label: "Sand / Gravel (3,000 PSF)", value: "3000" },
          { label: "Compacted Gravel (4,000 PSF)", value: "4000" },
          { label: "Rock (12,000+ PSF)", value: "12000" },
        ], defaultValue: "2000" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = (inputs.width as number) || 20;
        const depth = (inputs.depth as number) || 8;
        const soilCapacity = parseInt(inputs.soilType as string) || 2000;
        if (!length) return null;

        const widthFt = width / 12;
        const depthFt = depth / 12;
        const volumeCuFt = length * widthFt * depthFt;
        const cubicYards = volumeCuFt / 27;
        const cubicYardsWithWaste = cubicYards * 1.10;

        // Bearing capacity: load per linear foot the footing can support
        const bearingPerLinFt = widthFt * soilCapacity;

        // Rebar: 2 continuous #4 bars, plus #4 crossbars every 24"
        const longitudinalRebarFt = length * 2;
        const crossBars = Math.ceil(length * 12 / 24);
        const crossBarLengthFt = crossBars * (width / 12);
        const totalRebarFt = longitudinalRebarFt + crossBarLengthFt;

        return {
          primary: { label: "Concrete Needed", value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards` },
          details: [
            { label: "Volume (exact)", value: `${formatNumber(cubicYards, 2)} cu yd (${formatNumber(volumeCuFt, 1)} cu ft)` },
            { label: "Volume (with 10% waste)", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Bearing capacity", value: `${formatNumber(bearingPerLinFt, 0)} lbs per linear ft` },
            { label: "Soil bearing capacity", value: `${formatNumber(soilCapacity, 0)} PSF` },
            { label: "Rebar (#4 bar)", value: `${formatNumber(totalRebarFt, 0)} linear ft` },
            { label: "Cross bars (#4 at 24\" OC)", value: `${crossBars}` },
          ],
          note: "Standard residential continuous footings are 20\" wide × 8\" deep with 2 #4 rebar bars. Increase width for poor soil or heavy loads. Footing bottom must be below frost line.",
        };
      },
    },
    {
      id: "spread-footing",
      name: "Spread / Pad Footing (Column Footing)",
      description: "Calculate footings for individual columns or posts",
      fields: [
        { name: "load", label: "Column Load (pounds)", type: "number", placeholder: "e.g. 10000" },
        { name: "soilType", label: "Soil Bearing Capacity", type: "select", options: [
          { label: "Soft Clay (1,500 PSF)", value: "1500" },
          { label: "Sandy Clay (2,000 PSF)", value: "2000" },
          { label: "Sand / Gravel (3,000 PSF)", value: "3000" },
          { label: "Compacted Gravel (4,000 PSF)", value: "4000" },
        ], defaultValue: "2000" },
        { name: "footingDepth", label: "Footing Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "count", label: "Number of Footings", type: "number", placeholder: "e.g. 4", defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const load = inputs.load as number;
        const soilCapacity = parseInt(inputs.soilType as string) || 2000;
        const footingDepth = (inputs.footingDepth as number) || 12;
        const count = (inputs.count as number) || 1;
        if (!load) return null;

        const requiredAreaSqFt = load / soilCapacity;
        const sideLength = Math.sqrt(requiredAreaSqFt);
        const sideLengthIn = Math.ceil(sideLength * 12 / 6) * 6; // Round up to nearest 6"
        const actualSideFt = sideLengthIn / 12;
        const actualArea = actualSideFt * actualSideFt;

        const volumePerFooting = actualArea * (footingDepth / 12);
        const totalVolume = volumePerFooting * count;
        const cubicYards = totalVolume / 27;
        const cubicYardsWithWaste = cubicYards * 1.10;

        const actualBearingPressure = load / actualArea;

        return {
          primary: { label: "Footing Size", value: `${sideLengthIn}" × ${sideLengthIn}" × ${footingDepth}" deep` },
          details: [
            { label: "Required area", value: `${formatNumber(requiredAreaSqFt, 2)} sq ft` },
            { label: "Footing size (each)", value: `${sideLengthIn}" × ${sideLengthIn}"` },
            { label: "Actual bearing pressure", value: `${formatNumber(actualBearingPressure, 0)} PSF` },
            { label: "Safety factor", value: `${formatNumber(soilCapacity / actualBearingPressure, 2)}×` },
            { label: "Concrete per footing", value: `${formatNumber(volumePerFooting, 2)} cu ft` },
            { label: "Total concrete (${count} footings)", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
          ],
          note: "Spread footings distribute point loads to the soil. Footing area = Load / Soil Capacity. Depth should be at least equal to the projection beyond the column face. Consult a structural engineer for specific designs.",
        };
      },
    },
  ],
  relatedSlugs: ["foundation-calculator", "concrete-calculator", "column-calculator"],
  faq: [
    { question: "How wide should my footings be?", answer: "Footing width depends on soil bearing capacity and load. For standard residential: 12\" wide for interior walls, 16\"-20\" wide for exterior walls, 24\"+ for poor soil. The rule of thumb is the footing width should be twice the wall thickness." },
    { question: "How deep do footings need to be?", answer: "Footings must extend below the frost line, which varies by location (12\" in the South to 48\"+ in the North). Minimum depth is typically 8\" for continuous footings and 12\" for spread footings. Check local building codes for frost depth requirements." },
  ],
  formula: "Footing Area = Load / Soil Bearing Capacity | Volume = Length × Width × Depth | Cu Yd = Cu Ft / 27",
};
