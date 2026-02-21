import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const osmoticPressureCalculator: CalculatorDefinition = {
  slug: "osmotic-pressure-calculator",
  title: "Osmotic Pressure Calculator",
  description: "Free osmotic pressure calculator. Calculate osmotic pressure of solutions using the van't Hoff equation (π = iMRT).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["osmotic pressure", "van't Hoff equation", "osmolarity", "colligative properties", "semipermeable membrane"],
  variants: [
    {
      id: "osmoticPressure",
      name: "Calculate Osmotic Pressure",
      fields: [
        { name: "molarity", label: "Molarity (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1 for non-electrolyte, 2 for NaCl", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const M = inputs.molarity as number, T = inputs.temp as number || 298.15, i = inputs.i as number || 1;
        if (!M || M <= 0 || T <= 0) return null;
        const R = 0.08206; // L·atm/(mol·K)
        const pi = i * M * R * T;
        const osmolarity = i * M;
        return {
          primary: { label: "Osmotic Pressure (π)", value: `${formatNumber(pi, 4)} atm` },
          details: [
            { label: "π in mmHg", value: formatNumber(pi * 760, 2) },
            { label: "π in kPa", value: formatNumber(pi * 101.325, 4) },
            { label: "π in psi", value: formatNumber(pi * 14.696, 4) },
            { label: "Osmolarity", value: `${formatNumber(osmolarity, 4)} Osm/L` },
            { label: "van't Hoff Factor", value: `${i}` },
          ],
        };
      },
    },
    {
      id: "findMolarity",
      name: "Find Molarity from Osmotic Pressure",
      fields: [
        { name: "pi", label: "Osmotic Pressure (atm)", type: "number", placeholder: "e.g. 2.45" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const pi = inputs.pi as number, T = inputs.temp as number || 298.15, i = inputs.i as number || 1;
        if (!pi || pi <= 0 || T <= 0 || i <= 0) return null;
        const R = 0.08206;
        const M = pi / (i * R * T);
        return {
          primary: { label: "Molarity", value: `${formatNumber(M, 6)} M` },
          details: [
            { label: "Osmotic Pressure", value: `${formatNumber(pi, 4)} atm` },
            { label: "Temperature", value: `${formatNumber(T, 2)} K (${formatNumber(T - 273.15, 2)}°C)` },
            { label: "Osmolarity", value: `${formatNumber(i * M, 6)} Osm/L` },
          ],
        };
      },
    },
    {
      id: "molarMassFromOsmotic",
      name: "Molar Mass from Osmotic Pressure",
      description: "Determine molar mass of unknown solute",
      fields: [
        { name: "pi", label: "Osmotic Pressure (atm)", type: "number", placeholder: "e.g. 0.245" },
        { name: "mass", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 5.0" },
        { name: "volume", label: "Solution Volume (L)", type: "number", placeholder: "e.g. 1.0" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
        { name: "i", label: "van't Hoff Factor (i)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const pi = inputs.pi as number, mass = inputs.mass as number, vol = inputs.volume as number;
        const T = inputs.temp as number || 298.15, i = inputs.i as number || 1;
        if (!pi || !mass || !vol || pi <= 0 || mass <= 0 || vol <= 0 || T <= 0) return null;
        const R = 0.08206;
        const M = pi / (i * R * T); // molarity
        const moles = M * vol;
        const molarMass = mass / moles;
        return {
          primary: { label: "Molar Mass", value: `${formatNumber(molarMass, 2)} g/mol` },
          details: [
            { label: "Molarity", value: `${formatNumber(M, 6)} M` },
            { label: "Moles of Solute", value: formatNumber(moles, 6) },
            { label: "Mass of Solute", value: `${formatNumber(mass, 4)} g` },
          ],
          note: "Osmotic pressure is commonly used to determine molar masses of large molecules (proteins, polymers) because even dilute solutions produce measurable pressures.",
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "freezing-point-calculator", "boiling-point-calculator"],
  faq: [
    { question: "What is osmotic pressure?", answer: "Osmotic pressure (π) is the minimum pressure needed to prevent osmosis across a semipermeable membrane. It is calculated by π = iMRT, where i is the van't Hoff factor, M is molarity, R is the gas constant, and T is temperature in Kelvin." },
    { question: "What is the van't Hoff factor?", answer: "The van't Hoff factor (i) represents the number of particles a solute dissociates into. For non-electrolytes (glucose): i=1. For NaCl: i=2 (Na⁺ + Cl⁻). For CaCl₂: i=3 (Ca²⁺ + 2Cl⁻). Real values may be slightly lower due to ion pairing." },
    { question: "How is osmotic pressure used in biology?", answer: "Osmotic pressure is critical in: IV fluid preparation (isotonic solutions ~0.9% NaCl), kidney function, plant water uptake, dialysis, and reverse osmosis water purification." },
  ],
  formula: "π = iMRT | R = 0.08206 L·atm/(mol·K) | i = van't Hoff factor",
};
