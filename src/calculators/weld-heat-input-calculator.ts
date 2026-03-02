import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weldHeatInputCalculator: CalculatorDefinition = {
  slug: "weld-heat-input-calculator",
  title: "Weld Heat Input Calculator",
  description: "Calculate heat input for arc welding processes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["weld heat input","welding energy calculator"],
  variants: [{
    id: "standard",
    name: "Weld Heat Input",
    description: "Calculate heat input for arc welding processes.",
    fields: [
      { name: "voltage", label: "Arc Voltage (V)", type: "number", min: 10, max: 50, defaultValue: 25 },
      { name: "amperage", label: "Welding Current (A)", type: "number", min: 50, max: 500, defaultValue: 200 },
      { name: "travelSpeed", label: "Travel Speed (in/min)", type: "number", min: 1, max: 60, defaultValue: 10 },
      { name: "efficiency", label: "Process Efficiency (%)", type: "number", min: 20, max: 100, defaultValue: 80 },
    ],
    calculate: (inputs) => {
      const v = inputs.voltage as number;
      const a = inputs.amperage as number;
      const ts = inputs.travelSpeed as number;
      const eff = inputs.efficiency as number;
      if (!v || !a || !ts || !eff) return null;
      const heatRaw = (v * a * 60) / ts;
      const heatNet = Math.round(heatRaw * (eff / 100));
      const kjPerIn = Math.round(heatNet / 1000 * 100) / 100;
      return {
        primary: { label: "Heat Input", value: formatNumber(kjPerIn) + " kJ/in" },
        details: [
          { label: "Gross Heat Input", value: formatNumber(Math.round(heatRaw / 1000 * 100) / 100) + " kJ/in" },
          { label: "Arc Power", value: formatNumber(v * a) + " W" },
          { label: "Efficiency", value: eff + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Why does heat input matter?", answer: "Heat input affects the weld microstructure, distortion, and residual stress." },
    { question: "What is a typical efficiency for MIG welding?", answer: "MIG or GMAW typically has a process efficiency of 80 to 85 percent." },
  ],
  formula: "Heat Input (kJ/in) = (Voltage x Amps x 60 / Travel Speed) x Efficiency / 1000",
};
