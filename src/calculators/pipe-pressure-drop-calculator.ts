import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pipePressureDropCalculator: CalculatorDefinition = {
  slug: "pipe-pressure-drop-calculator",
  title: "Pipe Pressure Drop Calculator",
  description: "Estimate pressure loss in a pipe run.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pressure drop","pipe friction loss"],
  variants: [{
    id: "standard",
    name: "Pipe Pressure Drop",
    description: "Estimate pressure loss in a pipe run.",
    fields: [
      { name: "length", label: "Pipe Length (ft)", type: "number", min: 1, max: 5000, defaultValue: 100 },
      { name: "diameter", label: "Pipe Diameter (in)", type: "number", min: 0.5, max: 12, defaultValue: 1 },
      { name: "flowRate", label: "Flow Rate (GPM)", type: "number", min: 0.5, max: 500, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const len = inputs.length as number;
      const dia = inputs.diameter as number;
      const gpm = inputs.flowRate as number;
      const vel = (gpm * 0.4085) / Math.pow(dia / 2, 2);
      const frictionFactor = 0.02;
      const headLoss = frictionFactor * (len / (dia / 12)) * Math.pow(vel, 2) / (2 * 32.2);
      const psi = headLoss * 0.433;
      return {
        primary: { label: "Pressure Drop", value: formatNumber(Math.round(psi * 10) / 10) + " PSI" },
        details: [
          { label: "Head Loss", value: formatNumber(Math.round(headLoss * 10) / 10) + " ft" },
          { label: "Velocity", value: formatNumber(Math.round(vel * 10) / 10) + " ft/s" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What causes pressure drop?", answer: "Friction between water and pipe walls causes pressure loss." },
    { question: "How do I reduce pressure drop?", answer: "Use larger diameter pipes or shorter runs to reduce loss." },
  ],
  formula: "Head Loss = f x (L/D) x V^2 / (2g)",
};
