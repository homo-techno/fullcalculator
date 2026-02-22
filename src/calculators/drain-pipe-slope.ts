import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drainPipeSlopeCalculator: CalculatorDefinition = {
  slug: "drain-pipe-slope-calculator",
  title: "Drain Pipe Slope Calculator",
  description: "Free drain pipe slope calculator. Calculate required slope and drop for drain pipes based on pipe diameter and run length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drain pipe slope calculator", "pipe grade calculator", "drainage slope", "plumbing slope", "pipe fall calculator"],
  variants: [
    {
      id: "slope-calc",
      name: "Required Slope and Drop",
      description: "Calculate total drop for a drain pipe run",
      fields: [
        { name: "pipeSize", label: "Pipe Diameter", type: "select", options: [
          { label: "1-1/2 inch", value: "1.5" },
          { label: "2 inch", value: "2" },
          { label: "3 inch", value: "3" },
          { label: "4 inch", value: "4" },
          { label: "6 inch", value: "6" },
        ], defaultValue: "3" },
        { name: "runLength", label: "Pipe Run Length (ft)", type: "number", placeholder: "e.g. 30" },
        { name: "customSlope", label: "Custom Slope (in/ft, 0 for code min)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const pipeSize = parseFloat(inputs.pipeSize as string);
        const runLength = inputs.runLength as number;
        const customSlope = inputs.customSlope as number;
        if (!pipeSize || !runLength) return null;
        const codeSlope = pipeSize >= 3 ? 0.125 : 0.25;
        const slope = customSlope > 0 ? customSlope : codeSlope;
        const totalDrop = slope * runLength;
        const percentSlope = (slope / 12) * 100;
        const degreeSlope = Math.atan(slope / 12) * (180 / Math.PI);
        return {
          primary: { label: "Total Drop Required", value: `${formatNumber(totalDrop, 2)}` + " inches" },
          details: [
            { label: "Slope", value: `${formatNumber(slope, 3)}` + " in/ft" },
            { label: "Percent Slope", value: `${formatNumber(percentSlope, 2)}` + "%" },
            { label: "Degrees", value: `${formatNumber(degreeSlope, 2)}` + " deg" },
            { label: "Pipe Diameter", value: `${formatNumber(pipeSize, 2)}` + " in" },
            { label: "Run Length", value: `${formatNumber(runLength, 0)}` + " ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pipe-sizing-calculator", "sewer-pipe-capacity-calculator", "condensate-drain-calculator"],
  faq: [
    { question: "What slope do drain pipes need?", answer: "Per most plumbing codes, pipes 3 inches and larger need 1/8 inch per foot minimum. Pipes smaller than 3 inches need 1/4 inch per foot minimum." },
    { question: "Can a drain pipe have too much slope?", answer: "Yes. Excessive slope can cause liquids to outrun solids, leading to clogs. The ideal range is 1/8 to 1/4 inch per foot." },
  ],
  formula: "Total Drop = Slope (in/ft) x Run Length (ft) | Code Min: 1/4 in/ft for < 3 in, 1/8 in/ft for >= 3 in",
};