import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatTransferCalculator: CalculatorDefinition = {
  slug: "heat-transfer",
  title: "Heat Transfer Calculator",
  description:
    "Calculate the heat transferred using Q = mcΔT, where Q is heat energy, m is mass, c is specific heat capacity, and ΔT is temperature change.",
  category: "Science",
  categorySlug: "science",
  icon: "Thermometer",
  keywords: [
    "heat transfer",
    "thermal energy",
    "temperature change",
    "specific heat",
    "calorimetry",
    "physics",
  ],
  variants: [
    {
      id: "heat-from-mass-temp",
      name: "Heat Energy from Mass & Temperature Change",
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
          placeholder: "Enter specific heat (e.g. 4186 for water)",
        },
        {
          name: "tempChange",
          label: "Temperature Change ΔT (°C)",
          type: "number",
          placeholder: "Enter temperature change in °C",
        },
      ],
      calculate: (inputs) => {
        const mass = parseFloat(inputs.mass as string);
        const c = parseFloat(inputs.specificHeat as string);
        const deltaT = parseFloat(inputs.tempChange as string);
        if (isNaN(mass) || isNaN(c) || isNaN(deltaT)) {
          return { primary: { label: "Heat Energy", value: "Invalid input" }, details: [] };
        }
        const Q = mass * c * deltaT;
        return {
          primary: { label: "Heat Energy", value: `${formatNumber(Q)} J` },
          details: [
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Specific Heat", value: `${formatNumber(c)} J/kg·°C` },
            { label: "Temperature Change", value: `${formatNumber(deltaT)} °C` },
            { label: "Heat Energy (kJ)", value: `${formatNumber(Q / 1000)} kJ` },
            { label: "Heat Energy (kcal)", value: `${formatNumber(Q / 4184)} kcal` },
          ],
        };
      },
    },
    {
      id: "temp-change-from-heat",
      name: "Temperature Change from Heat Energy",
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
          name: "specificHeat",
          label: "Specific Heat Capacity c (J/kg·°C)",
          type: "number",
          placeholder: "Enter specific heat",
        },
      ],
      calculate: (inputs) => {
        const Q = parseFloat(inputs.heatEnergy as string);
        const mass = parseFloat(inputs.mass as string);
        const c = parseFloat(inputs.specificHeat as string);
        if (isNaN(Q) || isNaN(mass) || isNaN(c) || mass <= 0 || c <= 0) {
          return { primary: { label: "Temperature Change", value: "Invalid input" }, details: [] };
        }
        const deltaT = Q / (mass * c);
        return {
          primary: { label: "Temperature Change", value: `${formatNumber(deltaT)} °C` },
          details: [
            { label: "Heat Energy", value: `${formatNumber(Q)} J` },
            { label: "Mass", value: `${formatNumber(mass)} kg` },
            { label: "Specific Heat", value: `${formatNumber(c)} J/kg·°C` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["specific-heat-calc", "ideal-gas-calc", "kinetic-energy-calc"],
  faq: [
    {
      question: "What is heat transfer?",
      answer:
        "Heat transfer is the movement of thermal energy from a hotter object to a cooler one. The amount of heat transferred depends on the mass, the specific heat capacity of the material, and the temperature change.",
    },
    {
      question: "What is the specific heat of water?",
      answer:
        "Water has a specific heat capacity of approximately 4,186 J/kg·°C (or 1 cal/g·°C), which is unusually high compared to most substances. This makes water an excellent thermal buffer.",
    },
  ],
  formula:
    "Q = mcΔT, where Q is heat energy in joules, m is mass in kg, c is specific heat capacity in J/kg·°C, and ΔT is temperature change in °C.",
};
