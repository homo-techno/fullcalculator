import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasLawCombinedCalculator: CalculatorDefinition = {
  slug: "combined-gas-law-calculator",
  title: "Combined Gas Law Calculator",
  description: "Free combined gas law calculator. Solve (P1V1)/T1 = (P2V2)/T2 for any unknown variable. Combines Boyle's, Charles's, and Gay-Lussac's laws.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["combined gas law", "gas law calculator", "P1V1/T1", "Boyle Charles Gay-Lussac", "gas laws"],
  variants: [
    {
      id: "solveP2",
      name: "Solve for Final Pressure (P2)",
      fields: [
        { name: "p1", label: "Initial Pressure (P1, atm)", type: "number", placeholder: "e.g. 1.0" },
        { name: "v1", label: "Initial Volume (V1, L)", type: "number", placeholder: "e.g. 10.0" },
        { name: "t1", label: "Initial Temperature (T1, K)", type: "number", placeholder: "e.g. 273.15" },
        { name: "v2", label: "Final Volume (V2, L)", type: "number", placeholder: "e.g. 5.0" },
        { name: "t2", label: "Final Temperature (T2, K)", type: "number", placeholder: "e.g. 373.15" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number, v1 = inputs.v1 as number, t1 = inputs.t1 as number;
        const v2 = inputs.v2 as number, t2 = inputs.t2 as number;
        if (!p1 || !v1 || !t1 || !v2 || !t2 || t1 <= 0 || t2 <= 0 || v2 <= 0) return null;
        const p2 = (p1 * v1 * t2) / (t1 * v2);
        return {
          primary: { label: "Final Pressure (P2)", value: `${formatNumber(p2, 4)} atm` },
          details: [
            { label: "P2 in kPa", value: formatNumber(p2 * 101.325, 4) },
            { label: "P2 in mmHg", value: formatNumber(p2 * 760, 2) },
            { label: "P2 in psi", value: formatNumber(p2 * 14.696, 4) },
            { label: "Volume Change", value: `${formatNumber(((v2 - v1) / v1) * 100, 2)}%` },
            { label: "Temperature Change", value: `${formatNumber(t2 - t1, 2)} K` },
          ],
        };
      },
    },
    {
      id: "solveV2",
      name: "Solve for Final Volume (V2)",
      fields: [
        { name: "p1", label: "Initial Pressure (P1, atm)", type: "number", placeholder: "e.g. 1.0" },
        { name: "v1", label: "Initial Volume (V1, L)", type: "number", placeholder: "e.g. 10.0" },
        { name: "t1", label: "Initial Temperature (T1, K)", type: "number", placeholder: "e.g. 273.15" },
        { name: "p2", label: "Final Pressure (P2, atm)", type: "number", placeholder: "e.g. 2.0" },
        { name: "t2", label: "Final Temperature (T2, K)", type: "number", placeholder: "e.g. 373.15" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number, v1 = inputs.v1 as number, t1 = inputs.t1 as number;
        const p2 = inputs.p2 as number, t2 = inputs.t2 as number;
        if (!p1 || !v1 || !t1 || !p2 || !t2 || t1 <= 0 || p2 <= 0) return null;
        const v2 = (p1 * v1 * t2) / (t1 * p2);
        return {
          primary: { label: "Final Volume (V2)", value: `${formatNumber(v2, 4)} L` },
          details: [
            { label: "V2 in mL", value: formatNumber(v2 * 1000, 2) },
            { label: "V2 in m³", value: formatNumber(v2 / 1000, 6) },
            { label: "Volume Change", value: `${formatNumber(((v2 - v1) / v1) * 100, 2)}%` },
          ],
        };
      },
    },
    {
      id: "solveT2",
      name: "Solve for Final Temperature (T2)",
      fields: [
        { name: "p1", label: "Initial Pressure (P1, atm)", type: "number", placeholder: "e.g. 1.0" },
        { name: "v1", label: "Initial Volume (V1, L)", type: "number", placeholder: "e.g. 10.0" },
        { name: "t1", label: "Initial Temperature (T1, K)", type: "number", placeholder: "e.g. 273.15" },
        { name: "p2", label: "Final Pressure (P2, atm)", type: "number", placeholder: "e.g. 2.0" },
        { name: "v2", label: "Final Volume (V2, L)", type: "number", placeholder: "e.g. 5.0" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number, v1 = inputs.v1 as number, t1 = inputs.t1 as number;
        const p2 = inputs.p2 as number, v2 = inputs.v2 as number;
        if (!p1 || !v1 || !t1 || !p2 || !v2 || t1 <= 0) return null;
        const t2 = (p2 * v2 * t1) / (p1 * v1);
        return {
          primary: { label: "Final Temperature (T2)", value: `${formatNumber(t2, 4)} K` },
          details: [
            { label: "T2 in °C", value: `${formatNumber(t2 - 273.15, 2)}°C` },
            { label: "T2 in °F", value: `${formatNumber((t2 - 273.15) * 9 / 5 + 32, 2)}°F` },
            { label: "Temperature Change", value: `${formatNumber(t2 - t1, 2)} K` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ideal-gas-law-calculator", "boyles-law-calculator", "charles-law-calculator"],
  faq: [
    { question: "What is the combined gas law?", answer: "The combined gas law merges Boyle's, Charles's, and Gay-Lussac's laws into one equation: (P1V1)/T1 = (P2V2)/T2. It relates the pressure, volume, and temperature of a fixed amount of gas between two states." },
    { question: "When do I use the combined gas law vs. the ideal gas law?", answer: "Use the combined gas law when comparing the same gas sample under two different sets of conditions (P, V, T). Use the ideal gas law (PV = nRT) when you need to find absolute values or when moles are involved." },
    { question: "What temperature unit must I use?", answer: "Always use absolute temperature in Kelvin (K). Convert from Celsius: K = °C + 273.15. Using Celsius or Fahrenheit will give incorrect results." },
  ],
  formula: "(P₁V₁)/T₁ = (P₂V₂)/T₂ | Temperature must be in Kelvin",
};
