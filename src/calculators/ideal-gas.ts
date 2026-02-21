import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const idealGasCalculator: CalculatorDefinition = {
  slug: "ideal-gas-law-calculator",
  title: "Ideal Gas Law Calculator",
  description: "Free ideal gas law calculator. Solve PV = nRT for pressure, volume, temperature, or moles.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ideal gas law calculator", "PV=nRT", "gas law calculator", "pressure volume temperature", "Boyle's law"],
  variants: [
    {
      id: "solveP",
      name: "Solve for Pressure",
      fields: [
        { name: "n", label: "Moles (n)", type: "number", placeholder: "e.g. 1" },
        { name: "T", label: "Temperature (K)", type: "number", placeholder: "e.g. 273.15" },
        { name: "V", label: "Volume (L)", type: "number", placeholder: "e.g. 22.414" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number, T = inputs.T as number, V = inputs.V as number;
        if (!n || !T || !V) return null;
        const R = 0.08206;
        const P = (n * R * T) / V;
        return {
          primary: { label: "Pressure", value: `${formatNumber(P, 4)} atm` },
          details: [
            { label: "In kPa", value: formatNumber(P * 101.325, 4) },
            { label: "In mmHg", value: formatNumber(P * 760, 4) },
            { label: "In psi", value: formatNumber(P * 14.696, 4) },
          ],
        };
      },
    },
    {
      id: "solveV",
      name: "Solve for Volume",
      fields: [
        { name: "n", label: "Moles (n)", type: "number", placeholder: "e.g. 1" },
        { name: "T", label: "Temperature (K)", type: "number", placeholder: "e.g. 273.15" },
        { name: "P", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const n = inputs.n as number, T = inputs.T as number, P = inputs.P as number;
        if (!n || !T || !P) return null;
        const R = 0.08206;
        const V = (n * R * T) / P;
        return {
          primary: { label: "Volume", value: `${formatNumber(V, 4)} L` },
          details: [
            { label: "In mL", value: formatNumber(V * 1000, 2) },
            { label: "In m³", value: formatNumber(V / 1000, 6) },
          ],
        };
      },
    },
    {
      id: "solveT",
      name: "Solve for Temperature",
      fields: [
        { name: "P", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1" },
        { name: "V", label: "Volume (L)", type: "number", placeholder: "e.g. 22.414" },
        { name: "n", label: "Moles (n)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const P = inputs.P as number, V = inputs.V as number, n = inputs.n as number;
        if (!P || !V || !n) return null;
        const R = 0.08206;
        const T = (P * V) / (n * R);
        return {
          primary: { label: "Temperature", value: `${formatNumber(T, 4)} K` },
          details: [
            { label: "In °C", value: `${formatNumber(T - 273.15, 4)}°C` },
            { label: "In °F", value: `${formatNumber((T - 273.15) * 9/5 + 32, 4)}°F` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "density-calculator", "pressure-calculator"],
  faq: [{ question: "What is the ideal gas law?", answer: "PV = nRT relates pressure (P, atm), volume (V, L), moles (n), and temperature (T, K) of an ideal gas. R = 0.08206 L·atm/(mol·K). At STP (1 atm, 273.15 K), 1 mole of gas occupies 22.414 L." }],
  formula: "PV = nRT | R = 0.08206 L·atm/(mol·K)",
};
