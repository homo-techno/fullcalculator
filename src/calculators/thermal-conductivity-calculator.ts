import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thermalConductivityCalculator: CalculatorDefinition = {
  slug: "thermal-conductivity-calculator",
  title: "Thermal Conductivity Calculator",
  description: "Calculate heat flow through a material slab.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["thermal conductivity","heat transfer calculator"],
  variants: [{
    id: "standard",
    name: "Thermal Conductivity",
    description: "Calculate heat flow through a material slab.",
    fields: [
      { name: "conductivity", label: "Conductivity (W/m K)", type: "number", min: 0.01, max: 500, defaultValue: 0.6 },
      { name: "area", label: "Area (sq m)", type: "number", min: 0.001, max: 1000, defaultValue: 1 },
      { name: "thickness", label: "Thickness (m)", type: "number", min: 0.001, max: 10, defaultValue: 0.1 },
      { name: "tempDiff", label: "Temperature Difference (K)", type: "number", min: 0.1, max: 1000, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const k = inputs.conductivity as number;
      const a = inputs.area as number;
      const t = inputs.thickness as number;
      const dT = inputs.tempDiff as number;
      if (!k || !a || !t || !dT) return null;
      const heatFlow = Math.round(k * a * dT / t * 100) / 100;
      const rValue = Math.round(t / k * 1000) / 1000;
      return {
        primary: { label: "Heat Flow", value: formatNumber(heatFlow) + " W" },
        details: [
          { label: "Thermal Resistance", value: formatNumber(rValue) + " m2 K/W" },
          { label: "Conductivity", value: formatNumber(k) + " W/m K" },
          { label: "Temperature Difference", value: formatNumber(dT) + " K" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is thermal conductivity?", answer: "It measures how well a material conducts heat, in watts per meter kelvin." },
    { question: "What material has the highest thermal conductivity?", answer: "Diamond has the highest at about 2000 W/m K." },
  ],
  formula: "Q = k x A x dT / thickness",
};
