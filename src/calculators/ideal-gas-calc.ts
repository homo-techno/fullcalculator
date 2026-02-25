import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const idealGasCalcCalculator: CalculatorDefinition = {
  slug: "ideal-gas-calc",
  title: "Ideal Gas Law Calculator",
  description:
    "Calculate pressure, volume, temperature, or amount of gas using the ideal gas law: PV = nRT.",
  category: "Science",
  categorySlug: "science",
  icon: "Cloud",
  keywords: [
    "ideal gas law",
    "pressure",
    "volume",
    "temperature",
    "moles",
    "gas constant",
    "physics",
    "thermodynamics",
  ],
  variants: [
    {
      id: "pressure-from-nvt",
      name: "Pressure from n, V, T",
      fields: [
        {
          name: "moles",
          label: "Amount of Gas n (mol)",
          type: "number",
          placeholder: "Enter number of moles",
        },
        {
          name: "volume",
          label: "Volume V (L)",
          type: "number",
          placeholder: "Enter volume in liters",
        },
        {
          name: "temperature",
          label: "Temperature T (K)",
          type: "number",
          placeholder: "Enter temperature in kelvin",
        },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.moles as string);
        const V_L = parseFloat(inputs.volume as string);
        const T = parseFloat(inputs.temperature as string);
        if (isNaN(n) || isNaN(V_L) || isNaN(T) || V_L <= 0 || T <= 0) {
          return { primary: { label: "Pressure", value: "Invalid input" }, details: [] };
        }
        const R = 8.314;
        const V_m3 = V_L / 1000;
        const P = (n * R * T) / V_m3;
        return {
          primary: { label: "Pressure", value: `${formatNumber(P)} Pa` },
          details: [
            { label: "Moles", value: `${formatNumber(n)} mol` },
            { label: "Volume", value: `${formatNumber(V_L)} L` },
            { label: "Temperature", value: `${formatNumber(T)} K` },
            { label: "Pressure (atm)", value: `${formatNumber(P / 101325)} atm` },
            { label: "Pressure (kPa)", value: `${formatNumber(P / 1000)} kPa` },
          ],
        };
      },
    },
    {
      id: "volume-from-npt",
      name: "Volume from n, P, T",
      fields: [
        {
          name: "moles",
          label: "Amount of Gas n (mol)",
          type: "number",
          placeholder: "Enter number of moles",
        },
        {
          name: "pressure",
          label: "Pressure P (Pa)",
          type: "number",
          placeholder: "Enter pressure in pascals",
        },
        {
          name: "temperature",
          label: "Temperature T (K)",
          type: "number",
          placeholder: "Enter temperature in kelvin",
        },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.moles as string);
        const P = parseFloat(inputs.pressure as string);
        const T = parseFloat(inputs.temperature as string);
        if (isNaN(n) || isNaN(P) || isNaN(T) || P <= 0 || T <= 0) {
          return { primary: { label: "Volume", value: "Invalid input" }, details: [] };
        }
        const R = 8.314;
        const V_m3 = (n * R * T) / P;
        const V_L = V_m3 * 1000;
        return {
          primary: { label: "Volume", value: `${formatNumber(V_L)} L` },
          details: [
            { label: "Moles", value: `${formatNumber(n)} mol` },
            { label: "Pressure", value: `${formatNumber(P)} Pa` },
            { label: "Temperature", value: `${formatNumber(T)} K` },
            { label: "Volume (m³)", value: `${formatNumber(V_m3)} m³` },
          ],
        };
      },
    },
    {
      id: "temperature-from-npv",
      name: "Temperature from n, P, V",
      fields: [
        {
          name: "moles",
          label: "Amount of Gas n (mol)",
          type: "number",
          placeholder: "Enter number of moles",
        },
        {
          name: "pressure",
          label: "Pressure P (Pa)",
          type: "number",
          placeholder: "Enter pressure in pascals",
        },
        {
          name: "volume",
          label: "Volume V (L)",
          type: "number",
          placeholder: "Enter volume in liters",
        },
      ],
      calculate: (inputs) => {
        const n = parseFloat(inputs.moles as string);
        const P = parseFloat(inputs.pressure as string);
        const V_L = parseFloat(inputs.volume as string);
        if (isNaN(n) || isNaN(P) || isNaN(V_L) || n <= 0) {
          return { primary: { label: "Temperature", value: "Invalid input" }, details: [] };
        }
        const R = 8.314;
        const V_m3 = V_L / 1000;
        const T = (P * V_m3) / (n * R);
        return {
          primary: { label: "Temperature", value: `${formatNumber(T)} K` },
          details: [
            { label: "Moles", value: `${formatNumber(n)} mol` },
            { label: "Pressure", value: `${formatNumber(P)} Pa` },
            { label: "Volume", value: `${formatNumber(V_L)} L` },
            { label: "Temperature (°C)", value: `${formatNumber(T - 273.15)} °C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-transfer", "specific-heat-calc", "bernoulli-equation"],
  faq: [
    {
      question: "What is the ideal gas law?",
      answer:
        "The ideal gas law relates the pressure, volume, temperature, and amount of an ideal gas: PV = nRT. R is the universal gas constant (8.314 J/mol·K).",
    },
    {
      question: "When does the ideal gas law break down?",
      answer:
        "The ideal gas law works best at low pressures and high temperatures. It breaks down at high pressures (molecules are close together), low temperatures (near liquefaction), and for gases with strong intermolecular forces.",
    },
  ],
  formula:
    "PV = nRT, where P is pressure in Pa, V is volume in m³, n is amount in moles, R = 8.314 J/mol·K, and T is temperature in kelvin.",
};
