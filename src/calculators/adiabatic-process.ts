import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adiabaticProcessCalculator: CalculatorDefinition = {
  slug: "adiabatic-process-calculator",
  title: "Adiabatic Process Calculator",
  description: "Free adiabatic process calculator. Compute final temperature, pressure, volume, and work done during an adiabatic expansion or compression of an ideal gas.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["adiabatic process", "adiabatic expansion", "adiabatic compression", "ideal gas", "thermodynamics", "gamma ratio"],
  variants: [
    {
      id: "temp-volume",
      name: "Temperature-Volume Relation",
      description: "Calculate final temperature from initial state and volume change (TV^(γ-1) = const)",
      fields: [
        { name: "t1", label: "Initial Temperature (K)", type: "number", placeholder: "e.g. 300", min: 0.01 },
        { name: "v1", label: "Initial Volume (L)", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "v2", label: "Final Volume (L)", type: "number", placeholder: "e.g. 2", min: 0.001 },
        {
          name: "gasType",
          label: "Gas Type",
          type: "select",
          options: [
            { label: "Monatomic (γ = 5/3)", value: "mono" },
            { label: "Diatomic (γ = 7/5)", value: "di" },
            { label: "Polyatomic (γ = 4/3)", value: "poly" },
          ],
          defaultValue: "di",
        },
      ],
      calculate: (inputs) => {
        const T1 = parseFloat(inputs.t1 as string);
        const V1 = parseFloat(inputs.v1 as string);
        const V2 = parseFloat(inputs.v2 as string);
        const gasType = (inputs.gasType as string) || "di";
        if (isNaN(T1) || isNaN(V1) || isNaN(V2)) return null;
        if (T1 <= 0 || V1 <= 0 || V2 <= 0) return null;

        let gamma: number;
        switch (gasType) {
          case "mono": gamma = 5 / 3; break;
          case "poly": gamma = 4 / 3; break;
          default: gamma = 7 / 5;
        }

        // T1 * V1^(γ-1) = T2 * V2^(γ-1)
        const T2 = T1 * Math.pow(V1 / V2, gamma - 1);
        const compressionRatio = V1 / V2;
        const processType = V2 < V1 ? "Compression" : "Expansion";

        return {
          primary: { label: "Final Temperature", value: `${formatNumber(T2, 2)} K` },
          details: [
            { label: "Process Type", value: processType },
            { label: "Initial Temperature", value: `${formatNumber(T1, 2)} K` },
            { label: "Final Temperature", value: `${formatNumber(T2, 2)} K` },
            { label: "Temperature Change", value: `${formatNumber(T2 - T1, 2)} K` },
            { label: "Volume Ratio (V1/V2)", value: formatNumber(compressionRatio, 4) },
            { label: "γ (Heat Capacity Ratio)", value: formatNumber(gamma, 4) },
            { label: "Relation", value: "T·V^(γ-1) = const" },
          ],
        };
      },
    },
    {
      id: "pressure-volume",
      name: "Pressure-Volume Relation",
      description: "Calculate final pressure from volume change (PV^γ = const)",
      fields: [
        { name: "p1", label: "Initial Pressure (kPa)", type: "number", placeholder: "e.g. 101.325", min: 0.001 },
        { name: "v1", label: "Initial Volume (L)", type: "number", placeholder: "e.g. 10", min: 0.001 },
        { name: "v2", label: "Final Volume (L)", type: "number", placeholder: "e.g. 2", min: 0.001 },
        {
          name: "gasType",
          label: "Gas Type",
          type: "select",
          options: [
            { label: "Monatomic (γ = 5/3)", value: "mono" },
            { label: "Diatomic (γ = 7/5)", value: "di" },
            { label: "Polyatomic (γ = 4/3)", value: "poly" },
          ],
          defaultValue: "di",
        },
      ],
      calculate: (inputs) => {
        const P1 = parseFloat(inputs.p1 as string);
        const V1 = parseFloat(inputs.v1 as string);
        const V2 = parseFloat(inputs.v2 as string);
        const gasType = (inputs.gasType as string) || "di";
        if (isNaN(P1) || isNaN(V1) || isNaN(V2)) return null;
        if (P1 <= 0 || V1 <= 0 || V2 <= 0) return null;

        let gamma: number;
        switch (gasType) {
          case "mono": gamma = 5 / 3; break;
          case "poly": gamma = 4 / 3; break;
          default: gamma = 7 / 5;
        }

        // P1 * V1^γ = P2 * V2^γ
        const P2 = P1 * Math.pow(V1 / V2, gamma);

        // Work done: W = (P1V1 - P2V2) / (γ - 1)
        // Convert L·kPa to Joules: 1 L·kPa = 1 J
        const work = (P1 * V1 - P2 * V2) / (gamma - 1);

        return {
          primary: { label: "Final Pressure", value: `${formatNumber(P2, 4)} kPa` },
          details: [
            { label: "Initial Pressure", value: `${formatNumber(P1, 4)} kPa` },
            { label: "Final Pressure", value: `${formatNumber(P2, 4)} kPa` },
            { label: "Pressure Ratio (P2/P1)", value: formatNumber(P2 / P1, 4) },
            { label: "Work Done by Gas", value: `${formatNumber(work, 4)} J` },
            { label: "γ", value: formatNumber(gamma, 4) },
            { label: "Relation", value: "P·V^γ = const" },
          ],
          note: work > 0 ? "Gas does positive work (expansion)." : "Work is done on the gas (compression).",
        };
      },
    },
    {
      id: "work",
      name: "Adiabatic Work",
      description: "Calculate work done during an adiabatic process for n moles of ideal gas",
      fields: [
        { name: "n", label: "Moles of Gas (n)", type: "number", placeholder: "e.g. 1", min: 0.001 },
        { name: "t1", label: "Initial Temperature (K)", type: "number", placeholder: "e.g. 300", min: 0.01 },
        { name: "t2", label: "Final Temperature (K)", type: "number", placeholder: "e.g. 500", min: 0.01 },
        {
          name: "gasType",
          label: "Gas Type",
          type: "select",
          options: [
            { label: "Monatomic (γ = 5/3)", value: "mono" },
            { label: "Diatomic (γ = 7/5)", value: "di" },
            { label: "Polyatomic (γ = 4/3)", value: "poly" },
          ],
          defaultValue: "di",
        },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.n as string);
        const T1 = parseFloat(inputs.t1 as string);
        const T2 = parseFloat(inputs.t2 as string);
        const gasType = (inputs.gasType as string) || "di";
        if (isNaN(n) || isNaN(T1) || isNaN(T2)) return null;

        let gamma: number;
        switch (gasType) {
          case "mono": gamma = 5 / 3; break;
          case "poly": gamma = 4 / 3; break;
          default: gamma = 7 / 5;
        }

        const R = 8.314; // J/(mol·K)
        const Cv = R / (gamma - 1);
        // W = nCv(T1 - T2) for adiabatic (Q = 0, so W = -ΔU)
        const work = n * Cv * (T1 - T2);
        const deltaU = n * Cv * (T2 - T1);

        return {
          primary: { label: "Work Done by Gas", value: `${formatNumber(work, 4)} J` },
          details: [
            { label: "Work (W)", value: `${formatNumber(work, 4)} J` },
            { label: "Change in Internal Energy (ΔU)", value: `${formatNumber(deltaU, 4)} J` },
            { label: "Heat Transfer (Q)", value: `${formatNumber(0, 0)} J` },
            { label: "Cv", value: `${formatNumber(Cv, 4)} J/(mol·K)` },
            { label: "Moles", value: formatNumber(n, 4) },
            { label: "ΔT", value: `${formatNumber(T2 - T1, 2)} K` },
          ],
          note: "In an adiabatic process Q = 0, so W = -ΔU = nCv(T₁ - T₂).",
        };
      },
    },
  ],
  relatedSlugs: ["isothermal-process-calculator", "carnot-efficiency-calculator", "energy-calculator"],
  faq: [
    { question: "What is an adiabatic process?", answer: "An adiabatic process is one in which no heat is transferred to or from the system (Q = 0). All energy changes come from work. During adiabatic compression, temperature rises; during expansion, it falls. The key relation is PV^γ = constant." },
    { question: "What is gamma (γ)?", answer: "Gamma (γ) = Cp/Cv is the heat capacity ratio. For monatomic ideal gases (He, Ar): γ = 5/3 ≈ 1.667. For diatomic gases (N₂, O₂): γ = 7/5 = 1.4. For polyatomic gases (CO₂): γ ≈ 4/3 ≈ 1.333." },
  ],
  formula: "PV^γ = const | TV^(γ-1) = const | W = nCv(T₁ - T₂) | Q = 0 | γ = Cp/Cv",
};
