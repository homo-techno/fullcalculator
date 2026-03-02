import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quiltFabricCalculator: CalculatorDefinition = {
  slug: "quilt-fabric-calculator",
  title: "Quilt Fabric Calculator",
  description: "Estimate total fabric yardage needed for quilt tops, backing, and binding based on quilt dimensions and block size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["quilt fabric","quilting yardage","quilt calculator","patchwork fabric"],
  variants: [{
    id: "standard",
    name: "Quilt Fabric",
    description: "Estimate total fabric yardage needed for quilt tops, backing, and binding based on quilt dimensions and block size.",
    fields: [
      { name: "quiltWidth", label: "Quilt Width (inches)", type: "number", min: 20, max: 120, defaultValue: 60 },
      { name: "quiltLength", label: "Quilt Length (inches)", type: "number", min: 20, max: 120, defaultValue: 80 },
      { name: "blockSize", label: "Block Size (inches)", type: "number", min: 4, max: 24, defaultValue: 12 },
      { name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", min: 0.25, max: 1, defaultValue: 0.25 },
      { name: "fabricWidth", label: "Fabric Width (inches)", type: "number", min: 36, max: 60, defaultValue: 44 },
    ],
    calculate: (inputs) => {
    const quiltWidth = inputs.quiltWidth as number;
    const quiltLength = inputs.quiltLength as number;
    const blockSize = inputs.blockSize as number;
    const seam = inputs.seamAllowance as number;
    const fabricWidth = inputs.fabricWidth as number;
    const cutBlock = blockSize + seam * 2;
    const blocksAcross = Math.ceil(quiltWidth / blockSize);
    const blocksDown = Math.ceil(quiltLength / blockSize);
    const totalBlocks = blocksAcross * blocksDown;
    const blocksPerRow = Math.floor(fabricWidth / cutBlock);
    const rowsNeeded = Math.ceil(totalBlocks / blocksPerRow);
    const topYardage = Math.ceil((rowsNeeded * cutBlock) / 36 * 10) / 10;
    const backingYardage = Math.ceil((quiltLength + 8) / 36 * (Math.ceil((quiltWidth + 8) / fabricWidth)) * 10) / 10;
    const bindingYardage = Math.ceil(((quiltWidth + quiltLength) * 2 + 20) / (fabricWidth * 6) * 36) / 36;
    const bindingRounded = Math.ceil(bindingYardage * 10) / 10;
    return {
      primary: { label: "Top Fabric Needed", value: formatNumber(topYardage) + " yards" },
      details: [
        { label: "Total Blocks", value: formatNumber(totalBlocks) },
        { label: "Backing Fabric", value: formatNumber(backingYardage) + " yards" },
        { label: "Binding Fabric", value: formatNumber(bindingRounded) + " yards" },
        { label: "Blocks Per Fabric Row", value: formatNumber(blocksPerRow) }
      ]
    };
  },
  }],
  relatedSlugs: ["fabric-yardage-calculator","yarn-yardage-calculator"],
  faq: [
    { question: "How do I calculate fabric for a quilt?", answer: "Determine the number of blocks, account for seam allowances, then calculate how many blocks fit across your fabric width to find how many rows you need to cut." },
    { question: "How much extra fabric should I buy for quilting?", answer: "Buy 10 to 20 percent extra to account for cutting mistakes, shrinkage, and fabric defects. Pre-wash cotton fabrics as they can shrink up to 5 percent." },
    { question: "What is a standard quilt seam allowance?", answer: "The standard quilting seam allowance is one quarter inch. This is smaller than garment sewing which typically uses five eighths of an inch." },
  ],
  formula: "Top Fabric = (Rows Needed x Cut Block Size) / 36 yards
Backing = (Quilt Length + 8) / 36 x Widths Needed
Binding = Perimeter / (Fabric Width x 6 strips per yard)",
};
