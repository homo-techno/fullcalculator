import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dovetailJointCalculator: CalculatorDefinition = {
  slug: "dovetail-joint-calculator",
  title: "Dovetail Joint Calculator",
  description: "Free dovetail joint calculator. Calculate pin and tail spacing, angles, and layout dimensions for through and half-blind dovetails.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dovetail joint calculator", "pin spacing calculator", "tail spacing calculator", "dovetail layout", "woodworking joint calculator"],
  variants: [
    {
      id: "through-dovetail",
      name: "Through Dovetail Layout",
      description: "Calculate pin and tail spacing for through dovetails",
      fields: [
        { name: "boardWidth", label: "Board Width (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "boardThickness", label: "Board Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "numTails", label: "Number of Tails", type: "number", placeholder: "e.g. 3" },
        {
          name: "angleRatio",
          label: "Dovetail Angle Ratio",
          type: "select",
          options: [
            { label: "1:6 (Softwood)", value: "6" },
            { label: "1:7 (General Purpose)", value: "7" },
            { label: "1:8 (Hardwood)", value: "8" },
          ],
        },
      ],
      calculate: (inputs) => {
        const boardWidth = inputs.boardWidth as number;
        const boardThickness = inputs.boardThickness as number;
        const numTails = inputs.numTails as number;
        const angleRatio = parseFloat(inputs.angleRatio as string);
        if (!boardWidth || !boardThickness || !numTails || !angleRatio) return null;
        const angleDeg = Math.atan(1 / angleRatio) * (180 / Math.PI);
        const numPins = numTails + 1;
        const halfPinWidth = boardThickness / 2;
        const fullPinWidth = boardThickness * 0.6;
        const totalPinWidth = (numPins - 2) * fullPinWidth + 2 * halfPinWidth;
        const tailWidth = numTails > 0 ? (boardWidth - totalPinWidth) / numTails : 0;
        const narrowEnd = tailWidth - 2 * (boardThickness / angleRatio);
        return {
          primary: { label: "Tail Width (Wide End)", value: `${formatNumber(tailWidth, 3)} inches` },
          details: [
            { label: "Tail Narrow End", value: `${formatNumber(narrowEnd, 3)} inches` },
            { label: "Number of Pins", value: formatNumber(numPins, 0) },
            { label: "Number of Tails", value: formatNumber(numTails, 0) },
            { label: "Half-Pin Width", value: `${formatNumber(halfPinWidth, 3)} inches` },
            { label: "Full Pin Width", value: `${formatNumber(fullPinWidth, 3)} inches` },
            { label: "Dovetail Angle", value: `${formatNumber(angleDeg, 1)} degrees` },
            { label: "Angle Ratio", value: `1:${formatNumber(angleRatio, 0)}` },
            { label: "Joint Depth", value: `${formatNumber(boardThickness, 3)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tenon-size-calculator", "dado-joint-calculator", "miter-angle-calculator"],
  faq: [
    { question: "What dovetail angle should I use?", answer: "Use 1:6 for softwoods, 1:7 for general purpose, and 1:8 for hardwoods. A steeper angle provides more mechanical strength but is harder to cut in hardwoods." },
    { question: "How many tails should I use?", answer: "A common guideline is one tail per inch of board width. Odd numbers of tails often look more pleasing." },
  ],
  formula: "Tail Width = (Board Width - Total Pin Width) / Number of Tails | Angle = arctan(1/ratio)",
};
