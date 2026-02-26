import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const R = 8.314; // J/(mol·K)

export const isothermalProcessCalculator: CalculatorDefinition = {
  slug: "isothermal-process-calculator",
  title: "Isothermal Process Calculator",
  description: "Free isothermal process calculator. Compute work done, heat transfer, and state changes during an isothermal expansion or compression of an ideal gas.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["isothermal process", "isothermal expansion", "isothermal compression", "ideal gas", "thermodynamics", "Boyle's law"],
  variants: [
    {
      id: "work-volume",
      name: "Work from Volume Change",
      description: "Calculate work done during isothermal expansion/compression from volume change",
      fields: [
        { name: "n", label: "Moles of Gas (n)", type: "number", placeholder: "e.g. 1", min: 0.001 },
        { name: "T", label: "Temperature (K)", type: "number", placeholder: "e.g. 300", min: 0.01 },
        { name: "v1", label: "Initial Volume (L)", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "v2", label: "Final Volume (L)", type: "number", placeholder: "e.g. 20", min: 0.001 },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.n as string);
        const T = parseFloat(inputs.T as string);
        const V1 = parseFloat(inputs.v1 as string);
        const V2 = parseFloat(inputs.v2 as string);
        if (isNaN(n) || isNaN(T) || isNaN(V1) || isNaN(V2)) return null;
        if (n <= 0 || T <= 0 || V1 <= 0 || V2 <= 0) return null;

        // W = nRT·ln(V2/V1)
        const work = n * R * T * Math.log(V2 / V1);
        const heat = work; // Q = W for isothermal (ΔU = 0)

        // Pressures using ideal gas law: PV = nRT, P in Pa, V in m³
        const P1 = (n * R * T) / (V1 * 1e-3); // V in L -> m³
        const P2 = (n * R * T) / (V2 * 1e-3);

        const processType = V2 > V1 ? "Expansion" : "Compression";

        return {
          primary: { label: "Work Done by Gas", value: `${formatNumber(work, 4)} J` },
          details: [
            { label: "Process Type", value: processType },
            { label: "Work (W)", value: `${formatNumber(work, 4)} J` },
            { label: "Heat Transfer (Q)", value: `${formatNumber(heat, 4)} J` },
            { label: "ΔU (Internal Energy)", value: `${formatNumber(0, 0)} J` },
            { label: "Initial Pressure", value: `${formatNumber(P1 / 1000, 4)} kPa` },
            { label: "Final Pressure", value: `${formatNumber(P2 / 1000, 4)} kPa` },
            { label: "Volume Ratio (V2/V1)", value: formatNumber(V2 / V1, 4) },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
          ],
          note: "In an isothermal process: ΔT = 0, ΔU = 0, Q = W. Temperature stays constant; all heat absorbed becomes work.",
        };
      },
    },
    {
      id: "work-pressure",
      name: "Work from Pressure Change",
      description: "Calculate work done from initial and final pressures",
      fields: [
        { name: "n", label: "Moles of Gas (n)", type: "number", placeholder: "e.g. 1", min: 0.001 },
        { name: "T", label: "Temperature (K)", type: "number", placeholder: "e.g. 300", min: 0.01 },
        { name: "p1", label: "Initial Pressure (kPa)", type: "number", placeholder: "e.g. 200", min: 0.001 },
        { name: "p2", label: "Final Pressure (kPa)", type: "number", placeholder: "e.g. 100", min: 0.001 },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.n as string);
        const T = parseFloat(inputs.T as string);
        const P1 = parseFloat(inputs.p1 as string);
        const P2 = parseFloat(inputs.p2 as string);
        if (isNaN(n) || isNaN(T) || isNaN(P1) || isNaN(P2)) return null;
        if (n <= 0 || T <= 0 || P1 <= 0 || P2 <= 0) return null;

        // W = nRT·ln(P1/P2) since PV = const → ln(V2/V1) = ln(P1/P2)
        const work = n * R * T * Math.log(P1 / P2);
        const heat = work;

        const V1 = (n * R * T) / (P1 * 1000); // m³
        const V2 = (n * R * T) / (P2 * 1000);

        return {
          primary: { label: "Work Done by Gas", value: `${formatNumber(work, 4)} J` },
          details: [
            { label: "Work (W = Q)", value: `${formatNumber(work, 4)} J` },
            { label: "ΔU", value: `${formatNumber(0, 0)} J` },
            { label: "Initial Volume", value: `${formatNumber(V1 * 1000, 4)} L` },
            { label: "Final Volume", value: `${formatNumber(V2 * 1000, 4)} L` },
            { label: "Pressure Ratio (P1/P2)", value: formatNumber(P1 / P2, 4) },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["adiabatic-process-calculator", "carnot-efficiency-calculator", "energy-calculator"],
  faq: [
    { question: "What is an isothermal process?", answer: "An isothermal process occurs at constant temperature (ΔT = 0). For an ideal gas, this means internal energy does not change (ΔU = 0), so all heat absorbed equals the work done: Q = W = nRT·ln(V₂/V₁). Boyle's law (PV = const) applies." },
    { question: "How does isothermal differ from adiabatic?", answer: "Isothermal: temperature constant, heat exchanged freely (Q = W). Adiabatic: no heat exchange (Q = 0), temperature changes. Isothermal expansion does more work than adiabatic expansion from the same initial state because energy is continuously supplied as heat." },
    { question: "When does an isothermal process occur?", answer: "Isothermal processes occur when a system changes slowly enough to stay in thermal equilibrium with its surroundings, or when in contact with a large thermal reservoir. Examples include slow gas expansion in a cylinder surrounded by a water bath." },
  ],
  formula: "W = nRT·ln(V₂/V₁) = nRT·ln(P₁/P₂) | Q = W | ΔU = 0 | PV = nRT = const",
};
