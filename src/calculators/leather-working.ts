import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const leatherWorkingCalculator: CalculatorDefinition = {
  slug: "leather-working-calculator",
  title: "Leatherworking Material Calculator",
  description: "Free online leatherworking material calculator. Calculate leather area, thread length, and material costs for leathercraft projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["leatherworking calculator", "leather material calculator", "leather area calculator", "stitching thread calculator", "leathercraft calculator"],
  variants: [
    {
      id: "leather-area",
      name: "Leather Area Calculator",
      description: "Calculate leather needed for a project with waste allowance",
      fields: [
        { name: "numPieces", label: "Number of Pattern Pieces", type: "number", placeholder: "e.g. 5" },
        { name: "avgWidth", label: "Average Piece Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "avgHeight", label: "Average Piece Height (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "waste", label: "Waste/Defect Allowance (%)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "leatherCost", label: "Cost per Square Foot ($)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "thickness", label: "Leather Weight (oz)", type: "select", options: [
          { label: "2-3 oz (thin, lining)", value: "2.5" },
          { label: "3-4 oz (wallets, pouches)", value: "3.5" },
          { label: "4-5 oz (bags, cases)", value: "4.5" },
          { label: "5-6 oz (belts, straps)", value: "5.5" },
          { label: "6-7 oz (holsters, sheaths)", value: "6.5" },
          { label: "7-8 oz (heavy belts)", value: "7.5" },
          { label: "8-10 oz (armor, soles)", value: "9" },
        ], defaultValue: "4.5" },
      ],
      calculate: (inputs) => {
        const numPieces = parseFloat(inputs.numPieces as string) || 0;
        const avgWidth = parseFloat(inputs.avgWidth as string) || 0;
        const avgHeight = parseFloat(inputs.avgHeight as string) || 0;
        const waste = parseFloat(inputs.waste as string) || 25;
        const costPerSqFt = parseFloat(inputs.leatherCost as string) || 8;
        const thickness = parseFloat(inputs.thickness as string) || 4.5;
        if (!numPieces || !avgWidth || !avgHeight) return null;

        const areaSqIn = numPieces * avgWidth * avgHeight;
        const areaSqFt = areaSqIn / 144;
        const areaWithWaste = areaSqFt * (1 + waste / 100);
        const totalCost = areaWithWaste * costPerSqFt;
        const thicknessMm = thickness * 0.4;

        return {
          primary: { label: "Leather Needed", value: `${formatNumber(areaWithWaste, 1)} sq ft` },
          details: [
            { label: "Pattern area", value: `${formatNumber(areaSqFt, 1)} sq ft (${formatNumber(areaSqIn, 0)} sq in)` },
            { label: "Waste allowance", value: `${waste}%` },
            { label: "Estimated cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Leather weight", value: `${thickness} oz (~${formatNumber(thicknessMm, 1)} mm)` },
            { label: "Number of pieces", value: formatNumber(numPieces, 0) },
          ],
          note: "Leather hides have irregular shapes and may have defects. 20-30% waste is normal. Belly areas are thinner and stretchier.",
        };
      },
    },
    {
      id: "thread-length",
      name: "Stitching Thread Calculator",
      description: "Calculate thread needed for hand-stitching leather",
      fields: [
        { name: "stitchLength", label: "Total Stitch Line Length (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "spi", label: "Stitches per Inch", type: "select", options: [
          { label: "5 SPI (coarse)", value: "5" },
          { label: "6 SPI (standard)", value: "6" },
          { label: "7 SPI (fine)", value: "7" },
          { label: "8 SPI (very fine)", value: "8" },
        ], defaultValue: "6" },
        { name: "leatherThickness", label: "Total Leather Thickness (mm)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "stitchType", label: "Stitch Type", type: "select", options: [
          { label: "Saddle stitch (2 needles)", value: "2" },
          { label: "Running stitch (1 needle)", value: "1" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.stitchLength as string) || 0;
        const spi = parseFloat(inputs.spi as string) || 6;
        const thickness = parseFloat(inputs.leatherThickness as string) || 4;
        const needles = parseFloat(inputs.stitchType as string) || 2;
        if (!totalLength) return null;

        const thicknessIn = thickness / 25.4;
        const totalStitches = totalLength * spi;
        const threadPerStitch = (1 / spi) + (thicknessIn * 2);
        const totalThread = totalStitches * threadPerStitch * needles;
        const threadWithExtra = totalThread * 1.15;
        const threadFeet = threadWithExtra / 12;

        return {
          primary: { label: "Thread Needed", value: `${formatNumber(threadWithExtra, 1)} inches` },
          details: [
            { label: "Thread (feet)", value: formatNumber(threadFeet, 1) },
            { label: "Total stitches", value: formatNumber(totalStitches, 0) },
            { label: "Thread per stitch", value: `${formatNumber(threadPerStitch, 3)}"` },
            { label: "Stitches per inch", value: formatNumber(spi, 0) },
            { label: "Needles", value: formatNumber(needles, 0) },
            { label: "Extra allowance", value: "15%" },
          ],
          note: "For saddle stitching, cut one continuous thread 4x the stitch line length plus extra for tying off. Wax thread before use.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "square-footage-calculator"],
  faq: [
    { question: "What does leather weight (oz) mean?", answer: "Leather weight is measured in ounces per square foot. 1 oz ≈ 0.4mm thickness. So 4-5 oz leather is about 1.6-2.0mm thick. Heavier weights are thicker and stiffer." },
    { question: "How much waste should I allow?", answer: "For full hides, allow 25-30% waste due to irregular shape and defects. For pre-cut panels, 10-15% waste. Belly areas are thinner and stretchier than the back/shoulder." },
    { question: "What is saddle stitching?", answer: "Saddle stitching uses two needles on a single thread, passing through the same holes from opposite sides. It is stronger than machine stitching because if one stitch breaks, the others hold. It requires 2x the thread of a running stitch." },
  ],
  formula: "Thread (in) = Stitch Length × SPI × Thread per Stitch × Needles × 1.15",
};
