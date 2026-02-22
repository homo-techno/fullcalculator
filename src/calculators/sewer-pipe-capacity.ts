import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sewerPipeCapacityCalculator: CalculatorDefinition = {
  slug: "sewer-pipe-capacity-calculator",
  title: "Sewer Pipe Capacity Calculator",
  description: "Free sewer pipe capacity calculator. Calculate flow capacity of gravity sewer pipes using Manning equation based on pipe size, slope, and material.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sewer pipe capacity", "Manning equation", "gravity sewer flow", "pipe flow calculator", "drainage capacity"],
  variants: [
    {
      id: "manning",
      name: "Manning Equation Flow",
      description: "Calculate full-pipe flow capacity",
      fields: [
        { name: "diameter", label: "Pipe Diameter (inches)", type: "number", placeholder: "e.g. 6" },
        { name: "slope", label: "Slope (ft/ft)", type: "number", placeholder: "e.g. 0.01", step: 0.001 },
        { name: "material", label: "Pipe Material", type: "select", options: [
          { label: "PVC (n=0.010)", value: "0.010" },
          { label: "Concrete (n=0.013)", value: "0.013" },
          { label: "Clay (n=0.013)", value: "0.013" },
          { label: "Cast Iron (n=0.012)", value: "0.012" },
          { label: "Corrugated Metal (n=0.024)", value: "0.024" },
        ], defaultValue: "0.010" },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const slope = inputs.slope as number;
        const n = parseFloat(inputs.material as string);
        if (!diameter || !slope || !n) return null;
        const dFt = diameter / 12;
        const area = Math.PI * Math.pow(dFt / 2, 2);
        const hydraulicRadius = dFt / 4;
        const velocity = (1.486 / n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(slope, 0.5);
        const flowCfs = velocity * area;
        const flowGpm = flowCfs * 448.831;
        return {
          primary: { label: "Full Pipe Flow", value: `${formatNumber(flowGpm, 1)}` + " GPM" },
          details: [
            { label: "Flow (CFS)", value: `${formatNumber(flowCfs, 3)}` + " ft3/s" },
            { label: "Velocity", value: `${formatNumber(velocity, 2)}` + " ft/s" },
            { label: "Pipe Area", value: `${formatNumber(area, 4)}` + " ft2" },
            { label: "Hydraulic Radius", value: `${formatNumber(hydraulicRadius, 4)}` + " ft" },
            { label: "Manning n", value: `${n}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["drain-pipe-slope-calculator", "pipe-sizing-calculator", "water-supply-demand-calculator"],
  faq: [
    { question: "What is the Manning equation?", answer: "The Manning equation calculates gravity flow in open channels and partially full pipes: V = (1.486/n) x R^(2/3) x S^(1/2), where n is roughness, R is hydraulic radius, and S is slope." },
    { question: "What velocity should sewer pipes have?", answer: "Minimum 2 ft/s to prevent solids settling (self-cleansing velocity). Maximum about 10 ft/s to prevent erosion. Ideal range is 2-5 ft/s." },
  ],
  formula: "V = (1.486/n) x R^(2/3) x S^(1/2) | Q = V x A | R = D/4 (full pipe)",
};