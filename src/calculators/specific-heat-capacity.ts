import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const specificHeatCapacityCalculator: CalculatorDefinition = {
  slug: "specific-heat-capacity-calculator",
  title: "Specific Heat Capacity Calculator",
  description: "Free specific heat capacity calculator. Calculate heat transfer, temperature change, or specific heat using q = mcΔT. Includes common substance data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["specific heat capacity", "heat capacity", "q=mcΔT", "thermal energy", "temperature change"],
  variants: [
    {
      id: "find-heat",
      name: "Find Heat (q)",
      fields: [
        { name: "mass", label: "Mass (grams)", type: "number", placeholder: "e.g. 100", min: 0, step: 0.01 },
        { name: "specificHeat", label: "Specific Heat (J/g·°C)", type: "number", placeholder: "e.g. 4.184 for water", min: 0.001, step: 0.001 },
        { name: "deltaT", label: "Temperature Change ΔT (°C)", type: "number", placeholder: "e.g. 25", step: 0.01 },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const c = inputs.specificHeat as number;
        const dT = inputs.deltaT as number;
        if (!m || !c || dT === undefined || m <= 0 || c <= 0) return null;
        const q = m * c * dT;
        return {
          primary: { label: "Heat (q)", value: formatNumber(Math.abs(q), 4), suffix: "J" },
          details: [
            { label: "Heat (kJ)", value: formatNumber(q / 1000, 6) },
            { label: "Heat (cal)", value: formatNumber(q / 4.184, 4) },
            { label: "Heat (kcal)", value: formatNumber(q / 4184, 6) },
            { label: "Direction", value: q > 0 ? "Endothermic (heat absorbed)" : q < 0 ? "Exothermic (heat released)" : "No heat transfer" },
          ],
          note: "q = mcΔT. Positive q = heat absorbed, negative q = heat released.",
        };
      },
    },
    {
      id: "find-specific-heat",
      name: "Find Specific Heat (c)",
      fields: [
        { name: "heat", label: "Heat (J)", type: "number", placeholder: "e.g. 10460", step: 0.01 },
        { name: "mass", label: "Mass (grams)", type: "number", placeholder: "e.g. 100", min: 0.001, step: 0.01 },
        { name: "deltaT", label: "Temperature Change ΔT (°C)", type: "number", placeholder: "e.g. 25", step: 0.01 },
      ],
      calculate: (inputs) => {
        const q = inputs.heat as number;
        const m = inputs.mass as number;
        const dT = inputs.deltaT as number;
        if (q === undefined || !m || !dT || m <= 0 || dT === 0) return null;
        const c = q / (m * dT);
        return {
          primary: { label: "Specific Heat", value: formatNumber(Math.abs(c), 4), suffix: "J/(g·°C)" },
          details: [
            { label: "Heat (q)", value: `${formatNumber(q, 4)} J` },
            { label: "Mass", value: `${formatNumber(m, 4)} g` },
            { label: "ΔT", value: `${formatNumber(dT, 2)} °C` },
          ],
        };
      },
    },
    {
      id: "common-substances",
      name: "Common Substances",
      fields: [
        { name: "mass", label: "Mass (grams)", type: "number", placeholder: "e.g. 200", min: 0, step: 0.01 },
        { name: "deltaT", label: "Temperature Change ΔT (°C)", type: "number", placeholder: "e.g. 50", step: 0.01 },
        {
          name: "substance",
          label: "Substance",
          type: "select",
          options: [
            { label: "Water - 4.184 J/(g·°C)", value: "4.184" },
            { label: "Ethanol - 2.44 J/(g·°C)", value: "2.44" },
            { label: "Aluminum - 0.897 J/(g·°C)", value: "0.897" },
            { label: "Iron - 0.449 J/(g·°C)", value: "0.449" },
            { label: "Copper - 0.385 J/(g·°C)", value: "0.385" },
            { label: "Gold - 0.129 J/(g·°C)", value: "0.129" },
            { label: "Glass - 0.840 J/(g·°C)", value: "0.840" },
            { label: "Air - 1.006 J/(g·°C)", value: "1.006" },
          ],
        },
      ],
      calculate: (inputs) => {
        const m = inputs.mass as number;
        const dT = inputs.deltaT as number;
        const c = parseFloat(inputs.substance as string);
        if (!m || dT === undefined || !c || m <= 0) return null;
        const q = m * c * dT;
        return {
          primary: { label: "Heat (q)", value: formatNumber(Math.abs(q), 2), suffix: "J" },
          details: [
            { label: "Heat (kJ)", value: formatNumber(q / 1000, 4) },
            { label: "Specific Heat", value: `${c} J/(g·°C)` },
            { label: "Direction", value: q > 0 ? "Heat absorbed" : q < 0 ? "Heat released" : "No transfer" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["calorimetry-calculator", "heat-of-combustion-calculator", "enthalpy-calculator"],
  faq: [
    { question: "What is specific heat capacity?", answer: "Specific heat capacity (c) is the amount of heat energy required to raise the temperature of 1 gram of a substance by 1°C. Water has an unusually high specific heat (4.184 J/g·°C), which is why it is excellent for temperature regulation." },
    { question: "What is the difference between specific heat and heat capacity?", answer: "Specific heat (c) is per unit mass (J/g·°C), while heat capacity (C) is for the entire object (J/°C). Heat capacity C = mass × specific heat c." },
  ],
  formula: "q = m × c × ΔT | c = q / (m × ΔT) | ΔT = q / (m × c)",
};
