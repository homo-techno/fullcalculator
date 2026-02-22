import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quiltBindingCalculator: CalculatorDefinition = {
  slug: "quilt-binding-calculator",
  title: "Quilt Binding Calculator",
  description: "Free quilt binding calculator. Calculate binding strip length, fabric yardage, and number of strips for double-fold and single-fold quilt binding.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["quilt binding calculator", "binding fabric calculator", "quilt binding yardage", "binding strips calculator", "double fold binding"],
  variants: [
    {
      id: "binding-yardage",
      name: "Binding Yardage",
      description: "Calculate binding fabric needed from quilt dimensions",
      fields: [
        { name: "quiltWidth", label: "Quilt Width", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "quiltLength", label: "Quilt Length", type: "number", placeholder: "e.g. 80", suffix: "in", step: 1 },
        { name: "bindingType", label: "Binding Type", type: "select", options: [
          { label: "Double-fold (standard, 2.5\" strips)", value: "double-2.5" },
          { label: "Double-fold (2.25\" strips)", value: "double-2.25" },
          { label: "Single-fold (1.5\" strips)", value: "single-1.5" },
          { label: "Double-fold wide (3\" strips)", value: "double-3" },
        ], defaultValue: "double-2.5" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "42 inches (usable width)", value: "42" },
          { label: "44 inches", value: "44" },
          { label: "54 inches", value: "54" },
          { label: "60 inches", value: "60" },
        ], defaultValue: "42" },
        { name: "joinMethod", label: "Strip Joining Method", type: "select", options: [
          { label: "Bias seam (diagonal)", value: "bias" },
          { label: "Straight seam", value: "straight" },
        ], defaultValue: "bias" },
      ],
      calculate: (inputs) => {
        const quiltWidth = inputs.quiltWidth as number;
        const quiltLength = inputs.quiltLength as number;
        const bindingType = inputs.bindingType as string;
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        const joinMethod = inputs.joinMethod as string;
        if (!quiltWidth || !quiltLength) return null;

        const stripWidths: Record<string, number> = {
          "double-2.5": 2.5,
          "double-2.25": 2.25,
          "single-1.5": 1.5,
          "double-3": 3,
        };
        const stripWidth = stripWidths[bindingType] || 2.5;

        // Perimeter + extra for corners and joining
        const perimeter = (quiltWidth + quiltLength) * 2;
        const extra = 20; // for mitered corners and joining ends
        const totalLength = perimeter + extra;

        // Strips needed
        const usableStripLength = fabricWidth - (joinMethod === "bias" ? stripWidth : 1);
        const stripsNeeded = Math.ceil(totalLength / usableStripLength);

        // Fabric needed
        const fabricInches = stripsNeeded * stripWidth;
        const fabricYards = Math.ceil((fabricInches / 36) * 8) / 8;

        const typeLabels: Record<string, string> = {
          "double-2.5": "Double-fold (2.5\" strips)",
          "double-2.25": "Double-fold (2.25\" strips)",
          "single-1.5": "Single-fold (1.5\" strips)",
          "double-3": "Double-fold wide (3\" strips)",
        };

        return {
          primary: { label: "Binding Fabric", value: formatNumber(fabricYards, 3), suffix: "yards" },
          details: [
            { label: "Quilt Perimeter", value: `${perimeter} in` },
            { label: "Total Binding Length", value: `${totalLength} in (${formatNumber(totalLength / 36, 1)} yd)` },
            { label: "Strip Width", value: `${stripWidth} in` },
            { label: "Strips to Cut", value: `${stripsNeeded}` },
            { label: "Usable Strip Length", value: `${formatNumber(usableStripLength, 1)} in` },
            { label: "Binding Type", value: typeLabels[bindingType] || bindingType },
            { label: "Join Method", value: joinMethod === "bias" ? "Diagonal/bias seam" : "Straight seam" },
          ],
          note: "Double-fold binding is the most durable and is recommended for bed quilts. Cut strips on the straight grain for most quilts, or on the bias for quilts with curved edges.",
        };
      },
    },
    {
      id: "bias-binding",
      name: "Continuous Bias Binding",
      description: "Calculate fabric square size for continuous bias binding",
      fields: [
        { name: "bindingLength", label: "Total Binding Length Needed", type: "number", placeholder: "e.g. 300", suffix: "in", step: 1 },
        { name: "stripWidth", label: "Binding Strip Width", type: "select", options: [
          { label: "2 inches", value: "2" },
          { label: "2.25 inches", value: "2.25" },
          { label: "2.5 inches (standard)", value: "2.5" },
          { label: "3 inches", value: "3" },
        ], defaultValue: "2.5" },
      ],
      calculate: (inputs) => {
        const bindingLength = inputs.bindingLength as number;
        const stripWidth = parseFloat(inputs.stripWidth as string);
        if (!bindingLength) return null;

        // Area needed = binding length × strip width
        const areaNeeded = bindingLength * stripWidth;
        // Square side = sqrt(area)
        const squareSide = Math.ceil(Math.sqrt(areaNeeded));
        // Round up to nearest inch
        const cuttingSquare = Math.ceil(squareSide) + 1;

        // Verify: strips from this square
        const diagonalLength = cuttingSquare * Math.sqrt(2);
        const stripsFromSquare = Math.floor(diagonalLength / stripWidth);
        const totalFromSquare = stripsFromSquare * cuttingSquare;

        const fabricYards = Math.ceil((cuttingSquare / 36) * 4) / 4;

        return {
          primary: { label: "Fabric Square Size", value: `${cuttingSquare} × ${cuttingSquare}`, suffix: "inches" },
          details: [
            { label: "Binding Length Needed", value: `${bindingLength} in` },
            { label: "Strip Width", value: `${stripWidth} in` },
            { label: "Area Needed", value: `${formatNumber(areaNeeded, 0)} sq in` },
            { label: "Binding Produced", value: `~${formatNumber(totalFromSquare, 0)} in` },
            { label: "Fabric Needed", value: `${formatNumber(fabricYards, 2)} yards` },
          ],
          note: "Cut the square in half diagonally, sew the halves into a parallelogram, then mark and sew into a tube. Cut along the marked lines in a continuous spiral to produce one long bias strip.",
        };
      },
    },
  ],
  relatedSlugs: ["quilt-size-calculator", "bias-tape-calculator", "fabric-yardage-calculator"],
  faq: [
    { question: "How wide should I cut binding strips?", answer: "For double-fold binding (the most common), cut strips 2.5 inches wide. This produces a binding that finishes at about 3/8 inch on the front. Use 2.25 inches for a narrower binding or 3 inches for thicker quilts." },
    { question: "How much binding do I need for a queen quilt?", answer: "A queen quilt (roughly 90×100 inches) has a perimeter of 380 inches. Add 20 inches for corners and joining, totaling about 400 inches or 11 yards. This requires approximately 3/4 yard of fabric cut into 2.5-inch strips." },
    { question: "Should I use straight grain or bias binding?", answer: "Use straight grain binding for quilts with straight edges — it is easier and uses less fabric. Use bias binding for quilts with curved edges, as the bias stretch allows the binding to curve smoothly." },
  ],
  formula: "Perimeter = (Width + Length) × 2 | Total binding = Perimeter + 20\" extra | Strips needed = Total / Usable strip length | Fabric = Strips × Strip width / 36",
};
