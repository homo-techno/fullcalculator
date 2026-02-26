import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quiltingFabricCalculator: CalculatorDefinition = {
  slug: "quilting-fabric-calculator",
  title: "Quilting Fabric Yardage Calculator",
  description: "Free online quilting fabric yardage calculator. Calculate how much fabric you need for quilt tops, backing, binding, and borders.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["quilting fabric calculator", "quilt yardage calculator", "how much fabric for a quilt", "quilt backing calculator", "quilt binding calculator"],
  variants: [
    {
      id: "quilt-top",
      name: "Quilt Top Fabric",
      description: "Calculate fabric for square/rectangular quilt blocks",
      fields: [
        { name: "quiltWidth", label: "Finished Quilt Width (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "quiltLength", label: "Finished Quilt Length (inches)", type: "number", placeholder: "e.g. 80" },
        { name: "blockSize", label: "Block Size (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "seamAllowance", label: "Seam Allowance (inches)", type: "number", placeholder: "e.g. 0.25", defaultValue: 0.25 },
        { name: "fabricWidth", label: "Fabric Width (inches)", type: "select", options: [
          { label: "44\" (standard quilting cotton)", value: "44" },
          { label: "45\" (standard)", value: "45" },
          { label: "54\" (wider fabric)", value: "54" },
          { label: "60\" (wide fabric)", value: "60" },
        ], defaultValue: "44" },
        { name: "numFabrics", label: "Number of Different Fabrics", type: "number", placeholder: "e.g. 5", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const quiltW = parseFloat(inputs.quiltWidth as string) || 0;
        const quiltL = parseFloat(inputs.quiltLength as string) || 0;
        const blockSize = parseFloat(inputs.blockSize as string) || 0;
        const seam = parseFloat(inputs.seamAllowance as string) || 0.25;
        const fabricWidth = parseFloat(inputs.fabricWidth as string) || 44;
        const numFabrics = parseFloat(inputs.numFabrics as string) || 1;
        if (!quiltW || !quiltL || !blockSize) return null;

        const cutBlockSize = blockSize + seam * 2;
        const blocksAcross = Math.ceil(quiltW / blockSize);
        const blocksDown = Math.ceil(quiltL / blockSize);
        const totalBlocks = blocksAcross * blocksDown;
        const usableFabricWidth = fabricWidth - 1;
        const blocksPerRow = Math.floor(usableFabricWidth / cutBlockSize);
        const rowsNeeded = Math.ceil(totalBlocks / (blocksPerRow * numFabrics));
        const fabricLengthIn = rowsNeeded * cutBlockSize;
        const fabricYards = fabricLengthIn / 36;

        return {
          primary: { label: "Fabric per Color", value: `${formatNumber(Math.ceil(fabricYards * 8) / 8, 3)} yards` },
          details: [
            { label: "Total blocks needed", value: formatNumber(totalBlocks, 0) },
            { label: "Blocks per fabric", value: formatNumber(Math.ceil(totalBlocks / numFabrics), 0) },
            { label: "Cut block size", value: `${formatNumber(cutBlockSize, 2)}" × ${formatNumber(cutBlockSize, 2)}"` },
            { label: "Blocks across × down", value: `${blocksAcross} × ${blocksDown}` },
            { label: "Fabric width used", value: `${fabricWidth}"` },
            { label: "Number of fabrics", value: formatNumber(numFabrics, 0) },
          ],
          note: "Round up to the nearest 1/8 yard when purchasing. Add extra for cutting errors and fabric shrinkage.",
        };
      },
    },
    {
      id: "backing-binding",
      name: "Backing & Binding",
      description: "Calculate fabric for quilt backing and binding",
      fields: [
        { name: "quiltWidth", label: "Finished Quilt Width (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "quiltLength", label: "Finished Quilt Length (inches)", type: "number", placeholder: "e.g. 80" },
        { name: "overhang", label: "Backing Overhang (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "fabricWidth", label: "Backing Fabric Width (inches)", type: "select", options: [
          { label: "44\" (standard)", value: "44" },
          { label: "108\" (wide backing)", value: "108" },
        ], defaultValue: "44" },
        { name: "bindingWidth", label: "Binding Strip Width (inches)", type: "number", placeholder: "e.g. 2.5", defaultValue: 2.5 },
      ],
      calculate: (inputs) => {
        const quiltW = parseFloat(inputs.quiltWidth as string) || 0;
        const quiltL = parseFloat(inputs.quiltLength as string) || 0;
        const overhang = parseFloat(inputs.overhang as string) || 4;
        const fabricWidth = parseFloat(inputs.fabricWidth as string) || 44;
        const bindingWidth = parseFloat(inputs.bindingWidth as string) || 2.5;
        if (!quiltW || !quiltL) return null;

        const backingW = quiltW + overhang * 2;
        const backingL = quiltL + overhang * 2;
        const usableWidth = fabricWidth - 1;

        let backingYards: number;
        if (usableWidth >= backingW) {
          backingYards = backingL / 36;
        } else {
          const panels = Math.ceil(backingW / usableWidth);
          backingYards = (backingL * panels) / 36;
        }

        const perimeter = 2 * (quiltW + quiltL) + 12;
        const stripsFromWidth = Math.floor(usableWidth / bindingWidth);
        const stripsNeeded = Math.ceil(perimeter / usableWidth);
        const bindingFabric = (stripsNeeded * bindingWidth) / 36;

        return {
          primary: { label: "Backing Fabric", value: `${formatNumber(Math.ceil(backingYards * 8) / 8, 3)} yards` },
          details: [
            { label: "Backing dimensions", value: `${formatNumber(backingW)}" × ${formatNumber(backingL)}"` },
            { label: "Binding fabric", value: `${formatNumber(Math.ceil(bindingFabric * 8) / 8, 3)} yards` },
            { label: "Binding perimeter", value: `${formatNumber(perimeter)}" (includes 12" extra)` },
            { label: "Binding strips needed", value: formatNumber(stripsNeeded, 0) },
          ],
          note: "For 44\" fabric, backing may need to be pieced. Wide backing (108\") eliminates seams for most quilts.",
        };
      },
    },
  ],
  relatedSlugs: ["knitting-yarn-calculator", "unit-converter"],
  faq: [
    { question: "How much fabric do I need for a quilt?", answer: "It depends on quilt size, block size, and number of fabrics. A typical twin-size quilt (60\" × 80\") needs about 5-7 yards total for the top, 5 yards for backing (44\" fabric), and 0.5 yards for binding." },
    { question: "What is standard quilting fabric width?", answer: "Standard quilting cotton is 44-45 inches wide. Wide backing fabric is available at 108 inches. Always account for selvage edges (about 0.5\" on each side)." },
    { question: "How much extra fabric should I buy?", answer: "Buy 10-15% extra for cutting errors, shrinkage, and straightening. If using directional prints, add 15-20% for pattern matching." },
  ],
  formula: "Fabric (yards) = (Rows Needed × Cut Block Size) / 36",
};
