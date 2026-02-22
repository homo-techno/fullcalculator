import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concentrationCalculator: CalculatorDefinition = {
  slug: "concentration-calculator",
  title: "Solution Concentration Calculator",
  description: "Free solution concentration calculator. Calculate molarity, mass percent, and volume percent of solutions. Essential for chemistry lab preparation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["concentration", "solution", "molarity", "mass percent", "volume percent", "chemistry lab"],
  variants: [
    {
      id: "mass-volume",
      name: "Mass/Volume Concentration",
      fields: [
        { name: "soluteMass", label: "Solute Mass (grams)", type: "number", placeholder: "e.g. 10", min: 0, step: 0.01 },
        { name: "solutionVolume", label: "Solution Volume (mL)", type: "number", placeholder: "e.g. 250", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const mass = inputs.soluteMass as number;
        const volume = inputs.solutionVolume as number;
        if (!mass || !volume || mass < 0 || volume <= 0) return null;
        const concGPerL = (mass / volume) * 1000;
        const concMgPerMl = mass / volume * 1000 / 1000;
        const ppm = (mass / (volume * 1)) * 1e6 / 1000;
        return {
          primary: { label: "Concentration", value: formatNumber(concGPerL, 4), suffix: "g/L" },
          details: [
            { label: "mg/mL", value: formatNumber(concMgPerMl, 4) },
            { label: "g/mL", value: formatNumber(mass / volume, 6) },
            { label: "PPM (approx.)", value: formatNumber(ppm, 2) },
            { label: "Solute Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Solution Volume", value: `${formatNumber(volume, 2)} mL` },
          ],
          note: "Assumes aqueous solution with density ≈ 1 g/mL for PPM approximation.",
        };
      },
    },
    {
      id: "mass-percent",
      name: "Mass Percent (w/w%)",
      fields: [
        { name: "soluteMass", label: "Solute Mass (grams)", type: "number", placeholder: "e.g. 5", min: 0, step: 0.01 },
        { name: "solutionMass", label: "Total Solution Mass (grams)", type: "number", placeholder: "e.g. 100", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const soluteMass = inputs.soluteMass as number;
        const solutionMass = inputs.solutionMass as number;
        if (!soluteMass || !solutionMass || soluteMass < 0 || solutionMass <= 0) return null;
        const massPercent = (soluteMass / solutionMass) * 100;
        const solventMass = solutionMass - soluteMass;
        return {
          primary: { label: "Mass Percent", value: formatNumber(massPercent, 4), suffix: "% (w/w)" },
          details: [
            { label: "Solute Mass", value: `${formatNumber(soluteMass, 4)} g` },
            { label: "Solvent Mass", value: `${formatNumber(solventMass, 4)} g` },
            { label: "Solution Mass", value: `${formatNumber(solutionMass, 4)} g` },
            { label: "PPM", value: formatNumber(massPercent * 10000, 2) },
          ],
        };
      },
    },
    {
      id: "volume-percent",
      name: "Volume Percent (v/v%)",
      fields: [
        { name: "soluteVolume", label: "Solute Volume (mL)", type: "number", placeholder: "e.g. 25", min: 0, step: 0.01 },
        { name: "solutionVolume", label: "Total Solution Volume (mL)", type: "number", placeholder: "e.g. 500", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const soluteVol = inputs.soluteVolume as number;
        const solutionVol = inputs.solutionVolume as number;
        if (!soluteVol || !solutionVol || soluteVol < 0 || solutionVol <= 0) return null;
        const volPercent = (soluteVol / solutionVol) * 100;
        return {
          primary: { label: "Volume Percent", value: formatNumber(volPercent, 4), suffix: "% (v/v)" },
          details: [
            { label: "Solute Volume", value: `${formatNumber(soluteVol, 2)} mL` },
            { label: "Solution Volume", value: `${formatNumber(solutionVol, 2)} mL` },
            { label: "Solvent Volume", value: `${formatNumber(solutionVol - soluteVol, 2)} mL` },
          ],
          note: "Volume percent is commonly used for alcohol solutions (e.g., 40% v/v ethanol = 40 mL ethanol per 100 mL solution).",
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "ppm-calculator", "dilution-calculator"],
  faq: [
    { question: "What are the different ways to express concentration?", answer: "Concentration can be expressed as molarity (mol/L), mass percent (w/w%), volume percent (v/v%), mass/volume (g/L or mg/mL), ppm, ppb, molality, and normality. The choice depends on the application." },
    { question: "What is the difference between mass percent and volume percent?", answer: "Mass percent (w/w%) is the mass of solute divided by total solution mass × 100. Volume percent (v/v%) is the volume of solute divided by total solution volume × 100. Mass percent is more precise since volumes can change with temperature." },
  ],
  formula: "g/L = (mass_solute / volume_solution) × 1000 | w/w% = (mass_solute / mass_solution) × 100 | v/v% = (vol_solute / vol_solution) × 100",
};
