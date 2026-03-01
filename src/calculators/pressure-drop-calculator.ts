import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pressureDropCalculator: CalculatorDefinition = {
  slug: "pressure-drop-calculator",
  title: "Pressure Drop Calculator",
  description: "Calculate pressure loss in piping systems due to friction based on pipe dimensions and flow rate.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pressure drop", "pipe pressure loss", "friction loss"],
  variants: [{
    id: "standard",
    name: "Pressure Drop",
    description: "Calculate pressure loss in piping systems due to friction based on pipe dimensions and flow rate",
    fields: [
      { name: "pipeLength", label: "Pipe Length", type: "number", suffix: "feet", min: 1, max: 50000, defaultValue: 200 },
      { name: "diameter", label: "Pipe Diameter", type: "number", suffix: "inches", min: 0.5, max: 48, defaultValue: 4 },
      { name: "flowRate", label: "Flow Rate", type: "number", suffix: "GPM", min: 1, max: 100000, defaultValue: 100 },
      { name: "pipeMaterial", label: "Pipe Material", type: "select", options: [{value:"steel",label:"Steel"},{value:"copper",label:"Copper"},{value:"pvc",label:"PVC"},{value:"cast-iron",label:"Cast Iron"}], defaultValue: "steel" },
    ],
    calculate: (inputs) => {
      const length = inputs.pipeLength as number;
      const dia = inputs.diameter as number;
      const gpm = inputs.flowRate as number;
      const material = inputs.pipeMaterial as string;
      if (!length || !dia || !gpm) return null;
      const roughness: Record<string, number> = { steel: 0.00015, copper: 0.000005, pvc: 0.000005, "cast-iron": 0.00085 };
      const e = roughness[material] || 0.00015;
      const dFt = dia / 12;
      const area = Math.PI * Math.pow(dFt / 2, 2);
      const vel = (gpm * 0.002228) / area;
      const f = 0.025 + 0.05 * (e / dFt);
      const headLoss = f * (length / dFt) * Math.pow(vel, 2) / (2 * 32.174);
      const psiDrop = headLoss * 62.4 / 144;
      return {
        primary: { label: "Pressure Drop", value: psiDrop.toFixed(2) + " psi" },
        details: [
          { label: "Head Loss", value: headLoss.toFixed(2) + " ft" },
          { label: "Flow Velocity", value: vel.toFixed(2) + " ft/s" },
          { label: "Friction Factor", value: f.toFixed(4) },
        ],
      };
    },
  }],
  relatedSlugs: ["pipe-flow-calculator", "reynolds-number-calculator"],
  faq: [
    { question: "What causes pressure drop in pipes?", answer: "Pressure drop is caused by friction between the fluid and pipe walls, pipe fittings, valves, and changes in pipe diameter or direction." },
    { question: "How do I reduce pressure drop?", answer: "Increase pipe diameter, reduce pipe length, minimize fittings and bends, and use smoother pipe materials like PVC or copper." },
  ],
  formula: "Pressure Drop = Friction Factor x (Length/Diameter) x (Velocity squared) / (2 x g) x Density / 144",
};
