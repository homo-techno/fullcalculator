import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crossStitchCalculator: CalculatorDefinition = {
  slug: "cross-stitch-calculator",
  title: "Cross Stitch Calculator",
  description: "Free cross stitch calculator. Calculate fabric size, thread/floss amount, and stitch count for cross stitch projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cross stitch calculator", "cross stitch fabric calculator", "aida cloth calculator", "embroidery floss calculator", "stitch count calculator"],
  variants: [
    {
      id: "fabric-size",
      name: "Fabric Size",
      description: "Calculate how much fabric you need for a cross stitch pattern",
      fields: [
        { name: "stitchWidth", label: "Pattern Width (stitches)", type: "number", placeholder: "e.g. 150", min: 1, step: 1 },
        { name: "stitchHeight", label: "Pattern Height (stitches)", type: "number", placeholder: "e.g. 200", min: 1, step: 1 },
        { name: "fabricCount", label: "Fabric Count", type: "select", options: [
          { label: "11 count Aida", value: "11" },
          { label: "14 count Aida (most popular)", value: "14" },
          { label: "16 count Aida", value: "16" },
          { label: "18 count Aida", value: "18" },
          { label: "22 count Hardanger", value: "22" },
          { label: "25 count evenweave (over 2)", value: "12.5" },
          { label: "28 count evenweave (over 2)", value: "14" },
          { label: "32 count linen (over 2)", value: "16" },
        ], defaultValue: "14" },
        { name: "margin", label: "Border Margin", type: "select", options: [
          { label: "2 inches each side", value: "2" },
          { label: "3 inches each side (standard)", value: "3" },
          { label: "4 inches each side", value: "4" },
          { label: "5 inches each side", value: "5" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const stitchWidth = inputs.stitchWidth as number;
        const stitchHeight = inputs.stitchHeight as number;
        const fabricCount = parseFloat(inputs.fabricCount as string);
        const margin = parseInt(inputs.margin as string);
        if (!stitchWidth || !stitchHeight) return null;

        const designWidth = stitchWidth / fabricCount;
        const designHeight = stitchHeight / fabricCount;
        const fabricWidth = designWidth + (margin * 2);
        const fabricHeight = designHeight + (margin * 2);
        const totalStitches = stitchWidth * stitchHeight;

        // Fabric in metric
        const fabricWidthCm = fabricWidth * 2.54;
        const fabricHeightCm = fabricHeight * 2.54;

        return {
          primary: { label: "Fabric Size Needed", value: `${formatNumber(fabricWidth, 1)} × ${formatNumber(fabricHeight, 1)}`, suffix: "inches" },
          details: [
            { label: "Design Size", value: `${formatNumber(designWidth, 1)} × ${formatNumber(designHeight, 1)} in` },
            { label: "In Centimeters", value: `${formatNumber(fabricWidthCm, 1)} × ${formatNumber(fabricHeightCm, 1)} cm` },
            { label: "Total Stitches", value: formatNumber(totalStitches, 0) },
            { label: "Fabric Count", value: `${fabricCount} count` },
            { label: "Margin", value: `${margin} inches each side` },
            { label: "Stitch Dimensions", value: `${stitchWidth} W × ${stitchHeight} H` },
          ],
          note: "Always add at least 3 inches of margin on each side for framing. Some stitchers prefer even more. The fabric count determines the finished design size — higher count means smaller stitches and a smaller finished piece.",
        };
      },
    },
    {
      id: "floss-amount",
      name: "Floss / Thread Amount",
      description: "Estimate embroidery floss needed for a cross stitch project",
      fields: [
        { name: "totalStitches", label: "Total Stitch Count", type: "number", placeholder: "e.g. 15000", min: 1, step: 1 },
        { name: "fabricCount", label: "Fabric Count", type: "select", options: [
          { label: "11 count Aida", value: "11" },
          { label: "14 count Aida", value: "14" },
          { label: "16 count Aida", value: "16" },
          { label: "18 count Aida", value: "18" },
        ], defaultValue: "14" },
        { name: "strands", label: "Strands Used", type: "select", options: [
          { label: "1 strand", value: "1" },
          { label: "2 strands (standard)", value: "2" },
          { label: "3 strands", value: "3" },
        ], defaultValue: "2" },
        { name: "colorCount", label: "Number of Colors", type: "number", placeholder: "e.g. 30", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const totalStitches = inputs.totalStitches as number;
        const fabricCount = parseInt(inputs.fabricCount as string);
        const strands = parseInt(inputs.strands as string);
        const colorCount = inputs.colorCount as number;
        if (!totalStitches || !colorCount) return null;

        // Floss per stitch varies by fabric count
        // On 14-count, each cross stitch uses roughly 1 inch of floss per strand
        const inchesPerStitch: Record<number, number> = {
          11: 1.3,
          14: 1.0,
          16: 0.9,
          18: 0.8,
        };
        const baseInches = inchesPerStitch[fabricCount] || 1.0;

        const totalInches = totalStitches * baseInches * strands;
        const totalYards = totalInches / 36;

        // Standard DMC skein = 8.7 yards (8 meters)
        const skeinYards = 8.7;
        const totalSkeins = Math.ceil(totalYards / skeinYards);
        const avgStitchesPerColor = totalStitches / colorCount;
        const avgSkeinsPerColor = Math.ceil((avgStitchesPerColor * baseInches * strands / 36) / skeinYards * 10) / 10;

        return {
          primary: { label: "Total Floss Needed", value: `~${totalSkeins}`, suffix: "skeins" },
          details: [
            { label: "Total Thread Length", value: `${formatNumber(totalYards, 0)} yards` },
            { label: "Number of Colors", value: `${colorCount}` },
            { label: "Avg Stitches Per Color", value: formatNumber(avgStitchesPerColor, 0) },
            { label: "Avg Skeins Per Color", value: formatNumber(avgSkeinsPerColor, 1) },
            { label: "Strands Used", value: `${strands}` },
            { label: "Skein Size (DMC)", value: "8.7 yards / 8 meters" },
          ],
          note: "This is an estimate assuming even color distribution. Check your pattern's color chart — dominant colors will need more skeins. Buy 1 extra skein of heavily used colors to avoid dye lot differences.",
        };
      },
    },
  ],
  relatedSlugs: ["embroidery-hoop-calculator", "fabric-yardage-calculator", "thread-calculator"],
  faq: [
    { question: "How do I calculate cross stitch fabric size?", answer: "Divide your stitch count by the fabric count to get the design size in inches. For example, a 140×200 stitch pattern on 14-count Aida is 10×14.3 inches. Add 3 inches on each side for framing margins, giving you 16×20.3 inches of fabric needed." },
    { question: "How many strands should I use for cross stitch?", answer: "On 14-count Aida, use 2 strands for cross stitches and 1 strand for backstitching. On 18-count, try 1-2 strands. On 11-count, use 3 strands. The goal is good coverage without the fabric showing through." },
    { question: "How much floss do I need per skein?", answer: "A standard DMC embroidery floss skein contains 8.7 yards (8 meters) of 6-strand floss. When stitching with 2 strands on 14-count, one skein covers approximately 150-200 full cross stitches." },
  ],
  formula: "Design size = Stitch count / Fabric count | Fabric needed = Design size + (2 × Margin) | Floss = Total stitches × Inches per stitch × Strands / 36",
};
