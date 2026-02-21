import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const molalityCalculator: CalculatorDefinition = {
  slug: "molality-calculator",
  title: "Molality Calculator",
  description: "Free molality calculator. Calculate molality (moles of solute per kilogram of solvent) for chemistry solutions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["molality", "molal concentration", "moles per kilogram", "solution concentration", "chemistry"],
  variants: [
    {
      id: "molality",
      name: "Calculate Molality",
      fields: [
        { name: "moles", label: "Moles of Solute (mol)", type: "number", placeholder: "e.g. 0.5" },
        { name: "massSolvent", label: "Mass of Solvent (g)", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const mol = inputs.moles as number, massG = inputs.massSolvent as number;
        if (!mol || !massG || massG <= 0) return null;
        const massKg = massG / 1000;
        const molality = mol / massKg;
        return {
          primary: { label: "Molality", value: `${formatNumber(molality, 6)} m` },
          details: [
            { label: "Moles of Solute", value: `${formatNumber(mol, 6)} mol` },
            { label: "Mass of Solvent", value: `${formatNumber(massG, 2)} g (${formatNumber(massKg, 4)} kg)` },
            { label: "Millimolal", value: `${formatNumber(molality * 1000, 4)} mm` },
          ],
        };
      },
    },
    {
      id: "fromMass",
      name: "From Mass & Molar Mass",
      fields: [
        { name: "massSolute", label: "Mass of Solute (g)", type: "number", placeholder: "e.g. 29.22" },
        { name: "molarMass", label: "Molar Mass of Solute (g/mol)", type: "number", placeholder: "e.g. 58.44" },
        { name: "massSolvent", label: "Mass of Solvent (g)", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const massSolute = inputs.massSolute as number, mm = inputs.molarMass as number, massSolvent = inputs.massSolvent as number;
        if (!massSolute || !mm || !massSolvent || mm <= 0 || massSolvent <= 0) return null;
        const moles = massSolute / mm;
        const massKg = massSolvent / 1000;
        const molality = moles / massKg;
        return {
          primary: { label: "Molality", value: `${formatNumber(molality, 6)} m` },
          details: [
            { label: "Moles of Solute", value: `${formatNumber(moles, 6)} mol` },
            { label: "Mass of Solute", value: `${formatNumber(massSolute, 4)} g` },
            { label: "Mass of Solvent", value: `${formatNumber(massSolvent, 2)} g` },
          ],
        };
      },
    },
    {
      id: "molarityToMolality",
      name: "Molarity to Molality",
      description: "Convert molarity to molality using solution density",
      fields: [
        { name: "molarity", label: "Molarity (M)", type: "number", placeholder: "e.g. 1.0" },
        { name: "density", label: "Solution Density (g/mL)", type: "number", placeholder: "e.g. 1.04" },
        { name: "molarMass", label: "Molar Mass of Solute (g/mol)", type: "number", placeholder: "e.g. 58.44" },
      ],
      calculate: (inputs) => {
        const M = inputs.molarity as number, d = inputs.density as number, mm = inputs.molarMass as number;
        if (!M || !d || !mm || d <= 0 || mm <= 0) return null;
        const massSolution = d * 1000; // g per L
        const massSolute = M * mm; // g per L
        const massSolvent = massSolution - massSolute; // g per L
        if (massSolvent <= 0) return null;
        const molality = (M * 1000) / massSolvent;
        return {
          primary: { label: "Molality", value: `${formatNumber(molality, 6)} m` },
          details: [
            { label: "Molarity", value: `${formatNumber(M, 4)} M` },
            { label: "Mass of solute per L", value: `${formatNumber(massSolute, 4)} g` },
            { label: "Mass of solvent per L", value: `${formatNumber(massSolvent, 4)} g` },
          ],
          note: "Molality is independent of temperature since it uses mass (not volume). Molality = moles of solute / kg of solvent.",
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "freezing-point-calculator", "boiling-point-calculator"],
  faq: [
    { question: "What is molality?", answer: "Molality (m) is the number of moles of solute per kilogram of solvent. Unlike molarity, it does not change with temperature because it is based on mass rather than volume. The unit is mol/kg." },
    { question: "What is the difference between molality and molarity?", answer: "Molarity (M) = moles of solute / liters of solution. Molality (m) = moles of solute / kilograms of solvent. Molality is preferred for colligative property calculations because it is temperature-independent." },
    { question: "When is molality used?", answer: "Molality is commonly used in colligative property calculations such as freezing point depression, boiling point elevation, and osmotic pressure, because these properties depend on the ratio of solute to solvent particles." },
  ],
  formula: "m = moles of solute / kg of solvent | m = (M × 1000) / (1000d - M × Mw)",
};
