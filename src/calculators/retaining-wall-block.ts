import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retainingWallBlockCalculator: CalculatorDefinition = {
  slug: "retaining-wall-block-calculator",
  title: "Retaining Wall Block Calculator",
  description: "Free retaining wall block calculator. Calculate the number of blocks, courses, and base materials needed for segmental retaining walls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["retaining wall block calculator", "retaining wall blocks needed", "block wall calculator", "segmental retaining wall", "landscape block calculator"],
  variants: [
    {
      id: "block-count",
      name: "Retaining Wall Block Count",
      description: "Calculate blocks needed for your retaining wall",
      fields: [
        { name: "wallLength", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "blockSize", label: "Block Size", type: "select", options: [
          { label: "Standard (12\"L × 4\"H × 8\"D)", value: "12-4" },
          { label: "Medium (16\"L × 6\"H × 12\"D)", value: "16-6" },
          { label: "Large (18\"L × 6\"H × 12\"D)", value: "18-6" },
          { label: "Extra Large (18\"L × 8\"H × 12\"D)", value: "18-8" },
        ], defaultValue: "16-6" },
        { name: "capBlocks", label: "Include Cap Blocks?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], defaultValue: "yes" },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const wallHeight = inputs.wallHeight as number;
        const blockSize = inputs.blockSize as string;
        const capBlocks = inputs.capBlocks as string;
        if (!wallLength || !wallHeight) return null;

        let blockLengthIn: number;
        let blockHeightIn: number;
        let blockDepthIn: number;
        let blockWeight: number;

        switch (blockSize) {
          case "12-4":
            blockLengthIn = 12; blockHeightIn = 4; blockDepthIn = 8; blockWeight = 25; break;
          case "16-6":
            blockLengthIn = 16; blockHeightIn = 6; blockDepthIn = 12; blockWeight = 40; break;
          case "18-6":
            blockLengthIn = 18; blockHeightIn = 6; blockDepthIn = 12; blockWeight = 50; break;
          case "18-8":
            blockLengthIn = 18; blockHeightIn = 8; blockDepthIn = 12; blockWeight = 65; break;
          default:
            blockLengthIn = 16; blockHeightIn = 6; blockDepthIn = 12; blockWeight = 40;
        }

        const wallLengthIn = wallLength * 12;
        const wallHeightIn = wallHeight * 12;

        const blocksPerRow = Math.ceil(wallLengthIn / blockLengthIn);
        const courses = Math.ceil(wallHeightIn / blockHeightIn);
        const totalBlocks = blocksPerRow * courses;

        const capBlockCount = capBlocks === "yes" ? blocksPerRow : 0;
        const totalBlocksWithCaps = totalBlocks + capBlockCount;
        const totalBlocksWithWaste = Math.ceil(totalBlocksWithCaps * 1.05); // 5% waste

        const totalWeight = totalBlocksWithWaste * blockWeight;

        // Base material: 6" deep gravel, 6" wider than block on each side
        const baseWidthFt = (blockDepthIn + 12) / 12;
        const baseGravelCuFt = wallLength * baseWidthFt * 0.5; // 6" deep
        const baseGravelCuYd = baseGravelCuFt / 27;

        // Backfill gravel (behind wall, 12" wide × wall height)
        const backfillCuFt = wallLength * 1 * wallHeight;
        const backfillCuYd = backfillCuFt / 27;

        return {
          primary: { label: "Blocks Needed", value: `${totalBlocksWithWaste} blocks` },
          details: [
            { label: "Blocks per row", value: `${blocksPerRow}` },
            { label: "Number of courses", value: `${courses}` },
            { label: "Wall blocks", value: `${totalBlocks}` },
            { label: "Cap blocks", value: capBlockCount > 0 ? `${capBlockCount}` : "None" },
            { label: "Total (with 5% waste)", value: `${totalBlocksWithWaste}` },
            { label: "Total weight", value: `${formatNumber(totalWeight, 0)} lbs (${formatNumber(totalWeight / 2000, 1)} tons)` },
            { label: "Base gravel (compacted)", value: `${formatNumber(baseGravelCuYd, 2)} cu yd` },
            { label: "Backfill gravel", value: `${formatNumber(backfillCuYd, 2)} cu yd` },
          ],
          note: "First course must be buried 1\" per 8\" of wall height. Compact gravel base in 2\" lifts. Use geogrid reinforcement for walls over 3-4 feet tall. Check local codes for wall height limits without an engineer.",
        };
      },
    },
    {
      id: "block-cost",
      name: "Retaining Wall Cost Estimate",
      description: "Estimate total cost for a retaining wall block project",
      fields: [
        { name: "wallLength", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "blockType", label: "Block Style", type: "select", options: [
          { label: "Basic / Builder Grade ($2-$5/block)", value: "basic" },
          { label: "Textured / Split Face ($4-$8/block)", value: "textured" },
          { label: "Premium / Natural Stone Look ($8-$15/block)", value: "premium" },
        ], defaultValue: "textured" },
        { name: "installation", label: "Installation", type: "select", options: [
          { label: "DIY", value: "0" },
          { label: "Professional ($20-$35/sq ft of wall face)", value: "25" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const wallLength = inputs.wallLength as number;
        const wallHeight = inputs.wallHeight as number;
        const blockType = inputs.blockType as string;
        const installCost = parseInt(inputs.installation as string) || 0;
        if (!wallLength || !wallHeight) return null;

        const wallFaceSqFt = wallLength * wallHeight;
        const blocksEstimate = Math.ceil(wallFaceSqFt * 1.5); // ~1.5 standard blocks per sq ft

        let blockCost: number;
        switch (blockType) {
          case "basic": blockCost = 3.5; break;
          case "textured": blockCost = 6; break;
          case "premium": blockCost = 11; break;
          default: blockCost = 6;
        }

        const materialBlockCost = blocksEstimate * blockCost;
        const gravelCost = (wallLength * wallHeight * 0.15) * 45; // Approximate cu yd × $45
        const geogridCost = wallHeight > 3 ? wallLength * wallHeight * 2 : 0;
        const capCost = Math.ceil(wallLength * 0.75) * (blockCost * 1.5);
        const laborCost = installCost * wallFaceSqFt;

        const totalCost = materialBlockCost + gravelCost + geogridCost + capCost + laborCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Block cost", value: `$${formatNumber(materialBlockCost, 0)}` },
            { label: "Cap blocks", value: `$${formatNumber(capCost, 0)}` },
            { label: "Gravel (base + backfill)", value: `$${formatNumber(gravelCost, 0)}` },
            { label: "Geogrid reinforcement", value: geogridCost > 0 ? `$${formatNumber(geogridCost, 0)}` : "Not needed (wall ≤3')"},
            { label: "Installation labor", value: laborCost > 0 ? `$${formatNumber(laborCost, 0)}` : "DIY" },
            { label: "Wall face area", value: `${formatNumber(wallFaceSqFt, 0)} sq ft` },
            { label: "Cost per sq ft of wall face", value: `$${formatNumber(totalCost / wallFaceSqFt, 2)}` },
          ],
          note: "Walls over 4 feet typically require engineering, permits, and geogrid reinforcement. DIY-friendly for walls under 3 feet. Always ensure proper drainage behind the wall.",
        };
      },
    },
  ],
  relatedSlugs: ["retaining-wall-calculator", "gravel-calculator", "concrete-block-calculator"],
  faq: [
    { question: "How many retaining wall blocks do I need?", answer: "Divide wall length by block length to get blocks per row. Divide wall height by block height to get number of courses. Multiply together and add 5-10% for waste and cuts. Example: 30 ft wall × 3 ft tall with 16\" × 6\" blocks = 23 blocks/row × 6 courses = 138 blocks + 5% = 145 blocks." },
    { question: "How tall can a retaining wall be without an engineer?", answer: "Most building codes allow 3-4 feet without an engineer or permit. Walls over 4 feet typically require a structural engineer, permits, and geogrid reinforcement. Some jurisdictions have stricter limits. Always check with your local building department." },
  ],
  formula: "Blocks Per Row = Wall Length / Block Length | Courses = Wall Height / Block Height | Total = Rows × Courses × 1.05 | Base Gravel = Length × (Block Depth + 12\") / 12 × 0.5'",
};
