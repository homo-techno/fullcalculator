import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quiltSizeCalculator: CalculatorDefinition = {
  slug: "quilt-size-calculator",
  title: "Quilt Size Calculator",
  description: "Free quilt size calculator. Calculate quilt dimensions, block count, and fabric needed for quilting projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["quilt size calculator", "quilt dimensions", "quilt block calculator", "quilting fabric calculator", "quilt yardage"],
  variants: [
    {
      id: "bed-quilt",
      name: "Bed Quilt Size",
      description: "Calculate quilt dimensions based on bed size and desired overhang",
      fields: [
        { name: "bedSize", label: "Bed Size", type: "select", options: [
          { label: "Crib (28 x 52 in)", value: "crib" },
          { label: "Twin (39 x 75 in)", value: "twin" },
          { label: "Full / Double (54 x 75 in)", value: "full" },
          { label: "Queen (60 x 80 in)", value: "queen" },
          { label: "King (76 x 80 in)", value: "king" },
          { label: "Cal King (72 x 84 in)", value: "calking" },
        ], defaultValue: "queen" },
        { name: "dropStyle", label: "Quilt Drop / Overhang", type: "select", options: [
          { label: "Coverlet (10-12 in drop)", value: "coverlet" },
          { label: "Bedspread (12-16 in drop)", value: "bedspread" },
          { label: "Floor length (18-21 in drop)", value: "floor" },
        ], defaultValue: "bedspread" },
        { name: "pillowTuck", label: "Pillow Tuck", type: "select", options: [
          { label: "No pillow tuck", value: "0" },
          { label: "Standard pillow tuck (+10 in)", value: "10" },
          { label: "Large pillow tuck (+15 in)", value: "15" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const bedSize = inputs.bedSize as string;
        const dropStyle = inputs.dropStyle as string;
        const pillowTuck = parseInt(inputs.pillowTuck as string);

        const bedDimensions: Record<string, [number, number]> = {
          crib: [28, 52],
          twin: [39, 75],
          full: [54, 75],
          queen: [60, 80],
          king: [76, 80],
          calking: [72, 84],
        };

        const dropAmounts: Record<string, number> = {
          coverlet: 11,
          bedspread: 14,
          floor: 20,
        };

        const [bedW, bedL] = bedDimensions[bedSize] || [60, 80];
        const drop = dropAmounts[dropStyle] || 14;

        const quiltWidth = bedW + (drop * 2);
        const quiltLength = bedL + drop + pillowTuck;

        // Fabric estimation (backing)
        const backingYards = (quiltWidth * quiltLength) / (36 * 42) * 1.1; // 42" usable width, 10% extra

        // Batting size
        const battingWidth = quiltWidth + 8;
        const battingLength = quiltLength + 8;

        // Binding
        const perimeter = (quiltWidth + quiltLength) * 2 + 20; // extra for corners and joining
        const bindingStrips = Math.ceil(perimeter / 42); // 42" usable width
        const bindingYards = (bindingStrips * 2.5) / 36; // 2.5" strips

        return {
          primary: { label: "Quilt Size", value: `${quiltWidth} x ${quiltLength} inches` },
          details: [
            { label: "Bed Size", value: `${bedW} x ${bedL} in` },
            { label: "Drop/Overhang", value: `${drop} inches per side` },
            { label: "Pillow Tuck", value: pillowTuck > 0 ? `${pillowTuck} inches` : "None" },
            { label: "Backing Fabric", value: `~${formatNumber(backingYards, 1)} yards` },
            { label: "Batting Size", value: `${battingWidth} x ${battingLength} in (minimum)` },
            { label: "Binding Fabric", value: `~${formatNumber(bindingYards, 1)} yards` },
          ],
          note: "Buy batting and backing 4 inches larger than the quilt top on each side. Binding is typically cut at 2.5 inches wide for double-fold binding.",
        };
      },
    },
    {
      id: "block-layout",
      name: "Block Layout",
      description: "Calculate how many blocks you need and their arrangement",
      fields: [
        { name: "quiltWidth", label: "Desired Quilt Width", type: "number", placeholder: "e.g. 80", suffix: "in", step: 1 },
        { name: "quiltLength", label: "Desired Quilt Length", type: "number", placeholder: "e.g. 90", suffix: "in", step: 1 },
        { name: "blockSize", label: "Finished Block Size", type: "select", options: [
          { label: "6 inches", value: "6" },
          { label: "8 inches", value: "8" },
          { label: "10 inches", value: "10" },
          { label: "12 inches (most common)", value: "12" },
          { label: "14 inches", value: "14" },
          { label: "16 inches", value: "16" },
        ], defaultValue: "12" },
        { name: "sashing", label: "Sashing Width", type: "select", options: [
          { label: "No sashing", value: "0" },
          { label: "1 inch sashing", value: "1" },
          { label: "2 inch sashing", value: "2" },
          { label: "3 inch sashing", value: "3" },
        ], defaultValue: "0" },
        { name: "borderWidth", label: "Border Width", type: "select", options: [
          { label: "No border", value: "0" },
          { label: "2 inch border", value: "2" },
          { label: "4 inch border", value: "4" },
          { label: "6 inch border", value: "6" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const quiltWidth = inputs.quiltWidth as number;
        const quiltLength = inputs.quiltLength as number;
        const blockSize = parseInt(inputs.blockSize as string);
        const sashing = parseInt(inputs.sashing as string);
        const borderWidth = parseInt(inputs.borderWidth as string);
        if (!quiltWidth || !quiltLength) return null;

        // Available space for blocks (subtract borders)
        const availableWidth = quiltWidth - (borderWidth * 2);
        const availableLength = quiltLength - (borderWidth * 2);

        // Calculate blocks needed
        const effectiveBlockSize = blockSize + sashing;
        const blocksAcross = Math.floor((availableWidth + sashing) / effectiveBlockSize);
        const blocksDown = Math.floor((availableLength + sashing) / effectiveBlockSize);
        const totalBlocks = blocksAcross * blocksDown;

        // Actual quilt center dimensions
        const centerWidth = (blocksAcross * effectiveBlockSize) - sashing;
        const centerLength = (blocksDown * effectiveBlockSize) - sashing;
        const actualWidth = centerWidth + (borderWidth * 2);
        const actualLength = centerLength + (borderWidth * 2);

        // Unfinished block size (add seam allowances)
        const unfBlockSize = blockSize + 0.5; // 1/4" seam on each side

        return {
          primary: { label: "Blocks Needed", value: `${totalBlocks} blocks` },
          details: [
            { label: "Layout", value: `${blocksAcross} across × ${blocksDown} down` },
            { label: "Finished Block Size", value: `${blockSize} inches` },
            { label: "Cut Block Size", value: `${formatNumber(unfBlockSize, 1)} inches (with seams)` },
            { label: "Actual Quilt Size", value: `${actualWidth} × ${actualLength} inches` },
            { label: "Border", value: borderWidth > 0 ? `${borderWidth} inches each side` : "None" },
            { label: "Sashing", value: sashing > 0 ? `${sashing} inches between blocks` : "None" },
          ],
          note: "Cut blocks 1/2 inch larger than finished size for 1/4 inch seam allowance on each side. Press all seams to the darker fabric.",
        };
      },
    },
  ],
  relatedSlugs: ["fabric-yardage-calculator", "thread-calculator", "pillow-size-calculator"],
  faq: [
    { question: "What size should I make my quilt?", answer: "Standard quilt sizes: Crib (36x52), Throw (50x65), Twin (70x90), Full (85x90), Queen (90x100), King (108x100). Add for pillow tuck and desired drop. These include typical overhang." },
    { question: "How many quilt blocks do I need?", answer: "Divide your desired dimensions (minus borders) by your block size. A queen quilt with 12-inch blocks and 4-inch borders needs about 6x7 = 42 blocks. Add sashing between blocks if desired." },
    { question: "How much backing fabric do I need?", answer: "For quilts over 40 inches wide, you will need to piece the backing. Calculate: (quilt length + 8 inches) × number of widths needed. For a queen quilt, you typically need about 8 yards of 44-inch fabric for backing." },
  ],
  formula: "Quilt width = Bed width + (2 × Drop) | Quilt length = Bed length + Drop + Pillow tuck | Blocks = (Available width / Block size) × (Available length / Block size)",
};
