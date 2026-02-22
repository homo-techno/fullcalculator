import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipeSizingCalculator: CalculatorDefinition = {
  slug: "pipe-sizing-calculator",
  title: "Pipe Sizing Calculator",
  description: "Free pipe sizing calculator. Determine optimal pipe diameter from flow rate and velocity for water, gas, or other fluids.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pipe sizing calculator", "pipe diameter calculator", "flow rate to diameter", "plumbing pipe size", "water pipe calculator"],
  variants: [
    {
      id: "flow-to-diameter",
      name: "Diameter from Flow Rate",
      description: "Calculate pipe diameter from flow rate and velocity",
      fields: [
        { name: "flowRate", label: "Flow Rate (GPM)", type: "number", placeholder: "e.g. 10" },
        { name: "velocity", label: "Target Velocity (ft/s)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "pipeType", label: "Pipe Material", type: "select", options: [
          { label: "Copper (Type L)", value: "copper" },
          { label: "PEX", value: "pex" },
          { label: "CPVC", value: "cpvc" },
          { label: "Steel (Schedule 40)", value: "steel" },
          { label: "PVC (Schedule 40)", value: "pvc" },
        ], defaultValue: "copper" },
      ],
      calculate: (inputs) => {
        const flowRate = inputs.flowRate as number;
        const velocity = inputs.velocity as number;
        const pipeType = inputs.pipeType as string;
        if (!flowRate || !velocity) return null;
        const flowCfs = flowRate / 448.831;
        const areaFt2 = flowCfs / velocity;
        const areaIn2 = areaFt2 * 144;
        const diamIn = Math.sqrt((4 * areaIn2) / Math.PI);
        const standardSizes = [0.375, 0.5, 0.625, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 6];
        const nominal = standardSizes.find(s => s >= diamIn) || standardSizes[standardSizes.length - 1];
        const nomArea = Math.PI * Math.pow(nominal / 2, 2);
        const actualVelocity = flowCfs / (nomArea / 144);
        const materialNames: Record<string, string> = { copper: "Copper Type L", pex: "PEX", cpvc: "CPVC", steel: "Steel Sch 40", pvc: "PVC Sch 40" };
        return {
          primary: { label: "Recommended Pipe Size", value: `${formatNumber(nominal, 3)}` + " inch nominal" },
          details: [
            { label: "Exact Diameter Needed", value: `${formatNumber(diamIn, 3)}` + " in" },
            { label: "Actual Velocity", value: `${formatNumber(actualVelocity, 2)}` + " ft/s" },
            { label: "Cross-Section Area", value: `${formatNumber(nomArea, 3)}` + " sq in" },
            { label: "Pipe Material", value: materialNames[pipeType] || pipeType },
            { label: "Flow Rate", value: `${formatNumber(flowRate, 1)}` + " GPM" },
          ],
        };
      },
    },
    {
      id: "velocity-from-size",
      name: "Velocity from Pipe Size",
      description: "Calculate velocity given pipe diameter and flow",
      fields: [
        { name: "flowRate", label: "Flow Rate (GPM)", type: "number", placeholder: "e.g. 10" },
        { name: "diameter", label: "Inside Diameter (inches)", type: "number", placeholder: "e.g. 1.0" },
      ],
      calculate: (inputs) => {
        const flowRate = inputs.flowRate as number;
        const diameter = inputs.diameter as number;
        if (!flowRate || !diameter) return null;
        const flowCfs = flowRate / 448.831;
        const areaIn2 = Math.PI * Math.pow(diameter / 2, 2);
        const areaFt2 = areaIn2 / 144;
        const velocity = flowCfs / areaFt2;
        const reynoldsApprox = (velocity * (diameter / 12)) / 0.00001217;
        const flowType = reynoldsApprox < 2300 ? "Laminar" : reynoldsApprox < 4000 ? "Transitional" : "Turbulent";
        return {
          primary: { label: "Flow Velocity", value: `${formatNumber(velocity, 2)}` + " ft/s" },
          details: [
            { label: "Pipe Area", value: `${formatNumber(areaIn2, 3)}` + " sq in" },
            { label: "Reynolds Number (approx)", value: formatNumber(reynoldsApprox, 0) },
            { label: "Flow Type", value: flowType },
            { label: "Velocity Assessment", value: velocity > 8 ? "Too high - risk of water hammer" : velocity < 2 ? "Low - risk of sediment buildup" : "Acceptable range" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["duct-size-calculator", "drain-pipe-slope-calculator", "water-supply-demand-calculator"],
  faq: [
    { question: "What velocity should water pipes have?", answer: "Residential water pipes should have velocities between 2-8 ft/s. The ideal range is 4-6 ft/s. Velocities above 8 ft/s can cause water hammer and erosion." },
    { question: "How do I convert GPM to pipe size?", answer: "Convert GPM to cubic feet per second (divide by 448.831), divide by target velocity to get area, then calculate diameter. Round up to the next standard pipe size." },
    { question: "Does pipe material affect sizing?", answer: "Yes. Different materials have different inside diameters for the same nominal size and different roughness values that affect friction losses." },
  ],
  formula: "D = sqrt(4Q / (pi x V)) | Q = GPM / 448.831 (ft3/s) | V = Q / A",
};