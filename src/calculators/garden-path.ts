import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenPathCalculator: CalculatorDefinition = {
  slug: "garden-path-calculator",
  title: "Garden Path Material Calculator",
  description: "Free garden path material calculator. Calculate how much gravel, stepping stones, pavers, or mulch you need for your garden path.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden path calculator", "path material calculator", "how much gravel for path", "stepping stone calculator", "garden walkway planner"],
  variants: [
    {
      id: "gravel-path",
      name: "Gravel / Mulch Path",
      description: "Calculate gravel or mulch for a garden path",
      fields: [
        { name: "length", label: "Path Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Path Width (feet)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "depth", label: "Material Depth (inches)", type: "select", options: [
          { label: "2 inches (mulch path)", value: "2" },
          { label: "3 inches (standard)", value: "3" },
          { label: "4 inches (gravel path)", value: "4" },
          { label: "6 inches (driveway/heavy traffic)", value: "6" },
        ], defaultValue: "3" },
        { name: "material", label: "Material Type", type: "select", options: [
          { label: "Pea gravel", value: "2600" },
          { label: "Crushed stone", value: "2700" },
          { label: "Decomposed granite", value: "2500" },
          { label: "Wood mulch / bark", value: "800" },
          { label: "River rock", value: "2600" },
        ], defaultValue: "2600" },
        { name: "pricePerYard", label: "Price per Cu Yd (optional)", type: "number", placeholder: "e.g. 45", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = (inputs.width as number) || 3;
        const depth = parseInt(inputs.depth as string) || 3;
        const density = parseInt(inputs.material as string) || 2600;
        const price = inputs.pricePerYard as number;
        if (!length) return null;

        const areaSqFt = length * width;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const tons = (cubicYards * density) / 2000;
        const edgingFt = (length * 2) + (width * 2);

        const details = [
          { label: "Path area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Volume", value: `${formatNumber(cubicYards, 2)} cu yd` },
          { label: "Weight (estimated)", value: `${formatNumber(tons, 2)} tons` },
          { label: "Edging needed", value: `${formatNumber(edgingFt)} linear ft` },
          { label: "Landscape fabric", value: `${formatNumber(areaSqFt)} sq ft` },
        ];
        if (price) {
          details.push({ label: "Material cost", value: `$${formatNumber(cubicYards * price)}` });
        }

        return {
          primary: { label: "Material Needed", value: `${formatNumber(cubicYards, 2)} cu yd` },
          details,
          note: "Lay landscape fabric under gravel to prevent weeds. Install edging to keep material from spreading. Add 10% extra for settling.",
        };
      },
    },
    {
      id: "stepping-stones",
      name: "Stepping Stones / Pavers",
      description: "Calculate stepping stones or pavers for a path",
      fields: [
        { name: "pathLength", label: "Path Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "pathWidth", label: "Path Width (feet)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "stoneType", label: "Stone / Paver Type", type: "select", options: [
          { label: "12\" × 12\" stepping stones", value: "12-12" },
          { label: "16\" × 16\" stepping stones", value: "16-16" },
          { label: "18\" round stepping stones", value: "18-18" },
          { label: "4\" × 8\" brick pavers", value: "4-8" },
          { label: "6\" × 6\" pavers", value: "6-6" },
          { label: "12\" × 24\" flagstone", value: "12-24" },
        ], defaultValue: "16-16" },
        { name: "layout", label: "Layout Style", type: "select", options: [
          { label: "Full coverage (solid path)", value: "full" },
          { label: "Stepping stones (spaced)", value: "spaced" },
        ], defaultValue: "full" },
      ],
      calculate: (inputs) => {
        const pathLength = inputs.pathLength as number;
        const pathWidth = (inputs.pathWidth as number) || 3;
        const stoneType = inputs.stoneType as string;
        const layout = inputs.layout as string;
        if (!pathLength) return null;

        const [w, h] = stoneType.split("-").map(Number);
        const stoneSqFt = (w * h) / 144;
        const pathArea = pathLength * pathWidth;

        let stonesNeeded: number;
        if (layout === "full") {
          stonesNeeded = Math.ceil(pathArea / stoneSqFt * 1.1);
        } else {
          const stepsPerFoot = 0.5;
          const stepsInLength = Math.ceil(pathLength * stepsPerFoot);
          const stepsAcross = Math.max(1, Math.floor((pathWidth * 12) / w));
          stonesNeeded = stepsInLength * stepsAcross;
        }

        const sandBase = (pathArea * 2) / (12 * 27);

        return {
          primary: { label: "Stones / Pavers Needed", value: `${stonesNeeded}` },
          details: [
            { label: "Stone size", value: `${w}\" \u00D7 ${h}\"` },
            { label: "Path area", value: `${formatNumber(pathArea)} sq ft` },
            { label: "Layout style", value: layout === "full" ? "Solid coverage" : "Spaced stepping stones" },
            { label: "Sand base (2\" deep)", value: `${formatNumber(sandBase, 2)} cu yd` },
          ],
          note: layout === "full"
            ? "Includes 10% extra for cuts and waste. Compact a gravel base before laying sand and pavers."
            : "Space stepping stones about 24 inches center-to-center for comfortable walking.",
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "square-footage-calculator", "concrete-calculator"],
  faq: [
    { question: "How wide should a garden path be?", answer: "Main paths should be 3-4 feet wide (comfortable for two people). Secondary paths can be 2-3 feet. Utility paths to sheds or bins should be at least 3 feet wide for wheelbarrow access." },
    { question: "How deep should gravel be for a garden path?", answer: "For foot traffic: 2-3 inches of gravel over landscape fabric. For wheelbarrow use: 3-4 inches. Always use a compacted gravel base under decorative gravel for stability." },
  ],
  formula: "Gravel (cu yd) = L \u00D7 W \u00D7 (Depth/12) / 27 | Stones = Path Area / Stone Area",
};
