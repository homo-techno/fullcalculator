import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatTransferCalculator: CalculatorDefinition = {
  slug: "heat-transfer-calculator",
  title: "Heat Transfer Calculator",
  description: "Calculate the rate of heat transfer through a material using conduction or estimate convective heat transfer.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat transfer","thermal conduction calculator","heat flow calculator"],
  variants: [{
    id: "standard",
    name: "Heat Transfer",
    description: "Calculate the rate of heat transfer through a material using conduction or estimate convective heat transfer.",
    fields: [
      { name: "conductivity", label: "Thermal Conductivity (W/m K)", type: "number", min: 0.01, max: 500, defaultValue: 0.6 },
      { name: "area", label: "Cross-Sectional Area (sq m)", type: "number", min: 0.001, max: 1000, defaultValue: 1 },
      { name: "tempDiff", label: "Temperature Difference (K)", type: "number", min: 0.1, max: 5000, defaultValue: 20 },
      { name: "thickness", label: "Material Thickness (m)", type: "number", min: 0.001, max: 100, defaultValue: 0.1 },
    ],
    calculate: (inputs) => {
      const k = inputs.conductivity as number;
      const a = inputs.area as number;
      const dt = inputs.tempDiff as number;
      const dx = inputs.thickness as number;
      if (!k || !a || !dt || !dx) return null;
      const heatRate = (k * a * dt) / dx;
      const heatFlux = heatRate / a;
      const thermalResistance = dx / (k * a);
      return {
        primary: { label: "Heat Transfer Rate", value: formatNumber(Math.round(heatRate * 100) / 100) + " W" },
        details: [
          { label: "Heat Flux", value: formatNumber(Math.round(heatFlux * 100) / 100) + " W/sq m" },
          { label: "Thermal Resistance", value: formatNumber(Math.round(thermalResistance * 10000) / 10000) + " K/W" },
          { label: "Temperature Difference", value: formatNumber(dt) + " K" },
        ],
      };
    },
  }],
  relatedSlugs: ["thermal-expansion-calculator","pressure-drop-calculator"],
  faq: [
    { question: "What is thermal conductivity?", answer: "Thermal conductivity (k) measures how well a material conducts heat. Metals like copper (385 W/mK) have high conductivity, while insulators like fiberglass (0.04 W/mK) have low conductivity." },
    { question: "What is the difference between conduction and convection?", answer: "Conduction transfers heat through direct molecular contact within a material. Convection transfers heat through fluid (liquid or gas) movement. Radiation transfers heat through electromagnetic waves without a medium." },
  ],
  formula: "Q = k x A x (T1 - T2) / thickness; Heat Flux = Q / A; Thermal Resistance = thickness / (k x A)",
};
