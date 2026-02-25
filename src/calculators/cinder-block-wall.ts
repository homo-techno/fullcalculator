import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cinderBlockWallCalculator: CalculatorDefinition = {
  slug: "cinder-block-wall-calculator",
  title: "Cinder Block Wall Calculator",
  description: "Free cinder block wall calculator. Estimate how many cinder blocks, mortar bags, and rebar you need for your block wall project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cinder block calculator", "block wall calculator", "CMU calculator", "concrete block wall", "how many cinder blocks do I need"],
  variants: [
    {
      id: "calc",
      name: "Calculate Cinder Block Wall Materials",
      description: "Estimate blocks, mortar, and rebar for a block wall",
      fields: [
        { name: "length", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "height", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "blockSize", label: "Block Size", type: "select", options: [{ label: "8\" x 8\" x 16\" (standard)", value: "standard" }, { label: "4\" x 8\" x 16\" (half)", value: "half" }], defaultValue: "standard" },
        { name: "costPerBlock", label: "Cost per Block (optional)", type: "number", placeholder: "e.g. 1.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        const blockSize = (inputs.blockSize as string) || "standard";
        const costPerBlock = inputs.costPerBlock as number;
        if (!length || !height) return null;

        const wallAreaSqFt = length * height;
        // Standard 8x8x16 block covers 0.89 sq ft (accounting for 3/8" mortar joint)
        // Half 4x8x16 block covers the same face area
        const blocksPerSqFt = 1.125;
        const blocksNeeded = Math.ceil(wallAreaSqFt * blocksPerSqFt);
        const blocksWithWaste = Math.ceil(blocksNeeded * 1.10);

        // Mortar: approximately 1 bag (80 lb) per 30 standard blocks
        const mortarBags = Math.ceil(blocksWithWaste / 30);

        // Rebar: vertical every 4 feet, horizontal every other course
        const verticalRebar = Math.ceil(length / 4) + 1;
        const courses = Math.ceil(height / (8 / 12));
        const horizontalRebar = Math.floor(courses / 2);
        const rebarPieces = verticalRebar + horizontalRebar;

        const details: { label: string; value: string }[] = [
          { label: "Wall Area", value: `${formatNumber(wallAreaSqFt)} sq ft` },
          { label: "Blocks Needed (exact)", value: formatNumber(blocksNeeded) },
          { label: "Blocks with 10% Waste", value: formatNumber(blocksWithWaste) },
          { label: "Mortar Bags (80 lb)", value: formatNumber(mortarBags) },
          { label: "Vertical Rebar Pieces", value: formatNumber(verticalRebar) },
          { label: "Horizontal Rebar Runs", value: formatNumber(horizontalRebar) },
          { label: "Block Size", value: blockSize === "standard" ? "8\" x 8\" x 16\"" : "4\" x 8\" x 16\"" },
        ];

        if (costPerBlock) {
          const blockCost = blocksWithWaste * costPerBlock;
          const mortarCost = mortarBags * 12;
          const totalCost = blockCost + mortarCost;
          details.push({ label: "Block Cost", value: `$${formatNumber(blockCost, 2)}` });
          details.push({ label: "Estimated Mortar Cost", value: `$${formatNumber(mortarCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Cinder Blocks Needed", value: `${formatNumber(blocksWithWaste)} blocks` },
          details,
          note: "Based on standard 8x8x16 CMU blocks with 3/8\" mortar joints. Includes 10% waste factor. Rebar spacing based on typical residential requirements; check local building codes.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "stone-wall-calculator", "mortar-calculator"],
  faq: [
    { question: "How many cinder blocks do I need per square foot?", answer: "You need approximately 1.125 standard 8x8x16 cinder blocks per square foot of wall, which accounts for the 3/8-inch mortar joints between blocks." },
    { question: "How much mortar do I need for a cinder block wall?", answer: "One 80-pound bag of mortar mix will lay approximately 30 standard cinder blocks. For a 100-block wall, plan on about 3-4 bags of mortar." },
    { question: "Do cinder block walls need rebar?", answer: "Yes, most building codes require vertical rebar every 4 feet and horizontal rebar every 2-3 courses. The cells containing rebar must be filled with grout. Always check local codes." },
  ],
  formula: "Blocks = Wall Length (ft) x Wall Height (ft) x 1.125 blocks/sq ft x 1.10 waste factor",
};
