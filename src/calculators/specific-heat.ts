import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const specificHeatCalculator: CalculatorDefinition = {
  slug: "specific-heat-calculator",
  title: "Specific Heat Calculator",
  description: "Free specific heat calculator. Calculate heat energy, mass, temperature change, or specific heat capacity using Q = mcΔT.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["specific heat calculator", "heat energy calculator", "Q=mcΔT", "calorimetry calculator", "thermal energy"],
  variants: [
    {
      id: "findQ",
      name: "Find Heat Energy (Q)",
      fields: [
        { name: "m", label: "Mass (g)", type: "number", placeholder: "e.g. 500" },
        { name: "c", label: "Specific Heat (J/g·°C)", type: "number", placeholder: "e.g. 4.184", defaultValue: 4.184 },
        { name: "dT", label: "Temperature Change (°C)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const m = inputs.m as number, c = (inputs.c as number) || 4.184;
        const dT = inputs.dT as number;
        if (!m || !dT) return null;
        const Q = m * c * dT;
        return {
          primary: { label: "Heat Energy (Q)", value: `${formatNumber(Q, 4)} J` },
          details: [
            { label: "In kJ", value: formatNumber(Q / 1000, 4) },
            { label: "In calories", value: formatNumber(Q / 4.184, 4) },
            { label: "In kcal", value: formatNumber(Q / 4184, 4) },
            { label: "In BTU", value: formatNumber(Q / 1055.06, 4) },
          ],
        };
      },
    },
    {
      id: "findC",
      name: "Find Specific Heat (c)",
      fields: [
        { name: "Q", label: "Heat Energy (J)", type: "number", placeholder: "e.g. 41840" },
        { name: "m", label: "Mass (g)", type: "number", placeholder: "e.g. 500" },
        { name: "dT", label: "Temperature Change (°C)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const Q = inputs.Q as number, m = inputs.m as number, dT = inputs.dT as number;
        if (!Q || !m || !dT) return null;
        const c = Q / (m * dT);
        let substance = "Unknown";
        if (Math.abs(c - 4.184) < 0.1) substance = "Water";
        else if (Math.abs(c - 0.897) < 0.05) substance = "Aluminum";
        else if (Math.abs(c - 0.385) < 0.05) substance = "Copper";
        else if (Math.abs(c - 0.449) < 0.05) substance = "Iron";
        return {
          primary: { label: "Specific Heat", value: `${formatNumber(c, 4)} J/g·°C` },
          details: [
            { label: "Possible substance", value: substance },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["energy-calculator", "density-calculator", "temperature-converter"],
  faq: [{ question: "What is specific heat?", answer: "Specific heat capacity (c) is the energy needed to raise 1 gram of a substance by 1°C. Water has a high specific heat of 4.184 J/g·°C. The formula Q = mcΔT relates heat energy, mass, specific heat, and temperature change." }],
  formula: "Q = mcΔT | Water c = 4.184 J/g·°C",
};
