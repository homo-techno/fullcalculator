import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stairStringerCalculator: CalculatorDefinition = {
  slug: "stair-stringer-calculator",
  title: "Stair Stringer Calculator",
  description: "Free stair stringer calculator. Calculate stringer length, number of risers, tread depth, and cut layout for building code-compliant stairs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stair stringer calculator", "stair layout calculator", "stair rise run calculator", "stair building calculator", "stringer cut calculator"],
  variants: [
    {
      id: "from-height",
      name: "Stringer from Total Height",
      description: "Calculate stringer layout from floor-to-floor height",
      fields: [
        { name: "totalRise", label: "Total Rise / Height (inches)", type: "number", placeholder: "e.g. 108" },
        { name: "riserHeight", label: "Target Riser Height (inches)", type: "select", options: [
          { label: "7 inches (standard)", value: "7" },
          { label: "7.25 inches", value: "7.25" },
          { label: "7.5 inches (max code)", value: "7.5" },
          { label: "7.75 inches (max IRC)", value: "7.75" },
        ], defaultValue: "7.25" },
        { name: "treadDepth", label: "Tread Depth (inches)", type: "select", options: [
          { label: "10 inches (min code)", value: "10" },
          { label: "10.5 inches", value: "10.5" },
          { label: "11 inches (standard)", value: "11" },
          { label: "11.25 inches", value: "11.25" },
          { label: "12 inches", value: "12" },
        ], defaultValue: "10" },
        { name: "stringerBoard", label: "Stringer Lumber", type: "select", options: [
          { label: "2\u00D712 (actual 11.25\")", value: "11.25" },
          { label: "2\u00D714 (actual 13.25\")", value: "13.25" },
        ], defaultValue: "11.25" },
      ],
      calculate: (inputs) => {
        const totalRise = inputs.totalRise as number;
        const targetRiser = parseFloat(inputs.riserHeight as string) || 7.25;
        const treadDepth = parseFloat(inputs.treadDepth as string) || 10;
        const boardWidth = parseFloat(inputs.stringerBoard as string) || 11.25;
        if (!totalRise) return null;

        const numRisers = Math.round(totalRise / targetRiser);
        const actualRiser = totalRise / numRisers;
        const numTreads = numRisers - 1;
        const totalRun = numTreads * treadDepth;
        const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
        const stringerLengthFt = stringerLength / 12;

        const minThroat = boardWidth - Math.sqrt(actualRiser * actualRiser + treadDepth * treadDepth);
        const riseRunSum = actualRiser + treadDepth;
        const codeCompliant = actualRiser <= 7.75 && treadDepth >= 10 && riseRunSum >= 17 && riseRunSum <= 18;

        return {
          primary: { label: "Stringer Length", value: `${formatNumber(stringerLengthFt, 1)} feet (${formatNumber(stringerLength, 1)} in)` },
          details: [
            { label: "Number of risers", value: `${numRisers}` },
            { label: "Number of treads", value: `${numTreads}` },
            { label: "Actual riser height", value: `${formatNumber(actualRiser, 3)} in` },
            { label: "Tread depth", value: `${treadDepth} in` },
            { label: "Total run", value: `${formatNumber(totalRun, 1)} in (${formatNumber(totalRun / 12, 1)} ft)` },
            { label: "Rise + Run sum", value: `${formatNumber(riseRunSum, 2)} in` },
            { label: "Stringer throat", value: `${formatNumber(minThroat, 2)} in` },
            { label: "Angle", value: `${formatNumber(Math.atan(totalRise / totalRun) * (180 / Math.PI), 1)}\u00B0` },
            { label: "Meets building code", value: codeCompliant ? "Yes" : "Check local code" },
          ],
          note: "IRC code: max riser 7.75\", min tread 10\", rise+run should be 17-18\". Minimum stringer throat thickness is 3.5\" for a 2\u00D712. Always verify with local building code.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Rise and Run",
      description: "Calculate stringer from known rise and run per step",
      fields: [
        { name: "riserHeight", label: "Riser Height (inches)", type: "number", placeholder: "e.g. 7.25" },
        { name: "treadDepth", label: "Tread Depth (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "numRisers", label: "Number of Risers", type: "number", placeholder: "e.g. 14" },
      ],
      calculate: (inputs) => {
        const riser = inputs.riserHeight as number;
        const tread = inputs.treadDepth as number;
        const numRisers = inputs.numRisers as number;
        if (!riser || !tread || !numRisers) return null;

        const numTreads = numRisers - 1;
        const totalRise = riser * numRisers;
        const totalRun = tread * numTreads;
        const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);

        return {
          primary: { label: "Stringer Length", value: `${formatNumber(stringerLength / 12, 1)} feet` },
          details: [
            { label: "Total rise", value: `${formatNumber(totalRise, 1)} in (${formatNumber(totalRise / 12, 1)} ft)` },
            { label: "Total run", value: `${formatNumber(totalRun, 1)} in (${formatNumber(totalRun / 12, 1)} ft)` },
            { label: "Risers", value: `${numRisers}` },
            { label: "Treads", value: `${numTreads}` },
            { label: "Stair angle", value: `${formatNumber(Math.atan(totalRise / totalRun) * (180 / Math.PI), 1)}\u00B0` },
            { label: "Rise + Run", value: `${formatNumber(riser + tread, 2)} in` },
          ],
          note: "Comfortable stairs typically have a rise + run sum between 17 and 18 inches. The ideal stair angle is 30-37 degrees.",
        };
      },
    },
  ],
  relatedSlugs: ["slope-grade-calculator", "handrail-height-calculator", "baluster-spacing-calculator"],
  faq: [
    { question: "What is the building code for stair dimensions?", answer: "Per the IRC (International Residential Code): maximum riser height is 7.75 inches, minimum tread depth is 10 inches, minimum stair width is 36 inches, and minimum headroom is 6 feet 8 inches. The rise+run sum should be between 17 and 18 inches for comfortable stairs." },
    { question: "How do I cut stair stringers?", answer: "Mark the rise and run on a framing square, then transfer these marks along the 2\u00D712 board. Cut the notches with a circular saw and finish corners with a handsaw. The bottom riser must be reduced by the tread thickness (typically 1 inch for decking). Always maintain at least 3.5 inches of throat thickness." },
  ],
  formula: "Stringer Length = \u221A(Total Rise\u00B2 + Total Run\u00B2) | Risers = Total Rise / Riser Height | Treads = Risers - 1",
};
