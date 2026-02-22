import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dowelSpacingCalculator: CalculatorDefinition = {
  slug: "dowel-spacing-calculator",
  title: "Dowel Spacing Calculator",
  description: "Free dowel spacing calculator. Determine optimal dowel size, spacing, and hole depth for edge-to-edge and face joints.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dowel spacing calculator", "dowel joint calculator", "dowel hole depth", "dowel size calculator", "edge joint dowels"],
  variants: [
    {
      id: "edge-joint",
      name: "Edge Joint Dowels",
      description: "Calculate dowel spacing for edge-to-edge glue-ups",
      fields: [
        { name: "boardThickness", label: "Board Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "jointLength", label: "Joint Length (inches)", type: "number", placeholder: "e.g. 36" },
        {
          name: "dowelDiameter",
          label: "Dowel Diameter",
          type: "select",
          options: [
            { label: "1/4 inch", value: "0.25" },
            { label: "5/16 inch", value: "0.3125" },
            { label: "3/8 inch", value: "0.375" },
            { label: "1/2 inch", value: "0.5" },
          ],
        },
        {
          name: "spacingRule",
          label: "Spacing Guideline",
          type: "select",
          options: [
            { label: "6 inches apart (standard)", value: "6" },
            { label: "4 inches apart (heavy duty)", value: "4" },
            { label: "8 inches apart (light duty)", value: "8" },
          ],
        },
      ],
      calculate: (inputs) => {
        const boardThickness = inputs.boardThickness as number;
        const jointLength = inputs.jointLength as number;
        const dowelDia = parseFloat(inputs.dowelDiameter as string);
        const spacing = parseFloat(inputs.spacingRule as string);
        if (!boardThickness || !jointLength || !dowelDia) return null;
        const maxDowelDia = boardThickness / 2;
        const recommended = dowelDia <= maxDowelDia;
        const numDowels = Math.floor((jointLength - 2) / spacing) + 1;
        const actualSpacing = numDowels > 1 ? (jointLength - 2 * 1) / (numDowels - 1) : jointLength;
        const holeDepth = dowelDia * 4;
        const dowelLength = holeDepth * 2 - 0.0625;
        const drillBitSize = dowelDia;
        const endDistance = 1;
        return {
          primary: { label: "Number of Dowels", value: formatNumber(numDowels, 0) },
          details: [
            { label: "Actual Spacing", value: `${formatNumber(actualSpacing, 2)} inches` },
            { label: "Dowel Diameter", value: `${formatNumber(dowelDia, 4)} inches` },
            { label: "Max Recommended Diameter", value: `${formatNumber(maxDowelDia, 3)} inches` },
            { label: "Size OK", value: recommended ? "Yes" : "Too large for stock" },
            { label: "Hole Depth (each side)", value: `${formatNumber(holeDepth, 3)} inches` },
            { label: "Dowel Length", value: `${formatNumber(dowelLength, 3)} inches` },
            { label: "Drill Bit Size", value: `${formatNumber(drillBitSize, 4)} inches` },
            { label: "End Distance", value: `${formatNumber(endDistance, 1)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tenon-size-calculator", "dovetail-joint-calculator", "drill-bit-size-calculator"],
  faq: [
    { question: "What size dowel should I use?", answer: "Use a dowel diameter no more than half the thickness of the thinnest board being joined. For 3/4 inch stock, use 3/8 inch or smaller dowels." },
    { question: "How deep should dowel holes be?", answer: "Drill each hole about 4 times the dowel diameter deep. For 3/8 inch dowels, drill about 1.5 inches deep on each side. Leave a small gap for excess glue." },
  ],
  formula: "Num Dowels = floor((Length - 2) / Spacing) + 1 | Hole Depth = Diameter x 4 | Max Diameter = Thickness / 2",
};
