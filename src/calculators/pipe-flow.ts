import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipeFlowCalculator: CalculatorDefinition = {
  slug: "pipe-flow-calculator",
  title: "Pipe Flow Calculator",
  description:
    "Free pipe flow rate calculator. Calculate flow rate from pipe diameter and flow velocity. Q = A × v. Results in GPM, liters per minute, and more.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "pipe flow",
    "flow rate calculator",
    "pipe flow rate",
    "gpm calculator",
    "water flow calculator",
    "pipe velocity",
  ],
  variants: [
    {
      id: "flow-rate",
      name: "Calculate Flow Rate",
      description: "Q = A × v (cross-sectional area × velocity)",
      fields: [
        {
          name: "diameter",
          label: "Pipe Inner Diameter (inches)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "velocity",
          label: "Flow Velocity (feet/second)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const diamInches = inputs.diameter as number;
        const velocityFps = inputs.velocity as number;
        if (!diamInches || !velocityFps) return null;

        const radiusFt = diamInches / 2 / 12; // Convert inches to feet
        const areaFt2 = Math.PI * radiusFt * radiusFt;
        const flowCfs = areaFt2 * velocityFps; // cubic feet per second
        const flowGpm = flowCfs * 448.831; // GPM
        const flowLpm = flowGpm * 3.78541; // liters per minute
        const flowCfm = flowCfs * 60; // cubic feet per minute
        const flowM3h = flowLpm * 60 / 1000; // cubic meters per hour

        return {
          primary: {
            label: "Flow Rate",
            value: `${formatNumber(flowGpm, 4)} GPM`,
          },
          details: [
            { label: "Gallons per Minute (GPM)", value: formatNumber(flowGpm, 4) },
            { label: "Liters per Minute (LPM)", value: formatNumber(flowLpm, 4) },
            { label: "Cubic Feet per Second", value: formatNumber(flowCfs, 6) },
            { label: "Cubic Feet per Minute", value: formatNumber(flowCfm, 4) },
            { label: "Cubic Meters per Hour", value: formatNumber(flowM3h, 4) },
            { label: "Pipe Cross-Section Area", value: `${formatNumber(areaFt2 * 144, 4)} sq in` },
          ],
        };
      },
    },
    {
      id: "velocity",
      name: "Calculate Velocity from Flow Rate",
      description: "v = Q / A",
      fields: [
        {
          name: "diameter",
          label: "Pipe Inner Diameter (inches)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "flowGpm",
          label: "Flow Rate (GPM)",
          type: "number",
          placeholder: "e.g. 50",
        },
      ],
      calculate: (inputs) => {
        const diamInches = inputs.diameter as number;
        const gpm = inputs.flowGpm as number;
        if (!diamInches || !gpm) return null;

        const radiusFt = diamInches / 2 / 12;
        const areaFt2 = Math.PI * radiusFt * radiusFt;
        const flowCfs = gpm / 448.831;
        const velocityFps = flowCfs / areaFt2;
        const velocityMps = velocityFps * 0.3048;

        return {
          primary: {
            label: "Flow Velocity",
            value: `${formatNumber(velocityFps, 4)} ft/s`,
          },
          details: [
            { label: "Feet per Second", value: formatNumber(velocityFps, 4) },
            { label: "Meters per Second", value: formatNumber(velocityMps, 4) },
            { label: "Liters per Minute", value: formatNumber(gpm * 3.78541, 4) },
            { label: "Pipe Area", value: `${formatNumber(areaFt2 * 144, 4)} sq in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["water-pressure-calculator", "flow-rate-calculator", "reynolds-number-calculator"],
  faq: [
    {
      question: "How is pipe flow rate calculated?",
      answer:
        "Flow rate Q = A × v, where A is the pipe cross-sectional area (π × r²) and v is the flow velocity. For a 2-inch pipe at 5 ft/s: A = π × (1/12)² = 0.0218 ft², Q = 0.0218 × 5 = 0.109 ft³/s = 48.9 GPM.",
    },
    {
      question: "What is a typical water flow velocity in pipes?",
      answer:
        "For residential plumbing, typical water velocity is 4-8 ft/s. Velocities above 8 ft/s can cause noise and pipe erosion. For fire sprinkler systems, maximum velocity is typically 20 ft/s.",
    },
  ],
  formula: "Q = A × v | A = π × (d/2)² | GPM = ft³/s × 448.831",
};
