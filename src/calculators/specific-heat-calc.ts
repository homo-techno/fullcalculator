import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const specificHeatCalcCalculator: CalculatorDefinition = {
  slug: "specific-heat-calc",
  title: "Specific Heat Calculator",
  description:
    "Calculate the specific heat capacity of a substance from experimental data using c = Q/(mΔT).",
  category: "Science",
  categorySlug: "science",
  icon: "Flame",
  keywords: [
    "specific heat",
    "heat capacity",
    "calorimetry",
    "thermal properties",
    "material",
    "physics",
  ],
  variants: [
    {
      id: "specific-heat-from-data",
      name: "Specific Heat from Experimental Data",
      fields: [
        {
          name: "heatEnergy",
          label: "Heat Energy Q (J)",
          type: "number",
          placeholder: "Enter heat energy in joules",
        },
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "tempChange",
          label: "Temperature Change ΔT (°C)",
          type: "number",
          placeholder: "Enter temperature change in °C",
        },
      ],
      calculate: (inputs) => {
        const Q = parseFloat(inputs.heatEnergy as string);
        const mass = parseFloat(inputs.mass as string);
        const deltaT = parseFloat(inputs.tempChange as string);
        if (isNaN(Q) || isNaN(mass) || isNaN(deltaT) || mass <= 0 || deltaT === 0) {
          return { primary: { label: "Specific Heat", value: "Invalid input" }, details: [] };
        }
        const c = Q / (mass * deltaT);
        let material = "Unknown";
        if (Math.abs(c - 4186) < 200) material = "Water (~4186 J/kg·°C)";
        else if (Math.abs(c - 900) < 100) material = "Aluminum (~900 J/kg·°C)";
        else if (Math.abs(c - 385) < 50) material = "Copper (~385 J/kg·°C)";
        else if (Math.abs(c - 449) < 50) material = "Iron (~449 J/kg·°C)";
        else if (Math.abs(c - 129) < 30) material = "Lead (~129 J/kg·°C)";
        else if (Math.abs(c - 2090) < 200) material = "Ice (~2090 J/kg·°C)";
        return {
          primary: { label: "Specific Heat Capacity", value: `${formatNumber(c)} J/kg·°C` },
          details: [
            { label: "Heat Energy", value: `${formatNumber(Q)} J` },
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Temperature Change", value: `${formatNumber(deltaT)} °C` },
            { label: "Possible Material", value: material },
            { label: "Specific Heat (cal/g·°C)", value: `${formatNumber(c / 4184)} cal/g·°C` },
          ],
        };
      },
    },
    {
      id: "heat-capacity-total",
      name: "Total Heat Capacity",
      fields: [
        {
          name: "mass",
          label: "Mass (kg)",
          type: "number",
          placeholder: "Enter mass in kilograms",
        },
        {
          name: "specificHeat",
          label: "Specific Heat Capacity c (J/kg·°C)",
          type: "number",
          placeholder: "Enter specific heat capacity",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const c = parseFloat(inputs.specificHeat as string);
        if (isNaN(mass) || isNaN(c) || mass <= 0) {
          return { primary: { label: "Heat Capacity", value: "Invalid input" }, details: [] };
        }
        const heatCapacity = mass * c;
        return {
          primary: { label: "Total Heat Capacity", value: `${formatNumber(heatCapacity)} J/°C` },
          details: [
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Specific Heat", value: `${formatNumber(c)} J/kg·°C` },
            { label: "Heat Capacity (kJ/°C)", value: `${formatNumber(heatCapacity / 1000)} kJ/°C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-transfer", "ideal-gas-calc", "potential-energy-calc"],
  faq: [
    {
      question: "What is specific heat capacity?",
      answer:
        "Specific heat capacity is the amount of heat energy required to raise the temperature of 1 kilogram of a substance by 1 degree Celsius. It is an intrinsic property of the material.",
    },
    {
      question: "What is the difference between specific heat and heat capacity?",
      answer:
        "Specific heat (c) is the heat per unit mass per degree: c = Q/(mΔT), measured in J/kg·°C. Heat capacity (C) is for the whole object: C = mc, measured in J/°C. Specific heat is a material property, while heat capacity depends on the amount of material.",
    },
  ],
  formula:
    "c = Q/(mΔT), where c is specific heat capacity in J/kg·°C, Q is heat energy in J, m is mass in kg, and ΔT is temperature change in °C.",
};
