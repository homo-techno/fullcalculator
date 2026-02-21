import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mulchDepthCalculator: CalculatorDefinition = {
  slug: "mulch-depth-calculator",
  title: "Mulch Calculator",
  description: "Free mulch calculator. Calculate how much mulch you need in cubic yards and bags based on area and desired depth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mulch calculator", "mulch depth calculator", "how much mulch do I need", "cubic yards of mulch", "mulch coverage calculator"],
  variants: [
    {
      id: "area",
      name: "By Area & Depth",
      description: "Calculate mulch needed for a given area",
      fields: [
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "depth", label: "Mulch Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "mulchType", label: "Mulch Type", type: "select", options: [
          { label: "Hardwood Bark Mulch", value: "hardwood" },
          { label: "Pine Bark Mulch", value: "pine" },
          { label: "Cedar Mulch", value: "cedar" },
          { label: "Rubber Mulch", value: "rubber" },
          { label: "Straw/Hay", value: "straw" },
          { label: "Wood Chips", value: "woodchips" },
          { label: "Cocoa Bean Hulls", value: "cocoa" },
          { label: "River Rock (decorative)", value: "rock" },
        ], defaultValue: "hardwood" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const depth = inputs.depth as number;
        const mulchType = inputs.mulchType as string;
        if (!area || !depth) return null;
        const cubicFeet = area * (depth / 12);
        const cubicYards = cubicFeet / 27;
        // Weight per cubic yard
        const weightMap: Record<string, number> = {
          hardwood: 600, pine: 450, cedar: 500, rubber: 1200,
          straw: 200, woodchips: 500, cocoa: 400, rock: 2400,
        };
        const priceMap: Record<string, number> = {
          hardwood: 35, pine: 30, cedar: 40, rubber: 80,
          straw: 15, woodchips: 25, cocoa: 50, rock: 60,
        };
        const weight = weightMap[mulchType] || 500;
        const pricePerYard = priceMap[mulchType] || 35;
        const totalWeight = cubicYards * weight;
        const bags2cuft = cubicFeet / 2;
        const totalCost = cubicYards * pricePerYard;
        return {
          primary: { label: "Mulch Needed", value: `${formatNumber(cubicYards, 1)} cubic yards` },
          details: [
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "2 cu ft bags needed", value: `${Math.ceil(bags2cuft)}` },
            { label: "Total weight (approx)", value: `${formatNumber(totalWeight, 0)} lbs` },
            { label: "Estimated cost (bulk)", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Coverage at ${depth}\"", value: `${formatNumber(area, 0)} sq ft` },
          ],
          note: "One cubic yard of mulch covers approximately 162 sq ft at 2\" depth, 108 sq ft at 3\" depth, or 81 sq ft at 4\" depth.",
        };
      },
    },
    {
      id: "refresh",
      name: "Refresh Existing Mulch",
      description: "Calculate mulch to refresh an existing layer",
      fields: [
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "currentDepth", label: "Current Mulch Depth (inches)", type: "number", placeholder: "e.g. 1" },
        { name: "desiredDepth", label: "Desired Total Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const current = inputs.currentDepth as number;
        const desired = inputs.desiredDepth as number;
        if (!area || current === undefined || !desired) return null;
        const addDepth = Math.max(0, desired - current);
        if (addDepth <= 0) return {
          primary: { label: "Mulch Needed", value: "0 cubic yards" },
          details: [{ label: "Note", value: "Current depth meets or exceeds desired depth" }],
        };
        const cubicFeet = area * (addDepth / 12);
        const cubicYards = cubicFeet / 27;
        return {
          primary: { label: "Mulch to Add", value: `${formatNumber(cubicYards, 1)} cubic yards` },
          details: [
            { label: "Depth to add", value: `${formatNumber(addDepth, 1)} inches` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "2 cu ft bags", value: `${Math.ceil(cubicFeet / 2)}` },
            { label: "Current depth", value: `${current} inches` },
            { label: "Target depth", value: `${desired} inches` },
          ],
          note: "Mulch decomposes 1-2 inches per year. Refresh annually to maintain a 2-3 inch layer. Avoid exceeding 4 inches total to prevent root suffocation.",
        };
      },
    },
  ],
  relatedSlugs: ["topsoil-calculator", "gravel-calculator", "raised-garden-bed-calculator"],
  faq: [
    { question: "How deep should mulch be?", answer: "Most beds need 2-4 inches of mulch. Use 2-3 inches for fine mulch (shredded bark) and 3-4 inches for coarse mulch (wood chips). Keep mulch 2-3 inches away from tree trunks and plant stems to prevent rot." },
    { question: "How many bags of mulch do I need?", answer: "One cubic yard equals 13.5 bags of 2 cu ft mulch. For example: 500 sq ft at 3\" depth needs about 4.6 cubic yards or 63 bags of 2 cu ft mulch." },
    { question: "When is the best time to apply mulch?", answer: "Apply mulch in mid to late spring after the soil has warmed. Applying too early keeps soil cold and delays plant growth. A fall top-up helps insulate roots for winter." },
  ],
  formula: "Cubic Yards = Area (sq ft) × Depth (in) / 12 / 27 | Bags (2 cu ft) = Area × Depth / 12 / 2",
};
