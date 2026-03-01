import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spectrophotometerCalculator: CalculatorDefinition = {
  slug: "spectrophotometer-calculator",
  title: "Spectrophotometer Calculator",
  description: "Calculate the concentration of a solution using Beer-Lambert law from absorbance and path length data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Beer-Lambert law", "spectrophotometer calculator", "absorbance concentration"],
  variants: [{
    id: "standard",
    name: "Spectrophotometer",
    description: "Calculate the concentration of a solution using Beer-Lambert law from absorbance and path length data",
    fields: [
      { name: "absorbance", label: "Measured Absorbance (A)", type: "number", suffix: "AU", min: 0.001, max: 4, step: 0.001, defaultValue: 0.5 },
      { name: "molarAbsorptivity", label: "Molar Absorptivity (epsilon)", type: "number", suffix: "L/mol cm", min: 1, max: 1000000, step: 1, defaultValue: 5000 },
      { name: "pathLength", label: "Path Length", type: "number", suffix: "cm", min: 0.1, max: 10, step: 0.1, defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const A = inputs.absorbance as number;
      const epsilon = inputs.molarAbsorptivity as number;
      const l = inputs.pathLength as number;
      if (!A || !epsilon || !l || A <= 0 || epsilon <= 0 || l <= 0) return null;
      const concentration = A / (epsilon * l);
      const transmittance = Math.pow(10, -A) * 100;
      const concMM = concentration * 1000;
      const concuM = concentration * 1000000;
      const displayConc = concentration >= 0.001 ? formatNumber(Math.round(concentration * 10000) / 10000) + " M" : formatNumber(Math.round(concuM * 100) / 100) + " uM";
      return {
        primary: { label: "Concentration", value: displayConc },
        details: [
          { label: "Concentration (mM)", value: formatNumber(Math.round(concMM * 10000) / 10000) + " mM" },
          { label: "Percent Transmittance", value: formatNumber(Math.round(transmittance * 100) / 100) + "%" },
          { label: "Equation", value: "A = epsilon x l x c" },
        ],
      };
    },
  }],
  relatedSlugs: ["dilution-factor-calculator", "buffer-calculator"],
  faq: [
    { question: "What is the Beer-Lambert law?", answer: "The Beer-Lambert law states that absorbance (A) is directly proportional to the concentration (c) of the absorbing species, the path length (l), and the molar absorptivity (epsilon): A = epsilon x l x c." },
    { question: "What are the limitations of the Beer-Lambert law?", answer: "The Beer-Lambert law is most accurate at low concentrations. At high concentrations, deviations occur due to molecular interactions, scattering, and detector saturation, typically above an absorbance of 2." },
  ],
  formula: "Concentration = Absorbance / (Molar Absorptivity x Path Length)",
};
