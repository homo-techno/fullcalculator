import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const molesToGramsCalculator: CalculatorDefinition = {
  slug: "moles-to-grams-calculator",
  title: "Moles to Grams Calculator",
  description: "Free moles to grams converter. Convert moles to mass in grams using molar mass. Essential for chemistry lab preparations and stoichiometry.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["moles to grams", "grams converter", "molar mass", "stoichiometry", "chemistry conversion"],
  variants: [
    {
      id: "moles-to-grams",
      name: "Moles to Grams",
      fields: [
        { name: "moles", label: "Amount (moles)", type: "number", placeholder: "e.g. 2.5", min: 0, step: 0.001 },
        { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", placeholder: "e.g. 18.015 for H₂O", min: 0.001, step: 0.001 },
      ],
      calculate: (inputs) => {
        const moles = inputs.moles as number;
        const molarMass = inputs.molarMass as number;
        if (!moles || !molarMass || moles < 0 || molarMass <= 0) return null;
        const mass = moles * molarMass;
        const molecules = moles * 6.02214076e23;
        return {
          primary: { label: "Mass", value: formatNumber(mass, 4), suffix: "g" },
          details: [
            { label: "Moles", value: `${formatNumber(moles, 6)} mol` },
            { label: "Molar Mass", value: `${formatNumber(molarMass, 4)} g/mol` },
            { label: "Number of Molecules", value: molecules.toExponential(4) },
          ],
          note: "mass = moles × molar mass. Always verify molar mass from periodic table values.",
        };
      },
    },
    {
      id: "common-compounds",
      name: "Common Compounds",
      fields: [
        { name: "moles", label: "Amount (moles)", type: "number", placeholder: "e.g. 1.0", min: 0, step: 0.001 },
        {
          name: "compound",
          label: "Compound",
          type: "select",
          options: [
            { label: "Water (H₂O) - 18.015 g/mol", value: "18.015" },
            { label: "Sodium Chloride (NaCl) - 58.44 g/mol", value: "58.44" },
            { label: "Carbon Dioxide (CO₂) - 44.01 g/mol", value: "44.01" },
            { label: "Glucose (C₆H₁₂O₆) - 180.16 g/mol", value: "180.16" },
            { label: "Calcium Carbonate (CaCO₃) - 100.09 g/mol", value: "100.09" },
            { label: "Sodium Hydroxide (NaOH) - 40.00 g/mol", value: "40.00" },
          ],
        },
      ],
      calculate: (inputs) => {
        const moles = inputs.moles as number;
        const molarMass = parseFloat(inputs.compound as string);
        if (!moles || !molarMass || moles < 0) return null;
        const mass = moles * molarMass;
        return {
          primary: { label: "Mass", value: formatNumber(mass, 4), suffix: "g" },
          details: [
            { label: "Moles", value: `${formatNumber(moles, 6)} mol` },
            { label: "Molar Mass", value: `${formatNumber(molarMass, 4)} g/mol` },
            { label: "Mass in kg", value: `${formatNumber(mass / 1000, 6)} kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-moles-calculator", "molar-mass-calculator", "molarity-calculator"],
  faq: [
    { question: "How do I convert moles to grams?", answer: "Multiply the number of moles by the molar mass of the substance: mass (g) = moles × molar mass (g/mol). For example, 2 mol of NaCl (molar mass 58.44 g/mol) = 2 × 58.44 = 116.88 g." },
    { question: "Why is moles to grams conversion important?", answer: "In the lab, you measure mass with a balance, not moles directly. Converting moles to grams tells you exactly how much substance to weigh out for a reaction or solution." },
  ],
  formula: "m = n × M | where m = mass (g), n = moles, M = molar mass (g/mol)",
};
