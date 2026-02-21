import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vaporPressureCalculator: CalculatorDefinition = {
  slug: "vapor-pressure-calculator",
  title: "Vapor Pressure Calculator",
  description: "Free vapor pressure calculator. Use the Clausius-Clapeyron equation to calculate vapor pressure at different temperatures and heat of vaporization.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["vapor pressure", "Clausius-Clapeyron", "boiling point", "evaporation", "heat of vaporization"],
  variants: [
    {
      id: "clausiusClapeyron",
      name: "Clausius-Clapeyron (Find P2)",
      description: "Calculate vapor pressure at a new temperature",
      fields: [
        { name: "p1", label: "Known Vapor Pressure P1 (mmHg)", type: "number", placeholder: "e.g. 760" },
        { name: "t1", label: "Temperature at P1 (K)", type: "number", placeholder: "e.g. 373.15" },
        { name: "t2", label: "New Temperature T2 (K)", type: "number", placeholder: "e.g. 350" },
        { name: "deltaHvap", label: "ΔHvap (kJ/mol)", type: "number", placeholder: "e.g. 40.7 for water" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number, t1 = inputs.t1 as number, t2 = inputs.t2 as number;
        const dH = inputs.deltaHvap as number;
        if (!p1 || !t1 || !t2 || !dH || t1 <= 0 || t2 <= 0 || p1 <= 0) return null;
        const R = 8.314; // J/(mol·K)
        const dHJ = dH * 1000; // Convert kJ to J
        const lnRatio = (dHJ / R) * (1 / t1 - 1 / t2);
        const p2 = p1 * Math.exp(lnRatio);
        return {
          primary: { label: "Vapor Pressure at T2", value: `${formatNumber(p2, 4)} mmHg` },
          details: [
            { label: "P2 in atm", value: formatNumber(p2 / 760, 6) },
            { label: "P2 in kPa", value: formatNumber(p2 * 0.133322, 4) },
            { label: "P1", value: `${formatNumber(p1, 2)} mmHg at ${formatNumber(t1, 2)} K` },
            { label: "ln(P2/P1)", value: formatNumber(lnRatio, 6) },
          ],
        };
      },
    },
    {
      id: "findDeltaH",
      name: "Find ΔHvap",
      description: "Calculate heat of vaporization from two P-T data points",
      fields: [
        { name: "p1", label: "Vapor Pressure P1 (mmHg)", type: "number", placeholder: "e.g. 100" },
        { name: "t1", label: "Temperature T1 (K)", type: "number", placeholder: "e.g. 342" },
        { name: "p2", label: "Vapor Pressure P2 (mmHg)", type: "number", placeholder: "e.g. 760" },
        { name: "t2", label: "Temperature T2 (K)", type: "number", placeholder: "e.g. 373.15" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number, t1 = inputs.t1 as number;
        const p2 = inputs.p2 as number, t2 = inputs.t2 as number;
        if (!p1 || !t1 || !p2 || !t2 || p1 <= 0 || p2 <= 0 || t1 <= 0 || t2 <= 0) return null;
        const R = 8.314;
        const dH = -R * Math.log(p2 / p1) / (1 / t2 - 1 / t1);
        return {
          primary: { label: "ΔHvap", value: `${formatNumber(dH / 1000, 4)} kJ/mol` },
          details: [
            { label: "ΔHvap in J/mol", value: formatNumber(dH, 2) },
            { label: "ΔHvap in kcal/mol", value: formatNumber(dH / 4184, 4) },
            { label: "ln(P2/P1)", value: formatNumber(Math.log(p2 / p1), 6) },
            { label: "1/T1 - 1/T2", value: (1 / t1 - 1 / t2).toExponential(6) },
          ],
        };
      },
    },
    {
      id: "raoults",
      name: "Raoult's Law",
      description: "Vapor pressure of solution (ideal solution)",
      fields: [
        { name: "pPure", label: "Pure Solvent Vapor Pressure (mmHg)", type: "number", placeholder: "e.g. 23.8 for water at 25°C" },
        { name: "moleFractionSolvent", label: "Mole Fraction of Solvent", type: "number", placeholder: "e.g. 0.95", min: 0, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const pPure = inputs.pPure as number, x = inputs.moleFractionSolvent as number;
        if (!pPure || !x || x <= 0 || x > 1 || pPure <= 0) return null;
        const pSolution = pPure * x;
        const vaporPressureLowering = pPure - pSolution;
        const xSolute = 1 - x;
        return {
          primary: { label: "Solution Vapor Pressure", value: `${formatNumber(pSolution, 4)} mmHg` },
          details: [
            { label: "Pure Solvent VP", value: `${formatNumber(pPure, 4)} mmHg` },
            { label: "Vapor Pressure Lowering", value: `${formatNumber(vaporPressureLowering, 4)} mmHg` },
            { label: "Mole Fraction Solvent", value: formatNumber(x, 4) },
            { label: "Mole Fraction Solute", value: formatNumber(xSolute, 4) },
            { label: "% Decrease", value: `${formatNumber(xSolute * 100, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boiling-point-calculator", "freezing-point-calculator", "ideal-gas-law-calculator"],
  faq: [
    { question: "What is the Clausius-Clapeyron equation?", answer: "ln(P2/P1) = (ΔHvap/R)(1/T1 - 1/T2). It relates vapor pressure to temperature using the enthalpy of vaporization. P1 and P2 are vapor pressures at temperatures T1 and T2 (in Kelvin), R = 8.314 J/(mol·K)." },
    { question: "What is Raoult's Law?", answer: "Raoult's Law states: P_solution = x_solvent × P°_solvent, where x is the mole fraction. Adding a non-volatile solute lowers the vapor pressure. This is a colligative property." },
    { question: "What affects vapor pressure?", answer: "Vapor pressure increases with temperature (exponentially). Stronger intermolecular forces = lower vapor pressure. Adding non-volatile solute decreases vapor pressure (Raoult's Law)." },
  ],
  formula: "ln(P₂/P₁) = (ΔHvap/R)(1/T₁ - 1/T₂) | Raoult's: P = x × P° | R = 8.314 J/(mol·K)",
};
