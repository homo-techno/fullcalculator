import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const molarityCalculator: CalculatorDefinition = {
  slug: "molarity-calculator",
  title: "Molarity Calculator",
  description: "Free molarity calculator. Calculate molarity, moles, volume, or molar mass for chemistry solutions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["molarity calculator", "moles calculator", "concentration calculator", "solution calculator", "chemistry calculator"],
  variants: [
    {
      id: "molarity",
      name: "Calculate Molarity",
      fields: [
        { name: "moles", label: "Moles of Solute (mol)", type: "number", placeholder: "e.g. 0.5" },
        { name: "volume", label: "Volume of Solution (L)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const mol = inputs.moles as number, vol = inputs.volume as number;
        if (!mol || !vol) return null;
        const M = mol / vol;
        return {
          primary: { label: "Molarity", value: `${formatNumber(M, 6)} M` },
          details: [
            { label: "Moles", value: `${formatNumber(mol, 6)} mol` },
            { label: "Volume", value: `${formatNumber(vol, 4)} L` },
            { label: "Millimolar (mM)", value: formatNumber(M * 1000, 4) },
          ],
        };
      },
    },
    {
      id: "fromMass",
      name: "From Mass & Molar Mass",
      fields: [
        { name: "mass", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 58.44" },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 58.44" },
        { name: "volume", label: "Volume (L)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number, mm = inputs.molarMass as number, vol = inputs.volume as number;
        if (!mass || !mm || !vol) return null;
        const moles = mass / mm;
        const M = moles / vol;
        return {
          primary: { label: "Molarity", value: `${formatNumber(M, 6)} M` },
          details: [
            { label: "Moles", value: `${formatNumber(moles, 6)} mol` },
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Concentration (g/L)", value: formatNumber(mass / vol, 4) },
          ],
        };
      },
    },
    {
      id: "dilution",
      name: "Dilution (C₁V₁ = C₂V₂)",
      fields: [
        { name: "c1", label: "Initial Concentration (M)", type: "number", placeholder: "e.g. 6" },
        { name: "v1", label: "Initial Volume (mL)", type: "number", placeholder: "e.g. 50" },
        { name: "c2", label: "Final Concentration (M)", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const c1 = inputs.c1 as number, v1 = inputs.v1 as number, c2 = inputs.c2 as number;
        if (!c1 || !v1 || !c2) return null;
        const v2 = (c1 * v1) / c2;
        const waterToAdd = v2 - v1;
        return {
          primary: { label: "Final Volume", value: `${formatNumber(v2, 2)} mL` },
          details: [
            { label: "Solvent to add", value: `${formatNumber(waterToAdd, 2)} mL` },
            { label: "Dilution factor", value: `${formatNumber(c1 / c2, 2)}×` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ph-calculator", "density-calculator", "scientific-calculator"],
  faq: [{ question: "What is molarity?", answer: "Molarity (M) is the concentration of a solution: moles of solute per liter of solution. 1 M = 1 mol/L. For dilutions, use C₁V₁ = C₂V₂. To find moles from mass: moles = mass (g) / molar mass (g/mol)." }],
  formula: "M = mol / L | C₁V₁ = C₂V₂",
};
