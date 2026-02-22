import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const halfSquareTriangleCalculator: CalculatorDefinition = {
  slug: "half-square-triangle-calculator",
  title: "Half Square Triangle Calculator",
  description: "Free half square triangle (HST) quilt calculator. Calculate cutting sizes, fabric yardage, and block count for HST quilt blocks.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["half square triangle calculator", "HST calculator", "quilt block calculator", "half square triangle quilt", "HST cutting size"],
  variants: [
    {
      id: "cutting-size",
      name: "HST Cutting Size",
      description: "Calculate the cutting size for half square triangles",
      fields: [
        { name: "finishedSize", label: "Finished HST Size", type: "number", placeholder: "e.g. 3", suffix: "in", step: 0.25 },
        { name: "method", label: "Construction Method", type: "select", options: [
          { label: "Two-at-a-time (draw diagonal)", value: "two" },
          { label: "Four-at-a-time (two diagonals)", value: "four" },
          { label: "Eight-at-a-time (grid method)", value: "eight" },
        ], defaultValue: "two" },
        { name: "quantity", label: "HSTs Needed", type: "number", placeholder: "e.g. 48", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const finishedSize = inputs.finishedSize as number;
        const method = inputs.method as string;
        const quantity = inputs.quantity as number;
        if (!finishedSize || !quantity) return null;

        let cuttingSize: number;
        let unitsPerPair: number;
        let description: string;

        if (method === "two") {
          cuttingSize = finishedSize + 0.875; // add 7/8"
          unitsPerPair = 2;
          description = "Cut squares, draw diagonal, sew 1/4\" on each side, cut apart";
        } else if (method === "four") {
          cuttingSize = finishedSize + 1.25; // add 1-1/4"
          unitsPerPair = 4;
          description = "Cut squares, draw both diagonals, sew 1/4\" on each side of both lines, cut apart";
        } else {
          cuttingSize = finishedSize + 1; // grid method
          unitsPerPair = 8;
          description = "Draw grid, sew diagonals, cut apart — yields 8 HSTs per pair of fabric pieces";
        }

        const squarePairsNeeded = Math.ceil(quantity / unitsPerPair);
        const squaresOfEachFabric = squarePairsNeeded;

        // Fabric estimation (42" usable width)
        const squaresPerRow = Math.floor(42 / cuttingSize);
        const rowsNeeded = Math.ceil(squaresOfEachFabric / squaresPerRow);
        const fabricInches = rowsNeeded * cuttingSize;
        const fabricYards = Math.ceil((fabricInches / 36) * 8) / 8;

        return {
          primary: { label: "Cut Squares At", value: formatNumber(cuttingSize, 3), suffix: "inches" },
          details: [
            { label: "Finished HST Size", value: `${formatNumber(finishedSize, 2)} in` },
            { label: "HSTs Per Pair", value: `${unitsPerPair}` },
            { label: "Square Pairs Needed", value: `${squarePairsNeeded}` },
            { label: "Squares of Each Fabric", value: `${squaresOfEachFabric}` },
            { label: "Fabric Per Color (est.)", value: `${formatNumber(fabricYards, 3)} yards` },
            { label: "Total HSTs Produced", value: `${squarePairsNeeded * unitsPerPair}` },
            { label: "Method", value: description },
          ],
          note: "The two-at-a-time method adds 7/8\" to finished size. Always make 1-2 extra HSTs in case of trimming errors. Press seams to the darker fabric and trim to exact size.",
        };
      },
    },
    {
      id: "quilt-layout",
      name: "HST Quilt Layout",
      description: "Plan an entire HST quilt with block count and fabric needs",
      fields: [
        { name: "quiltWidth", label: "Desired Quilt Width", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "quiltLength", label: "Desired Quilt Length", type: "number", placeholder: "e.g. 80", suffix: "in", step: 1 },
        { name: "hstSize", label: "Finished HST Size", type: "select", options: [
          { label: "2 inches", value: "2" },
          { label: "2.5 inches", value: "2.5" },
          { label: "3 inches", value: "3" },
          { label: "4 inches", value: "4" },
          { label: "5 inches", value: "5" },
          { label: "6 inches", value: "6" },
        ], defaultValue: "3" },
        { name: "borderWidth", label: "Border Width", type: "select", options: [
          { label: "No border", value: "0" },
          { label: "2 inches", value: "2" },
          { label: "4 inches", value: "4" },
          { label: "6 inches", value: "6" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const quiltWidth = inputs.quiltWidth as number;
        const quiltLength = inputs.quiltLength as number;
        const hstSize = parseFloat(inputs.hstSize as string);
        const borderWidth = parseInt(inputs.borderWidth as string);
        if (!quiltWidth || !quiltLength) return null;

        const innerWidth = quiltWidth - (borderWidth * 2);
        const innerLength = quiltLength - (borderWidth * 2);
        const hstAcross = Math.ceil(innerWidth / hstSize);
        const hstDown = Math.ceil(innerLength / hstSize);
        const totalHST = hstAcross * hstDown;

        const cuttingSize = hstSize + 0.875;
        const squarePairs = Math.ceil(totalHST / 2);
        const squaresPerRow = Math.floor(42 / cuttingSize);
        const rowsPerFabric = Math.ceil(squarePairs / squaresPerRow);
        const fabricPerColor = Math.ceil((rowsPerFabric * cuttingSize / 36) * 4) / 4;

        const actualWidth = (hstAcross * hstSize) + (borderWidth * 2);
        const actualLength = (hstDown * hstSize) + (borderWidth * 2);

        // Border fabric
        const borderYards = borderWidth > 0 ? Math.ceil(((actualWidth + actualLength) * 2 * borderWidth / (36 * 42)) * 4) / 4 + 0.5 : 0;

        return {
          primary: { label: "Total HSTs Needed", value: `${totalHST}` },
          details: [
            { label: "Layout", value: `${hstAcross} × ${hstDown}` },
            { label: "Actual Quilt Size", value: `${actualWidth} × ${actualLength} in` },
            { label: "Cut Square Size", value: `${formatNumber(cuttingSize, 3)} in` },
            { label: "Fabric Per Color", value: `~${formatNumber(fabricPerColor, 2)} yards` },
            { label: "Border Fabric", value: borderWidth > 0 ? `~${formatNumber(borderYards, 2)} yards` : "None" },
            { label: "Square Pairs to Cut", value: `${squarePairs}` },
          ],
          note: "This layout uses the two-at-a-time method. Consider making 5-10% extra HSTs for trimming losses. Starch your fabric before cutting for more accurate results.",
        };
      },
    },
  ],
  relatedSlugs: ["quilt-size-calculator", "quilt-binding-calculator", "fabric-yardage-calculator"],
  faq: [
    { question: "What size do I cut squares for half square triangles?", answer: "For the two-at-a-time method, add 7/8 inch to your desired finished size. For example, for 3-inch finished HSTs, cut 3-7/8 inch squares. For the four-at-a-time method, add 1-1/4 inch instead." },
    { question: "How many HSTs can I get from a pair of squares?", answer: "The two-at-a-time method yields 2 HSTs per pair. The four-at-a-time method yields 4 per pair, and the eight-at-a-time grid method yields 8 per pair. More units per pair means less waste but slightly more complex construction." },
    { question: "Why do my HSTs come out too small?", answer: "Always cut slightly oversized and trim to exact size after sewing. The seam allowance can shift slightly, so cutting 1/8 inch extra and trimming with a square ruler ensures perfect results every time." },
  ],
  formula: "Cutting size (2-at-a-time) = Finished size + 7/8\" | Cutting size (4-at-a-time) = Finished size + 1-1/4\" | Square pairs = Total HSTs / Units per method",
};
