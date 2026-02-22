import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partialPressureCalculator: CalculatorDefinition = {
  slug: "partial-pressure-calculator",
  title: "Dalton's Partial Pressure Calculator",
  description: "Free partial pressure calculator using Dalton's law. Calculate individual gas partial pressures from mole fractions and total pressure in gas mixtures.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["partial pressure", "Dalton's law", "gas mixture", "mole fraction", "total pressure"],
  variants: [
    {
      id: "from-mole-fraction",
      name: "From Mole Fraction",
      fields: [
        { name: "totalPressure", label: "Total Pressure (atm)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
        { name: "moleFraction", label: "Mole Fraction of Gas", type: "number", placeholder: "e.g. 0.21 for O₂ in air", min: 0, max: 1, step: 0.001 },
      ],
      calculate: (inputs) => {
        const Ptotal = inputs.totalPressure as number;
        const x = inputs.moleFraction as number;
        if (!Ptotal || x === undefined || Ptotal <= 0 || x < 0 || x > 1) return null;
        const Ppartial = Ptotal * x;
        return {
          primary: { label: "Partial Pressure", value: formatNumber(Ppartial, 4), suffix: "atm" },
          details: [
            { label: "Partial Pressure (kPa)", value: formatNumber(Ppartial * 101.325, 4) },
            { label: "Partial Pressure (mmHg)", value: formatNumber(Ppartial * 760, 2) },
            { label: "Total Pressure", value: `${formatNumber(Ptotal, 4)} atm` },
            { label: "Mole Fraction", value: formatNumber(x, 6) },
          ],
          note: "Dalton's Law: P_i = χ_i × P_total. The sum of all partial pressures equals the total pressure.",
        };
      },
    },
    {
      id: "two-gas-mixture",
      name: "Two-Gas Mixture",
      fields: [
        { name: "molesA", label: "Moles of Gas A", type: "number", placeholder: "e.g. 2.0", min: 0, step: 0.001 },
        { name: "molesB", label: "Moles of Gas B", type: "number", placeholder: "e.g. 3.0", min: 0, step: 0.001 },
        { name: "totalPressure", label: "Total Pressure (atm)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const nA = inputs.molesA as number;
        const nB = inputs.molesB as number;
        const Ptotal = inputs.totalPressure as number;
        if (!nA || !nB || !Ptotal || nA < 0 || nB < 0 || Ptotal <= 0) return null;
        const nTotal = nA + nB;
        const xA = nA / nTotal;
        const xB = nB / nTotal;
        const PA = Ptotal * xA;
        const PB = Ptotal * xB;
        return {
          primary: { label: "Partial Pressure of A", value: formatNumber(PA, 4), suffix: "atm" },
          details: [
            { label: "Partial Pressure of B", value: `${formatNumber(PB, 4)} atm` },
            { label: "Mole Fraction of A (χ_A)", value: formatNumber(xA, 6) },
            { label: "Mole Fraction of B (χ_B)", value: formatNumber(xB, 6) },
            { label: "Total Moles", value: formatNumber(nTotal, 4) },
            { label: "P_A + P_B", value: `${formatNumber(PA + PB, 4)} atm` },
          ],
        };
      },
    },
    {
      id: "air-composition",
      name: "Air Composition at Altitude",
      fields: [
        { name: "totalPressure", label: "Atmospheric Pressure (atm)", type: "number", placeholder: "e.g. 1.0 at sea level", min: 0.001, step: 0.001 },
        {
          name: "gas",
          label: "Gas Component",
          type: "select",
          options: [
            { label: "Nitrogen (N₂) - 78.09%", value: "0.7809" },
            { label: "Oxygen (O₂) - 20.95%", value: "0.2095" },
            { label: "Argon (Ar) - 0.93%", value: "0.0093" },
            { label: "Carbon Dioxide (CO₂) - 0.04%", value: "0.0004" },
            { label: "Water Vapor (avg) - 1.0%", value: "0.01" },
          ],
        },
      ],
      calculate: (inputs) => {
        const Ptotal = inputs.totalPressure as number;
        const x = parseFloat(inputs.gas as string);
        if (!Ptotal || !x || Ptotal <= 0) return null;
        const Ppartial = Ptotal * x;
        return {
          primary: { label: "Partial Pressure", value: formatNumber(Ppartial, 6), suffix: "atm" },
          details: [
            { label: "Partial Pressure (kPa)", value: formatNumber(Ppartial * 101.325, 4) },
            { label: "Partial Pressure (mmHg)", value: formatNumber(Ppartial * 760, 4) },
            { label: "Mole Fraction", value: formatNumber(x, 6) },
            { label: "Percentage", value: `${formatNumber(x * 100, 4)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ideal-gas-constant-calculator", "mole-fraction-calculator", "gas-stoichiometry-calculator"],
  faq: [
    { question: "What is Dalton's law of partial pressures?", answer: "Dalton's law states that the total pressure of a gas mixture equals the sum of the partial pressures of each individual gas. Each gas's partial pressure equals its mole fraction times the total pressure: P_i = χ_i × P_total." },
    { question: "What is partial pressure used for?", answer: "Partial pressure is used in respiratory physiology (O₂ and CO₂ transport), scuba diving calculations, industrial gas mixing, and weather prediction (water vapor pressure)." },
  ],
  formula: "P_i = χ_i × P_total | P_total = P₁ + P₂ + P₃ + ... | χ_i = n_i / n_total",
};
