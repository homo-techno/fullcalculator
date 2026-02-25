import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treeMulchRingCalculator: CalculatorDefinition = {
  slug: "tree-mulch-ring-calculator",
  title: "Tree Mulch Ring Calculator",
  description: "Free tree mulch ring calculator. Calculate the amount of mulch needed for tree rings based on tree size, ring diameter, and desired mulch depth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tree mulch ring", "mulch around tree calculator", "tree mulch calculator", "how much mulch around tree", "tree ring mulch"],
  variants: [
    {
      id: "single-tree",
      name: "Single Tree Mulch Ring",
      description: "Calculate mulch for a single tree ring",
      fields: [
        { name: "outerDiameter", label: "Ring Outer Diameter (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "trunkDiameter", label: "Trunk Diameter (inches)", type: "number", placeholder: "e.g. 8", defaultValue: 6 },
        { name: "mulchDepth", label: "Mulch Depth (inches)", type: "select", options: [
          { label: "2 inches (minimum)", value: "2" },
          { label: "3 inches (recommended)", value: "3" },
          { label: "4 inches (maximum)", value: "4" },
        ], defaultValue: "3" },
        { name: "mulchType", label: "Mulch Type", type: "select", options: [
          { label: "Shredded hardwood", value: "shredded" },
          { label: "Wood chips", value: "chips" },
          { label: "Pine bark", value: "pine" },
          { label: "Cedar mulch", value: "cedar" },
        ], defaultValue: "shredded" },
      ],
      calculate: (inputs) => {
        const outerDiam = inputs.outerDiameter as number;
        const trunkDiam = (inputs.trunkDiameter as number) || 6;
        const depth = parseInt(inputs.mulchDepth as string) || 3;
        if (!outerDiam) return null;

        const outerRadius = outerDiam / 2;
        const innerRadius = (trunkDiam / 12) / 2 + 0.25;
        const ringArea = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
        const cubicFeet = ringArea * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const bags2cuft = Math.ceil(cubicFeet / 2);

        return {
          primary: { label: "Mulch Needed", value: `${formatNumber(cubicYards, 2)} cu yd` },
          details: [
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet, 1) },
            { label: "2 cu ft bags needed", value: `${bags2cuft}` },
            { label: "Ring area", value: `${formatNumber(ringArea, 1)} sq ft` },
            { label: "Mulch depth", value: `${depth} inches` },
            { label: "Keep mulch away from trunk", value: "3-6 inches clearance" },
          ],
          note: "Never pile mulch against the trunk (\"volcano mulching\"). Leave 3-6 inches of space around the trunk to prevent rot.",
        };
      },
    },
    {
      id: "multiple-trees",
      name: "Multiple Trees",
      description: "Calculate total mulch for several trees",
      fields: [
        { name: "trees", label: "Number of Trees", type: "number", placeholder: "e.g. 5" },
        { name: "outerDiameter", label: "Average Ring Diameter (feet)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "mulchDepth", label: "Mulch Depth (inches)", type: "select", options: [
          { label: "2 inches", value: "2" },
          { label: "3 inches", value: "3" },
          { label: "4 inches", value: "4" },
        ], defaultValue: "3" },
        { name: "pricePerYard", label: "Price per Cu Yd (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const trees = inputs.trees as number;
        const outerDiam = (inputs.outerDiameter as number) || 6;
        const depth = parseInt(inputs.mulchDepth as string) || 3;
        const price = inputs.pricePerYard as number;
        if (!trees) return null;

        const outerRadius = outerDiam / 2;
        const innerRadius = 0.5;
        const ringArea = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
        const totalArea = ringArea * trees;
        const totalCuFt = totalArea * (depth / 12);
        const totalCuYd = totalCuFt / 27;

        const details = [
          { label: "Total area", value: `${formatNumber(totalArea, 1)} sq ft` },
          { label: "Total volume", value: `${formatNumber(totalCuFt, 1)} cu ft` },
          { label: "Per tree", value: `${formatNumber(totalCuYd / trees, 2)} cu yd` },
          { label: "2 cu ft bags needed", value: `${Math.ceil(totalCuFt / 2)}` },
        ];
        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(totalCuYd * price)}` });
        }

        return {
          primary: { label: "Total Mulch Needed", value: `${formatNumber(totalCuYd, 2)} cu yd` },
          details,
          note: "Bulk mulch is usually cheaper than bagged. Most suppliers deliver for orders over 2-3 cubic yards.",
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "soil-volume-calculator", "flower-bed-calculator"],
  faq: [
    { question: "How wide should a mulch ring be around a tree?", answer: "The mulch ring should extend at least 3-6 feet from the trunk for young trees, ideally to the drip line. A wider ring reduces mower damage and competition from grass." },
    { question: "How deep should mulch be around trees?", answer: "Apply 2-4 inches of mulch, keeping it 3-6 inches away from the trunk. Do not pile mulch against the trunk as this promotes disease and pest problems." },
  ],
  formula: "Mulch (cu yd) = π × (R² - r²) × Depth / 324",
};
