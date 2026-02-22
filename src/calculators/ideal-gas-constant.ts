import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const idealGasConstantCalculator: CalculatorDefinition = {
  slug: "ideal-gas-constant-calculator",
  title: "Ideal Gas Constant Calculator",
  description: "Free ideal gas constant calculator. Calculate any variable (P, V, n, or T) in PV = nRT using the ideal gas law. Supports multiple unit systems.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ideal gas constant", "PV=nRT", "gas law", "R constant", "ideal gas equation"],
  variants: [
    {
      id: "find-pressure",
      name: "Find Pressure",
      fields: [
        { name: "moles", label: "Amount of Gas (mol)", type: "number", placeholder: "e.g. 1.0", min: 0, step: 0.001 },
        { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "e.g. 273.15", min: 0.01, step: 0.01 },
        { name: "volume", label: "Volume (L)", type: "number", placeholder: "e.g. 22.414", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const n = inputs.moles as number;
        const T = inputs.temperature as number;
        const V = inputs.volume as number;
        const R = 0.082057;
        if (!n || !T || !V || n < 0 || T <= 0 || V <= 0) return null;
        const P = (n * R * T) / V;
        return {
          primary: { label: "Pressure", value: formatNumber(P, 4), suffix: "atm" },
          details: [
            { label: "Pressure (kPa)", value: formatNumber(P * 101.325, 4) },
            { label: "Pressure (mmHg)", value: formatNumber(P * 760, 2) },
            { label: "R Used", value: "0.08206 L·atm/(mol·K)" },
            { label: "n", value: `${formatNumber(n, 4)} mol` },
            { label: "T", value: `${formatNumber(T, 2)} K` },
            { label: "V", value: `${formatNumber(V, 4)} L` },
          ],
          note: "PV = nRT. R = 0.08206 L·atm/(mol·K) = 8.314 J/(mol·K).",
        };
      },
    },
    {
      id: "find-volume",
      name: "Find Volume",
      fields: [
        { name: "moles", label: "Amount of Gas (mol)", type: "number", placeholder: "e.g. 1.0", min: 0, step: 0.001 },
        { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "e.g. 273.15", min: 0.01, step: 0.01 },
        { name: "pressure", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const n = inputs.moles as number;
        const T = inputs.temperature as number;
        const P = inputs.pressure as number;
        const R = 0.082057;
        if (!n || !T || !P || n < 0 || T <= 0 || P <= 0) return null;
        const V = (n * R * T) / P;
        return {
          primary: { label: "Volume", value: formatNumber(V, 4), suffix: "L" },
          details: [
            { label: "Volume (mL)", value: formatNumber(V * 1000, 2) },
            { label: "Volume (m³)", value: formatNumber(V / 1000, 6) },
            { label: "R Used", value: "0.08206 L·atm/(mol·K)" },
          ],
        };
      },
    },
    {
      id: "find-temperature",
      name: "Find Temperature",
      fields: [
        { name: "pressure", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
        { name: "volume", label: "Volume (L)", type: "number", placeholder: "e.g. 22.414", min: 0.001, step: 0.001 },
        { name: "moles", label: "Amount of Gas (mol)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const P = inputs.pressure as number;
        const V = inputs.volume as number;
        const n = inputs.moles as number;
        const R = 0.082057;
        if (!P || !V || !n || P <= 0 || V <= 0 || n <= 0) return null;
        const T = (P * V) / (n * R);
        return {
          primary: { label: "Temperature", value: formatNumber(T, 2), suffix: "K" },
          details: [
            { label: "Temperature (°C)", value: `${formatNumber(T - 273.15, 2)} °C` },
            { label: "Temperature (°F)", value: `${formatNumber((T - 273.15) * 9 / 5 + 32, 2)} °F` },
          ],
        };
      },
    },
    {
      id: "find-moles",
      name: "Find Moles",
      fields: [
        { name: "pressure", label: "Pressure (atm)", type: "number", placeholder: "e.g. 1.0", min: 0.001, step: 0.001 },
        { name: "volume", label: "Volume (L)", type: "number", placeholder: "e.g. 22.414", min: 0.001, step: 0.001 },
        { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "e.g. 273.15", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const P = inputs.pressure as number;
        const V = inputs.volume as number;
        const T = inputs.temperature as number;
        const R = 0.082057;
        if (!P || !V || !T || P <= 0 || V <= 0 || T <= 0) return null;
        const n = (P * V) / (R * T);
        const molecules = n * 6.02214076e23;
        return {
          primary: { label: "Amount of Gas", value: formatNumber(n, 6), suffix: "mol" },
          details: [
            { label: "Number of Molecules", value: molecules.toExponential(4) },
            { label: "P", value: `${formatNumber(P, 4)} atm` },
            { label: "V", value: `${formatNumber(V, 4)} L` },
            { label: "T", value: `${formatNumber(T, 2)} K` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ideal-gas-calculator", "partial-pressure-calculator", "gas-stoichiometry-calculator"],
  faq: [
    { question: "What is the ideal gas constant?", answer: "The ideal gas constant R has the value 8.314 J/(mol·K) or 0.08206 L·atm/(mol·K). It relates pressure, volume, temperature, and amount of an ideal gas through PV = nRT." },
    { question: "When does the ideal gas law fail?", answer: "The ideal gas law is inaccurate at very high pressures, very low temperatures, or for gases with strong intermolecular forces. In these cases, the van der Waals equation or other real gas equations are used." },
  ],
  formula: "PV = nRT | R = 0.08206 L·atm/(mol·K) = 8.314 J/(mol·K)",
};
