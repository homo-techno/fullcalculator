import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retainingWallCalculator: CalculatorDefinition = {
  slug: "retaining-wall-calculator",
  title: "Retaining Wall Calculator",
  description:
    "Free retaining wall calculator. Estimate blocks, base gravel, and drainage stone needed for your wall.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["retaining wall", "blocks", "landscaping", "gravel", "drainage"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Wall Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "height",
          label: "Wall Height (feet)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "blockSize",
          label: "Block Size",
          type: "select",
          options: [
            { label: '12" × 4" (standard)', value: "12x4" },
            { label: '16" × 6" (large)', value: "16x6" },
            { label: '18" × 6" (extra large)', value: "18x6" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        const blockSize = inputs.blockSize as string;
        if (!length || !height || !blockSize) return null;

        const blockDimensions: Record<string, { widthIn: number; heightIn: number }> = {
          "12x4": { widthIn: 12, heightIn: 4 },
          "16x6": { widthIn: 16, heightIn: 6 },
          "18x6": { widthIn: 18, heightIn: 6 },
        };

        const block = blockDimensions[blockSize];
        const lengthInches = length * 12;
        const heightInches = height * 12;

        const blocksPerRow = Math.ceil(lengthInches / block.widthIn);
        const rows = Math.ceil(heightInches / block.heightIn);
        const totalBlocks = blocksPerRow * rows;

        // Base gravel: 6" deep × 2ft wide trench
        const baseGravelCuFt = length * 2 * 0.5;
        const baseGravelCuYd = baseGravelCuFt / 27;

        // Drainage stone: behind wall, 1ft wide × wall height
        const drainageCuFt = length * 1 * height;
        const drainageCuYd = drainageCuFt / 27;

        return {
          primary: {
            label: "Blocks Needed",
            value: formatNumber(totalBlocks, 0),
          },
          details: [
            { label: "Wall Face Area", value: formatNumber(length * height, 1) + " sq ft" },
            { label: "Blocks per Row", value: String(blocksPerRow) },
            { label: "Number of Rows", value: String(rows) },
            { label: "Base Gravel", value: formatNumber(baseGravelCuYd, 2) + " cu yd" },
            { label: "Drainage Stone", value: formatNumber(drainageCuYd, 2) + " cu yd" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["brick-calculator", "gravel-calculator"],
  faq: [
    {
      question: "How deep should the base be for a retaining wall?",
      answer:
        "Dig a trench about 6 inches deep and twice the width of the blocks. Fill with compacted gravel for a stable base.",
    },
    {
      question: "Do I need drainage behind a retaining wall?",
      answer:
        "Yes. Place drainage gravel and a perforated drain pipe behind the wall to prevent water pressure buildup.",
    },
  ],
  formula:
    "Blocks = (Length ÷ Block Width) × (Height ÷ Block Height). Base Gravel = Length × 2' × 0.5'. Drainage = Length × 1' × Height.",
};
