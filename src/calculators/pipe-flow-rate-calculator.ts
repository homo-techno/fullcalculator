import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipeFlowRateCalculator: CalculatorDefinition = {
  slug: "pipe-flow-rate-calculator",
  title: "Pipe Flow Rate Calculator",
  description: "Calculate water flow rate through a pipe.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pipe flow rate","water flow gpm"],
  variants: [{
    id: "standard",
    name: "Pipe Flow Rate",
    description: "Calculate water flow rate through a pipe.",
    fields: [
      { name: "diameter", label: "Pipe Diameter (in)", type: "number", min: 0.25, max: 12, defaultValue: 1 },
      { name: "velocity", label: "Flow Velocity (ft/s)", type: "number", min: 0.5, max: 20, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const dia = inputs.diameter as number;
      const vel = inputs.velocity as number;
      const areaFt = Math.PI * Math.pow((dia / 12) / 2, 2);
      const cfs = areaFt * vel;
      const gpm = cfs * 448.83;
      return {
        primary: { label: "Flow Rate", value: formatNumber(Math.round(gpm * 10) / 10) + " GPM" },
        details: [
          { label: "Pipe Area", value: formatNumber(Math.round(areaFt * 10000) / 10000) + " sq ft" },
          { label: "Flow (CFS)", value: formatNumber(Math.round(cfs * 1000) / 1000) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a typical flow velocity?", answer: "Residential water pipes typically flow at 4 to 8 feet per second." },
    { question: "How does pipe size affect flow?", answer: "Doubling diameter increases flow capacity by about four times." },
  ],
  formula: "GPM = Pi x (D/24)^2 x Velocity x 448.83",
};
