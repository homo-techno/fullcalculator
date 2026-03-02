import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const viscosityCalculator: CalculatorDefinition = {
  slug: "viscosity-calculator",
  title: "Viscosity Calculator",
  description: "Calculate dynamic viscosity from shear stress and rate.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["viscosity","fluid viscosity calculator"],
  variants: [{
    id: "standard",
    name: "Viscosity",
    description: "Calculate dynamic viscosity from shear stress and rate.",
    fields: [
      { name: "shearStress", label: "Shear Stress (Pa)", type: "number", min: 0.0001, max: 100000, defaultValue: 10 },
      { name: "shearRate", label: "Shear Rate (1/s)", type: "number", min: 0.001, max: 100000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const stress = inputs.shearStress as number;
      const rate = inputs.shearRate as number;
      if (!stress || !rate) return null;
      const viscosity = stress / rate;
      const viscCp = Math.round(viscosity * 1000 * 1000) / 1000;
      const kinematic = Math.round(viscosity / 1000 * 1e6 * 1000) / 1000;
      return {
        primary: { label: "Dynamic Viscosity", value: formatNumber(Math.round(viscosity * 10000) / 10000) + " Pa s" },
        details: [
          { label: "Viscosity (cP)", value: formatNumber(viscCp) + " cP" },
          { label: "Shear Stress", value: formatNumber(stress) + " Pa" },
          { label: "Shear Rate", value: formatNumber(rate) + " 1/s" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is dynamic viscosity?", answer: "It measures a fluid resistance to flow under an applied shear stress." },
    { question: "What is the viscosity of water?", answer: "Water at 20 degrees C has a viscosity of about 1 cP or 0.001 Pa s." },
  ],
  formula: "Viscosity = Shear Stress / Shear Rate",
};
