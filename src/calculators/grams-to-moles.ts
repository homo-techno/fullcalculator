import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToMolesCalculator: CalculatorDefinition = {
  slug: "grams-to-moles-calculator",
  title: "Grams to Moles Calculator",
  description: "Free grams to moles converter. Convert mass in grams to moles using molar mass. Essential for stoichiometry and chemistry lab calculations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["grams to moles", "moles converter", "molar mass", "stoichiometry", "chemistry conversion"],
  variants: [
    {
      id: "grams-to-moles",
      name: "Grams to Moles",
      fields: [
        { name: "mass", label: "Mass (grams)", type: "number", placeholder: "e.g. 18", min: 0, step: 0.01 },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 18.015 for H₂O", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const molarMass = inputs.molarMass as number;
        if (!mass || !molarMass || mass < 0 || molarMass <= 0) return null;
        const moles = mass / molarMass;
        const molecules = moles * 6.02214076e23;
        return {
          primary: { label: "Moles", value: formatNumber(moles, 6), suffix: "mol" },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Molar Mass", value: `${formatNumber(molarMass, 4)} g/mol` },
            { label: "Number of Molecules", value: molecules.toExponential(4) },
          ],
          note: "n = mass / molar mass. Common molar masses: H₂O = 18.015, NaCl = 58.44, CO₂ = 44.01 g/mol.",
        };
      },
    },
    {
      id: "common-compounds",
      name: "Common Compounds",
      fields: [
        { name: "mass", label: "Mass (grams)", type: "number", placeholder: "e.g. 100", min: 0, step: 0.01 },
        {
          name: "compound",
          label: "Compound",
          type: "select",
          options: [
            { label: "Water (H₂O) - 18.015 g/mol", value: "18.015" },
            { label: "Sodium Chloride (NaCl) - 58.44 g/mol", value: "58.44" },
            { label: "Carbon Dioxide (CO₂) - 44.01 g/mol", value: "44.01" },
            { label: "Glucose (C₆H₁₂O₆) - 180.16 g/mol", value: "180.16" },
            { label: "Sulfuric Acid (H₂SO₄) - 98.079 g/mol", value: "98.079" },
            { label: "Ethanol (C₂H₅OH) - 46.07 g/mol", value: "46.07" },
          ],
        },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const molarMass = parseFloat(inputs.compound as string);
        if (!mass || !molarMass || mass < 0) return null;
        const moles = mass / molarMass;
        const molecules = moles * 6.02214076e23;
        return {
          primary: { label: "Moles", value: formatNumber(moles, 6), suffix: "mol" },
          details: [
            { label: "Mass", value: `${formatNumber(mass, 4)} g` },
            { label: "Molar Mass", value: `${formatNumber(molarMass, 4)} g/mol` },
            { label: "Number of Molecules", value: molecules.toExponential(4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["moles-to-grams-calculator", "molar-mass-calculator", "molarity-calculator"],
  faq: [
    { question: "How do I convert grams to moles?", answer: "Divide the mass in grams by the molar mass of the substance: n = mass (g) / molar mass (g/mol). For example, 36 g of water (molar mass 18.015 g/mol) = 36 / 18.015 = 1.999 mol." },
    { question: "What is molar mass?", answer: "Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). It equals the sum of atomic masses of all atoms in the molecular formula." },
  ],
  formula: "n = m / M | where n = moles, m = mass (g), M = molar mass (g/mol)",
};
