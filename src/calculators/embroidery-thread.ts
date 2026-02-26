import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const embroideryThreadCalculator: CalculatorDefinition = {
  slug: "embroidery-thread-calculator",
  title: "Embroidery Thread & Floss Calculator",
  description: "Free online embroidery thread and floss calculator. Estimate how much thread or floss you need for hand embroidery and cross-stitch projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["embroidery thread calculator", "floss calculator", "cross stitch thread calculator", "embroidery floss estimator", "thread yardage calculator"],
  variants: [
    {
      id: "cross-stitch",
      name: "Cross-Stitch Floss",
      description: "Calculate floss needed for a cross-stitch pattern",
      fields: [
        { name: "stitchCount", label: "Total Stitch Count (for this color)", type: "number", placeholder: "e.g. 500" },
        { name: "fabricCount", label: "Fabric Count", type: "select", options: [
          { label: "11 count Aida", value: "11" },
          { label: "14 count Aida", value: "14" },
          { label: "16 count Aida", value: "16" },
          { label: "18 count Aida", value: "18" },
          { label: "28 count evenweave (over 2)", value: "14" },
          { label: "32 count linen (over 2)", value: "16" },
        ], defaultValue: "14" },
        { name: "strands", label: "Number of Strands", type: "select", options: [
          { label: "1 strand", value: "1" },
          { label: "2 strands (standard)", value: "2" },
          { label: "3 strands", value: "3" },
        ], defaultValue: "2" },
        { name: "numColors", label: "Number of Colors (for total estimate)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const stitchCount = parseFloat(inputs.stitchCount as string) || 0;
        const fabricCount = parseFloat(inputs.fabricCount as string) || 14;
        const strands = parseFloat(inputs.strands as string) || 2;
        const numColors = parseFloat(inputs.numColors as string) || 1;
        if (!stitchCount) return null;

        const stitchSize = 1 / fabricCount;
        const threadPerStitch = stitchSize * 2 * 1.414 + stitchSize;
        const totalInches = stitchCount * threadPerStitch * strands;
        const totalYards = totalInches / 36;
        const skeinsNeeded = Math.ceil(totalYards / 8.7);
        const totalForAll = totalYards * numColors;
        const skeinsForAll = skeinsNeeded * numColors;

        return {
          primary: { label: "Floss Needed (this color)", value: `${formatNumber(totalYards, 1)} yards` },
          details: [
            { label: "Skeins needed (this color)", value: `${skeinsNeeded} (8.7 yds/skein)` },
            { label: "Thread per stitch", value: `${formatNumber(threadPerStitch * strands, 3)}" (${strands} strands)` },
            { label: "Stitch count", value: formatNumber(stitchCount, 0) },
            { label: "Fabric count", value: `${fabricCount} ct` },
            { label: "Total for all colors", value: `${formatNumber(totalForAll, 1)} yards (${skeinsForAll} skeins)` },
          ],
          note: "Standard DMC/Anchor skein is 8.7 yards (8 meters). Buy an extra skein per color for safety.",
        };
      },
    },
    {
      id: "hand-embroidery",
      name: "Hand Embroidery Thread",
      description: "Estimate thread for embroidery fill areas",
      fields: [
        { name: "areaWidth", label: "Fill Area Width (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "areaHeight", label: "Fill Area Height (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "coverage", label: "Fill Coverage", type: "select", options: [
          { label: "Light (outline/backstitch)", value: "0.25" },
          { label: "Medium (partial fill)", value: "0.5" },
          { label: "Heavy (satin stitch fill)", value: "0.85" },
          { label: "Full (dense fill)", value: "1.0" },
        ], defaultValue: "0.85" },
        { name: "strands", label: "Number of Strands", type: "select", options: [
          { label: "1 strand", value: "1" },
          { label: "2 strands", value: "2" },
          { label: "3 strands", value: "3" },
          { label: "6 strands (full)", value: "6" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const width = parseFloat(inputs.areaWidth as string) || 0;
        const height = parseFloat(inputs.areaHeight as string) || 0;
        const coverage = parseFloat(inputs.coverage as string) || 0.85;
        const strands = parseFloat(inputs.strands as string) || 2;
        if (!width || !height) return null;

        const area = width * height;
        const stitchesPerSqIn = 196;
        const totalStitches = area * stitchesPerSqIn * coverage;
        const avgStitchLength = 0.1;
        const threadInches = totalStitches * avgStitchLength * strands * 1.3;
        const threadYards = threadInches / 36;
        const skeins = Math.ceil(threadYards / 8.7);

        return {
          primary: { label: "Thread Needed", value: `${formatNumber(threadYards, 1)} yards` },
          details: [
            { label: "Skeins needed", value: `${skeins}` },
            { label: "Fill area", value: `${formatNumber(area, 1)} sq in` },
            { label: "Coverage density", value: `${coverage * 100}%` },
            { label: "Strands used", value: `${strands}` },
            { label: "Est. total stitches", value: formatNumber(totalStitches, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["knitting-yarn-calculator", "quilting-fabric-calculator"],
  faq: [
    { question: "How much floss do I need for cross-stitch?", answer: "It depends on stitch count, fabric count, and number of strands. As a rule of thumb, one standard skein (8.7 yards) of 2-strand floss covers about 400-500 cross-stitches on 14-count Aida." },
    { question: "How many strands should I use?", answer: "For 14-count Aida: 2 strands for cross-stitch, 1 for backstitch. For 18-count: 1-2 strands. For 11-count: 3 strands. More strands give fuller coverage but use more floss." },
    { question: "How long should I cut my floss?", answer: "Cut strands 18-24 inches long. Longer threads are harder to manage and tend to tangle or fray. For metallic threads, use even shorter lengths (12-15 inches)." },
  ],
  formula: "Floss (yards) = Stitch Count × Thread per Stitch × Strands / 36",
};
