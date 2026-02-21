import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const raisedBedSoilCalculator: CalculatorDefinition = {
  slug: "raised-bed-soil-calculator",
  title: "Raised Bed Soil Volume Calculator",
  description: "Free raised bed soil calculator. Calculate exactly how much soil, compost, and amendments you need to fill raised garden beds of any size or shape.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["raised bed soil calculator", "how much soil for raised bed", "raised bed fill calculator", "garden bed soil volume", "soil for raised garden bed"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Bed",
      description: "Calculate soil for a standard rectangular raised bed",
      fields: [
        { name: "length", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Bed Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "soilMix", label: "Soil Mix", type: "select", options: [
          { label: "Mel's Mix (1/3 each: compost, peat, vermiculite)", value: "mels" },
          { label: "Standard (50% topsoil, 30% compost, 20% amendment)", value: "standard" },
          { label: "Budget (70% topsoil, 30% compost)", value: "budget" },
          { label: "Premium (40% compost, 40% topsoil, 20% perlite)", value: "premium" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        const mix = inputs.soilMix as string;
        if (!length || !width || !depth) return null;

        const cubicFeet = length * width * (depth / 12);
        const cubicYards = cubicFeet / 27;

        const mixRatios: Record<string, { components: string[]; ratios: number[] }> = {
          mels: { components: ["Compost", "Peat Moss", "Vermiculite"], ratios: [0.333, 0.333, 0.334] },
          standard: { components: ["Topsoil", "Compost", "Perlite/Amendment"], ratios: [0.5, 0.3, 0.2] },
          budget: { components: ["Topsoil", "Compost"], ratios: [0.7, 0.3] },
          premium: { components: ["Compost", "Topsoil", "Perlite"], ratios: [0.4, 0.4, 0.2] },
        };

        const selected = mixRatios[mix] || mixRatios.standard;
        const costPerCuYd: Record<string, number> = { mels: 60, standard: 40, budget: 30, premium: 55 };
        const totalCost = cubicYards * (costPerCuYd[mix] || 40);

        const details = [
          { label: "Total volume", value: `${formatNumber(cubicFeet, 1)} cu ft (${formatNumber(cubicYards, 2)} cu yd)` },
        ];

        selected.components.forEach((comp, i) => {
          const vol = cubicFeet * selected.ratios[i];
          details.push({ label: comp, value: `${formatNumber(vol, 1)} cu ft (${formatNumber(vol / 27, 2)} cu yd)` });
        });

        details.push({ label: "Bags needed (1.5 cu ft bags)", value: `${Math.ceil(cubicFeet / 1.5)}` });
        details.push({ label: "Estimated cost", value: `$${formatNumber(totalCost, 0)}` });

        return {
          primary: { label: "Soil Needed", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          details,
          note: "Soil will settle 10-20% over the first few months. Consider overfilling by 10-15% to account for settling.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular/Round Bed",
      description: "Calculate soil for round or circular raised beds",
      fields: [
        { name: "diameter", label: "Bed Diameter (ft)", type: "number", placeholder: "e.g. 6" },
        { name: "depth", label: "Bed Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const depth = inputs.depth as number;
        if (!diameter || !depth) return null;

        const radius = diameter / 2;
        const areaSqFt = Math.PI * radius * radius;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const bags = Math.ceil(cubicFeet / 1.5);

        return {
          primary: { label: "Soil Needed", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          details: [
            { label: "Bed area", value: `${formatNumber(areaSqFt, 1)} sq ft` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "1.5 cu ft bags needed", value: `${bags}` },
            { label: "Weight (approx)", value: `${formatNumber(cubicFeet * 40, 0)} lbs` },
          ],
          note: "Circular beds are great for herb spirals and focal point gardens. Use a string and stake to mark a perfect circle.",
        };
      },
    },
    {
      id: "multiple",
      name: "Multiple Beds",
      description: "Calculate total soil for several raised beds",
      fields: [
        { name: "numBeds", label: "Number of Beds", type: "number", placeholder: "e.g. 4", min: 1, max: 20 },
        { name: "length", label: "Each Bed Length (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Each Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Each Bed Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const num = inputs.numBeds as number;
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        if (!num || !length || !width || !depth) return null;

        const cubicFeetEach = length * width * (depth / 12);
        const totalCubicFeet = cubicFeetEach * num;
        const totalCubicYards = totalCubicFeet / 27;
        const totalArea = length * width * num;
        const bulkCost = totalCubicYards * 40;
        const bagCost = Math.ceil(totalCubicFeet / 1.5) * 8;

        return {
          primary: { label: "Total Soil Needed", value: `${formatNumber(totalCubicYards, 2)} cubic yards` },
          details: [
            { label: "Soil per bed", value: `${formatNumber(cubicFeetEach, 1)} cu ft (${formatNumber(cubicFeetEach / 27, 2)} cu yd)` },
            { label: "Total cubic feet", value: formatNumber(totalCubicFeet, 1) },
            { label: "Total growing area", value: `${formatNumber(totalArea, 0)} sq ft` },
            { label: "Total bags (1.5 cu ft)", value: `${Math.ceil(totalCubicFeet / 1.5)}` },
            { label: "Bulk delivery cost", value: `~$${formatNumber(bulkCost, 0)}` },
            { label: "Bagged cost", value: `~$${formatNumber(bagCost, 0)}` },
          ],
          note: "Bulk delivery is significantly cheaper for 2+ cubic yards. Most delivery trucks require a minimum of 1-2 cubic yards.",
        };
      },
    },
  ],
  relatedSlugs: ["raised-garden-bed-calculator", "topsoil-calculator", "compost-ratio-calculator"],
  faq: [
    { question: "How deep should raised bed soil be?", answer: "Most vegetables need 12 inches of soil depth. Shallow-rooted crops (lettuce, herbs, radishes) need 6-8 inches. Deep-rooted crops (tomatoes, carrots, potatoes) need 12-18 inches. A standard 12-inch depth works for most gardens." },
    { question: "What is the best soil mix for raised beds?", answer: "A proven mix is 50% topsoil, 30% compost, and 20% perlite or vermiculite. For square foot gardening, Mel's Mix (1/3 compost, 1/3 peat moss, 1/3 vermiculite) is popular. Always use multiple compost sources for diverse nutrition." },
    { question: "How much will the soil settle after filling?", answer: "New raised bed soil typically settles 10-20% within the first growing season. Overfill by 10-15% initially and top off with compost each spring. Settled soil is normal and healthy as organic matter decomposes." },
  ],
  formula: "Rectangular: Volume = Length × Width × (Depth/12) cu ft | Circular: Volume = π × r² × (Depth/12) cu ft | Cubic Yards = Cu Ft / 27",
};
