import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gibbsFreeEnergyCalculator: CalculatorDefinition = {
  slug: "gibbs-free-energy-calculator",
  title: "Gibbs Free Energy Calculator",
  description: "Free Gibbs free energy calculator. Calculate ΔG from ΔH and ΔS, determine spontaneity, and find equilibrium temperature.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Gibbs free energy", "ΔG", "spontaneity", "thermodynamics", "free energy"],
  variants: [
    {
      id: "deltaG",
      name: "Calculate ΔG",
      description: "ΔG = ΔH - TΔS",
      fields: [
        { name: "deltaH", label: "ΔH (kJ/mol)", type: "number", placeholder: "e.g. -285.8" },
        { name: "deltaS", label: "ΔS (J/mol·K)", type: "number", placeholder: "e.g. -163.2" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
      ],
      calculate: (inputs) => {
        const dH = inputs.deltaH as number, dS = inputs.deltaS as number, T = inputs.temp as number || 298.15;
        if (dH === undefined || dS === undefined || T <= 0) return null;
        const dSkJ = dS / 1000; // Convert J to kJ
        const dG = dH - T * dSkJ;
        const K = Math.exp(-dG * 1000 / (8.314 * T));
        let spontaneity = "Non-spontaneous (ΔG > 0)";
        if (dG < -0.001) spontaneity = "Spontaneous (ΔG < 0)";
        else if (Math.abs(dG) < 0.001) spontaneity = "At equilibrium (ΔG ≈ 0)";
        return {
          primary: { label: "ΔG", value: `${formatNumber(dG, 4)} kJ/mol` },
          details: [
            { label: "ΔH", value: `${formatNumber(dH, 4)} kJ/mol` },
            { label: "TΔS", value: `${formatNumber(T * dSkJ, 4)} kJ/mol` },
            { label: "Spontaneity", value: spontaneity },
            { label: "K (equilibrium constant)", value: K > 1e10 || K < 1e-10 ? K.toExponential(4) : formatNumber(K, 4) },
          ],
        };
      },
    },
    {
      id: "equilibriumTemp",
      name: "Equilibrium Temperature",
      description: "Find T where ΔG = 0 (ΔH = TΔS)",
      fields: [
        { name: "deltaH", label: "ΔH (kJ/mol)", type: "number", placeholder: "e.g. -285.8" },
        { name: "deltaS", label: "ΔS (J/mol·K)", type: "number", placeholder: "e.g. -163.2" },
      ],
      calculate: (inputs) => {
        const dH = inputs.deltaH as number, dS = inputs.deltaS as number;
        if (dH === undefined || dS === undefined || dS === 0) return null;
        const dSkJ = dS / 1000;
        const Teq = dH / dSkJ; // K
        if (Teq <= 0) {
          return {
            primary: { label: "Equilibrium Temperature", value: "No positive T (always spontaneous or always non-spontaneous)" },
            details: [
              { label: "ΔH", value: `${formatNumber(dH, 4)} kJ/mol` },
              { label: "ΔS", value: `${formatNumber(dS, 4)} J/(mol·K)` },
              { label: "Calculated T", value: `${formatNumber(Teq, 2)} K (not physical)` },
            ],
            note: dH < 0 && dS > 0 ? "Spontaneous at ALL temperatures (ΔH < 0, ΔS > 0)" : "Non-spontaneous at ALL temperatures (ΔH > 0, ΔS < 0)",
          };
        }
        return {
          primary: { label: "Equilibrium Temperature", value: `${formatNumber(Teq, 2)} K` },
          details: [
            { label: "T in °C", value: `${formatNumber(Teq - 273.15, 2)}°C` },
            { label: "ΔH", value: `${formatNumber(dH, 4)} kJ/mol` },
            { label: "ΔS", value: `${formatNumber(dS, 4)} J/(mol·K)` },
            { label: "Spontaneous below T?", value: dH < 0 && dS < 0 ? "Yes (exothermic, ΔS < 0)" : "No" },
            { label: "Spontaneous above T?", value: dH > 0 && dS > 0 ? "Yes (endothermic, ΔS > 0)" : "No" },
          ],
        };
      },
    },
    {
      id: "fromK",
      name: "ΔG° from Equilibrium Constant",
      description: "ΔG° = -RT·ln(K)",
      fields: [
        { name: "k", label: "Equilibrium Constant K", type: "number", placeholder: "e.g. 1000" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
      ],
      calculate: (inputs) => {
        const K = inputs.k as number, T = inputs.temp as number || 298.15;
        if (!K || K <= 0 || T <= 0) return null;
        const R = 8.314;
        const dG = -R * T * Math.log(K) / 1000; // kJ/mol
        return {
          primary: { label: "ΔG°", value: `${formatNumber(dG, 4)} kJ/mol` },
          details: [
            { label: "K", value: K > 1e6 ? K.toExponential(4) : formatNumber(K, 6) },
            { label: "ln(K)", value: formatNumber(Math.log(K), 6) },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
            { label: "Spontaneous?", value: dG < 0 ? "Yes (K > 1)" : "No (K < 1)" },
          ],
        };
      },
    },
    {
      id: "nonStandard",
      name: "Non-Standard ΔG",
      description: "ΔG = ΔG° + RT·ln(Q)",
      fields: [
        { name: "deltaGStd", label: "ΔG° (kJ/mol)", type: "number", placeholder: "e.g. -33.0" },
        { name: "logQ", label: "log₁₀(Q)", type: "number", placeholder: "e.g. 2", step: 0.1 },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
      ],
      calculate: (inputs) => {
        const dGstd = inputs.deltaGStd as number, logQ = inputs.logQ as number, T = inputs.temp as number || 298.15;
        if (dGstd === undefined || logQ === undefined || T <= 0) return null;
        const R = 8.314;
        const lnQ = logQ * Math.log(10); // Convert log10 to ln
        const dG = dGstd + (R * T * lnQ) / 1000;
        return {
          primary: { label: "ΔG", value: `${formatNumber(dG, 4)} kJ/mol` },
          details: [
            { label: "ΔG°", value: `${formatNumber(dGstd, 4)} kJ/mol` },
            { label: "RT·ln(Q)", value: `${formatNumber((R * T * lnQ) / 1000, 4)} kJ/mol` },
            { label: "Spontaneous?", value: dG < 0 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["entropy-calculator", "enthalpy-calculator", "equilibrium-constant-calculator"],
  faq: [
    { question: "What is Gibbs free energy?", answer: "Gibbs free energy (G) combines enthalpy and entropy to predict spontaneity: ΔG = ΔH - TΔS. If ΔG < 0, the reaction is spontaneous. If ΔG > 0, it is non-spontaneous. If ΔG = 0, the system is at equilibrium." },
    { question: "How are ΔG and K related?", answer: "ΔG° = -RT·ln(K). When K > 1, ΔG° < 0 (products favored). When K < 1, ΔG° > 0 (reactants favored). Under non-standard conditions: ΔG = ΔG° + RT·ln(Q)." },
    { question: "When is a reaction always spontaneous?", answer: "When ΔH < 0 and ΔS > 0 (exothermic with entropy increase), ΔG is always negative. When ΔH > 0 and ΔS < 0, ΔG is always positive (never spontaneous). Other combinations depend on temperature." },
  ],
  formula: "ΔG = ΔH - TΔS | ΔG° = -RT·ln(K) | ΔG = ΔG° + RT·ln(Q) | T_eq = ΔH/ΔS",
};
