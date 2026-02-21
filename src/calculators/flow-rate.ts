import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flowRateCalculator: CalculatorDefinition = {
  slug: "flow-rate-calculator",
  title: "Flow Rate Calculator",
  description: "Free flow rate calculator. Calculate volume flow rate, velocity, and pipe sizing for fluid dynamics problems.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["flow rate calculator", "volume flow rate", "pipe flow", "fluid dynamics", "GPM calculator"],
  variants: [
    {
      id: "fromVelocity",
      name: "From Velocity & Area",
      fields: [
        { name: "velocity", label: "Flow Velocity (m/s)", type: "number", placeholder: "e.g. 2" },
        { name: "diameter", label: "Pipe Diameter (m)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const v = inputs.velocity as number, d = inputs.diameter as number;
        if (!v || !d) return null;
        const area = Math.PI * (d / 2) * (d / 2);
        const qM3s = v * area;
        const qLpm = qM3s * 60000;
        const qGpm = qM3s * 15850.3;
        return {
          primary: { label: "Flow Rate", value: `${formatNumber(qM3s, 6)} m³/s` },
          details: [
            { label: "Liters/min", value: formatNumber(qLpm, 2) },
            { label: "Gallons/min (US)", value: formatNumber(qGpm, 2) },
            { label: "Cross-section area", value: `${formatNumber(area * 10000, 4)} cm²` },
            { label: "Reynolds number (water)", value: formatNumber(v * d / 1.004e-6, 0) },
          ],
        };
      },
    },
    {
      id: "convert",
      name: "Convert Flow Units",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 10" },
        { name: "from", label: "From", type: "select", options: [
          { label: "GPM (US)", value: "gpm" }, { label: "Liters/min", value: "lpm" },
          { label: "m³/s", value: "m3s" }, { label: "m³/hr", value: "m3h" },
          { label: "CFM (ft³/min)", value: "cfm" },
        ]},
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "gpm";
        if (!val) return null;
        const toM3s: Record<string, number> = {
          gpm: 6.309e-5, lpm: 1.667e-5, m3s: 1, m3h: 1/3600, cfm: 4.719e-4,
        };
        const m3s = val * (toM3s[from] || 1);
        return {
          primary: { label: "Conversions", value: `${formatNumber(m3s * 60000, 4)} L/min` },
          details: [
            { label: "m³/s", value: m3s.toExponential(4) },
            { label: "m³/hr", value: formatNumber(m3s * 3600, 4) },
            { label: "GPM (US)", value: formatNumber(m3s / 6.309e-5, 4) },
            { label: "L/min", value: formatNumber(m3s * 60000, 4) },
            { label: "CFM", value: formatNumber(m3s / 4.719e-4, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["density-calculator", "pressure-calculator", "volume-calculator"],
  faq: [{ question: "How do I calculate flow rate?", answer: "Flow rate Q = velocity × cross-sectional area. For a circular pipe: Q = v × π(d/2)². Units: m³/s, L/min, or GPM. Average household faucet: 2-3 GPM. Garden hose: 5-10 GPM." }],
  formula: "Q = v × A = v × π(d/2)²",
};
